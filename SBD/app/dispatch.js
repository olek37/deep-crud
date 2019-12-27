const controller = require('./controller')

module.exports.default = (schema) => (req, res) => {
    switch(req.method) {
        case 'POST':
            controller.create(req, res, schema)
            break
        case 'GET':
            if(req.params.id == 'new') {
                controller.new(req, res, schema)
            } else if(req.params.id) {
                controller.readOne(req, res, schema)
            } else {
                controller.read(req, res, schema)
            }
            break
        case 'PUT':
            controller.update(req, res, schema)
            break
        case 'DELETE':
            controller.delete(req, res, schema)
            break
        default:
            res.send('Fatal server error')
    }
}

