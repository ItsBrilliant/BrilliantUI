const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/token',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: {
                '^/token': ""
            },
        })
    );
    app.use(
        '/graph',
        createProxyMiddleware({
            target: 'http://graph.microsoft.com',
            changeOrigin: true,
            pathRewrite: {
                '^/graph': ""
            },
        })
    );
    app.use(
        '/.*',
        createProxyMiddleware({
            target: 'http:/login.microsoftonline.com',
            changeOrigin: true,
        })
    );
};