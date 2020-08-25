import request from 'supertest'; 
import {app} from '../../app'; 

it('returns a 201 on successful signuo', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email : 'nhat7203@gmail.com', 
            passoword: 'nhatnhat'
        })
        .expect(201);
})


it('set a cookie after successful signup', async () => {
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com', 
        password: 'password',
    })
    .expect(201); 

    expect(response.get('Set-Cookie')).toBeDefined(); 
    
})