import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';

// Mock the api module
jest.mock('../../services/api');

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear SecureStore mocks
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('Initial State', () => {
    it('should start with loading true', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.loading).toBe(true);
    });

    it('should have signed false initially when no stored data', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.signed).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should restore user from storage if available', async () => {
      const storedUser = JSON.stringify({ email: 'test@example.com', role: 'driver' });
      const storedToken = 'mock-token-123';
      
      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === 'podium_user') return Promise.resolve(storedUser);
        if (key === 'podium_token') return Promise.resolve(storedToken);
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.signed).toBe(true);
      expect(result.current.user).toEqual({ email: 'test@example.com', role: 'driver' });
    });
  });

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const mockResponse = {
        data: { access_token: 'new-token-456' },
      };
      
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('driver@example.com', 'password123');
      });

      expect(api.post).toHaveBeenCalledWith(
        '/login',
        'username=driver%40example.com&password=password123',
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('podium_token', 'new-token-456');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'podium_user',
        JSON.stringify({ email: 'driver@example.com', role: 'driver' })
      );
      
      expect(result.current.signed).toBe(true);
      expect(result.current.user).toEqual({ email: 'driver@example.com', role: 'driver' });
    });

    it('should handle sign in errors', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('wrong@example.com', 'wrongpass');
        })
      ).rejects.toThrow('Invalid credentials');
      
      expect(result.current.signed).toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out and clear stored data', async () => {
      // Setup: User is signed in
      const storedUser = JSON.stringify({ email: 'test@example.com', role: 'driver' });
      const storedToken = 'mock-token-123';
      
      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === 'podium_user') return Promise.resolve(storedUser);
        if (key === 'podium_token') return Promise.resolve(storedToken);
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.signed).toBe(true);
      });

      // Sign out
      await act(async () => {
        await result.current.signOut();
      });

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('podium_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('podium_user');
      expect(result.current.signed).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
