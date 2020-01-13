const { Client } = require('pg')

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'erpmini',
    password: 'root',
    port: 5432,
})

db.connect()

module.exports.query = async (sql) => {
    console.log(sql)
    const res = await db.query(sql)
    console.log(res)
    //console.log(res.rows)
    return res.rows
}
