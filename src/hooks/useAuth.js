import { apiService } from './api.service';

export class TemplateService {
  // Create new template
  async createTemplate(templateData) {
    return await apiService.post('/templates', templateData);
  }

  // Get all templates with pagination and filters
  async getTemplates(params) {
    return await apiService.get('/templates', params);
  }

  // Get template by ID
  async getTemplateById(id) {
    return await apiService.get(`/templates/${id}`);
  }

  // Get templates by category
  async getTemplatesByCategory(categoryId) {
    return await apiService.get(`/templates/category/${categoryId}`);
  }

  // Update template
  async updateTemplate(id, updateData) {
    return await apiService.put(`/templates/${id}`, updateData);
  }

  // Delete template
  async deleteTemplate(id) {
    return await apiService.delete(`/templates/${id}`);
  }

  // Use template (creates a board from template)
  async useTemplate(id) {
    return await apiService.post(`/templates/${id}/use`);
  }

  // Download template
  async downloadTemplate(id) {
    return await apiService.post(`/templates/${id}/download`);
  }

  // Batch operations
  async batchUpdateTemplates(ids, updateData) {
    return await apiService.put('/templates/batch/update', {
      ids,
      ...updateData
    });
  }

  async batchDeleteTemplates(ids) {
    return await apiService.delete('/templates/batch/delete', {
      data: { ids }
    });
  }

  // Analytics
  async getTemplateAnalytics(id) {
    return await apiService.get(`/templates/${id}/analytics`);
  }

  async getPopularTemplates(limit) {
    return await apiService.get('/templates/analytics/popular', { limit });
  }
}

export const templateService = new TemplateService();
