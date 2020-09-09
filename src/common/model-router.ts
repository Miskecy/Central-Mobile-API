import { Router } from './router'
import { Request, Response, Next } from 'restify'
import mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string
    pageSize: number = 4

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
    }

    // protected prepareOne(query: mongoose.DocumentQuery<D[], D>): mongoose.DocumentQuery<D[], D> {
    //     return query
    // }

    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query
    }

    envelope(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        }
        if (options.page && options.countDocuments && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            }
            const remaining = options.countDocuments - (options.page * options.pageSize)
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
            }

        }
        return resource
    }

    validateId = (req: Request, res: Response, next: Next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    findAll = (req: Request, res: Response, next: Next) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize
        this.model.countDocuments({}).exec().then(
            count => this.model
                .find()
                .skip(skip)
                .limit(this.pageSize)
                .then(this.renderAll(res, next, { page, count, pageSize: this.pageSize, url: req.url })))
            .catch(next)
    }
    //this.model.findById(req.params.id)
    findById = (req: Request, res: Response, next: Next) => {
        this.prepareOne((this.model.findById(req.params.id) as mongoose.DocumentQuery<D, D>)).then(this.render(res, next)).catch(next)
    }

    save = (req: Request, res: Response, next: Next) => {
        let document = new this.model(req.body)
        //user.name = req.body.name
        //user.email = req.body.email
        document.save().then(this.render(res, next)).catch(next)
    }

    replace = (req: Request, res: Response, next: Next) => {
        const options = {
            runValidators: true,
            overwrite: true
        }
        this.model.replaceOne({ _id: req.params.id }, req.body).exec().then(result => {
            if (result.n) {
                return this.model.findById(req.params.id)
            } else {
                throw new NotFoundError('Documento não encontrado')
            }
        }).then(this.render(res, next)).catch(next)
    }

    update = (req: Request, res: Response, next: Next) => {
        const options = { runValidators: true, new: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(res, next)).catch(next)
    }

    delete = (req: Request, res: Response, next: Next) => {
        this.model.deleteOne({ _id: req.params.id }).exec().then((cmdResult: any) => {
            if (cmdResult.n) {
                res.send(204)
            } else {
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }).catch(next)
    }
}