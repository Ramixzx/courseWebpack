// Requiere a path de node
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Crea un modulo que se exporta,en modo de objeto, la config deseada
module.exports = {
    //Punto de entrada de la aplicacion (por donde/que archivo empieza)
    entry: './src/index.js',
    //Hacia donde enviamos lo que prepara webpack (por defecto lo envia a la carpeta dist(distribution))
    output: {
        //Donde se encuantra nuestro proyecto, en que directorio
        path: path.resolve(__dirname, 'dist'),
        //Nombre del archivo que resulta de la compilacion
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    //Con que extenciones tiene que trabajar el proyecto
    //Resolve = que entender
    resolve: {
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },

    // Como se tienen que comportar los modulos de exportacion
    module: {
        rules: [
            //Para conectar babel-loder con webpack y poder trabajar con el proyecto
            {
                // Utiliza cualquier extension que sea msj o js
                test: /\.m?js$/,
                // Exclui todo lo que este en la carpeta node_modules
                exclude: /node_modules/,
                // 
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ],
            },

            {
                test: /\.png/,
                type: 'asset/resource'
            },

            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false,
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),

        new Dotenv(),

        new CleanWebpackPlugin(),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    }
}