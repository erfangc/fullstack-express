let express = require('express');
let app = express();
let path = require('path');
let {createProxyMiddleware} = require('http-proxy-middleware');

//
// you may use https://github.com/expressjs/cookie-parser to work with Cookies 
// to support encrypting and storing storing JWT tokens etc.
//

app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://reqres.in',
        changeOrigin: true,
        onProxyReq: function (proxyReq, req, res, options) {
            // we can transform the incoming request's cookies into a JWT token (decrypt it) and pass it into
            // the Authorization header to the proxyReq.
            // If you are wondering what's in the cookie - the cookie just stores the encrypted version of the JWT token
            // you get the JWT token from another route (ex: app.use('/callback') )
            proxyReq.setHeader('Authorization', 'Bearer 1234')
        }
    })
);

app.use('/app', express.static(path.join(__dirname, 'public')));

app.use('/app/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000);