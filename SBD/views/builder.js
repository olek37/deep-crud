const template = require('./template').default
const form = require('./form').default
const list = require('./list').default


module.exports.new = (route, data) => template(form(route, data, 'POST'))
module.exports.viewList = (data) => template(list(data))
module.exports.viewOne = (route, data) => template(form(route, data, 'PUT') + list(data.dependentData))