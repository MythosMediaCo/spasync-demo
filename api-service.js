// api-service.js - MedSpaSync Pro API Integration
// Copy this entire file to your GitHub repository as: api-service.js

class MedSpaSyncAPI {
    constructor() {
        this.baseURL = 'https://medspasync-backend-production.up.railway.app/api';
        this.token = this.getStoredToken();
    }

    getStoredToken() {
        try {
            return localStorage.getItem('medspasync_token');
        } catch (error) {
            console.warn('localStorage not available');
            return null;
        }
    }

    setToken(token) {
        this.token = token;
        try {
            if (token) {
                localStorage.setItem('medspasync_token', token);
            } else {
                localStorage.removeItem('medspasync_token');
            }
        } catch (error) {
            console.warn('localStorage not available');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            console.log(`API Request: ${config.method || 'GET'} ${url}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.setToken(null);
                    throw new Error('Authentication required');
                }
                
                let errorMessage;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.request('/health');
            return response;
        } catch (error) {
            throw new Error(`Backend unavailable: ${error.message}`);
        }
    }

    // Authentication
    async login(email, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            
            if (response.success && response.token) {
                this.setToken(response.token);
                return response;
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async register(userData) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            
            if (response.success && response.token) {
                this.setToken(response.token);
                return response;
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    logout() {
        this.setToken(null);
        return { success: true, message: 'Logged out successfully' };
    }

    isAuthenticated() {
        return !!this.token;
    }

    // File Upload with progress tracking
    async uploadFile(file, onProgress = null) {
        if (!this.token) {
            throw new Error('Authentication required');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
            
            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable && onProgress) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(progress);
                    }
                };

                xhr.onload = () => {
                    try {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            console.log('Upload successful:', response);
                            resolve(response);
                        } else {
                            const error = JSON.parse(xhr.responseText);
                            reject(new Error(error.error || error.message || `Upload failed: ${xhr.status}`));
                        }
                    } catch (parseError) {
                        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('Upload failed: Network error'));
                };

                xhr.open('POST', `${this.baseURL}/upload/file`);
                xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
                xhr.send(formData);
            });
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    // Upload History
    async getUploadHistory() {
        try {
            const response = await this.request('/upload/history');
            if (response.success) {
                return response;
            } else {
                throw new Error(response.error || 'Failed to fetch upload history');
            }
        } catch (error) {
            throw new Error(`Failed to fetch upload history: ${error.message}`);
        }
    }

    // Reconciliation
    async runReconciliation(uploadIds, options = {}) {
        try {
            const requestBody = {
                uploadIds: Array.isArray(uploadIds) ? uploadIds : [uploadIds],
                matchCriteria: options.matchCriteria || 'normal',
                dateToleranceDays: options.dateToleranceDays || 7,
                amountTolerancePercent: options.amountTolerancePercent || 5,
            };

            console.log('Running reconciliation with options:', requestBody);

            const response = await this.request('/reconciliation/analyze', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            });

            if (response.success) {
                return response;
            } else {
                throw new Error(response.error || 'Reconciliation failed');
            }
        } catch (error) {
            throw new Error(`Reconciliation failed: ${error.message}`);
        }
    }

    // Statistics
    async getStats() {
        try {
            const response = await this.request('/reconciliation/stats');
            if (response.success) {
                return response;
            } else {
                throw new Error(response.error || 'Failed to fetch statistics');
            }
        } catch (error) {
            throw new Error(`Failed to fetch statistics: ${error.message}`);
        }
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Error handling helper
    handleError(error, context = '') {
        console.error(`${context} error:`, error);
        
        if (error.message.includes('Authentication required')) {
            return 'Please log in to continue';
        } else if (error.message.includes('Network')) {
            return 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('500')) {
            return 'Server error. Please try again later.';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }
}

// Make API available globally
window.MedSpaSyncAPI = MedSpaSyncAPI;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedSpaSyncAPI;
}
