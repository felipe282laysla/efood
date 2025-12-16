import React, { useState } from 'react';
import { Star, Trash2, Search, Filter, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ReviewsManager: React.FC = () => {
  const { reviews, deleteReview, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await deleteReview(reviewId);
        alert('Avaliação excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir avaliação');
        console.error(error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.rating - a.rating;
      }
    });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 : 0
  }));

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Star className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Gerenciar Avaliações</h2>
          <p className={`text-sm ${textSecondary}`}>
            Visualize e gerencie as avaliações dos clientes
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <div className="flex items-center justify-center mb-2">
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {averageRating.toFixed(1)}
          </p>
          <p className={`text-sm ${textSecondary}`}>Avaliação Média</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {reviews.length}
          </p>
          <p className={`text-sm ${textSecondary}`}>Total de Avaliações</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg`}>
          <h3 className={`text-sm font-medium ${textColor} mb-3`}>Distribuição</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className={`text-sm ${textColor} w-4`}>{rating}</span>
                <Star size={12} className="text-yellow-400" />
                <div className={`flex-1 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={`text-xs ${textSecondary} w-8`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou comentário..."
              className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="all">Todas as estrelas</option>
            <option value={5}>5 estrelas</option>
            <option value={4}>4 estrelas</option>
            <option value={3}>3 estrelas</option>
            <option value={2}>2 estrelas</option>
            <option value={1}>1 estrela</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="date">Mais recentes</option>
            <option value="rating">Maior avaliação</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className={`text-sm ${textSecondary} mb-4`}>
          Mostrando {filteredReviews.length} de {reviews.length} avaliações
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>
              {reviews.length === 0 
                ? 'Nenhuma avaliação ainda' 
                : 'Nenhuma avaliação encontrada com os filtros aplicados'
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className={`font-semibold ${textColor}`}>{review.customerName}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${textSecondary}`}>
                        {review.date.toLocaleDateString('pt-BR')}
                      </span>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Excluir avaliação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`${textSecondary} leading-relaxed`}>
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;