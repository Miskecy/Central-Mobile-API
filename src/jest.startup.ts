import * as jestCli from 'jest-cli'
import { Server } from './server/server'
import { environment } from './common/environment'

import { User } from './users/users.model'

import { usersRouter } from './users/users.router'

let server: Server
const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/central-mobile-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter
    ])
        .then(() => User.deleteMany({}).exec())
        .then(() => {
            let admin = new User()
            admin.name = 'admin',
                admin.email = 'admin@email.com',
                admin.password = '123456',
                admin.profiles = ['admin', 'user']
            return admin.save()
        })
}

const afterAllTests = () => {
    return server.shutdown()
}
//Dynamic find tests
beforeAllTests().then(() => jestCli.run()).then(() => afterAllTests()).catch(console.error)