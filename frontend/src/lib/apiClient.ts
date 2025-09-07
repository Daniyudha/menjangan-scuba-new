// src/lib/apiClient.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt');
    }

    // Determine if we're sending FormData (for file uploads)
    const isFormData = options.body instanceof FormData;
    
    const headers: Record<string, string> = {};
    
    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
        // Check if Content-Type is already set in options
        if (options.headers) {
            const existingHeaders = new Headers(options.headers);
            if (!existingHeaders.has('Content-Type')) {
                headers['Content-Type'] = 'application/json';
            }
        } else {
            headers['Content-Type'] = 'application/json';
        }
    }
    
    if (options.headers) {
        // Merge existing headers
        const existingHeaders = new Headers(options.headers);
        existingHeaders.forEach((value, key) => {
            headers[key] = value;
        });
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        console.log(`API Request: ${url}`, { status: response.status, statusText: response.statusText });

        if (response.status === 204) {
            return null; // Handle No Content
        }

        // Handle non-JSON responses (like file uploads)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json().catch(() => {
                throw new Error(response.statusText || `Request failed with status ${response.status}`);
            });
            
            if (!response.ok) {
                throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
            }

            return data;
        } else {
            // For non-JSON responses, return the response as-is
            if (!response.ok) {
                throw new Error(response.statusText || `Request failed with status ${response.status}`);
            }
            return response;
        }
    } catch (error) {
        console.error('API Client Error:', {
            url,
            error: error instanceof Error ? error.message : 'Unknown error',
            config
        });
        throw error; // Re-throw to let the caller handle it
    }
};

// Helper function for FormData requests
export const apiClientFormData = async (endpoint: string, formData: FormData, method: string = 'POST') => {
    return apiClient(endpoint, {
        method,
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary
    });
};