from models import Property
from models.enums import PropertyType

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
