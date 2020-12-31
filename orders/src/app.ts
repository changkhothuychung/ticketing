import express from 'express'; 
import {json} from 'body-parser'; 
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import {currentUser} from './middlewares/current-user';
import {newOrderRouter} from './routes/new'; 
import {showOrderRouter} from './routes/show'; 
import {indexRouter} from './routes/index'; 
import {deleteOrderRouter} from './routes/delete';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexRouter);
app.use(deleteOrderRouter);
app.use(errorHandler);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});



export { app };
