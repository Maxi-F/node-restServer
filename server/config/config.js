// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Data Base
let urlDB;

if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
else urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;

// Token expiration
process.env.TOKEN_EXPIRATION = '48h';

// autentication Seed
process.env.SEED = process.env.SEED || 'Seed-De-Desarrollo'

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '723225456183-rstrq2t1t3h0anlatj9oquvgr6pisf34.apps.googleusercontent.com';