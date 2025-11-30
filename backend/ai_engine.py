import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def analyze_business(business_text):

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": """
You are a professional business consultant AI.

You MUST respond ONLY in valid JSON format with NO extra text.

Use this EXACT structure:

{
  "score": 0-100 (number only),
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "summary": "1-2 sentence executive summary of the business health",
  "weaknesses": [3-5 short bullet weaknesses],
  "report": "Formatted business analysis with these exact sections:
Efficiency Improvements:
Scalability:
Risk Reduction:
Revenue Growth:"
}

RULES:
- score MUST be a number (not text)
- priority reflects urgency of business issues
- summary must be professional and concise
- weaknesses must be realistic and problem-focused
- report must stay structured and professional
- NO text outside JSON.
"""
            },
            {"role": "user", "content": business_text}
        ],
        temperature=0.3,
    )

    raw = response.choices[0].message.content

    try:
        return json.loads(raw)
    except:
        # Fallback protection if AI breaks format
        return {
            "score": 70,
            "priority": "MEDIUM",
            "summary": "Business analysis could not be perfectly structured due to AI formatting limitations.",
            "weaknesses": ["AI formatting inconsistency detected"],
            "report": raw
        }
