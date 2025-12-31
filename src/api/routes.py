"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import func

from api.models import db, User, ClickEvent
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# =========================
# HELLO (DEMO / HEALTHCHECK)
# =========================


@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({
        "message": "Backend is running"
    }), 200


# =========================
# COMPARE (CON RANKING REAL)
# =========================
@api.route('/compare', methods=['GET'])
def compare_transfers():
    origin = request.args.get('from', 'ES')
    destination = request.args.get('to', 'CO')
    amount = float(request.args.get('amount', 200))

    # Proveedores base (luego vendrán de DB o config)
    results = [
        {
            "id": "remitly",
            "name": "Remitly",
            "receive": round(amount * 0.992, 2),
            "time": "5-10 min",
            "fee": "3,99 €",
            "url": "https://example.com/remitly"
        },
        {
            "id": "worldremit",
            "name": "WorldRemit",
            "receive": round(amount * 0.986, 2),
            "time": "Same day",
            "fee": "4,99 €",
            "url": "https://example.com/worldremit"
        },
        {
            "id": "ria",
            "name": "Ria",
            "receive": round(amount * 0.982, 2),
            "time": "Cash pickup",
            "fee": "3,50 €",
            "url": "https://example.com/ria"
        },
        {
            "id": "wise",
            "name": "Wise",
            "receive": round(amount * 0.988, 2),
            "time": "Same day",
            "fee": "Variable",
            "url": "https://example.com/wise"
        },
        {
            "id": "xoom",
            "name": "Xoom",
            "receive": round(amount * 0.985, 2),
            "time": "Same day",
            "fee": "4,50 €",
            "url": "https://example.com/xoom"
        }
    ]

    # 🔢 Ranking automático por clicks en este corredor
    clicks = dict(
        db.session.query(
            ClickEvent.provider_id,
            func.count(ClickEvent.id)
        )
        .filter(
            ClickEvent.origin == origin,
            ClickEvent.destination == destination
        )
        .group_by(ClickEvent.provider_id)
        .all()
    )

    # Ordenar resultados por popularidad (clicks)
    results.sort(
        key=lambda r: clicks.get(r["id"], 0),
        reverse=True
    )

    return jsonify({
        "from": origin,
        "to": destination,
        "amount": amount,
        "results": results
    }), 200


# =========================
# CLICK TRACKING (CRÍTICO)
# =========================
@api.route('/click', methods=['POST'])
def register_click():
    data = request.get_json()

    provider_id = data.get('provider_id')
    origin = data.get('from')
    destination = data.get('to')
    amount = data.get('amount')

    if not provider_id or not origin or not destination:
        return jsonify({"error": "Invalid payload"}), 400

    affiliate_urls = {
        "remitly": "https://example.com/remitly",
        "worldremit": "https://example.com/worldremit",
        "ria": "https://example.com/ria",
        "wise": "https://example.com/wise",
        "xoom": "https://example.com/xoom"
    }

    redirect_url = affiliate_urls.get(provider_id)

    if not redirect_url:
        return jsonify({"error": "Provider not found"}), 404

    # Guardar click en BD
    click = ClickEvent(
        provider_id=provider_id,
        origin=origin,
        destination=destination,
        amount=amount
    )

    db.session.add(click)
    db.session.commit()

    return jsonify({
        "redirect_url": redirect_url
    }), 200


# =========================
# MÉTRICAS (INTELIGENCIA)
# =========================
@api.route('/metrics', methods=['GET'])
def metrics():
    by_provider = (
        db.session.query(
            ClickEvent.provider_id,
            func.count(ClickEvent.id)
        )
        .group_by(ClickEvent.provider_id)
        .all()
    )

    by_corridor = (
        db.session.query(
            ClickEvent.origin,
            ClickEvent.destination,
            func.count(ClickEvent.id)
        )
        .group_by(ClickEvent.origin, ClickEvent.destination)
        .all()
    )

    return jsonify({
        "by_provider": [
            {"provider": p, "clicks": c} for p, c in by_provider
        ],
        "by_corridor": [
            {"from": o, "to": d, "clicks": c} for o, d, c in by_corridor
        ]
    }), 200
