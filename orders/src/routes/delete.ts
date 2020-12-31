import express, {Request, Response} from 'express'; 
import {Order} from '../models/orders'; 
import {OrderStatus} from '../events/types/order-status';
import {requireAuth} from '../middlewares/require-auth'; 
import {NotAuthorizedError} from '../errors/not-authorized-error';
import {NotFoundError} from '../errors/not-found-error';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher'
import {natsWrapper} from '../nats-wrapper'
const router = express.Router(); 


router.delete('/api/orders/:orderId',requireAuth, async (req: Request, res:Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order._id, 
        ticket: {
            id: order.ticket._id, 
        }
    })
    res.status(204).send(order);
});


export {router as deleteOrderRouter};