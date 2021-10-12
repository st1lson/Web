import axios from 'axios';

const instance = axios.create({
	// Deploy
	baseURL: 'https://mail-sender-client.azurewebsites.net/api',
	// Local
	//baseURL: 'https://localhost:44396/api', // APS.NET Core Web API URL
});

export default instance;
