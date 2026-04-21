from mongoengine import Document, IntField, StringField, FloatField, EnumField
from .enums import PropertyType
class Property(Document):
    meta = {'collection': 'properties'}
    
    prop_id = IntField(required=True, unique=True)
    title = StringField(required=True, max_length=100)
    property_type = EnumField(PropertyType, required=True)
    price = FloatField(required=True)

    def to_dict(self):
        return {
            "id": self.prop_id,
            "title": self.title,
            "type": self.property_type.value,
            "price": self.price
        }
