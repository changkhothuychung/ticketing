import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator'; 
import {RequestValidationError} from '../errors/request-validation';
import {validationRequest} from '../middlewares/validate-request';
import {User} from '../models/user';
import {Password} from '../services/password';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"), 
    body('password')
        .trim()
        .isLength({min:4, max: 20})
        .notEmpty()
        .withMessage("You must add a password")
],validationRequest, 
async (req: Request,res : Response) => {
    const {email, password} = req.body; 

    const existingUser = await User.findOne({email}); 
    if(!existingUser){
        throw new Error("Invalid credentials");
    }

    const passwordMatchh = await Password.compare(existingUser.password, password);
    if(!passwordMatchh){
        throw new Error("invalid password"); 
    }


    const userJwt = jwt.sign({
        id: existingUser.id, 
        email: existingUser.email, 
    }, process.env.JWT_KEY!)

    //store on session object
    req.session= {
        jwt: userJwt
    }


    res.status(200).send(existingUser); 

})

export {router as signinRouter}