import * as restify from 'restify'
import { User } from './users.model'
import { ModelRouter } from '../common/model-router'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }

    findByEmail = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email).then(user => {
                if (user) {
                    return [user]
                } else {
                    return []
                }
            }).then(this.renderAll(res, next, {
                pageSize: this.pageSize,
                url: req.url
            })).catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        //application.get('/users', callback)
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {
                version: '2.0.0', handler: [
                    authorize('admin'),
                    this.findByEmail,
                    this.findAll
                ]
            },
            { version: '1.0.0', handler: [authorize('admin'), this.findAll] }
        ]))
        //application.get('/users/:id', callback)
        application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), this.save])
        application.put(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.replace])//user nao pode alterar proprio cadastro
        application.patch(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])
        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter() 