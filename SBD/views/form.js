const formatDate = (date) => ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()

const formatIfDate = (val) => {
    if(val instanceof Date) {
        return formatDate(val)
    }
    return val
}

const inputs = (data) => 
    Object.keys(data.tableData[0]).reduce((str, key) => str +
        `
        <p>${key}</p>
        ${
            data.dependsOnData.find(depends => depends.name == key)
            ?
                `
                <select name="${key}">
                    <option ${data.tableData[0][key] == null ? 'selected' : ''} value="null"></option>
                    ${
                        data.dependsOnData.find(depends => depends.name == key).available.map(obj => {
                            const val = Object.values(obj)[0]
                            return `<option ${val == data.tableData[0][key] ? 'selected' : '' } value="${val}">${val}</option>`
                        })
                    }
                </select>
                `
            :
                `
                <input type="text" name="${key}" value="${formatIfDate(data.tableData[0][key])}"></input>
                `
        }
        <br>
        `
    , '')

const formData = (data) => 
    Object.keys(data.tableData[0]).reduce((str, key) => str +
    `
    ${key}: $("*[name='${key}']").val(),
    `
    , '').split(0, -1)

module.exports.default = (route, data, method) => `
    <form id="form">
        ${
            inputs(data)
        }
        <br>
        <br>
        <input id="submit" type="submit" value="${method}">
    </form> 
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script> 
    <script>
    $(document).ready(function(){
        $("#form").submit(function(event){
            event.preventDefault()
            const data = {${formData(data)}}
            console.log(data)
            $.ajax({
                url: '/${route}',
                type: '${method.toUpperCase()}',
                dataType: 'json',
                data: data
            }).done(function(response){
                alert()
            });
        });
    });
    </script>
`
