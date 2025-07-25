import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Ticket",
        price: 40
    });

    await ticket.save();
    
    const user = global.signin();

    const { body: order} =  await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should publish an order:cancelled event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test Ticket",
        price: 40
    });

    await ticket.save();
    
    const user = global.signin();

    const { body: order} =  await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});