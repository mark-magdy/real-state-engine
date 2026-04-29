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

        if "meter_square" in filters:
            query["meter_square"] = int(filters["meter_square"])

        if "min_price" in filters:
            query["price__gte"] = float(filters["min_price"])
            
        if "max_price" in filters:
            query["price__lte"] = float(filters["max_price"])

        if "bedrooms" in filters:
            query["bedrooms"] = int(filters["bedrooms"])

        return query
    
    def calculate_return_on_investment(self, filters=None):
        """Calculating ROI using Average Price for the specific Area AND Property Type"""
        query = self.build_filter(filters or {})

        aggregation_query = query.copy()
        aggregation_query["listing_type"] = "buy"

        # 1. Run an aggregation to get the average price grouped by BOTH Area and Property Type
        pipeline = [
            {"$match": aggregation_query},
            {
                "$group": {
                    "_id": {
                        "area": "$area",
                        "property_type": "$property_type"
                    },
                    "avg_price": {"$avg": "$price"}
                }
            }
        ]
        
        # Note: Using Property.objects.aggregate to be consistent with MongoEngine
        avg_price_results = list(Property.objects.aggregate(pipeline))

        # 2. Build a composite key dictionary for O(1) lookups: { ('Area', 'Type'): avg_price }
        avg_prices_map = {}
        for r in avg_price_results:
            if r["_id"]: # Ensure _id is not null
                area_key = r["_id"].get("area", "Unknown area")
                type_key = r["_id"].get("property_type", "Unknown")
                avg_prices_map[(area_key, type_key)] = r["avg_price"]

        # 3. Fetch rental listings
        apartments_for_rent = Property.objects(**query, listing_type="rent")
        roi = {}

        for apt in apartments_for_rent:
            annual_rent = apt.price * 12 if apt.price else None
            area = apt.area if apt.area else "Unknown area"
            
            # Safely get property type
            prop_type_key = apt.property_type.value if hasattr(apt.property_type, 'value') else apt.property_type

            if area not in roi:
                roi[area] = []

            # 4. Lookup the average price for THIS specific area AND property type
            avg_full_price = avg_prices_map.get((area, prop_type_key))
            
            # Calculate ROI only if we have both rent and a valid average price
            if annual_rent:
                roi_value = (annual_rent / avg_full_price) * 100 if avg_full_price else None
                break_even_months = (avg_full_price / apt.price) if (avg_full_price and apt.price) else None

                roi[area].append({
                    "title": apt.title,
                    "compound": apt.compound,
                    "apartment_type": prop_type_key,
                    "investment_type": "Average Price by Area and Type",
                    "avg_full_price": round(avg_full_price, 2) if avg_full_price else None,
                    "rent": apt.price,
                    "roi_percentage": round(roi_value, 2) if roi_value else None,
                    "months_to_break_even": round(break_even_months, 2) if break_even_months else None
                })
                
        return {"roi": roi}

    
    def calculate_property_counts_by_area(self, filters=None):
        pipeline = [
            {"$match": self.build_filter(filters or {})},
            {
                "$group": {
                    "_id": "$area",
                    "property_count": {"$sum": 1}
                }
            },
            {
                "$sort": {"property_count": -1}
            }
        ]

        results = list(Property.objects.aggregate(pipeline))

        return {
            "property_counts_by_area": [
                {
                    "area": r["_id"],
                    "property_count": r["property_count"]
                }
                for r in results
            ]
        }
    
    def calculate_avg_price_by_type(self, filters=None):
        pipeline = [
            {"$match": self.build_filter(filters or {})},
            {
                "$group": {
                    "_id": "$property_type",
                    "avg_price": {"$avg": "$price"},
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"avg_price": -1}
            }
        ]

        results = list(Property.objects.aggregate(pipeline))

        return {
            "avg_price_by_type": [
                {
                    "property_type": r["_id"],
                    "avg_price": r["avg_price"],
                    "count": r["count"]
                }
                for r in results
            ]
        }
    
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
            },
            {
                "$match": {
                    "avg_installment": {"$ne": None}
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
                            {"$eq": ["$price", 0]},
                            0,
                            {
                                "$multiply": [
                                    {"$divide": ["$down_payment", "$price"]},
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