function checkEnvVariable(key) {
  const variable = process.env[key];

  if (!variable) {
    throw new Error(`environment variable ${key} is missing`);
  }

  return variable;
}

const config = {
  app: {
    env: checkEnvVariable('NODE_ENV'),
    port: Number(checkEnvVariable('PORT')),
    authenKey: checkEnvVariable('JWT_KEY'),
  },
  db: {
    main: {
      port: Number(checkEnvVariable('DB_PORT')),
      host: checkEnvVariable('DB_HOST'),
      user: checkEnvVariable('DB_USER'),
      password: checkEnvVariable('DB_PASSWORD'),
      database: checkEnvVariable('DB_SCHEMA'),
    },
  },
};

export default config;
