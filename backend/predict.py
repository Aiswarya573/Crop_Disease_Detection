import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os
from model import load_or_build_model, preprocess_image, CLASS_NAMES

MODEL_WEIGHTS_PATH = os.environ.get('MODEL_WEIGHTS', 'crop_disease_model.h5')

_model = None


def get_model():
    global _model
    if _model is None:
        weights = MODEL_WEIGHTS_PATH if os.path.exists(MODEL_WEIGHTS_PATH) else None
        _model = load_or_build_model(weights)
    return _model


DISEASE_INFO = {
    'tomato_early_blight': {
        'name': 'Tomato Early Blight',
        'crop_type': 'Tomato',
        'is_healthy': False,
        'description': 'Early blight is a common fungal disease affecting tomato plants, caused by Alternaria solani. It typically appears as dark brown spots with concentric rings forming a target-like pattern on older leaves, gradually moving upward.',
        'causes': [
            'Fungal pathogen Alternaria solani',
            'Warm, humid weather conditions (24–29°C)',
            'Excessive moisture on leaf surfaces',
            'Poor air circulation around plants',
            'Nutrient-deficient or stressed plants',
        ],
        'prevention': [
            'Rotate crops every 2–3 years to prevent soil buildup',
            'Remove and destroy infected plant debris',
            'Water at the base to keep foliage dry',
            'Maintain proper plant spacing for airflow',
            'Apply balanced fertilization to reduce plant stress',
        ],
        'treatment': 'Apply fungicides containing chlorothalonil, mancozeb, or copper-based compounds at first sign of infection. Remove heavily infected leaves. Use biological controls like Bacillus subtilis products.',
    },
    'tomato_late_blight': {
        'name': 'Tomato Late Blight',
        'crop_type': 'Tomato',
        'is_healthy': False,
        'description': 'Late blight is a devastating oomycete disease caused by Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops within days.',
        'causes': [
            'Water mold pathogen Phytophthora infestans',
            'Cool temperatures (10–24°C) with high humidity',
            'Extended periods of leaf wetness',
            'Infected seed or transplants',
            'Airborne spore spread from neighboring fields',
        ],
        'prevention': [
            'Use certified disease-free seeds and transplants',
            'Plant resistant varieties when available',
            'Apply preventive fungicide sprays before disease onset',
            'Destroy infected volunteer plants and debris',
            'Monitor weather forecasts for blight-favorable conditions',
        ],
        'treatment': 'Apply systemic fungicides such as metalaxyl, mefenoxam, or cymoxanil as soon as symptoms appear. Remove and bag infected plant material. In severe cases, destroy entire infected plants to prevent spread.',
    },
    'potato_early_blight': {
        'name': 'Potato Early Blight',
        'crop_type': 'Potato',
        'is_healthy': False,
        'description': 'Early blight in potatoes is caused by Alternaria solani and presents as dark, circular to oval lesions with a distinctive target-board appearance on lower, older leaves.',
        'causes': [
            'Fungal pathogen Alternaria solani',
            'Warm days and cool nights with high humidity',
            'Plant stress from drought or nutrient deficiency',
            'Dense planting with poor air circulation',
            'Infected plant debris left in the field',
        ],
        'prevention': [
            'Use certified disease-free seed potatoes',
            'Implement 3–4 year crop rotation',
            'Apply adequate potassium and phosphorus fertilization',
            'Avoid overhead irrigation when possible',
            'Scout fields regularly and remove infected material early',
        ],
        'treatment': 'Spray with fungicides containing azoxystrobin, chlorothalonil, or mancozeb. Begin applications when lower leaves show first symptoms. Maintain plant vigor through proper nutrition.',
    },
    'potato_late_blight': {
        'name': 'Potato Late Blight',
        'crop_type': 'Potato',
        'is_healthy': False,
        'description': 'Potato late blight, caused by Phytophthora infestans, causes pale green to brown water-soaked lesions on leaves and stems. It can also infect tubers, causing a reddish-brown rot.',
        'causes': [
            'Oomycete pathogen Phytophthora infestans',
            'Cool, moist conditions (10–20°C) with leaf wetness',
            'Infected tubers used as seed',
            'Spores carried by wind from infected fields',
            'Proximity to other solanaceous crops',
        ],
        'prevention': [
            'Plant only certified, disease-free seed tubers',
            'Harvest before or during dry conditions',
            'Store tubers in cool, dry, well-ventilated areas',
            'Destroy cull piles and volunteers',
            'Apply preventive fungicide program during cool, wet seasons',
        ],
        'treatment': 'Use systemic fungicides (metalaxyl-M, dimethomorph) combined with contact fungicides (mancozeb, chlorothalonil). Apply every 5–7 days during favorable conditions. In severe outbreaks, consider vine killing before harvest.',
    },
    'corn_common_rust': {
        'name': 'Corn Common Rust',
        'crop_type': 'Corn',
        'is_healthy': False,
        'description': 'Common rust of corn is caused by the fungus Puccinia sorghi. It appears as cinnamon-brown to brick-red oval pustules scattered on both leaf surfaces.',
        'causes': [
            'Fungal pathogen Puccinia sorghi',
            'Cool temperatures (16–23°C) with high humidity',
            'Airborne urediniospores from infected fields',
            'Extended periods of leaf wetness from dew or rain',
            'Susceptible corn hybrids',
        ],
        'prevention': [
            'Plant resistant or tolerant corn hybrids',
            'Plant early to avoid peak rust spore periods',
            'Monitor fields regularly from tasseling onwards',
            'Avoid dense planting that restricts air movement',
            'Keep detailed field records to improve future management',
        ],
        'treatment': 'Apply foliar fungicides (strobilurins, triazoles or their mixtures) at early disease detection. Products containing pyraclostrobin, azoxystrobin, or propiconazole are effective.',
    },
    'healthy': {
        'name': 'Healthy Leaf',
        'crop_type': 'Various',
        'is_healthy': True,
        'description': 'This leaf appears healthy with no visible signs of disease, pest damage, or nutritional deficiencies.',
        'causes': [],
        'prevention': [
            'Continue regular monitoring for early disease detection',
            'Maintain optimal watering and fertilization schedules',
            'Practice crop rotation and sanitation',
            'Ensure proper plant spacing for air circulation',
            'Keep records of field conditions and treatments',
        ],
        'treatment': 'No treatment required. Continue standard crop management practices.',
    },
}


def predict_disease(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image_array = np.array(image)
    processed = preprocess_image(image_array)

    model = get_model()
    predictions = model.predict(processed, verbose=0)
    predicted_idx = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0])) * 100

    class_key = CLASS_NAMES[predicted_idx]
    info = DISEASE_INFO.get(class_key, DISEASE_INFO['healthy'])

    return {
        'disease_key': class_key,
        'disease_name': info['name'],
        'crop_type': info['crop_type'],
        'is_healthy': info['is_healthy'],
        'confidence': round(confidence, 1),
        'description': info['description'],
        'causes': info['causes'],
        'prevention': info['prevention'],
        'treatment': info['treatment'],
        'all_predictions': {
            CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        },
    }
