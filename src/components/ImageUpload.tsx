import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Link, Trash2 } from 'lucide-react';
import { uploadImage } from '../services/firebaseService';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  className?: string;
  isDarkMode?: boolean;
  allowDelete?: boolean;
  onImageDeleted?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage, 
  className = '',
  isDarkMode = false,
  allowDelete = false,
  onImageDeleted
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    try {
      console.log('Iniciando upload da imagem...');
      const url = await uploadImage(file);
      console.log('Upload concluído, URL:', url);
      onImageUploaded(url);
      alert('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      // Validate URL format
      try {
        new URL(imageUrl);
        onImageUploaded(imageUrl.trim());
        setImageUrl('');
        setShowUrlInput(false);
        alert('Imagem adicionada com sucesso!');
      } catch {
        alert('Por favor, insira uma URL válida');
      }
    }
  };

  const handleDeleteImage = () => {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
      if (onImageDeleted) {
        onImageDeleted();
        alert('Imagem removida com sucesso!');
      }
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-500';
  const inputBg = isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300';

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed ${borderColor} rounded-lg p-4 text-center transition-colors ${
          dragOver ? 'border-orange-500 bg-orange-50' : bgColor
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentImage && !uploading && (
          <div className="mb-4 relative">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            {allowDelete && (
              <button
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                title="Remover imagem"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}

        {uploading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className={`text-sm ${textSecondary}`}>Enviando imagem...</p>
          </div>
        ) : (
          <div className="py-4">
            <ImageIcon className={`mx-auto h-12 w-12 ${textSecondary} mb-2`} />
            <p className={`text-sm ${textColor} mb-2`}>
              Arraste uma imagem aqui ou use as opções abaixo
            </p>
            <p className={`text-xs ${textSecondary} mb-4`}>
              PNG, JPG, GIF até 5MB
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <label className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Upload size={16} />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Link size={16} />
                <span>URL</span>
              </button>
            </div>

            {showUrlInput && (
              <div className="mt-4 space-y-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem aqui (ex: https://images.pexels.com/...)"
                  className={`w-full px-3 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(false);
                      setImageUrl('');
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;