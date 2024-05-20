import axios from 'axios';
import { fetchConfig } from 'src/app.config';

export const consultantApi = axios.create({
  baseURL: fetchConfig('lib', 'consultant'),
  headers: {
    'Content-Type': 'application/json',
  },
});
