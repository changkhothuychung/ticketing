import express from 'express'; 
import {json} from 'body-parser'; 
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import {currentUser} from './middlewares/current-user';
import {createTicketRouter} from './routes/new'; 
import {showTicketRouter} from './routes/show'; 
import {indexTicketRouter} from './routes/index'; 
import {updateTicketRouter} from './routes/update';
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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
