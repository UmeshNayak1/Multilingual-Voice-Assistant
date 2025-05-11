from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.get_json()
        print("Received JSON:", data)  # Debug print

        if not data or 'text' not in data or 'dest' not in data:
            return jsonify({'error': 'Missing text or dest field'}), 400

        text = data['text']
        dest = data['dest']
        translated = translator.translate(text, dest=dest)

        return jsonify({'translated_text': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
