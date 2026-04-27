from mongoengine import Document, IntField, StringField, FloatField, EnumField
from .enums import PropertyType
class Property(Document):
    
    
    
    title = StringField(required=True, max_length=100)
    property_type = EnumField(PropertyType, required=True)
    down_payment = FloatField()
    installment = FloatField()

    area = StringField(required=True)
    compound = StringField()

    meter_square = IntField(required=True)

    bedrooms = IntField(required=True, min_value=0)
    bathrooms = IntField(required=True, min_value=0)

    rent = FloatField()
    full_price = FloatField()

    meta = {
        "collection": "properties",
        "indexes": [
            "area",
            "compound",
            "property_type",
            "bedrooms",
            "bathrooms",
            "rent",
            "full_price"
        ]
    }

    def to_dict(self):
            return {
                "id": str(self.id),  
                "title": self.title,
                "property_type": self.property_type.value,
                "down_payment": self.down_payment,
                "installment": self.installment,
                "area": self.area,
                "compound": self.compound,
                "meter_square": self.meter_square,
                "bedrooms": self.bedrooms,
                "bathrooms": self.bathrooms,
                "rent": self.rent,
                "full_price": self.full_price,
            }