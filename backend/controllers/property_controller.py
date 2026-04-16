from flask import Blueprint, jsonify
from services.property_service import PropertyService

property_bp = Blueprint('property_bp', __name__)
property_service = PropertyService()

@property_bp.route('/', methods=['GET'])
def get_properties():
    properties = property_service.get_all_properties()
    return jsonify(properties)

@property_bp.route('/<int:prop_id>', methods=['GET'])
def get_property(prop_id):
    prop = property_service.get_property_by_id(prop_id)
    if prop:
        return jsonify(prop)
    return jsonify({"error": "Property not found"}), 404
