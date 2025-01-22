import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-test-helper";

it('returns a 201 and sets a cookie after successfull signup.', async () => {
    const cookie = await getAuthCookie(); 

    if (!cookie) {
        throw new Error("Cookie not set after signup");
    }

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);  
    
    expect(response.body.currentUser.email).toEqual('test@email.com');
});

it('responds with null if not authenticated.', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);  
    
    expect(response.body.currentUser).toEqual(null);
});
