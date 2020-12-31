import express, {Request, Response} from 'express'; 
import mongoose from 'mongoose';
import {requireAuth} from '../middlewares/require-auth';
import {validateRequest} from '../middlewares/validate-request';
import {body} from 'express-validator'; 
import {Ticket} from '../models/ticket';
import {Order} from '../models/orders';
import { OrderStatus } from '../events/types/order-status';
import {NotFoundError} from '../errors/not-found-error';
import {BadRequestError} from '../errors/bad-request-error';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher'
import {natsWrapper} from '../nats-wrapper'
const router = express.Router(); 
const EXPIRATION_WINDOW_SECONDS = 15*60; 

router.post('/api/orders',requireAuth,
body('ticketId')
.not()
.isEmpty()
.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
.withMessage("TicketId must be provided")
,
validateRequest
, async (req: Request, res:Response) => {

    // find the ticket that the user is trying to order 
    // make sure that the ticket is already reserved 
    // 

    const {ticketId} = req.body;

    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
        return res.status(404).send({});
        throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if(isReserved){
        return res.status(400).send({});
        throw new BadRequestError("ticket already reserved")
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created, 
        expiresAt: expiration,
        ticket:ticket
    });
    await order.save();


    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order._id,
        status: order.status, 
        userId: order.userId, 
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket._id,
            price: ticket.price, 
        }
    })
    res.status(201).send(order);
});


export {router as newOrderRouter};