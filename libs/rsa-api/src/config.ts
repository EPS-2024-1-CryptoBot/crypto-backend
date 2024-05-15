import axios from 'axios';
import { fetchConfig } from 'src/app.config';

export const rsaApi = axios.create({
  baseURL: fetchConfig('lib', 'rsa'),
  headers: {
    'Content-Type': 'application/json',
  },
});
