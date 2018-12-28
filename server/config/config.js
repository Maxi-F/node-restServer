// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
let urlDB;

if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
urlDB = 'mongodb://cafe-test:asd123@ds245234.mlab.com:45234/cafe-restserver'

process.env.URLDB = urlDB;