const formatDate = (date) => ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()

const formatIfDate = (val) => {
    if(val instanceof Date) {
        return formatDate(val)
    }
    return val
}

const createLink = (route, obj) => '/' + route + '/' +  Object.keys(obj).reduce((str, key) => str + `${key}$${formatIfDate(obj[key])}&`, '')

module.exports.default = (data) => 
    `
    <div class="lists">
    ${
        data.filter(list => list.elements.length).reduce((str, list) => str + ` 
        <div class="list">
            <p>${list.name}</p>    
            <div class="list-header">
                ${
                    Object.keys(list.elements[0]).reduce((str,key) => str + `<p>${key}</p>`)    
                }
            </div>
                ${
                    list.elements.reduce((str_, obj) => str_ +
                    `  
                    <a class="list-element" href="${createLink(list.name, obj)}">
                        ${
                            Object.values(obj).reduce((str__, val) => str__ + `<p>${formatIfDate(val)}</p>`)
                        }
                    </a>
                    `
                , '')
                }
        </div>
        `, '')
    }
    </div>
    `