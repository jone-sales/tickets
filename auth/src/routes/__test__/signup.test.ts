import request from "supertest";
import { app } from "../../app";


it('returns a 400 with invalid data.', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'invalidemail.com',
            password : 'validPassword'
        })
        .expect(400); 

    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
            password : 'pw'
        })
        .expect(400); 
});

it('returns a 400 with missing required fields.', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password : 'validPassword'
        })
        .expect(400); 

        await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
        })
        .expect(400); 
});

it('disallows duplicated emails.', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(201); 

    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(400); 
});

it('returns a 201 and sets a cookie after successfull signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email : 'valid@email.com',
            password : 'validPassword'
        })
        .expect(201);  

    expect(response.get('Set-Cookie')).toBeDefined();
});