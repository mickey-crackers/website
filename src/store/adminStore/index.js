import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAdminSlice } from './adminSlice';

export const useAdminStore = create(
    devtools((set, get) => ({
        ...createAdminSlice(set, get),
    }), { name: 'adminStore' })
);
