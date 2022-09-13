const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/auth",
        createProxyMiddleware({
            target: "http://localhost:30000",
            changeOrigin: true,
        })
    );
    app.use(
        "/project",
        createProxyMiddleware({
            target: "http://localhost:30000",
            changeOrigin: true,
        })
    );
}