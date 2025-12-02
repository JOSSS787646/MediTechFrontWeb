import axios from "axios";

const api = axios.create({
  baseURL: "https://meditech-atdneshrczbsbtgw.canadacentral-01.azurewebsites.net/api/", 
  timeout: 20000,
});

export default api;
