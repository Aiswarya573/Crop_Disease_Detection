from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from predict import predict_disease

app = Flask(__name__)
CORS(app)

MAX_CONTENT_LENGTH = 10 * 1024 * 1024
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'bmp'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Crop Disease Detection API is running'})


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Use JPG, PNG, or WEBP'}), 400

    try:
        image_bytes = file.read()
        result = predict_disease(image_bytes)
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/diseases', methods=['GET'])
def get_diseases():
    from predict import DISEASE_INFO
    diseases = [
        {
            'key': key,
            'name': info['name'],
            'crop_type': info['crop_type'],
            'is_healthy': info['is_healthy'],
        }
        for key, info in DISEASE_INFO.items()
    ]
    return jsonify({'diseases': diseases, 'total': len(diseases)})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
