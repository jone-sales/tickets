import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { NotFoundError, UnauthorizedError } from '@js_tickets/common';

const router = express.Router();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    
    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId != req.currentUser!.id) {
        throw new UnauthorizedError();
    }

    res.send({order});
});

export { router as showOrderRouter };