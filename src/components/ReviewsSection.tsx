import React, { useState } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ReviewsSection: React.FC = () => {
  const { reviews, addReview, deleteReview, isAdmin, isDarkMode } = useApp();
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName.trim() || !newReview.comment.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    addReview({
      customerName: newReview.customerName,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setNewReview({
      customerName: '',
      rating: 5,
      comment: ''
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        alert('Erro ao excluir avaliação');
      }
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          >
            <Star
              size={14}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`${bgColor} rounded-lg shadow-md p-4`}>
        <h2 className={`text-lg font-bold ${textColor} mb-4`}>Avaliações dos Clientes</h2>
        
        {/* Review Form - Compact */}
        <div className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h3 className={`text-base font-semibold ${textColor} mb-3`}>Deixe sua avaliação</h3>
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={newReview.customerName}
                onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Seu nome"
                className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
                required
              />
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${textColor}`}>Avaliação:</span>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>
            
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Conte-nos sobre sua experiência..."
              rows={2}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm`}
              required
            />
            
            <button
              type="submit"
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm"
            >
              <Send size={14} />
              <span>Enviar Avaliação</span>
            </button>
          </form>
        </div>

        {/* Reviews List - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-6">
              <p className={`${textSecondary} text-sm`}>
                Ainda não há avaliações. Seja o primeiro a avaliar!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={`border ${borderColor} rounded-md p-3 relative`}>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Excluir avaliação"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${textColor} text-sm`}>{review.customerName}</h4>
                  {renderStars(review.rating)}
                </div>
                <p className={`${textSecondary} text-xs mb-2 line-clamp-2`}>{review.comment}</p>
                <p className={`text-xs ${textSecondary}`}>
                  {review.date.toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;