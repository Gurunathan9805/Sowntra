import apiClient from './api';

export class CategoryService {
  async createCategory(categoryData) {
    return await apiClient.post('/templates/categories', categoryData);
  }

  async getAllCategories() {
    return await apiClient.get('/templates/categories/all');
  }
}

export const categoryService = new CategoryService();