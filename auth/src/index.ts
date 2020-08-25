
import mongoose from 'mongoose';
import {app} from './app';

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


