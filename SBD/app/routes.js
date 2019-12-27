const dispatch = require('./dispatch').default

module.exports.default = (app, schema) => {
    const disp = dispatch(schema)
    schema.tables.forEach(table => {
        app.post('/' + table.name, disp)
        app.get('/' + table.name, disp)
        app.get('/' + table.name + '/:id', disp)
        app.put('/' + table.name + '/:id', disp)
        app.delete('/' + table.name + '/:id', disp)
    })
}
