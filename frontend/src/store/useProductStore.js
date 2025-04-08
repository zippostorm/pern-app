import { create } from "zustand";
import axios from "axios";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      set({ products: response.data.data, error: null });
    } catch (error) {
      if (error.status == 429)
        set({ error: "Too many requests!", products: [] });
      else set({ error: error.message, products: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
