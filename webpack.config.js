module.exports = {
    entry: "./js/index.js",
    devtool: "eval-source-map",
    output: {
        path: __dirname,
        filename: "pre2.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};