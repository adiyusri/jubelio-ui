// src/api/transactions.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch all transactions with optional query parameters (e.g., date range)
export const fetchTransactions = async (query = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
      params: query
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Fetch a specific transaction by ID
export const fetchTransactionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/transactions`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransaction = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/transactions/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/transactions/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
