import api from "./index";

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post("/Usuario/login", { email, password });
  return response.data;
};