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
