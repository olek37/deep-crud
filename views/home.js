module.exports.default = (tables) => `
    <div class="container">
        <div class="home-links">
            ${
                tables.reduce((acc, table) => acc + `<a href="/${table}">${table}</a>`, '')
            }
        </div>
    </div>
`
