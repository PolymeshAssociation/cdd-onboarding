// TODO: replace this with brackets for server variables
export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://polymesh.cdd.centrifuge.io/api';

export const LOG_LEVEL =  process.env.NODE_ENV === 'development' ? 'log' : 'error';

// TODO: replace this with brackets for server variables
export const NETWORK = process.env.NODE_ENV === 'development'? 'local' : 'testnet';