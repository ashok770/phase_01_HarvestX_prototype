from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import get_language_code, check_casual_greetings, get_ai_response, extract_text_from_response

app = Flask(__name__)
CORS(app)

# A temporary dictionary to store chat history for each user session
chat_histories = {}

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        user_input = data.get('message')
        session_id = data.get('session_id')

        if not user_input or not session_id:
            return jsonify({"error": "Missing 'message' or 'session_id' in request body"}), 400

        # Retrieve or initialize chat history for the session
        chat_history = chat_histories.get(session_id, [])
        preferred_lang = 'en'

        # Call your existing chatbot logic functions
        lang_code = get_language_code(user_input, preferred_lang)
        greeting_reply = check_casual_greetings(user_input, lang_code)

        if greeting_reply:
            response_text = greeting_reply
        else:
            api_response = get_ai_response(user_input, lang_code, short_answer=True, conversation_context=chat_history)
            if api_response:
                response_text = extract_text_from_response(api_response)
            else:
                response_text = "I'm having trouble connecting to the AI. Please try again."

        # Update and save the chat history
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "bot", "content": response_text})
        chat_histories[session_id] = chat_history

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)