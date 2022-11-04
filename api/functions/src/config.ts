function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is not set ${JSON.stringify(process.env)}`);
  }
  return value;
}

export const config = {
  moralisApiKey: readEnv('MORALIS_API_KEY'),
  maxIpCallsPerMinute: parseInt(readEnv('MAX_IP_CALLS_PER_MINUTE'), 10),
};
