from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from ai_engine import analyze_business
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()
app = Flask(__name__)

limiter = Limiter(get_remote_address, app=app, default_limits=["5 per minute"])


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    business_text = data.get("text", "")

    if not business_text.strip():
        return jsonify({"score": None, "report": "Please enter a business description.", "weaknesses": []})

    result = analyze_business(business_text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
