import requests
import json
from langdetect import detect, LangDetectException
from datetime import datetime

# --- Language Mapping ---
LANGUAGE_MAP = {
    "english": "en",
    "hindi": "hi",
    "nepali": "ne",
    "doteli": "ne",
    "malayalam": "ml",
    "bhojpuri": "hi"
}

# --- Greetings Mapping ---
GREETINGS = {
    "en": ["hi", "hello", "how are you", "kaise ho", "good morning", "good evening"],
    "hi": ["namaste", "kaise ho", "aap kaise hain"],
    "ne": ["namaste", "k xa", "kasto cha"],
    "ml": ["namaskaram", "sukhamano"]
}

GREET_RESPONSES = {
    "en": "Hello! How can I assist you with your farming today?",
    "hi": "नमस्ते! मैं आपकी खेती-बाड़ी में किस प्रकार मदद कर सकता हूँ?",
    "ne": "नमस्ते किसान भाई! म तपाईंलाई खेतीबारीमा कसरी सहयोग गर्न सक्छु?",
    "ml": "നമസ്കാരം! നിങ്ങളുടെ കാർഷിക പ്രവർത്തനത്തിൽ എങ്ങനെ സഹായിക്കാം?"
}

# --- Language Detection ---
def detect_language(text):
    try:
        lang_code = detect(text)
        return lang_code
    except LangDetectException:
        return None

def get_language_code(user_input, preferred_lang):
    lower_input = user_input.lower()
    for lang_name, code in LANGUAGE_MAP.items():
        if lang_name in lower_input:
            return code
    for lang_code, greetings in GREETINGS.items():
        for g in greetings:
            if g in lower_input:
                return lang_code
    detected_lang = detect_language(user_input)
    return detected_lang if detected_lang else preferred_lang

# --- Casual Greetings ---
def check_casual_greetings(user_input, lang_code):
    lower_input = user_input.lower()
    for greeting in GREETINGS.get(lang_code, []):
        if greeting in lower_input:
            return GREET_RESPONSES.get(lang_code, "Hello!")
    return None

# --- AI API Call ---
def get_ai_response(user_message, lang_code, short_answer=True, conversation_context=None):
    api_key = "AIzaSyBc8gKV0aPJln88nKbT7YqvLXqlngMqKz0"
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"

    context_text = ""
    if conversation_context:
        for msg in conversation_context[-5:]:
            role = msg["role"]
            content = msg["content"]
            context_text += f"{role}: {content}\n"

    system_instruction = f"""
    You are a helpful Agricultural Expert chatbot for farmers.
    1. Focus on crops, soil, irrigation, fertilizers, pests, diseases.
    2. Provide direct actionable solutions first, max 4-5 lines.
    3. Explain more only if the user asks explicitly.
    4. Maintain conversation context: {context_text}
    5. Respond strictly in {lang_code}.
    """

    payload = {
        "contents": [{"parts": [{"text": user_message}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "tools": [{"google_search": {}}]
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(api_url, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
        return None

# --- Extract AI Response ---
def extract_text_from_response(response_data):
    try:
        candidates = response_data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts and "text" in parts[0]:
                return parts[0]["text"]
        return "Sorry, I couldn't get a valid response. Please try again."
    except Exception as e:
        return f"Error parsing response: {e}"