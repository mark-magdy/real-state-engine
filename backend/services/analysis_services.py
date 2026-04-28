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
        """Calculating ROI using both Installments (Cash-on-Cash) and Average Price by type"""
        query = self.build_filter(filters or {})

        avg_price_data = self.calculate_avg_price_by_type(filters)
        avg_prices_map = {
            item["property_type"]: item["avg_price"] 
            for item in avg_price_data["avg_price_by_type"]
        }

        apartments_for_rent = Property.objects(**query, listing_type="rent")
        roi = {}

        for apt in apartments_for_rent:
            annual_rent = apt.price * 12 if apt.price else None

            area = apt.area if apt.area else "Unknown area"
            if area not in roi:
                roi[area] = []
            
            prop_type_key = apt.property_type.value if hasattr(apt.property_type, 'value') else apt.property_type
            avg_full_price = avg_prices_map.get(prop_type_key)
            
            if annual_rent:

                if apt.down_payment and apt.installment:
                    first_year_cash_invested = apt.down_payment + (apt.installment * 12)

                    if first_year_cash_invested > 0:
                        installment_roi_value = (annual_rent / first_year_cash_invested) * 100
                        roi[area].append({
                            "title": apt.title,
                            "compound": apt.compound,
                            "investment_type": "Installment plan",
                            "apartment_type": prop_type_key,
                            "down_payment": apt.down_payment,
                            "installment": apt.installment,
                            "rent": apt.price,
                            "roi_percentage": round(installment_roi_value, 2),
                            "months_to_recover_year_one_cash": round(first_year_cash_invested / apt.price, 2) if apt.price else None
                        })
            
        
                if avg_full_price:
                    roi_value = (annual_rent / avg_full_price) * 100

                    roi[area].append({
                        "title": apt.title,
                        "compound": apt.compound,
                        "apartment_type": prop_type_key,
                        "investment_type": "Average Price by Type",
                        "avg_full_price": avg_full_price,
                        "rent": apt.price,
                        "roi_percentage": round(roi_value, 2),
                        "months_to_break_even": round(avg_full_price / apt.price, 2)
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

    def calculate_avg_price_by_area(self, filters=None):
        pipeline = [
            {"$match": self.build_filter(filters or {})},
            {
                "$group": {
                    "_id": "$area",
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
            "avg_price_by_area": [
                {
                    "area": r["_id"],
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