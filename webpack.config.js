const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const loaderUtils = require('loader-utils');

module.exports = {
    entry: "./src/components/index.tsx",
    target: "web",  // This builds for web, not servers
    mode: "development",
    devServer: {
        port: 3001,
        proxy: {
            '/': 'http://localhost:8080'
        }
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    resolve: {
        // Resolve file extensions in the specified order
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                getLocalIdent: (context, localIdentName, localName, options) => {
                                    // Certain css rule names we do not want to hash, as they may
                                    // override rules put in place by third party libraries.
                                    const toIgnore = ['pac-container']
                                    if (toIgnore.includes(localName)) {
                                        return localName;
                                    }
                                    
                                    // Generate unique name based off rule and path name, to make unique
                                    options.content = `${context.resourcePath}_${localName}`;
                                    const hash = loaderUtils.interpolateName(
                                        context,
                                        '[hash:base64:5]',
                                        options
                                    );
                                    return `${localName}_${hash}`;
                                  },
                            },
                            importLoaders: 1,
                        },
                    }],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    // Used to parse React code, and support browsers that use all versions of js/ts
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-env',
                            ['@babel/preset-typescript', {allowNamespaces: true}],
                        ],
                        plugins: ['@babel/plugin-transform-runtime'],
                    },
                },
            },
        ],
    },
    plugins: [
        // This generates the index.html with all required script tags using the given template
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "public", "index.html"),
        }),
        new Dotenv()
    ],
};