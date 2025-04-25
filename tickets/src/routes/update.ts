import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, UnauthorizedError, BadRequestError } from '@js_tickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater then zero.')
], validateRequest, 
async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        throw new NotFoundError();
    }

    if(ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket.')
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new UnauthorizedError();
    }
    
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      userId: ticket.userId,
      price: ticket.price,
      version: ticket.version
    });

    res.send(ticket);
  });

export { router as updateTicketRouter };