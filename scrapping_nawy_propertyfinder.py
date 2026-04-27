import requests
import pandas as pd
import time
from datetime import datetime

COMMON_COLUMNS = [
    "source", "property_id", "title", "compound", "area", "developer",
    "property_type", "bedrooms", "bathrooms", "size_sqm", "finishing",
    "ready_by", "min_price", "currency", "rent_per_month", "rent_period",
    "min_down_payment", "installment_percentage", "installment_type",
    "listing_type", "location", "latitude", "longitude", "url", "photo_url"
]

# ── Helper: detect listing type from URL + offering_type fallback ──
def detect_listing_type(share_url, offering_type=None):
    if share_url:
        if "/buy/" in share_url:
            return "buy"
        if "/rent/" in share_url:
            return "rent"
    if offering_type:
        ot = offering_type.lower()
        if "rent" in ot:
            return "rent"
        if "sale" in ot or "sell" in ot:
            return "buy"
    return "buy"  # default fallback

# ── Helper: parse price into min_price / rent_per_month / rent_period ──
def parse_price(price_obj, listing_type):
    if not price_obj:
        return None, None, None
    value    = price_obj.get("value")
    period   = price_obj.get("period", "")
    if listing_type == "rent":
        return None, value, period   # (min_price, rent_per_month, rent_period)
    else:
        return value, None, None     # (min_price, rent_per_month, rent_period)


# ============================================================
# SCRAPER 1 — PF NEW PROJECTS
# ============================================================

