const db = require('./db')

const quoteIfString = (val) => {
    if(typeof(val) == 'string') {
        return `'${val}'`
    } 
    return val
}

const removeTrailingComma = (str) => str.slice(0, -1)

const whereClauseByPrimaryKeys = (table, id) => {
    const primaryKeys = table.fields.filter(field => field.pk)
    return `
    WHERE 
        ${primaryKeys.reduce((_str, pk, i) => 
            `${pk.name} = '${id.split('$')[i]}' AND`, '').slice(0, -4)
        }
    `
}

module.exports.readData = async (table) => await db.query(`SELECT * FROM ${table.name}`)

module.exports.readOneData = async (table, dependent, dependsOn, id) => {
    const tableData = await db.query(
        `
        SELECT * 
        FROM ${table.name}  
        ${
            whereClauseByPrimaryKeys(table, id)}
        `)
    const depenentData = await Promise.all(dependent.map(async dependant => {
        await db.query(
            `
            SELECT *
            FROM ${dependant.table.name}
            WHERE ${dependant.field.name} = '${id}'
            `
        )
    }))
    const dependsOnData = await Promise.all(dependsOn.map(async depends => {
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
    return {tableData, depenentData, dependsOnData}
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
            removeTrailingComma(Object.values(data).reduce((str, val) => str + ` ${quoteIfString(val)},`, ''))
        }
    )
    `
)

module.exports.updateData = async (table, data, id) => await db.query(
    `
    UPDATE ${table.name} SET
    ${
        removeTrailingComma(Object.keys(data).reduce((str, key) => str + ` ${key} = ${quoteIfString(data[key])},`, ''))
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