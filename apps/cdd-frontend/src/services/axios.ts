import axios from "axios";

import { API_URL } from '../config/constants';
import { logger } from "./logger";

const instance = axios.create({
    baseURL: API_URL
  });

instance.interceptors.request.use((response) => {
    logger.log('Request:', response);

    return response;
}, (error) => {
    logger.error('Request:', error);

    return error;
});

instance.interceptors.response.use((response) => {
    logger.log('Response:', response);

    return response;
}, (error) => {
    logger.error('Response:', error);

    return error;
});

  export default instance;