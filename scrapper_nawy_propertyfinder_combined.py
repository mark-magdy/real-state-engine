import requests
import pandas as pd
import time
import json
from datetime import datetime

# ============================================================
# SHARED CONFIG
# ============================================================

COMMON_COLUMNS = [
    "source", "property_id", "title", "compound", "area", "developer",
    "property_type", "bedrooms", "bathrooms", "size_sqm", "finishing",
    "ready_by", "min_price", "currency", "min_down_payment",
    "installment_percentage", "installment_type", "listing_type",
    "location", "latitude", "longitude", "url"
]

# ============================================================
# SCRAPER 1 — PROPERTYFINDER NEW PROJECTS
# ============================================================

def scrape_pf_new_projects():
    print("\n" + "="*60)
    print("PROPERTYFINDER — NEW PROJECTS")
    print("="*60)

    BASE = "https://www.propertyfinder.eg/api/pwa/new-projects/search"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.propertyfinder.eg/en/new-projects"
    }

    PAGE_SIZE = 6
    rows = []

    # Get total pages
    r = requests.get(BASE, headers=headers,
                     params={"page[limit]": PAGE_SIZE, "page[number]": 1, "sort": "mr", "locale": "en"})
    total_pages = r.json().get("meta", {}).get("pagination", {}).get("total", 0)
    print(f"Total pages: {total_pages}")

    for page in range(1, total_pages + 1):
        print(f"  Page {page}/{total_pages}", end=" ... ")
        if page >= 50:   # ← ADD HERE
            break
        r = requests.get(BASE, headers=headers,
                         params={"page[limit]": PAGE_SIZE, "page[number]": page, "sort": "mr", "locale": "en"})

        if r.status_code != 200:
            print(f"Blocked ({r.status_code})")
            break

        projects = r.json().get("data", {}).get("projects", [])
        if not projects:
            print("empty, stopping.")
            break

        for p in projects:
            loc = p.get("location", {}) or {}
            coords = loc.get("coordinates", {}) or {}
            bedrooms = p.get("bedrooms", []) or []
            ptypes = p.get("propertyTypes", []) or []

            rows.append({
                "source":                 "propertyfinder",
                "property_id":            p.get("id"),
                "title":                  p.get("title"),
                "compound":               p.get("title"),
                "area":                   loc.get("fullName"),
                "developer":              (p.get("developer") or {}).get("name"),
                "property_type":          ", ".join(ptypes) if ptypes else None,
                "bedrooms":               ", ".join(bedrooms) if bedrooms else None,
                "bathrooms":              None,   # not in new projects list API
                "size_sqm":               None,   # not in new projects list API
                "finishing":              None,   # not in new projects list API
                "ready_by":               p.get("deliveryDate"),
                "min_price":              p.get("startingPrice"),
                "currency":               "EGP",
                "min_down_payment":       p.get("downPaymentPercentage"),
                "installment_percentage": None,
                "installment_type":       None,
                "listing_type":           "buy",  # new projects are always off-plan buy
                "location":               loc.get("fullName"),
                "latitude":               coords.get("lat"),
                "longitude":              coords.get("lon"),
                "url":                    "https://www.propertyfinder.eg" + p.get("shareUrl", ""),
            })

        print(f"got {len(projects)} (total: {len(rows)})")
        time.sleep(1.5)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# SCRAPER 2 — PROPERTYFINDER RESALE + RENTAL
# ============================================================

