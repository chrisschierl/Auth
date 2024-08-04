import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
import errorHandler from './src/helpers/errorhandler.js';

// Lade Umgebungsvariablen
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// Middleware für CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', // Verwende die URL deines Frontends, um CORS-Anfragen zu erlauben
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fehlerbehandlungs-Middleware
app.use(errorHandler);

// Dynamisch importierte Routen
const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach(file => {
  // Verwende dynamisches Importieren der Routen
  import(`./src/routes/${file}`)
    .then(route => {
      app.use('/api/v1', route.default);
    })
    .catch(err => {
      console.log('Failed to load route file', err);
    });
});

const server = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.log('Failed to start server...', error.message);
    process.exit(1);
  }
};

server();
