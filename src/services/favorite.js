import apiClient from './api';

export class FavoriteService {
  async addToFavorites(templateId) {
    return await apiClient.post('/favorites', { templateId });
  }

  async removeFromFavorites(templateId) {
    return await apiClient.delete(`/favorites/${templateId}`);
  }

  async getUserFavorites() {
    return await apiClient.get('/favorites');
  }

  async checkIsFavorite(templateId) {
    return await apiClient.get(`/favorites/check/${templateId}`);
  }
}

export const favoriteService = new FavoriteService();