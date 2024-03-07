import {expect, use} from "chai"
import chaiHttp from "chai-http"
import supertest from "supertest"
import { faker } from "@faker-js/faker"

const requester = supertest ('http://127.0.0.1:8080')
use(chaiHttp)


describe ('<<<<< session-router >>>>>', () => {
    const unique = Math.random().toString(32).substring(7)
    const loginUser = {
        email: 'test@tester.com',
        password: 'test'
    }

    let registerUser = {
        name: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email() + Math.random().toString(32).substring(7),
        username: faker.internet.userName() + Math.random().toString(32).substring(7),
        password: faker.internet.password(),
        age: faker.number.int(),
        gender: faker.person.sex()
    }

    let recoveryToken

    it ('Se registra - POST ("register")', async () => {
        const petition = await requester
            .post('/session/register')
            .send (registerUser)

        expect(petition.status).to.eq(302)
        expect(petition).to.redirectTo('/session/login')
    })

    it ('Se loguea - POST ("/login")', async () => {
        const petition = await requester
            .post('/session/login')
            .send(loginUser)

        expect(petition.status).to.eq(302)
        expect(petition).to.redirectTo('/products')
    })

    it ('Enviar mail de recuperacion - POST ("/recover/mail)', async () => {
        const {_body} = await requester
            .post('/session/recover/mail')
            .send({email: registerUser.email})

        expect(_body.result.success).to.be.eq(true)
        recoveryToken = _body.token
    })

    it ('Ingresa codigo de recuperacion - POST ("/recover/:token")', async () => {
        const petition = await requester
            .post(`/session/recover/${recoveryToken}`)
            .send({pass_1: `secret${unique}`, pass_2:  `secret${unique}`})

        expect(petition.status).to.eq(302)
        expect(petition).to.redirectTo('/session/login')
    })

    //NO SE COMO HACER CON SESIONES
    /* it ('Obtener el current - GET ("/current")', async () => {
        const petition = await requester
            .get(`/session/current`)
        
            console.log(petition);
    }) */

    //TAMPOCO SE COMO HACER CON SESIONES
    /* it ('Logearse con github - GET ("/github"', async () => {
        const first = await requester
            .get ('/session/github')
        const second = await requester
            .get ('/githubcallback')
        
        expect (second).to.redirectTo('/products')
    }) */
})