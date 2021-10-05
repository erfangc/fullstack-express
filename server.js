let express = require('express');
let app = express();
let path = require('path');
let {createProxyMiddleware} = require('http-proxy-middleware');
let cookieParser = require('cookie-parser');

// you may use https://github.com/expressjs/cookie-parser to work with Cookies 
// to support encrypting and storing storing JWT tokens etc.
app.use(cookieParser());

// all requests starting with /api with be routed to some API back-end
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

// body-parser can only be called after the middleware and proxy server has been configured

app.use('/app/login', function (req, res) {
    if (req.method === 'POST') {
        res.cookie(
            'accessToken',
            // this is some fake JWT
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            {
                httpOnly: true,
                path: '/',
                maxAge: 90000,
            }
        );
    }
    res.redirect('/app');
});

// serve files out of a static directory - this is our SPA
app.use('/app', express.static(path.join(__dirname, 'public')));

// everything not found by the above static file handler will result in index.html being returned
// this enables SPA apps to work with React Router and other client-side routing capabilities 
// but not forcing server side 404 when the user's entry point to the site in the browser is some deep path 
app.use('/app/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let port = 3000;
console.log(`Listening on port ${port}`);
app.listen(port);