// src/db.ts

import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://mohit-praan-test:3bdDB3UTFQ3strNU@praan.mxro1ad.mongodb.net/';

mongoose.connect(MONGO_URI, {

});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default db;
