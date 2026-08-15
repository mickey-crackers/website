import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createUserSlice } from './userSlice';

export const useUserStore = create(
    devtools((set, get) => ({
        ...createUserSlice(set, get),
    }), { name: 'userStore' })
);
