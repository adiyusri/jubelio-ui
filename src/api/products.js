// src/api/products.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch all products with optional query parameters (e.g., search, sort)
export const fetchProducts = async (query = {}) => {
  try {
    const url = `${API_BASE_URL}/api/products`;
    const response = await axios.get(url, {
      params: query
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a specific product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/products`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/products/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Populate products (dummy function, modify as needed)
export const populateProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/populate`);
    return response.data;
  } catch (error) {
    console.error('Error populating products:', error);
    throw error;
  }
};
