import { app } from '../app';
import request from 'supertest';

export const getAuthCookie = (async() => {
    const email = "test@email.com";
    const password = "password";
    
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        expect(201);
    
    const cookie = response.get("Set-Cookie");
    
    if (!cookie) {
        throw new Error("Failed to get cookie from response");
    }
    
    return cookie;
})