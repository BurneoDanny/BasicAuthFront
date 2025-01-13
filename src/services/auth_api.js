import apiClient from "./AxiosConfiguration";

export const login = async (userJson) => {
  try {
    const response = await apiClient.post("/auth/login", userJson);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response from the server.");
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

export const register = async (newUserJson) => {
  try {
    const response = await apiClient.post("/auth/register", newUserJson);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response from the server.");
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

export const logout = async (refreshToken) => {
  try {
    const response = await apiClient.post("/auth/logout", refreshToken);
    document.cookie = "XSRF-TOKEN=; Max-Age=0";
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response from the server.");
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
};