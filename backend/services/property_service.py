
from models import Property
from models.enums import PropertyType
import csv

class PropertyService:
    def __init__(self):
        pass

    def initialize_database(self):
        
        if Property.objects.count() > 0:
            print("⚠️ Database already seeded")
            return

        seed_data = [
            Property(
                title="Sea View Villa",
                property_type=PropertyType.VILLA,
                area="North Coast",
                compound="Hacienda Bay",
                meter_square=300,
                bedrooms=5,
                bathrooms=4,
                full_price=8500000
            ),
            Property(
                title="Modern City Apartment",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Mivida",
                meter_square=120,
                bedrooms=3,
                bathrooms=2,
                full_price=3200000
            ),
            Property(
                title="Suburban House",
                property_type=PropertyType.HOUSE,
                area="Sheikh Zayed",
                compound="",
                meter_square=200,
                bedrooms=4,
                bathrooms=3,
                full_price=4500000
            ),
            Property(
                title="Studio for Rent",
                property_type=PropertyType.APARTMENT,
                area="Nasr City",
                compound="",
                meter_square=60,
                bedrooms=1,
                bathrooms=1,
                rent=8000
            ),
            Property(
                title="Cozy Apartment in 5th Settlement",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Mountain View",
                meter_square=120,
                bedrooms=2,
                bathrooms=2,
                full_price=4000000,
                rent=25000
            ),
            Property(
                title="Luxury Flat off-plan",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Hyde Park",
                meter_square=180,
                bedrooms=3,
                bathrooms=3,
                full_price=8000000,
                down_payment=800000,
                installment=60000,
                rent=35000
            ),
            Property(
                title="Garden Apartment in Mivida",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Mivida",
                meter_square=160,
                bedrooms=3,
                bathrooms=2,
                full_price=6500000,
                down_payment=650000,
                installment=50000,
                rent=32000
            ),
            Property(
                title="Studio near AUC",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Eastown",
                meter_square=90,
                bedrooms=1,
                bathrooms=1,
                full_price=2800000,
                rent=18000
            ),

            # --- SHEIKH ZAYED ---
            Property(
                title="Modern Apartment in Zayed",
                property_type=PropertyType.APARTMENT,
                area="Sheikh Zayed",
                compound="Beverly Hills",
                meter_square=150,
                bedrooms=3,
                bathrooms=2,
                full_price=5500000,
                rent=30000
            ),
            Property(
                title="Spacious Duplex",
                property_type=PropertyType.APARTMENT,
                area="Sheikh Zayed",
                compound="ZED",
                meter_square=220,
                bedrooms=4,
                bathrooms=4,
                full_price=12000000,
                down_payment=1200000,
                installment=90000,
                rent=50000
            ),
            Property(
                title="High-floor Flat with View",
                property_type=PropertyType.APARTMENT,
                area="Sheikh Zayed",
                compound="Casa",
                meter_square=175,
                bedrooms=3,
                bathrooms=3,
                full_price=7000000,
                down_payment=1000000,
                installment=60000,
                rent=36000
            ),

            # --- MAADI ---
            Property(
                title="Classic Apartment in Sarayat",
                property_type=PropertyType.APARTMENT,
                area="Maadi",
                compound=None, # Standalone building
                meter_square=200,
                bedrooms=3,
                bathrooms=3,
                full_price=5000000,
                rent=35000
            ),
            Property(
                title="Nile View Apartment",
                property_type=PropertyType.APARTMENT,
                area="Maadi",
                compound="Nile Towers",
                meter_square=250,
                bedrooms=4,
                bathrooms=3,
                full_price=15000000,
                rent=80000
            ),
            
            # --- 6th OF OCTOBER ---
            Property(
                title="Cozy Flat in O West",
                property_type=PropertyType.APARTMENT,
                area="6th of October",
                compound="O West",
                meter_square=130,
                bedrooms=2,
                bathrooms=2,
                full_price=4500000,
                down_payment=450000,
                installment=35000,
                rent=22000
            ),
            Property(
                title="Family Apartment in Palm Hills",
                property_type=PropertyType.APARTMENT,
                area="6th of October",
                compound="Palm Hills October",
                meter_square=190,
                bedrooms=3,
                bathrooms=3,
                full_price=8500000,
                rent=40000
            ),

            # --- EDGE CASES (To Test Your Filters) ---
            
            # Missing Rent (Should be ignored by ROI calculations since there's no income)
            Property(
                title="Apartment for Sale ONLY",
                property_type=PropertyType.APARTMENT,
                area="Maadi",
                compound="Degla View",
                meter_square=140,
                bedrooms=3,
                bathrooms=2,
                full_price=3000000
            ),
            Property(
                title="Off-plan Unit No Expected Rent",
                property_type=PropertyType.APARTMENT,
                area="New Cairo",
                compound="Taj City",
                meter_square=110,
                bedrooms=2,
                bathrooms=2,
                full_price=3500000,
                down_payment=350000,
                installment=25000
            ),
            
            # Wrong Property Types (Should be filtered out if looking specifically for Apartments)
            Property(
                title="Huge Standalone Villa",
                property_type=PropertyType.VILLA,
                area="New Cairo",
                compound="Mivida",
                meter_square=450,
                bedrooms=5,
                bathrooms=6,
                full_price=25000000,
                rent=120000
            ),
            Property(
                title="Luxury Condo Unit",
                property_type=PropertyType.CONDO,
                area="Sheikh Zayed",
                compound="Arkan",
                meter_square=80,
                bedrooms=1,
                bathrooms=1,
                full_price=9000000,
                rent=75000
            ),
            Property(
                title="Townhouse in Allegria",
                property_type=PropertyType.TOWNHOUSE,
                area="Sheikh Zayed",
                compound="Allegria",
                meter_square=300,
                bedrooms=4,
                bathrooms=4,
                full_price=18000000,
                down_payment=2000000,
                installment=150000,
                rent=90000
            )
        ]

        for prop in seed_data:
            prop.save()

        print("✅ Database seeded successfully")

    def get_all_properties(self):
        properties = Property.objects()
        return [prop.to_dict() for prop in properties]

    def get_property_by_id(self, prop_id):
        prop = Property.objects(prop_id=prop_id).first()
        if prop:
            return prop.to_dict()
        return None

    def search_properties(self, filters, page=1, limit=12):
        query = {}
        
        # Mandatory-ish filters (if provided)
        if filters.get('area'):
            query['area__icontains'] = filters['area']
        
        if filters.get('listing_type'):
            query['listing_type'] = filters['listing_type']
            
        # Optional filters
        if filters.get('property_type'):
            query['property_type'] = filters['property_type']
            
        if filters.get('min_price'):
            query['price__gte'] = float(filters['min_price'])
            
        if filters.get('max_price'):
            query['price__lte'] = float(filters['max_price'])
            
        if filters.get('bedrooms'):
            query['bedrooms__gte'] = int(filters['bedrooms'])
            
        if filters.get('bathrooms'):
            query['bathrooms__gte'] = int(filters['bathrooms'])
            
        if filters.get('compound'):
            query['compound__icontains'] = filters['compound']

        # Pagination
        offset = (page - 1) * limit
        total_count = Property.objects(**query).count()
        properties = Property.objects(**query).skip(offset).limit(limit)
        
        return {
            "properties": [prop.to_dict() for prop in properties],
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    
    def clean_property(self,data):

    # property_type → take first type
        clean_data = []
        for row in data:
            row = {str(k).replace("\ufeff", "").strip().lower(): v for k, v in row.items()}# ✅ fix headers
                
            try:
                prop_type = row.get("property_type", "").split(",")[0].strip().lower()
                compound = row.get("compound", "").strip()
                price= float(row.get("min_price") or 0)

                if price == 0 or price == "N/A"or prop_type == "Unknown" or prop_type == "" or prop_type == "N/A":
                    print(f"⚠️ Skipping row due to invalid price or property type: {row}")
                    continue
                # bedrooms → take first number
                bedrooms = row.get("bedrooms")
                if bedrooms:
                    try:
                        val = bedrooms.strip().lower()
                        if "," in val:  # 👈 this means it's an array
                            bedrooms = len([b for b in val.split(",") if b.strip()])
                        else:
                            bedrooms = int(float(bedrooms.strip()))
                    except:
                        bedrooms = 0
                else:
                    bedrooms = 0
                
                
                



                source = next(iter(row.values()))
                area = row.get("area", "").strip()
                installment = ""

                if source == "propertyfinder":
                    parts = [p.strip() for p in area.split(",") if p.strip()]
                    area = parts[1] if len(parts) >= 2 else area

                else:
                    installment = row.get("installment_percentage", "").strip()
                
                area = area.replace("City", "").strip()


                clean_data.append({
                    "title": f"{prop_type}, {area}, {compound}" if compound else f"{prop_type}, {area}",
                    "property_type": prop_type,
                    "area": area,
                    "compound": compound,
                    "meter_square": int(float(row.get("size_sqm") or 0)),
                    "bedrooms": bedrooms,
                    "bathrooms": int(float(row.get("bathrooms") or 0)),
                    "price": price,
                    "down_payment": float(row.get("min_down_payment") or 0),
                    "installment": installment,
                    "url": row.get("url", ""),
                    "listing_type": "rent" if row.get("rent") else "buy"
                })
            except Exception as e:
                print(f"⚠️ Skipping row due to error: {e}")
                raise e
        return clean_data
    
    def clean_bayut(self, data):
        clean_data = []

        def parse_price(value):
            if not value or value == "N/A":
                return 0
            return float(value.replace(",", "").strip())

        def parse_down_payment(value):
            if not value or value == "N/A":
                return 0
            if "0%" in value:
                return 0
            return float(
                value.replace("EGP", "").replace(",", "").replace("Down Payment", "").strip()
            )

        def parse_installment(value):
            if not value or value == "N/A":
                return 0
            try:
                amount = value.split("monthly")[0]
                return float(amount.replace("EGP", "").replace(",", "").strip())
            except:
                return 0

        def parse_int(value):
            try:
                return int(float(value))
            except:
                return 0

        for row in data:
            # ✅ clean headers
            row = {k.strip(): v for k, v in row.items()}

            # property type (string, no enum now)
            prop_type = (row.get("type") or "").strip().lower()
            price = parse_price(row.get("Price(EGP)"))

            if price == 0 or price == "N/A"or prop_type == "Unknown" or prop_type == "" or prop_type == "N/A":
                    print(f"⚠️ Skipping row due to invalid price or property type: {row}")
                    continue

            # split location → area + compound
            location = row.get("location") or ""
            parts = [p.strip() for p in location.split(",")]

            compound = parts[0] if parts else ""
            area = parts[-2] if len(parts) > 1 else location

            area = area.replace("City", "").strip()

            clean_data.append({
                "title": f"{prop_type}, {area}, {compound}" if compound else f"{prop_type}, {area}",
                "property_type": prop_type,
                "area": area,
                "compound": compound,

                "meter_square": parse_int(row.get("Area(m2)")),
                "bedrooms": parse_int(row.get("bedrooms")),
                "bathrooms": parse_int(row.get("Bathrooms")),

                "price": price,
                "down_payment": parse_down_payment(row.get("Down payment")),
                "installment": parse_installment(row.get("Instalment")),

                "listing_type": (row.get("listing type") or "buy").lower(),

                "url": row.get("post link") or "",
            })

        return clean_data
        
      

    def get_properties_from_csv(self,csv_path):
        # Placeholder for CSV reading logic
        properties = []
        with open(csv_path, "r",encoding="latin-1") as file:
            reader = csv.DictReader(file)
            for row in reader:
                properties.append(row)
        return properties
    
    

    def create_properties(self, data):
        properties=[]
        for item in data:
            prop = Property(
                title=item.get("title"),
                property_type=item.get("property_type"),
                area=item.get("area"),
                compound=item.get("compound", ""),
                meter_square=item.get("meter_square"),
                bedrooms=item.get("bedrooms"),
                bathrooms=item.get("bathrooms"),
                price=item.get("price"),
                listing_type=item.get("listing_type", "buy"),
                down_payment=item.get("down_payment"),
                installment=item.get("installment"),
                url=item.get("url", ""),
               



            )
            
            properties.append(prop)
        
        Property.objects.insert(properties)

    def create_clean_properties(self):
            
            Property.drop_collection()  # Clear existing data 

            properties_data = self.get_properties_from_csv("properties.csv")
            if not properties_data:
                print("⚠️ No data found in Properties CSV")
                return False
            clean_data = self.clean_property(properties_data)
            self.create_properties(clean_data)

            bayout_data = self.get_properties_from_csv("bayut.csv")
            if not bayout_data:
                print("⚠️ No data found in Bayout CSV")
                return False    
            clean_bayout_data = self.clean_bayut(bayout_data)
            self.create_properties(clean_bayout_data)
            return True
            