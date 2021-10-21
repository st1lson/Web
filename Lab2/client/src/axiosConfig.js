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

export default instance;
