// Load settings from gitlab's producton settings or from user's .env file
if (process.env.NODE_ENV !== 'production') require('dotenv').load()

module.exports = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PW: process.env.DB_PW,
  DB_HOST: process.env.DB_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  GITLAB_PTOKEN: process.env.GITLAB_PTOKEN,
  GITLAB_BASE_URL: process.env.GITLAB_BASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  HOST_NAME: process.env.HOST_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SUDO_URL: process.env.SUDO_URL,
  REACT_APP_SERVER: process.env.REACT_APP_SERVER_URL,
  PORT: process.env.PORT
};
