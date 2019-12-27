const sql = require('./sql')
const buildView = require('../views/builder').default

const tableByRequest = (req, schema) => schema.tables.find(table => table.name == req.url.split('/')[1])

const dependentByTable = (table, schema) => {
    let pairs = []
    schema.tables.forEach(t =>
        t.fields.forEach(field => {
            if(field.references && field.references.split('$')[0] == table.name) {
                pairs.push({table: t, field})
            }
        })
    )
    return pairs
}

const dependsOnByTable = (table) => 
    table.fields
        .filter(field => field.references)
        .map(field => 
            ({
                name: field.name, 
                table: field.references.split('$')[0], 
                field: field.references.split('$')[1]
            })
        )


module.exports.read = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    const data = await sql.readData(table)
    res.send(JSON.stringify(data))
}

module.exports.readOne = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    const dependent = dependentByTable(table, schema)
    const dependsOn = dependsOnByTable(table)
    const data = await sql.readOneData(table, dependent, dependsOn, req.params.id)
    res.send(buildView(`${table.name}/${req.params.id}`, data, 'put'))
}

module.exports.create = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.createData(table, req.body)
        res.send('Data created successfully')
    }
    catch(e)
    {
        res.status(400).send('Bad request')
    }
    
}

module.exports.update = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.updateData(table, req.body, req.params.id)
        res.send('Data updated successfully')
    }
    catch(e)
    {
        res.status(400).send('Bad request')
    }
}

module.exports.delete = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.deleteData(table, req.params.id)
        res.send('Data deleted successfully')
    }
    catch(e)
    {
        res.status(400).send('Bad request')
    }
}