const template = require('./template').default
const form = require('./form').default

module.exports.default = (route, data, method) => template(form(route, data, method))