from models import *
class AnalysisService:
    def build_filter(self, filters):
        query = {}

        if "property_type" in filters:
            query["property_type"] = filters["property_type"]

        if "area" in filters:
            query["area"] = filters["area"]

        if "compound" in filters:
            query["compound"] = filters["compound"]

        if "min_price" in filters or "max_price" in filters:
            query["full_price"] = {}
            if "min_price" in filters:
                query["full_price"]["$gte"] = filters["min_price"]
            if "max_price" in filters:
                query["full_price"]["$lte"] = filters["max_price"]

        if "bedrooms" in filters:
            query["bedrooms"] = filters["bedrooms"]

        return query
    
    def calculate_return_on_investment(self):
        # Placeholder for ROI calculation logic
        return {"roi": "ROI calculation not implemented yet"}

    def calculate_average_price_by_location(self, location):
        # Placeholder for average price calculation logic
        return {"average_price": f"Average price for location {location} not implemented yet"}
    
    def calculate_property_counts_by_area(self):
        # Placeholder for property count calculation logic
        return {"property_counts": "Property counts by area calculation not implemented yet"}
    
    def calculate_avg_price_by_type(self):
        # Placeholder for average price by type calculation logic
        return {"average_price_by_type": "Average price by type calculation not implemented yet"}

    def calculate_installments_by_area(self, filters=None):
        match_stage = {"$match": self.build_filter(filters or {})}

        pipeline = [
            match_stage,
            {
                "$group": {
                    "_id": "$area",
                    "avg_installment": {"$avg": "$installment"},
                    "count": {"$sum": 1}
                }
            }
        ]

        results = list(Property.objects.aggregate(pipeline))

        return {
            "installments_by_area": [
                {
                    "area": r["_id"],
                    "avg_installment": r["avg_installment"],
                    "properties_count": r["count"]
                }
                for r in results
            ]
        }

    def calculate_downpayment_percentage_by_area(self, filters=None):
        match_stage = {"$match": self.build_filter(filters or {})}

        pipeline = [
            match_stage,
            {
                "$project": {
                    "area": 1,
                    "downpayment_percentage": {
                        "$cond": [
                            {"$eq": ["$full_price", 0]},
                            0,
                            {
                                "$multiply": [
                                    {"$divide": ["$down_payment", "$full_price"]},
                                    100
                                ]
                            }
                        ]
                    }
                }
            },
            {
                "$group": {
                    "_id": "$area",
                    "avg_downpayment_percentage": {"$avg": "$downpayment_percentage"}
                }
            }
        ]

        results = list(Property.objects.aggregate(pipeline))

        return {
            "downpayment_percentage_by_area": [
                {
                    "area": r["_id"],
                    "avg_downpayment_percentage": r["avg_downpayment_percentage"]
                }
                for r in results
            ]
        }