module.exports.default = (headerLinks, content) => `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Mini ERP</title>
        </head>
    <link rel="stylesheet" type="text/css" href="/style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script> 
    <body>
        <div id="alert-info">
        </div>
        <div class="header">
            <div class="container">
            <a href="/"><h1>Mini ERP</h1></Mini>
                <div class="header-links">
                    ${headerLinks} 
                </div>
            </div>
        </div>
        ${content}
        <script>
        $(document).ready(function() { 
            $('#alert-info').fadeOut(0)
            const lastVisited = localStorage.getItem('lastVisited')
            localStorage.setItem('lastVisited', location.href);
            if(lastVisited != location.href) {
                location.reload()
            }
            if($('.home-links').length > 0) {
                $('body').css('background', '#03a678')
            }
        })
        </script>
    </body>
    </html>
`
