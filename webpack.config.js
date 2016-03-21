module.exports = {
    entry: "./js/play.js",
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