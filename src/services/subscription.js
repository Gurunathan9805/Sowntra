import apiClient from './api';

export class SubscriptionService {
  async getUserSubscription() {
    return await apiClient.get('/subscriptions/my-subscription');
  }

  async updateUserSubscription(subscriptionData) {
    return await apiClient.post('/subscriptions/update', subscriptionData);
  }

  async getSubscriptionStats() {
    return await apiClient.get('/subscriptions/stats');
  }
}

export const subscriptionService = new SubscriptionService();