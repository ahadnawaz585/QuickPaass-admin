import * as dotenv from "dotenv";
const configEnv = () => dotenv.config();

configEnv();
export const environment = {
  // apiUrl: process.env.API_URL || 'http://localhost:3001'
  // apiUrl: process.env.API_URL || 'https://v21qbr74-3001.euw.devtunnels.ms/'
  // apiUrl: process.env.API_URL || 'http://174.136.29.206:3000'
  apiUrl: process.env.API_URL || 'https://solarmax.com.pk/gatepass'
};  