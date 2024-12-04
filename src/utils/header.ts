import AuthService from "@/auth/auth.service";
import axios from "axios";

const auth: AuthService = new AuthService();

const getBearerToken = () => {
  const token = auth.getToken();
  return token;
};

const handleError = (error: any) => {
  if (
    error.message == "Request failed with status code 403" ||
    error.response.data === "Invalid Token"
  ) {
    auth.clearToken();
    window.location.reload();
  }
  if (
    error.response &&
    (error.response.status === 401 ||
      error.response.statusText === "Unauthorized")
  ) {
    auth.clearToken();
    window.location.reload();
  }

  console.error("An error occurred:", error);
};

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getBearerToken()}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

const updateBearerToken = () => {
  axiosInstance.defaults.headers[
    "Authorization"
  ] = `Bearer ${getBearerToken()}`;
};

export { axiosInstance, updateBearerToken, handleError };
