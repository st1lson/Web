import axios from 'axios';

const instance = axios.create({
	// Deploy
	baseURL: 'https://mail-sender-api.azurewebsites.net/api',
	// Local
	//baseURL: 'https://localhost:44396/api', // APS.NET Core Web API URL
	headers: {
		'Content-Type': 'application/json',
	},
});

export default instance;
