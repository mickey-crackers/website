import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './authSlice';

export const useAuthStore = create(
    devtools((set, get) => ({
        ...createAuthSlice(set, get),
    }), { name: 'authStore' })
);
