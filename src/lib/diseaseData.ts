export interface DiseaseInfo {
  name: string;
  crop_type: string;
  is_healthy: boolean;
  description: string;
  causes: string[];
  prevention: string[];
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  'tomato_early_blight': {
    name: 'Tomato Early Blight',
    crop_type: 'Tomato',
    is_healthy: false,
    description: 'Early blight is a common fungal disease affecting tomato plants, caused by Alternaria solani. It typically appears as dark brown spots with concentric rings forming a target-like pattern on older leaves, gradually moving upward.',
    causes: [
      'Fungal pathogen Alternaria solani',
      'Warm, humid weather conditions (24–29°C)',
      'Excessive moisture on leaf surfaces',
      'Poor air circulation around plants',
      'Nutrient-deficient or stressed plants'
    ],
    prevention: [
      'Rotate crops every 2–3 years to prevent soil buildup',
      'Remove and destroy infected plant debris',
      'Water at the base to keep foliage dry',
      'Maintain proper plant spacing for airflow',
      'Apply balanced fertilization to reduce plant stress'
    ],
    treatment: 'Apply fungicides containing chlorothalonil, mancozeb, or copper-based compounds at first sign of infection. Remove heavily infected leaves. Use biological controls like Bacillus subtilis products. Ensure consistent watering and avoid over-fertilizing with nitrogen.',
    severity: 'medium'
  },
  'tomato_late_blight': {
    name: 'Tomato Late Blight',
    crop_type: 'Tomato',
    is_healthy: false,
    description: 'Late blight is a devastating oomycete disease caused by Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops within days. Symptoms include large, water-soaked lesions that turn brown-black with white fuzzy growth on the underside.',
    causes: [
      'Water mold pathogen Phytophthora infestans',
      'Cool temperatures (10–24°C) with high humidity',
      'Extended periods of leaf wetness',
      'Infected seed or transplants',
      'Airborne spore spread from neighboring fields'
    ],
    prevention: [
      'Use certified disease-free seeds and transplants',
      'Plant resistant varieties when available',
      'Apply preventive fungicide sprays before disease onset',
      'Destroy infected volunteer plants and debris',
      'Monitor weather forecasts for blight-favorable conditions'
    ],
    treatment: 'Apply systemic fungicides such as metalaxyl, mefenoxam, or cymoxanil as soon as symptoms appear. Protectant fungicides like chlorothalonil can slow spread. Remove and bag infected plant material. In severe cases, destroy entire infected plants to prevent spread.',
    severity: 'high'
  },
  'potato_early_blight': {
    name: 'Potato Early Blight',
    crop_type: 'Potato',
    is_healthy: false,
    description: 'Early blight in potatoes is caused by Alternaria solani and presents as dark, circular to oval lesions with a distinctive target-board appearance on lower, older leaves. The disease weakens the plant over time, reducing tuber yield significantly.',
    causes: [
      'Fungal pathogen Alternaria solani',
      'Warm days and cool nights with high humidity',
      'Plant stress from drought or nutrient deficiency',
      'Dense planting with poor air circulation',
      'Infected plant debris left in the field'
    ],
    prevention: [
      'Use certified disease-free seed potatoes',
      'Implement 3–4 year crop rotation',
      'Apply adequate potassium and phosphorus fertilization',
      'Avoid overhead irrigation when possible',
      'Scout fields regularly and remove infected material early'
    ],
    treatment: 'Spray with fungicides containing azoxystrobin, chlorothalonil, or mancozeb. Begin applications when lower leaves show first symptoms. Ensure good coverage of all leaf surfaces. Maintain plant vigor through proper nutrition and irrigation management.',
    severity: 'medium'
  },
  'potato_late_blight': {
    name: 'Potato Late Blight',
    crop_type: 'Potato',
    is_healthy: false,
    description: 'Potato late blight, caused by Phytophthora infestans, is the disease that triggered the Irish Potato Famine. It causes pale green to brown water-soaked lesions on leaves and stems, with white sporulation on lower leaf surfaces. It can also infect tubers, causing a reddish-brown rot.',
    causes: [
      'Oomycete pathogen Phytophthora infestans',
      'Cool, moist conditions (10–20°C) with leaf wetness',
      'Infected tubers used as seed',
      'Spores carried by wind from infected fields',
      'Proximity to other solanaceous crops'
    ],
    prevention: [
      'Plant only certified, disease-free seed tubers',
      'Harvest before or during dry conditions',
      'Store tubers in cool, dry, well-ventilated areas',
      'Destroy cull piles and volunteers',
      'Apply preventive fungicide program during cool, wet seasons'
    ],
    treatment: 'Use systemic fungicides (metalaxyl-M, dimethomorph) combined with contact fungicides (mancozeb, chlorothalonil). Apply every 5–7 days during favorable conditions. Hill up soil around plants to protect tubers. In severe outbreaks, consider vine killing before harvest to prevent tuber infection.',
    severity: 'high'
  },
  'corn_common_rust': {
    name: 'Corn Common Rust',
    crop_type: 'Corn',
    is_healthy: false,
    description: 'Common rust of corn is caused by the fungus Puccinia sorghi. It appears as cinnamon-brown to brick-red oval pustules scattered on both leaf surfaces. The pustules rupture to release powdery spores. While rarely fatal, severe infections can reduce photosynthesis and yield.',
    causes: [
      'Fungal pathogen Puccinia sorghi',
      'Cool temperatures (16–23°C) with high humidity',
      'Airborne urediniospores from infected fields',
      'Extended periods of leaf wetness from dew or rain',
      'Susceptible corn hybrids'
    ],
    prevention: [
      'Plant resistant or tolerant corn hybrids',
      'Plant early to avoid peak rust spore periods',
      'Monitor fields regularly from tasseling onwards',
      'Avoid dense planting that restricts air movement',
      'Keep detailed field records to improve future management'
    ],
    treatment: 'Apply foliar fungicides (strobilurins, triazoles or their mixtures) at early disease detection, especially if infection occurs before or at tasseling. Fungicides are most economical when applied at VT to R1 growth stage. Products containing pyraclostrobin, azoxystrobin, or propiconazole are effective.',
    severity: 'medium'
  },
  'healthy': {
    name: 'Healthy Leaf',
    crop_type: 'Various',
    is_healthy: true,
    description: 'This leaf appears healthy with no visible signs of disease, pest damage, or nutritional deficiencies. The leaf shows normal coloration and structure typical of a well-maintained plant.',
    causes: [],
    prevention: [
      'Continue regular monitoring for early disease detection',
      'Maintain optimal watering and fertilization schedules',
      'Practice crop rotation and sanitation',
      'Ensure proper plant spacing for air circulation',
      'Keep records of field conditions and treatments'
    ],
    treatment: 'No treatment required. Continue standard crop management practices including regular scouting, appropriate irrigation, balanced fertilization, and preventive pest management to maintain plant health.',
    severity: 'low'
  }
};

export function simulatePrediction(imageFile: File): Promise<{ disease_key: string; confidence: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseases = Object.keys(DISEASE_DATABASE);
      const weights = [0.18, 0.15, 0.15, 0.12, 0.15, 0.25];
      const rand = Math.random();
      let cumulative = 0;
      let selected = diseases[0];
      for (let i = 0; i < diseases.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
          selected = diseases[i];
          break;
        }
      }
      const baseConfidence = selected === 'healthy' ? 88 : 72;
      const confidence = Math.min(99, baseConfidence + Math.random() * 12);
      resolve({ disease_key: selected, confidence: parseFloat(confidence.toFixed(1)) });
    }, 2800);
  });
}
