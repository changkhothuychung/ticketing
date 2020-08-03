import express from 'express'; 
import {json} from 'body-parser'; 
import mongoose from 'mongoose';
import {currentUserRouter} from './routes/current-user'; 
import {signinRouter} from './routes/signin'; 
import {signupRouter} from './routes/signup';
import {signoutRouter} from './routes/signout';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';
import cookieSession from 'cookie-session';


const app = express(); 
app.set('trust proxy', true);
app.use(json()); 
app.use(
    cookieSession({
        signed: false, 
        secure: true
    })
)
app.use(currentUserRouter);
app.use(signinRouter); 
app.use(signupRouter); 
app.use(signoutRouter);


app.all('*', async (req,res,next) => {
    next(new NotFoundError());
})
app.use(errorHandler);
app.get('/', (req,res) => {
    res.send("ok"); 
})
app.get('/api/users/currentUser', (req,res) => {
    res.send('hi there');
})

const start =  () => {
    try{
        mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true, 
        }).then(con => {
            console.log(`MongoDB Database with host: ${con.connection.host}`);
        }).catch(err => {
            console.log(err);
        });
    }
    catch(err){
        console.log(err); 
    }
}
start(); 
app.listen(3000, () => {
    console.log('listening on 3000!!!!'); 
})


