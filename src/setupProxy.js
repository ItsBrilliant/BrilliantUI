const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/token',
        createProxyMiddleware({
            target: 'https://3.16.152.174:8000',
            changeOrigin: true,
            pathRewrite: {
                '^/token': ""
            },
        })
    );
};