// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    books: {
        getAll: () => `${API_BASE_URL}/books`,
        getById: (id) => `${API_BASE_URL}/books/${id}`,
        getByCategory: (category) => `${API_BASE_URL}/books/category/${category}`,
        search: (query) => `${API_BASE_URL}/books/search?q=${query}`,
        filter: () => `${API_BASE_URL}/books/filter`,
        incrementView: (id) => `${API_BASE_URL}/books/${id}/view`,
        incrementDownload: (id) => `${API_BASE_URL}/books/${id}/download`
    },
    genres: {
        getAll: () => `${API_BASE_URL}/genres`
    },
    authors: {
        getAll: () => `${API_BASE_URL}/authors`
    }
};

// Helper function for API calls
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