def scrape_pf_new_projects(limit=50):
    print("\n" + "="*60)
    print(f"PROPERTYFINDER — NEW PROJECTS (first {limit})")
    print("="*60)

    BASE = "https://www.propertyfinder.eg/api/pwa/new-projects/search"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.propertyfinder.eg/en/new-projects"
    }

    PAGE_SIZE = 6
    rows = []

    for page in range(1, 999):
        if len(rows) >= limit:
            break

        print(f"  Page {page}", end=" ... ")
        r = requests.get(BASE, headers=headers,
                         params={"page[limit]": PAGE_SIZE, "page[number]": page,
                                 "sort": "mr", "locale": "en"})

        if r.status_code != 200:
            print(f"Blocked ({r.status_code})")
            break

        projects = r.json().get("data", {}).get("projects", [])
        if not projects:
            print("empty, stopping.")
            break

        for p in projects:
            if len(rows) >= limit:
                break

            loc    = p.get("location", {}) or {}
            coords = loc.get("coordinates", {}) or {}
            bedrooms = p.get("bedrooms", []) or []
            ptypes   = p.get("propertyTypes", []) or []

            share_url    = "https://www.propertyfinder.eg" + p.get("shareUrl", "")
            listing_type = detect_listing_type(share_url)  # new projects are always buy

            photo_url = None
            images = p.get("images") or []
            if images:
                first = images[0]
                photo_url = first if isinstance(first, str) else (
                    first.get("url") or first.get("src") or first.get("large"))

            rows.append({
                "source":                 "propertyfinder",
                "property_id":            p.get("id"),
                "title":                  p.get("title"),
                "compound":               p.get("title"),
                "area":                   loc.get("fullName"),
                "developer":              (p.get("developer") or {}).get("name"),
                "property_type":          ", ".join(ptypes) if ptypes else None,
                "bedrooms":               ", ".join(bedrooms) if bedrooms else None,
                "bathrooms":              None,
                "size_sqm":               None,
                "finishing":              None,
                "ready_by":               p.get("deliveryDate"),
                "min_price":              p.get("startingPrice"),
                "currency":               "EGP",
                "rent_per_month":         None,
                "rent_period":            None,
                "min_down_payment":       p.get("downPaymentPercentage"),
                "installment_percentage": None,
                "installment_type":       None,
                "listing_type":           listing_type,
                "location":               loc.get("fullName"),
                "latitude":               coords.get("lat"),
                "longitude":              coords.get("lon"),
                "url":                    share_url,
                "photo_url":              photo_url,
            })

        print(f"got {len(projects)} (total so far: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# SCRAPER 2 — PF RESALE + RENTAL
# ============================================================

def scrape_pf_listings(category_id, category_label, limit=50):
    print(f"\n{'='*60}")
    print(f"PROPERTYFINDER — {category_label.upper()} (first {limit})")
    print("="*60)

    BASE = "https://www.propertyfinder.eg/api/pwa/property/search"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.propertyfinder.eg/en/buy/properties-for-sale.html"
    }

    PAGE_SIZE = 25
    rows = []

    for page in range(1, 999):
        if len(rows) >= limit:
            break

        print(f"  Page {page}", end=" ... ")
        r = requests.get(BASE, headers=headers,
                         params={"page[limit]": PAGE_SIZE, "page[number]": page,
                                 "category": category_id, "locale": "en"})

        if r.status_code != 200:
            print(f"Blocked ({r.status_code})")
            break

        listings = r.json().get("listings", [])
        if not listings:
            print("empty, stopping.")
            break

        for item in listings:
            if len(rows) >= limit:
                break

            p = item.get("property", {}) or {}
            if not p:
                continue

            loc    = p.get("location", {}) or {}
            coords = loc.get("coordinates", {}) or {}
            size   = p.get("size", {}) or {}
            price  = p.get("price", {}) or {}

            # ── listing_type: trust URL over category param ──
            share_url    = p.get("share_url")
            offering     = p.get("offering_type")
            listing_type = detect_listing_type(share_url, offering)

            # ── price routing ──
            min_price, rent_per_month, rent_period = parse_price(price, listing_type)

            # ── area from location_tree ──
            loc_tree = p.get("location_tree", []) or []
            area = None
            if loc_tree:
                for node in reversed(loc_tree):
                    if node.get("type") in ("DISTRICT", "TOWN", "CITY"):
                        area = node.get("name")
                        break

            # ── photo ──
            photo_url = None
            images = p.get("images") or []
            if images:
                first = images[0]
                photo_url = (first.get("small") or first.get("large")
                             or first.get("url") or first.get("src")
                             if isinstance(first, dict) else first)

            rows.append({
                "source":                 "propertyfinder",
                "property_id":            p.get("id"),
                "title":                  p.get("title"),
                "compound":               None,
                "area":                   area,
                "developer":              None,
                "property_type":          p.get("property_type"),
                "bedrooms":               p.get("bedrooms"),
                "bathrooms":              int(p["bathrooms"]) if p.get("bathrooms") else None,
                "size_sqm":               size.get("value"),
                "finishing":              p.get("completion_status"),
                "ready_by":               None,
                "min_price":              min_price,
                "currency":               price.get("currency"),
                "rent_per_month":         rent_per_month,
                "rent_period":            rent_period,      # "monthly" / "daily"
                "min_down_payment":       None,
                "installment_percentage": None,
                "installment_type":       None,
                "listing_type":           listing_type,
                "location":               loc.get("full_name"),
                "latitude":               coords.get("lat"),
                "longitude":              coords.get("lon"),
                "url":                    share_url,
                "photo_url":              photo_url,
            })

        print(f"got {len(listings)} (total so far: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# SCRAPER 3 — NAWY
# ============================================================

def scrape_nawy(limit=50):
    print("\n" + "="*60)
    print(f"NAWY — ALL PROPERTIES (first {limit})")
    print("="*60)

    BASE = "https://listing-api.nawy.com/v1/search/properties"
    headers = {"User-Agent": "Mozilla/5.0"}
    PAGE_SIZE = 24
    rows = []

    for page in range(1, 999):
        if len(rows) >= limit:
            break

        print(f"  Page {page}", end=" ... ")
        r = requests.get(BASE, headers=headers,
                         params={"page": page, "pageSize": PAGE_SIZE})

        if r.status_code != 200:
            print(f"Blocked ({r.status_code})")
            break

        data = r.json()
        results = data.get("results", [])
        if not results:
            print("empty, stopping.")
            break

        for p in results:
            if len(rows) >= limit:
                break

            plan     = p.get("paymentPlan", {}) or {}
            compound = p.get("compound", {}) or {}
            area     = p.get("area", {}) or {}
            developer= p.get("developer", {}) or {}

            sale_type    = p.get("saleType", "")
            listing_type = "rent" if "rent" in sale_type.lower() else "buy"

            ready_by = p.get("readyBy")
            if ready_by:
                try:
                    ready_by = datetime.fromisoformat(
                        ready_by.replace("Z", "+00:00")
                    ).strftime("%Y-%m-%d")
                except Exception:
                    pass

            # ── price routing ──
            raw_price = plan.get("minPrice")
            if listing_type == "rent":
                min_price, rent_per_month, rent_period = None, raw_price, "monthly"
            else:
                min_price, rent_per_month, rent_period = raw_price, None, None

            photo_url = (p.get("imageUrl")
                         or p.get("mainPhoto")
                         or p.get("coverImage")
                         or compound.get("coverImage")
                         or compound.get("image"))

            rows.append({
                "source":                 "nawy",
                "property_id":            p.get("id"),
                "title":                  p.get("title"),
                "compound":               compound.get("name"),
                "area":                   area.get("name"),
                "developer":              developer.get("name"),
                "property_type":          p.get("propertyType"),
                "bedrooms":               p.get("numberOfBedrooms"),
                "bathrooms":              p.get("numberOfBathrooms"),
                "size_sqm":               p.get("unitArea"),
                "finishing":              p.get("finishing"),
                "ready_by":               ready_by,
                "min_price":              min_price,
                "currency":               plan.get("currency"),
                "rent_per_month":         rent_per_month,
                "rent_period":            rent_period,
                "min_down_payment":       plan.get("minDownPayment"),
                "installment_percentage": plan.get("installmentPercentage"),
                "installment_type":       plan.get("installmentType"),
                "listing_type":           listing_type,
                "location":               area.get("name"),
                "latitude":               None,
                "longitude":              None,
                "url":                    f"https://www.nawy.com/property/{p.get('slug', '')}",
                "photo_url":              photo_url,
            })

        print(f"got {len(results)} (total so far: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# RUN & PREVIEW
# ============================================================

df_pf_new  = scrape_pf_new_projects(limit=50)
df_pf_buy  = scrape_pf_listings(category_id=1, category_label="buy", limit=50)
df_pf_rent = scrape_pf_listings(category_id=2, category_label="rent", limit=50)
df_nawy    = scrape_nawy(limit=50)

df_pf_all = pd.concat([df_pf_new, df_pf_buy, df_pf_rent], ignore_index=True)
df_pf_all = df_pf_all.drop_duplicates(subset=["property_id", "listing_type"])

# ── Verify listing_type classification ──
print("\n── PF listing_type distribution ──")
print(df_pf_all["listing_type"].value_counts())

print("\n── Sample rent rows (should have rent_per_month, no min_price) ──")
rent_sample = df_pf_all[df_pf_all["listing_type"] == "rent"][
    ["title", "listing_type", "min_price", "rent_per_month", "rent_period", "bathrooms", "size_sqm"]
].head(5)
print(rent_sample.to_string())

print("\n── Sample buy rows (should have min_price, no rent_per_month) ──")
buy_sample = df_pf_all[df_pf_all["listing_type"] == "buy"][
    ["title", "listing_type", "min_price", "rent_per_month", "bathrooms", "size_sqm"]
].head(5)
print(buy_sample.to_string())

print(f"\n✅ PF total: {len(df_pf_all)} rows")
print(f"✅ Nawy total: {len(df_nawy)} rows")