def scrape_pf_listings(category_id, listing_type_label):
    print(f"\n{'='*60}")
    print(f"PROPERTYFINDER — {listing_type_label.upper()} LISTINGS (category={category_id})")
    print("="*60)

    BASE = "https://www.propertyfinder.eg/api/pwa/property/search"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.propertyfinder.eg/en/buy/properties-for-sale.html"
    }

    PAGE_SIZE = 25
    rows = []

    # Get total pages
    r = requests.get(BASE, headers=headers,
                     params={"page[limit]": PAGE_SIZE, "page[number]": 1,
                             "category": category_id, "locale": "en"})
    meta = r.json().get("meta", {})
    total_pages = meta.get("page_count", 0)
    total_count = meta.get("total_count", 0)
    print(f"Total listings: {total_count:,} | Total pages: {total_pages:,}")

    for page in range(1, total_pages + 1):
        print(f"  Page {page}/{total_pages}", end=" ... ")
        if page >= 50:   # ← ADD HERE
            break
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
            p = item.get("property", {}) or {}
            if not p:
                continue

            loc = p.get("location", {}) or {}
            coords = loc.get("coordinates", {}) or {}
            price = p.get("price", {}) or {}
            size = p.get("size", {}) or {}

            # Extract area hierarchy from location_tree
            loc_tree = p.get("location_tree", []) or []
            area = None
            if loc_tree:
                # Take the most specific non-subdistrict level
                for node in reversed(loc_tree):
                    if node.get("type") in ("DISTRICT", "TOWN", "CITY"):
                        area = node.get("name")
                        break

            rows.append({
                "source":                 "propertyfinder",
                "property_id":            p.get("id"),
                "title":                  p.get("title"),
                "compound":               None,   # resale listings don't have compound
                "area":                   area,
                "developer":              None,   # resale listings don't have developer
                "property_type":          p.get("property_type"),
                "bedrooms":               p.get("bedrooms"),
                "bathrooms":              p.get("bathrooms"),
                "size_sqm":               size.get("value"),
                "finishing":              p.get("completion_status"),
                "ready_by":               None,
                "min_price":              price.get("value"),
                "currency":               price.get("currency"),
                "min_down_payment":       None,
                "installment_percentage": None,
                "installment_type":       None,
                "listing_type":           listing_type_label,
                "location":               loc.get("full_name"),
                "latitude":               coords.get("lat"),
                "longitude":              coords.get("lon"),
                "url":                    p.get("share_url"),
            })

        print(f"got {len(listings)} (total: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# SCRAPER 3 — NAWY
# ============================================================

def scrape_nawy():
    print("\n" + "="*60)
    print("NAWY — ALL PROPERTIES")
    print("="*60)

    BASE = "https://listing-api.nawy.com/v1/search/properties"
    headers = {"User-Agent": "Mozilla/5.0"}
    PAGE_SIZE = 24  # larger page = fewer requests
    rows = []

    # Get total
    r = requests.get(BASE, headers=headers,
                     params={"page": 1, "pageSize": PAGE_SIZE})
    data = r.json()

    if "total" not in data:
        print("Error:", data)
        return pd.DataFrame(columns=COMMON_COLUMNS)

    total = data["total"]
    total_pages = (total + PAGE_SIZE - 1) // PAGE_SIZE  # ceiling division
    print(f"Total listings: {total:,} | Total pages: {total_pages:,}")

    for page in range(1, total_pages + 1):
        print(f"  Page {page}/{total_pages}", end=" ... ")
        if page >= 50:   # ← ADD HERE
            break

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
            plan = p.get("paymentPlan", {}) or {}
            compound = p.get("compound", {}) or {}
            area = p.get("area", {}) or {}
            developer = p.get("developer", {}) or {}

            # Map saleType to listing_type
            sale_type = p.get("saleType", "")
            if "rent" in sale_type.lower():
                listing_type = "rent"
            else:
                listing_type = "buy"

            # Clean ready_by date
            ready_by = p.get("readyBy")
            if ready_by:
                try:
                    ready_by = datetime.fromisoformat(
                        ready_by.replace("Z", "+00:00")
                    ).strftime("%Y-%m-%d")
                except Exception:
                    pass

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
                "min_down_payment":       plan.get("minDownPayment"),
                "installment_percentage": plan.get("installmentPercentage"),
                "installment_type":       plan.get("installmentType"),
                "listing_type":           listing_type,
                "location":               area.get("name"),
                "latitude":               None,  # not in Nawy list API
                "longitude":              None,  # not in Nawy list API
                "url": f"https://www.nawy.com/property/{p.get('slug', '')}",
            })

        print(f"got {len(results)} (total: {len(rows)})")
        time.sleep(1)

    return pd.DataFrame(rows, columns=COMMON_COLUMNS)


# ============================================================
# RUN ALL & SAVE
# ============================================================

# --- Propertyfinder new projects
df_pf_new = scrape_pf_new_projects()

# --- Propertyfinder resale (buy)
df_pf_buy = scrape_pf_listings(category_id=1, listing_type_label="buy")

# --- Propertyfinder rental
df_pf_rent = scrape_pf_listings(category_id=2, listing_type_label="rent")

# --- Nawy
df_nawy = scrape_nawy()

# --- Combine propertyfinder sources & save
df_pf_all = pd.concat([df_pf_new, df_pf_buy, df_pf_rent], ignore_index=True)
df_pf_all = df_pf_all.drop_duplicates(subset=["property_id", "listing_type"])
df_pf_all.to_csv("propertyfinder_all.csv", index=False, encoding="utf-8-sig")
print(f"\nPropertyfinder CSV saved: {len(df_pf_all):,} rows")

# --- Save Nawy separately
df_nawy = df_nawy.drop_duplicates(subset=["property_id"])
df_nawy.to_csv("nawy_all.csv", index=False, encoding="utf-8-sig")
print(f"Nawy CSV saved: {len(df_nawy):,} rows")

print("\nALL DONE ✅")
