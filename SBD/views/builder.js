const template = require('./template').default
const form = require('./form').default
const list = require('./list').default

module.exports.default = (route, data, method) => template(form(route, data, method) + list(data.dependentData))