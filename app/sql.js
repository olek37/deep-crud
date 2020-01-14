const db = require('./db')

const processInputs = (val) => {
    if(typeof(val) == 'string' && val != 'null') {
        return `'${val}'`
    } 
    return val
}

const removeTrailingComma = (str) => str.slice(0, -1)

const whereClauseByPrimaryKeys = (table, id) => {
    id = id.replace(/@/g, '/')
    const singlePk = table.fields.find(field => field.pk && !field.references)
    if(singlePk) {
        const segment = id.split('&').find(segment => segment.split('$')[0] == singlePk.name)
        return `WHERE ${singlePk.name} = '${segment.split('$')[1]}'`
    }
    const conditions = id
        .split('&')
        .filter(segment => table.fields.find(field => field.pk && field.name == segment.split('$')[0]))
        .reduce((str, segment) => str + ` ${segment.split('$')[0]} =  '${segment.split('$')[1]}' AND`, '').slice(0, -4)
    return 'WHERE' + conditions
}

module.exports.dependsOnData = async (dependsOn) => await Promise.all(dependsOn.map(async depends => {
    return {
        name: depends.name,
        available: await db.query(
            `
            SELECT ${depends.field}
            FROM ${depends.table}
            `
        )
    }
}))

module.exports.readData = async (table) => await db.query(`SELECT * FROM ${table.name}`)

module.exports.readOneData = async (table, dependent, dependsOn, id) => {
    const tableData = await db.query(
        `
        SELECT * 
        FROM ${table.name}  
        ${
            whereClauseByPrimaryKeys(table, id)}
        `)
    const dependentData = await Promise.all(dependent.map(async dependant => {
        return {
            name: dependant.table.name,
            elements: await db.query(
                `
                SELECT *
                FROM ${dependant.table.name}
                WHERE ${dependant.field.name} = '${id.replace(/@/g, '/').split('&')[0].split('$')[1]}'
                `
                )
        }
    }
    ))
    const dependsOnData = await module.exports.dependsOnData(dependsOn)
    return {tableData, dependentData, dependsOnData}
}

module.exports.createData = async (table, data) => await db.query(
    `
    INSERT INTO ${table.name}
    (
        ${
            removeTrailingComma(Object.keys(data).reduce((str, key) => str + ` ${key},`, ''))
        }
    )
    VALUES 
    (
        ${
            removeTrailingComma(Object.values(data).reduce((str, val) => str + ` ${processInputs(val)},`, ''))
        }
    )
    `
)

module.exports.updateData = async (table, data, id) => await db.query(
    `
    UPDATE ${table.name} SET
    ${
        removeTrailingComma(Object.keys(data).reduce((str, key) => str + ` ${key} = ${processInputs(data[key])},`, ''))
    }
    ${
        whereClauseByPrimaryKeys(table, id)
    }
    `
)

module.exports.deleteData = async (table, id) => await db.query(
    `
    DELETE FROM ${table.name}
    ${
        whereClauseByPrimaryKeys(table, id)
    }
    `
)