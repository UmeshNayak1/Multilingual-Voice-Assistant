import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)

# Only allow your Netlify domain (replace with your actual Netlify URL)
CORS(app, resources={
    r"/translate": {
        "origins": ["https://multilingualvoiceassistant.netlify.app/"]
    }
}, supports_credentials=True)

translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data or 'dest' not in data:
            return jsonify({'error': 'Missing text or dest field'}), 400

        translated = translator.translate(data['text'], dest=data['dest'])
        return jsonify({'translated_text': translated.text})

    except Exception as e:
        # Log to stdout so Render captures it
        app.logger.exception("Translation error")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Render sets the PORT env var; default to 5000 locally
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
