from flask import Blueprint, jsonify, request
from services.property_service import PropertyService

property_bp = Blueprint('property_bp', __name__)
property_service = PropertyService()

@property_bp.route('/', methods=['GET'])
def get_properties():
    properties = property_service.get_all_properties()
    return jsonify(properties)

@property_bp.route('/search', methods=['GET'])
def search_properties():
    filters = {
        'area': request.args.get('area'),
        'listing_type': request.args.get('listing_type'),
        'property_type': request.args.get('property_type'),
        'min_price': request.args.get('min_price'),
        'max_price': request.args.get('max_price'),
        'bedrooms': request.args.get('bedrooms'),
        'bathrooms': request.args.get('bathrooms'),
        'compound': request.args.get('compound')
    }
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 12))
    
    results = property_service.search_properties(filters, page, limit)
    return jsonify(results)

@property_bp.route('/<int:prop_id>', methods=['GET'])
def get_property(prop_id):
    prop = property_service.get_property_by_id(prop_id)
    if prop:
        return jsonify(prop)
    return jsonify({"error": "Property not found"}), 404

@property_bp.route('/', methods=['POST'])
def create_clean_properties():
   
    try:
        is_created= property_service.create_clean_properties()
        if is_created:
            return jsonify({"message": "Properties created successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    