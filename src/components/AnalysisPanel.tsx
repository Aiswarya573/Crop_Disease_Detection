import { useState } from 'react';
import { Scan, Leaf } from 'lucide-react';
import ImageUpload from './ImageUpload';
import PredictionResult from './PredictionResult';
import { supabase } from '../lib/supabase';
import { DISEASE_DATABASE, simulatePrediction } from '../lib/diseaseData';
import type { Prediction, PredictionInsert } from '../lib/supabase';

interface AnalysisPanelProps {
  onNewPrediction: (prediction: Prediction) => void;
  downloadReport: (prediction: Prediction) => void;
}

export default function AnalysisPanel({ onNewPrediction, downloadReport }: AnalysisPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handleImageSelected = (file: File, url: string) => {
    setImageFile(file);
    setPreviewUrl(url);
    setPrediction(null);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setImageFile(null);
    setPrediction(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile || !previewUrl) return;
    setIsAnalyzing(true);

    try {
      const { disease_key, confidence } = await simulatePrediction(imageFile);
      const diseaseInfo = DISEASE_DATABASE[disease_key];

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = previewUrl;
      });
      canvas.width = 120;
      canvas.height = 90;
      ctx?.drawImage(img, 0, 0, 120, 90);
      const thumbUrl = canvas.toDataURL('image/jpeg', 0.7);

      const insertData: PredictionInsert = {
        image_url: thumbUrl,
        disease_name: diseaseInfo.name,
        confidence,
        description: diseaseInfo.description,
        causes: diseaseInfo.causes,
        prevention: diseaseInfo.prevention,
        treatment: diseaseInfo.treatment,
        crop_type: diseaseInfo.crop_type,
        is_healthy: diseaseInfo.is_healthy,
      };

      const { data, error } = await supabase
        .from('predictions')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setPrediction(data);
      onNewPrediction(data);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="font-bold text-gray-900">Upload & Analyze</h2>
        </div>

        <ImageUpload
          onImageSelected={handleImageSelected}
          isAnalyzing={isAnalyzing}
          previewUrl={previewUrl}
          onClear={handleClear}
        />

        {previewUrl && !isAnalyzing && !prediction && (
          <button
            onClick={handleAnalyze}
            className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <Scan className="w-4 h-4" />
            Analyze Disease
          </button>
        )}

        {isAnalyzing && (
          <div className="mt-4 bg-emerald-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-3 text-emerald-700">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">AI model analyzing your crop leaf...</span>
            </div>
            <p className="text-xs text-emerald-600/70 mt-1">This may take a few seconds</p>
          </div>
        )}
      </div>

      {prediction && (
        <PredictionResult
          prediction={prediction}
          onDownloadReport={() => downloadReport(prediction)}
        />
      )}
    </div>
  );
}
