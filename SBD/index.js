const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const generate = require('./app/routes').default

const schema = JSON.parse(fs.readFileSync('schema.json'))

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

generate(app, schema);

const port = 3000
app.listen(port, () => console.log(`Server listening on port ${port}!`))