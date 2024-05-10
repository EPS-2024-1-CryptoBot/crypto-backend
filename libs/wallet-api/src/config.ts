import axios from 'axios';
import { fetchConfig } from 'src/app.config';

export const walletApi = axios.create({
  baseURL: fetchConfig('lib', 'wallet'),
  headers: {
    'Content-Type': 'application/json'
  }
});
