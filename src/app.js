import express from 'express';
// import fileUpload from 'express-fileupload';
import cors from 'cors';
import config from './config.js';
import indexRoutes from './index.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors([config.app.domain]));

// app.use(fileUpload());

app.use('/', indexRoutes);

app.listen(config.app.port, () => {
  console.log(`[jit asa] run on ${config.app.env} env and using port ${config.app.port}`);
});
