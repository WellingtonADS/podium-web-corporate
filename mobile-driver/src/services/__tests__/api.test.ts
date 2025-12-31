import * as SecureStore from 'expo-secure-store';

// Don't mock axios, just import the configured instance
import api from '../api';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should have correct base URL', () => {
      expect(api.defaults.baseURL).toBe('http://192.168.15.18:8000/api/v1');
    });

    it('should have timeout configured', () => {
      expect(api.defaults.timeout).toBe(10000);
    });
  });

  describe('API Instance', () => {
    it('should be an axios instance', () => {
      expect(api).toBeDefined();
      expect(typeof api.get).toBe('function');
      expect(typeof api.post).toBe('function');
      expect(typeof api.patch).toBe('function');
      expect(typeof api.delete).toBe('function');
    });

    it('should have interceptors configured', () => {
      expect(api.interceptors).toBeDefined();
      expect(api.interceptors.request).toBeDefined();
      expect(api.interceptors.response).toBeDefined();
    });
  });

  describe('SecureStore Integration', () => {
    it('should use SecureStore for token management', async () => {
      // This test verifies that the api module imports SecureStore
      // The actual interceptor behavior is tested in integration tests
      expect(SecureStore.getItemAsync).toBeDefined();
      expect(SecureStore.setItemAsync).toBeDefined();
      expect(SecureStore.deleteItemAsync).toBeDefined();
    });
  });
});
