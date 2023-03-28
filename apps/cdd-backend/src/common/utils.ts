export const getExpiryFromJwt = (token: string): Date => {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }

  const payloadJson = Buffer.from(parts[1], 'base64').toString();
  const payload = JSON.parse(payloadJson);

  if (typeof payload.exp !== 'number') {
    throw new Error('Expiry not found in token');
  }

  return new Date(payload.exp * 1000);
};
