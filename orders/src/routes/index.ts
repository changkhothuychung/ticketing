import express, {Request, Response} from 'express'; 
import {requireAuth} from '../middlewares/require-auth';
import {validateRequest} from '../middlewares/validate-request';
import {Ticket} from '../models/ticket';
import {Order} from '../models/orders';
const router = express.Router(); 

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');
  
    res.send(orders);
  });
  
  export { router as indexRouter };