const formatDate = (date) => ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()

const formatIfDate = (val) => {
    if(val instanceof Date) {
        return formatDate(val)
    }
    return val
}

const formatIfNull = (val) => val ? val : ''

const createLink = (route, obj) => '/' + route + '/' +  Object.keys(obj).reduce((str, key) => str + `${key}$${formatIfDate(obj[key])}&`, '')

const createListElements = (name, elements) => elements.length > 0 ?
    elements.reduce((str_, obj) => str_ +
    `  
    <a class="list-element" href="${createLink(name, obj)}">
        ${
            Object.values(obj).reduce((str__, val) => str__ + `<p>${formatIfNull(formatIfDate(val))}</p>`, '')
        }
    </a>
    `
    , '') : ''

const createListHeader = (list) => {
    if(list.elements.length > 0) {
        return Object.keys(list.elements[0]).reduce((str,key) => str + `<p>${key}</p>`, '')    
    }
    return ''
}

module.exports.default = (data) => `
    <div class="container">
        <div class="lists">
        ${
            data.reduce((str, list) => str + ` 
            <div class="list">
                <h2 class="list-title">${list.name}</h2>    
                <div class="list-header">
                    ${
                        createListHeader(list)
                    }
                </div>
                <div class="list-elements">
                    ${
                        createListElements(list.name, list.elements)
                    }
                </div>
                <div class="button-wrapper">
                    <a class="list-add" href="/${list.name}/new">Dodaj</a>
                </div>
            </div>
            `, '')
        }
        </div>
    </div>
`