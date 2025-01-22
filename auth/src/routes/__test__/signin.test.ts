import request from "supertest";
import { app } from "../../app";

it('fails with not registered email.', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(400); 
});

it('fails with invalid password.', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(400); 

    await request(app)
        .post('/api/users/signin')
        .send({
            email : 'valid@email.com',
            password : 'invalidPassword'
        })
        .expect(400); 
});

it('returns a 201 and sets a cookie after successfull signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(201); 

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(200);  

    expect(response.get('Set-Cookie')).toBeDefined();
});