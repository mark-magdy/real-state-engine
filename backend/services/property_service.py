from models.property import Property

class PropertyService:
    def __init__(self):
        # Seed data if database is empty
        if Property.objects.count() == 0:
            seed_data = [
                Property(prop_id=1, title="Sea View Villa", type="Villa", price=850000),
                Property(prop_id=2, title="Modern City Apartment", type="Apartment", price=320000),
                Property(prop_id=3, title="Suburban House", type="House", price=450000)
            ]
            for prop in seed_data:
                prop.save()

    def get_all_properties(self):
        properties = Property.objects()
        return [prop.to_dict() for prop in properties]

    def get_property_by_id(self, prop_id):
        prop = Property.objects(prop_id=prop_id).first()
        if prop:
            return prop.to_dict()
        return None
