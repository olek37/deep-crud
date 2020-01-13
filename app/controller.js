const sql = require('./sql')
const build = require('../views/builder')

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

const templateObject = (table) => {
    let obj = {}
    table.fields.forEach(field => {
        obj[field.name] = ''
    })
    return obj
}

module.exports.home = (req, res, schema) => {
    res.send(build.home(schema.tables.map(table => table.name)))
}

module.exports.new = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    const dependsOn = dependsOnByTable(table)
    const template= templateObject(table)
    const data = {tableData: [template], dependsOnData: await sql.dependsOnData(dependsOn)}
    res.send(build.new(`${table.name}`, data))
}

module.exports.read = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    const data = await sql.readData(table)
    res.send(build.viewList([{name: table.name, elements: data}]))
}

module.exports.readOne = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    const pks = table.fields.filter(field => field.pk)
    const dependent = dependentByTable(table, schema)
    const dependsOn = dependsOnByTable(table)
    const data = await sql.readOneData(table, dependent, dependsOn, req.params.id)
    res.send(build.viewOne(`${table.name}/${req.params.id}`, data, pks))
}

module.exports.create = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.createData(table, req.body)
        res.status(200).send('Utworzono pomyślnie!')
    }
    catch(e)
    {
        res.status(400).send('Błąd przy tworzeniu!')
    }
    
}

module.exports.update = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.updateData(table, req.body, req.params.id)
        res.status(200).send('Zaktualizowano pomyślnie!')
    }
    catch(e)
    {
        res.status(400).send('Błąd przy aktualizacji!')
    }
}

module.exports.delete = async (req, res, schema) => {
    const table = tableByRequest(req, schema)
    try 
    {
        await sql.deleteData(table, req.params.id)
        res.status(200).send('Usunięto pomyślnie!')
    }
    catch(e)
    {
        res.status(400).send('Błąd przy usuwaniu!')
    }
}