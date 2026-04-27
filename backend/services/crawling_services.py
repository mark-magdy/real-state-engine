import requests
import pandas as pd
import time
from datetime import datetime

COMMON_COLUMNS = [
    "source", "property_id", "title", "compound", "area", "developer",
    "property_type", "bedrooms", "bathrooms", "size_sqm", "finishing",
    "ready_by", "min_price", "currency", "min_down_payment",
    "installment_percentage", "installment_type", "listing_type",
    "location", "latitude", "longitude", "url", "photo_url"
]

class CrawlingServices:

    def crawl_data(self):
        