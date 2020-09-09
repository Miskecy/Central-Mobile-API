import * as fs from 'fs'
import * as restify from 'restify'
import mongoose from "mongoose"

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'
import corsMiddleware from 'restify-cors-middleware'
import { logger } from '../common/logger'

export class Server {

    application?: restify.Server

    initializeDb() {
        mongoose.Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            //useMongoClient: true, //The `useMongoClient` option is no longer necessary in mongoose 5.x
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const options: restify.ServerOptions = {
                    name: 'central-mobile-api',
                    version: '1.0.0',
                    log: logger
                }

                if (environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate)
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)

                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: 10,
                    origins: ['*'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                }

                const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

                this.application.pre(cors.preflight)
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                this.application.use(cors.actual)
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)//auth

                //routes 
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)

            } catch (e) {
                reject(e)
            }
        })
    }
    
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application?.close())
    }
}