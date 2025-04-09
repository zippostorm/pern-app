import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),
  resetCurrentProduct: () => set({ currentProduct: null }),

  addProduct: async (e) => {
    e.preventDefault();

    set({ loading: true, error: null });
    try {
      const { formData } = get();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        formData
      );
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");

      document.getElementById("add_product_modal").close();
    } catch (error) {
      set({ error: error.message });
      toast.error("Error adding product");
    } finally {
      set({ loading: false });
    }
  },

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

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      set({
        currentProduct: response.data.data,
        formData: response.data.data,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        formData
      );
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Error updating product");
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));
