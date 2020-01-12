const fs = require('fs')
const template = require('./template').default
const form = require('./form').default
const list = require('./list').default
const home = require('./home').default
const schema = JSON.parse(fs.readFileSync(__dirname + '/../schema.json'))

const headerLinks = schema.tables.reduce((str, table) => str + `<a href="/${table.name}">${table.name}</a>`, '')

module.exports.home = (tables) => template(headerLinks, home(tables))
module.exports.new = (route, data) => template(headerLinks, form(route, data, 'POST'))
module.exports.viewList = (data) => template(headerLinks, list(data))
module.exports.viewOne = (route, data) => template(headerLinks, form(route, data, 'PUT') + list(data.dependentData))
