import * as restify from 'restify'

export const handleError = (req: restify.Request, res: restify.Response, e: any, done: any) => {

    try {
        switch (e.name) {
            case 'MongoError':
                if (11000 === e.code) {
                    e.statusCode = 400

                    e.errors = {
                        message: 'E11000 duplicate key error collection'
                    }

                    console.log('MongoError')
                }
                break
            case 'ValidationError':
                e.statusCode = 400

                const messages: any[] = []
                for (let name in e.errors) {
                    messages.push({ message: e.errors[name].message })
                }

                e.errors = messages

                console.log('ValidationError')
                break
        }
    } catch (error) { }

    done()
}
