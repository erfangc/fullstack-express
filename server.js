let express = require('express');
let app = express();
let path = require('path');
let {createProxyMiddleware} = require('http-proxy-middleware');

app.use(
    '/api',
    createProxyMiddleware({target: 'https://reqres.in', changeOrigin: true})
);

app.use('/app', express.static(path.join(__dirname, 'public')));

app.use('/app/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000);