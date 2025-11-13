import apiClient from "./api";

export class TemplateService {
  async createTemplate(templateData) {
    return await apiClient.post('/templates', templateData);
  }

  async getAllTemplates(params = {}) {
    return await apiClient.get('/templates', { params });
  }

  async getTemplateById(id) {
    return await apiClient.get(`/templates/${id}`);
  }

  async getTemplatesByCategory(categoryId) {
    return await apiClient.get(`/templates/category/${categoryId}`);
  }

  async updateTemplate(id, updateData) {
    return await apiClient.put(`/templates/${id}`, updateData);
  }

  async deleteTemplate(id) {
    return await apiClient.delete(`/templates/${id}`);
  }

  async useTemplate(id) {
    return await apiClient.post(`/templates/${id}/use`);
  }

  async downloadTemplate(id) {
    return await apiClient.post(`/templates/${id}/download`);
  }

  async batchUpdateTemplates(ids, updateData) {
    return await apiClient.put('/templates/batch/update', { ids, ...updateData });
  }

  async batchDeleteTemplates(ids) {
    return await apiClient.delete('/templates/batch/delete', { data: { ids } });
  }

  async getTemplateAnalytics(id) {
    return await apiClient.get(`/templates/${id}/analytics`);
  }

  async getPopularTemplates(limit = 10) {
    return await apiClient.get('/templates/analytics/popular', { params: { limit } });
  }
}

export const templateService = new TemplateService();