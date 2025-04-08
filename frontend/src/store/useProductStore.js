import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

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

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ error: error.message });
      toast.error("Error deleting product");
    } finally {
      set({ loading: false });
    }
  },
}));
