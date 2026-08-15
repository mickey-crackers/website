import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createCartSlice } from './cartSlice';

export const useCartStore = create(
    devtools(persist((set, get) => ({
        ...createCartSlice(set, get),
    }), { name: 'cartStore' }))
);
