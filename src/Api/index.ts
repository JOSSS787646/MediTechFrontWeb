import axios from "axios";


//Endpoint principal al backEnd

const api = axios.create({
  baseURL: "http://localhost:5000/api/", 
  timeout: 5000,
});


export default api;
