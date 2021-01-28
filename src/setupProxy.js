const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/token',
        createProxyMiddleware({
            target: 'http://localhost:8001',
            changeOrigin: true,
            pathRewrite: {
                '^/token': ""
            },
        })
    );
    app.use(
        '/server',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: {
                '^/server': ""
            },
        })
    );
};