import 'jest'
import request from 'supertest'

const address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /users', () => {
    return request(address)
        .get('/users')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'newuser',
            email: 'new.user@email.com',
            password: '123456',
            cpf: '288.009.480-14'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('newuser')
            expect(response.body.email).toBe('new.user@email.com')
            expect(response.body.cpf).toBe('288.009.480-14')
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})

// Register new user into database
test('post /users - nome obrigatorio', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            email: 'newuser2@gmail.com',
            password: '123456',
            cpf: '698.669.220-06'
        })
        .then(response => {
            expect(response.status).toBe(400)
            expect(response.body.errors).toBeInstanceOf(Array)
            expect(response.body.errors[0].message).toContain('name')
        })
        .catch(fail)
})


// A new user is created. Then filter by email in the expectation of returning only the one with the identical email.
test('get /users - findByEmail', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'new user2',
            email: 'user2.test@email.com',
            password: '123456',
        }).then(response => request(address)
            .get('/users')
            .set('Authorization', auth)
            .query({ email: 'user2.test@email.com' }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
            expect(response.body.items).toHaveLength(1)
            expect(response.body.items[0].email).toBe('user2.test@email.com')
        }).catch(fail)
})

// Check if Not found is working with sending a invalid id
test('get /users/aaaaa - Not Found', () => {
    return request(address)
        .get('/users/aaaaa')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

test('get /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'new user4',
            email: 'new.user4@gmail.com',
            password: '123456',
            cpf: '482.326.154-27'
        }).then(response => request(address)
            .get(`/users/${response.body._id}`)
            .set('Authorization', auth))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('new user4')
            expect(response.body.email).toBe('new.user4@gmail.com')
            expect(response.body.cpf).toBe('482.326.154-27')
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})

test('delete /users/aaaaa - not found', () => {
    return request(address)
        .delete(`/users/aaaaa`)
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

test('delete /users:/id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario 3',
            email: 'user3@gmail.com',
            password: '123456',
            cpf: '187.638.581-26'
        }).then(response => request(address)
            .delete(`/users/${response.body._id}`)
            .set('Authorization', auth))
        .then(response => {
            expect(response.status).toBe(204)
        }).catch(fail)
})

test('patch /users/aaaaa - Not Found', () => {
    return request(address)
        .patch(`/users/aaaaa`)
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

test('post /users - cpf invalido', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario 12',
            email: 'user12@gmail.com',
            password: '123456',
            cpf: '675.028.222-93'
        })
        .then(response => {
            expect(response.status).toBe(400)
            expect(response.body.errors).toBeInstanceOf(Array)
            expect(response.body.errors).toHaveLength(1)
            expect(response.body.errors[0].message).toContain('Invalid CPF')
        })
        .catch(fail)
})

test('post /users - email duplicado', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'dupe',
            email: 'dupe@gmail.com',
            password: '123456',
            cpf: '593.436.344-12'
        }).then(response =>
            request(address)
                .post('/users')
                .set('Authorization', auth)
                .send({
                    name: 'dupe',
                    email: 'dupe@gmail.com',
                    password: '123456',
                    cpf: '593.436.344-12'
                }))
        .then(response => {
            expect(response.status).toBe(400)
            expect(response.body.errors.message).toContain('E11000 duplicate key')
        })
        .catch(fail)
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario2',
            email: 'usuario2@email.com',
            password: '123456'
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .set('Authorization', auth)
            .send({
                name: 'usuario2 - patch'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario2 - patch')
            expect(response.body.email).toBe('usuario2@email.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

test('put /users/aaaaa - not found', () => {
    return request(address)
        .put(`/users/aaaaa`)
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

/*
  1. Create user with gender Male
  2. Update, but gender is missing
  3. Test if document is avaliable -> gender undefined
*/
test('put /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario 7',
            email: 'user7@gmail.com',
            password: '123456',
            cpf: '613.586.318-59',
            gender: 'Male'
        }).then(response => request(address)
            .put(`/users/${response.body._id}`)
            .set('Authorization', auth)
            .send({
                name: 'usuario 7',
                email: 'user7@gmail.com',
                password: '123456',
                cpf: '613.586.318-59'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuario 7')
            expect(response.body.email).toBe('user7@gmail.com')
            expect(response.body.cpf).toBe('613.586.318-59')
            expect(response.body.gender).toBeUndefined()
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})

//Test authentication
test('authenticate user - not authorized', () => {
    return request(address)
        .post('/users/authenticate')
        .send({
            email: "admin@email.com",
            password: "123"
        })
        .then(response => {
            expect(response.status).toBe(403)
        }).catch(fail)
})

test('authenticate user', () => {
    return request(address)
        .post('/users/authenticate')
        .send({
            email: "admin@email.com",
            password: "123456"
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        }).catch(fail)
})
