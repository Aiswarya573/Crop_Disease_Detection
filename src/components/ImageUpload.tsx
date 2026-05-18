import { useRef, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  isAnalyzing: boolean;
  previewUrl: string | null;
  onClear: () => void;
}

export default function ImageUpload({ onImageSelected, isAnalyzing, previewUrl, onClear }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 group
            ${isDragging
              ? 'border-emerald-400 bg-emerald-50 scale-[1.02]'
              : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50'
            }
          `}
        >
          <div className={`
            mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
            ${isDragging ? 'bg-emerald-100 scale-110' : 'bg-white shadow-md group-hover:bg-emerald-50 group-hover:scale-105'}
          `}>
            <Upload className={`w-9 h-9 transition-colors ${isDragging ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isDragging ? 'Drop your image here' : 'Upload Crop Leaf Image'}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Drag and drop or click to browse
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Choose File
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, WEBP — Max 10MB</p>

          <div className={`absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-lg group">
          <img
            src={previewUrl}
            alt="Uploaded crop leaf"
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 text-white text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>Crop leaf image ready for analysis</span>
            </div>
          </div>
          {!isAnalyzing && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center text-white">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-300/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-t-teal-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>
                <p className="text-sm font-medium">Analyzing leaf...</p>
              </div>
            </div>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
