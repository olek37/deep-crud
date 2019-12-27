module.exports.default = (headerLinks, content) => `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Mini ERP</title>
        </head>
    <link rel="stylesheet" type="text/css" href="/style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script> 
    <body>
        <div class="header">
            <div class="container">
                <h1>Mini ERP</h1>
                <div class="header-links">
                    ${headerLinks} 
                </div>
            </div>
        </div>
        ${content}
        <script>
        $(document).ready(function(){
            $(window).on('popstate', function() {
                console.log('hi?')
                location.reload(true);
             });
        })
        </script>
    </body>
    </html>
`
