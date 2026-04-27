from flask import Blueprint, jsonify, request
from services.crawling_services import CrawlingService

crawling_bp = Blueprint('crawling_bp', __name__)
crawling_service = CrawlingService()

@crawling_bp.route('/crawl', methods=['GET'])
def crawl_properties():
    """Endpoint to trigger the crawling process for properties."""
    try:
        crawling_service.crawl_data()
        return jsonify({"message": "Crawling successful."}), 200
    except Exception as e:
        return jsonify({
            "error": "Internal Server Error", 
            "message": str(e)
        }), 500