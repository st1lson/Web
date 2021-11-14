import axios from 'axios';

const baseURL =
    process.env.NODE_ENV.toLowerCase() === 'development'
        ? 'https://localhost:44396/api'
        : 'https://mail-sender-api.azurewebsites.net/api';

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

instance.interceptors.response.use(null, error => {
    if (!error.response) {
        const errors = {
            NetworkError: ['Error: Network error'],
        };
        error.response = {
            data: { errors },
        };
    }

    if (error.response.status === 429) {
        const errors = {
            CallQuotaExceeded: [error.response.data],
        };

        error.response.data = { errors };
    }

    return Promise.reject(error);
});

export default instance;
