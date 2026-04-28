from mongoengine import Document, IntField, StringField, FloatField, EnumField, URLField
from .enums import PropertyType

class Property(Document):
    
    
    
    title = StringField(required=True, max_length=100)
    property_type = StringField()
    down_payment = FloatField()
    installment = FloatField()

    area = StringField(required=True)
    compound = StringField()

    meter_square = IntField(required=True)

    bedrooms = IntField(required=True, min_value=0)
    bathrooms = IntField(required=True, min_value=0)

    listing_type = StringField(default="buy")  # "sale" or "rent"
    price = FloatField()

    url = URLField()

    meta = {
        "collection": "properties",
        "indexes": [
            "area",
            "compound",
            "property_type",
            "bedrooms",
            "bathrooms",
            "price"
        ]
    }

    def to_dict(self):
            return {
                "id": str(self.id),  
                "title": self.title,
                "property_type": self.property_type,
                "down_payment": self.down_payment,
                "installment": self.installment,
                "area": self.area,
                "compound": self.compound,
                "meter_square": self.meter_square,
                "bedrooms": self.bedrooms,
                "bathrooms": self.bathrooms,
                "listing_type": self.listing_type,
                "price": self.price,
                "url": self.url,
            }