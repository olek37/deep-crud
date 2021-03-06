const formatDate = (date) => ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()

const formatIfDate = (val) => {
    if(val instanceof Date) {
        return formatDate(val)
    }
    return val
}

const formatIfNull = (val) => val === null ? '' : val

const inputs = (data, pks, method) => 
    Object.keys(data.tableData[0]).reduce((str, key) => str +
        `
        <div class="inputs">
            <p class="input-title">${key}</p>
            ${
                data.dependsOnData.find(depends => depends.name == key)
                ?
                    `
                    <select name="${key}" ${ method == 'PUT' && pks.find(pk => pk.name == key) ? 'disabled' : ''}>
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
                    <input ${pks.find(pk => pk.name == key) ? 'disabled' : ''} type="text" name="${key}" value="${formatIfNull(formatIfDate(data.tableData[0][key]))}"></input>
                    `
            }
        </div>
        `
    , '')

const formData = (data) => 
    Object.keys(data.tableData[0]).reduce((str, key) => str +
    `
    ${key}: $("*[name='${key}']").val(),
    `
    , '').split(0, -1)

module.exports.default = (route, data, pks, method) => `
    <div class="container">
        <form id="form">
            ${
                inputs(data, pks, method)
            }
            <div class="button-wrapper">
                <a id="submit">Zapisz</a>
            </div>
            
        </form>
    </div>
    <script>
    $(document).ready(function(){
        $("#submit").on("click", function(event){
            event.preventDefault()
            const data = {${formData(data)}}
            $.ajax({
                url: '/${route}',
                type: '${method}',
                data: data
            }).done(function(data){
                $('#alert-info').html('<p>' + data + '</p>')
                $('#alert-info').fadeIn(500, () => {
                    setTimeout(function(){
                        location.reload()
                    }, 500);
                });
            }).fail(function(data){
                $('#alert-info').html('<p>Podano błędne dane</p>')
                $('#alert-info').addClass('error')
                $('#alert-info').fadeIn(500, () => {
                    setTimeout(function(){
                        location.reload()
                    }, 500);
                });
                
            });
        });
    });
    </script>
`
