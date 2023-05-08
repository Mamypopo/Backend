const config = {
  app: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    jwtKey: process.env.JWT_KEY,
  },
};

export default config;
