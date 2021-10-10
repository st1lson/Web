import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://localhost:44396/api', // APS.NET Core Web API URL
});

export default instance;
