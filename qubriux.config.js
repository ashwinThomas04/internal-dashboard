module.exports = {
    app: [
        { entry: "index", out: "" },
    ],
    rewrites: [
        { from: /./, to: '/index.html' }
    ]
}