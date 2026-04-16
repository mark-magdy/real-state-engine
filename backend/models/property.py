from mongoengine import Document, IntField, StringField, FloatField

class Property(Document):
    meta = {'collection': 'properties'}
    
    prop_id = IntField(required=True, unique=True)
    title = StringField(required=True, max_length=100)
    type = StringField(required=True, max_length=50) # e.g., 'Villa', 'Apartment', 'Townhouse'
    price = FloatField(required=True)
    property_type = EnumField('PropertyType', required=True) # 'For Sale' or 'For Rent'

    def to_dict(self):
        return {
            "id": self.prop_id,
            "title": self.title,
            "type": self.type,
            "price": self.price
        }
