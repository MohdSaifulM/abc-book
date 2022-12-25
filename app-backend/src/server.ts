import express, { Application } from 'express';
import mongoose from 'mongoose';

const app: Application = express();
const PORT: number = 5000;
const uri = 'mongodb://localhost:27017/abc';

//?===========Connect=============
mongoose.connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to DB & listening on port ${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`Failed to connect to server :: ${error}`);
  })