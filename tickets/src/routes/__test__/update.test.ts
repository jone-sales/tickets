import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString(); 
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: "Test Title",
            price: 10
        })
        .expect(404)
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString(); 
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({})
        .expect(401)
});

it('returns a 401 if the user does not own the ticket', async () => {    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: "Test Title",
            price: 10
        })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: "Updated Test Title",
        price: 40
    })
    .expect(401)
});

it('returns a 400 if the user provides invalid inputs', async () => {    
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "Test Title",
            price: 10
        })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "Updated Test Title",
        price: -10
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "",
        price: 10
    })
    .expect(400)
});

it('updates the ticket if provided valid inputs', async () => {    
    const cookie = global.signin();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "Test Title",
            price: 10
        })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "Updated Test Title",
        price: 40
    })
    .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    
    expect(ticketResponse.body.title).toEqual("Updated Test Title");
    expect(ticketResponse.body.price).toEqual(40);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "Test Title",
            price: 10
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "Updated Test Title",
            price: 40
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "Test Title",
            price: 10
        })

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "Updated Test Title",
            price: 40
        })
        .expect(400)
});