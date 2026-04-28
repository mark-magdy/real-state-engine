
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
    
    def clean_property(self,data):

    # property_type → take first type
        clean_data = []
        for row in data:
            row = {str(k).replace("\ufeff", "").strip().lower(): v for k, v in row.items()}# ✅ fix headers
                
            try:
                prop_type = row.get("property_type", "").split(",")[0].strip().lower()
            
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
                
                compound = row.get("compound", "").strip()
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
                    "title": f"{prop_type.title()} , {compound}" if compound else prop_type.title(),
                    "property_type": prop_type,
                    "area": area,
                    "compound": compound,
                    "meter_square": int(float(row.get("size_sqm") or 0)),
                    "bedrooms": bedrooms,
                    "bathrooms": int(float(row.get("bathrooms") or 0)),
                    "price": float(row.get("min_price") or 0),
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

            # split location → area + compound
            location = row.get("location") or ""
            parts = [p.strip() for p in location.split(",")]

            compound = parts[0] if parts else ""
            area = parts[-2] if len(parts) > 1 else location

            area = area.replace("City", "").strip()

            clean_data.append({
                "title": f"{prop_type.title()} , {compound}" if compound else prop_type.title(),
                "property_type": prop_type,
                "area": area,
                "compound": compound,

                "meter_square": parse_int(row.get("Area(m2)")),
                "bedrooms": parse_int(row.get("bedrooms")),
                "bathrooms": parse_int(row.get("Bathrooms")),

                "price": parse_price(row.get("Price(EGP)")),
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
            