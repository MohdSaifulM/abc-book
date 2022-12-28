import express, { Application, Request, Response, NextFunction } from 'express';
import { authenticationCheck } from './middleware/authenticationCheck';
import { adminAuthorizationCheck } from './middleware/authorizationCheck';
import mongoose from 'mongoose';

//?===========Import Routes=======
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import requestRoutes from './routes/requestRoutes';


const app: Application = express();
const PORT: number = 5000;  //! Should be placed in environment variables
const uri = 'mongodb://localhost:27017/abc';  //! Should be placed in environment variables

//?===========Middleware==========
app.use(express.json());

//?===========Routes==============
app.use('/api/user', userRoutes);
app.use('/api/book', authenticationCheck, bookRoutes);
app.use('/api/request', authenticationCheck, adminAuthorizationCheck, requestRoutes);

app.all('*', (req, res, next) => {
  res.send('404!');
});

app.use((err: any | unknown, req: Request, res: Response, next: NextFunction) => {
  const { status = 500 } = err;
  res.status(status).send(err.message);
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