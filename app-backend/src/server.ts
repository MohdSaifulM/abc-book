import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

//?===========Import Routes=======
import userRoutes from './routes/userRoutes';


const app: Application = express();
const PORT: number = 5000;
const uri = 'mongodb://localhost:27017/abc';

//?===========Middleware==========
app.use(express.json());

//?===========Routes==============
app.use('/api/user', userRoutes);

app.all('*', (req, res, next) => {
  res.send('404!');
});

app.use((err: any | unknown, req: Request, res: Response, next: NextFunction) => {
  const { message = 'Something went wrong', status = 500 } = err;
  res.status(status).send(message);
});

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