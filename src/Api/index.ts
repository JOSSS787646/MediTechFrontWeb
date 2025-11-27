import axios from "axios";


//Endpoint principal al backEnd

const api = axios.create({
  baseURL: "https://localhost:5239/api/", 
  timeout: 5000,
});

export default api;
