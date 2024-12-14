import * as dotenv from "dotenv";
const configEnv = () => dotenv.config();

configEnv();
export const environment = {
  apiUrl: process.env.API_URL || 'http://localhost:3001'
  // apiUrl: process.env.API_URL || 'http://174.136.29.206:3002'
  // apiUrl: process.env.API_URL || 'https://solarmaxcom.pk/testing'
};