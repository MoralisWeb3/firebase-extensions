function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set`);
  }
  return value;
}

export const config = {
  moralisApiKey: readEnv('MORALIS_API_KEY'),
};
