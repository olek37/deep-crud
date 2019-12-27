const formatDate = (date) => ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()

const formatIfDate = (val) => {
    if(val instanceof Date) {
        return formatDate(val)
    }
    return val
}

const createLink = (route, obj) => '/' + route + '/' +  Object.keys(obj).reduce((str, key) => str + `${key}$${formatIfDate(obj[key])}&`, '')

const createListElements = (name, elements) => 
    elements.reduce((str_, obj) => str_ +
    `  
    <a class="list-element" href="${createLink(name, obj)}">
        ${
            Object.values(obj).reduce((str__, val) => str__ + `<p>${formatIfDate(val)}</p>`)
        }
    </a>
    `
    , '')

const createListHeader = (list) => {
    if(list.elements.length > 0) {
        return Object.keys(list.elements[0]).reduce((str,key) => str + `<p>${key}</p>`)    
    }
}

module.exports.default = (data) => `
    <div class="lists">
    ${
        data.reduce((str, list) => str + ` 
        <div class="list">
            <p>${list.name}</p>    
            <div class="list-header">
                ${
                    createListHeader(list)
                }
            </div>
                ${
                    createListElements(list.name, list.elements)
                }
        </div>
        `, '')
    }
    </div>
`