from flask import Blueprint, jsonify, request
from services.analysis_services import AnalysisService

analysis_bp = Blueprint('analysis_bp', __name__)
analysis_service = AnalysisService()

@analysis_bp.route('/roi', methods=['GET'])
def get_return_on_investment():
    """Endpoint to calculate and return the average return on investment (ROI) for properties."""
    roi_data = analysis_service.calculate_return_on_investment()
    return jsonify(roi_data)

@analysis_bp.route('/average-price/<location>', methods=['GET'])
def get_average_price(location):
    """Endpoint to calculate and return the average price for properties in a specific location."""
    average_price_data = analysis_service.calculate_average_price_by_location(location)
    return jsonify(average_price_data)

@analysis_bp.route('/property-counts', methods=['GET'])
def get_property_counts():
    """Endpoint to return the count of properties grouped by type for each area."""
    filters = request.args.to_dict()
    count_data = analysis_service.calculate_property_counts_by_area(filters)
    return jsonify(count_data)

@analysis_bp.route('/average-price-by-type', methods=['GET'])
def get_average_price_by_type():
    """Endpoint to calculate and return average prices for each property type."""
    filters = request.args.to_dict()
    avg_price_data = analysis_service.calculate_avg_price_by_type(filters)
    return jsonify(avg_price_data)

@analysis_bp.route('/installments-by-area', methods=['GET'])
def get_installments_by_area():
    """Endpoint to analyze installment periods grouped by area."""
    filters = request.args.to_dict()
    installments_data =  analysis_service.calculate_installments_by_area(filters)
    return jsonify(installments_data)

@analysis_bp.route('/downpayment-percentage', methods=['GET'])
def get_downpayment_percentage():
    """Endpoint to calculate the downpayment percentage (downpayment/total cost) vs area."""
    filters = request.args.to_dict()
    downpayment_data = analysis_service.calculate_downpayment_percentage_by_area(filters)
    return jsonify(downpayment_data)