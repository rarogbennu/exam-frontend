import { Result } from '../types/Result';

const API_URL = 'http://localhost:8080/results';

export const getResults = async (): Promise<Result[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }
  return response.json();
};

export const createResult = async (result: Result): Promise<Result> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });
  if (!response.ok) {
    throw new Error('Failed to create result');
  }
  return response.json();
};

export const updateResult = async (id: number, result: Result): Promise<Result> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });
  if (!response.ok) {
    throw new Error('Failed to update result');
  }
  return response.json();
};

export const deleteResult = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete result');
  }
};