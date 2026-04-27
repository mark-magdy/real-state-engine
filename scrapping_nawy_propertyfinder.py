import requests
import pandas as pd
import time
from datetime import datetime

COMMON_COLUMNS = [
    "source", "property_id", "title", "compound", "area", "developer",
    "property_type", "bedrooms", "bathrooms", "size_sqm", "finishing",
    "ready_by", "min_price", "currency", "min_down_payment",
    "installment_percentage", "installment_type", "listing_type",
    "location", "latitude", "longitude", "url", "photo_url"
]

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
    return "buy"

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

    for page in range(1, 99):
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

            loc      = p.get("location", {}) or {}
            coords   = loc.get("coordinates", {}) or {}
            bedrooms = p.get("bedrooms", []) or []
            ptypes   = p.get("propertyTypes", []) or []

            # ── Down payment: % → EGP value ──
            starting_price = p.get("startingPrice")
            down_pct       = p.get("downPaymentPercentage")
            down_payment   = round(starting_price * down_pct / 100) if starting_price and down_pct else None

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
                "min_price":              starting_price,
                "currency":               "EGP",
                "min_down_payment":       down_payment,  # ← EGP value now
                "installment_percentage": None,
                "installment_type":       None,
                "listing_type":           "buy",
                "location":               loc.get("fullName"),
                "latitude":               coords.get("lat"),
                "longitude":              coords.get("lon"),
                "url":                    "https://www.propertyfinder.eg" + p.get("shareUrl", ""),
                "photo_url":              photo_url,
            })

        print(f"got {len(projects)} (total so far: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# SCRAPER 2 — PF RESALE + RENTAL
# ============================================================

def scrape_pf_listings(category_id, listing_type_label, limit=50):
    print(f"\n{'='*60}")
    print(f"PROPERTYFINDER — {listing_type_label.upper()} (first {limit})")
    print("="*60)

    BASE = "https://www.propertyfinder.eg/api/pwa/property/search"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.propertyfinder.eg/en/buy/properties-for-sale.html"
    }

    PAGE_SIZE = 25
    rows = []

    for page in range(1, 99):
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
            price  = p.get("price", {}) or {}
            size   = p.get("size", {}) or {}

            share_url    = p.get("share_url")
            offering     = p.get("offering_type")
            listing_type = detect_listing_type(share_url, offering)

            loc_tree = p.get("location_tree", []) or []
            area = None
            if loc_tree:
                for node in reversed(loc_tree):
                    if node.get("type") in ("DISTRICT", "TOWN", "CITY"):
                        area = node.get("name")
                        break

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
                "min_price":              price.get("value"),
                "currency":               price.get("currency"),
                "min_down_payment":       None,  # resale listings have no down payment
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

    for page in range(1, 99):
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

            plan      = p.get("paymentPlan", {}) or {}
            compound  = p.get("compound", {}) or {}
            area      = p.get("area", {}) or {}
            developer = p.get("developer", {}) or {}

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
                "min_price":              plan.get("minPrice"),
                "currency":               plan.get("currency"),
                "min_down_payment":       plan.get("minDownPayment"),  # already EGP
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
df_pf_buy  = scrape_pf_listings(category_id=1, listing_type_label="buy",  limit=50)
df_pf_rent = scrape_pf_listings(category_id=2, listing_type_label="rent", limit=50)
df_nawy    = scrape_nawy(limit=50)

df_pf_all = pd.concat([df_pf_new, df_pf_buy, df_pf_rent], ignore_index=True)
df_pf_all = df_pf_all.drop_duplicates(subset=["property_id", "listing_type"])

# ── Preview down payment consistency ──
print("\n── PF New Projects — min_price vs min_down_payment ──")
print(df_pf_new[["title", "min_price", "min_down_payment"]].head(5).to_string())

print("\n── Nawy — min_price vs min_down_payment ──")
print(df_nawy[["title", "min_price", "min_down_payment"]].head(5).to_string())

print(f"\n✅ PF total: {len(df_pf_all):,} rows")
print(f"✅ Nawy total: {len(df_nawy):,} rows")

# ============================================================
# SAVE
# ============================================================

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

df_pf_new.to_csv(f"pf_new_projects_{timestamp}.csv",  index=False, encoding="utf-8-sig")
df_pf_buy.to_csv(f"pf_buy_{timestamp}.csv",           index=False, encoding="utf-8-sig")
df_pf_rent.to_csv(f"pf_rent_{timestamp}.csv",         index=False, encoding="utf-8-sig")
df_nawy.to_csv(f"nawy_{timestamp}.csv",               index=False, encoding="utf-8-sig")
df_pf_all.to_csv(f"pf_all_{timestamp}.csv",           index=False, encoding="utf-8-sig")

df_all = pd.concat([df_pf_all, df_nawy], ignore_index=True)
df_all.to_csv(f"all_properties_{timestamp}.csv",      index=False, encoding="utf-8-sig")

print("\n💾 CSV files saved successfully!")
