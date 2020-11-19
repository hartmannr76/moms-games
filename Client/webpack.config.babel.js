import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import path from 'path';
import glob from 'glob';
const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

module.exports = {
    // context: path.resolve(__dirname, "src"),
    entry: glob.sync("./src/bundles/*.js").reduce((e, v) => {
        const extension = path.extname(v);
        const file = path.basename(v, extension);
        e[file] = v;
        return e;
    }, {}),
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: 'dist/'
    },

    resolve: {
        extensions: ['.jsx', '.js', '.json', '.less'],
        modules: [
            path.resolve(__dirname, "src/lib"),
            path.resolve(__dirname, "node_modules"),
            'node_modules'
        ],
        alias: {
            components: path.resolve(__dirname, "src/components"),    // used for tests
            style: path.resolve(__dirname, "src/style"),
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: path.resolve(__dirname, 'src'),
                enforce: 'pre',
                use: 'source-map-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                // Transform our own .(less|css) files with PostCSS and CSS-modules
                test: /\.(less|css)$/,
                include: [path.resolve(__dirname, 'src/components')],
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            // esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: CSS_MAPS,
                            plugins: () => {
                                autoprefixer({ browsers: [ 'last 2 versions' ] });
                            }
                        }
                    },
                    'less-loader',
                ],
            },
            {
                test: /\.(less|css)$/,
                exclude: [path.resolve(__dirname, 'src/components')],
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            // esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: CSS_MAPS,
                            plugins: () => {
                                autoprefixer({ browsers: [ 'last 2 versions' ] });
                            }
                        }
                    },
                    'less-loader',
                ],
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.(xml|html|txt|md)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
                use: ENV==='production' ? 'file-loader' : 'url-loader',
                exclude: [path.resolve(__dirname, 'src/assets')]
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
                use: 'file-loader',
                include: [path.resolve(__dirname, 'src/assets')]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        // new HtmlWebpackPlugin({
        //     template: './index.ejs',
        //     minify: { collapseWhitespace: true }
        // }),
        new CopyWebpackPlugin([
            // { from: './manifest.json', to: './' },
            // { from: './favicon.ico', to: './' },
            { from: 'src/assets', to: './' },
        ])
    ],

    // stats: { colors: true },

    node: {
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
    },

    devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',
    
    optimization: {
        minimize: ENV==='production',
    },

    devServer: {
        port: process.env.PORT || 8080,
        host: 'localhost',
        publicPath: '/dist',
        contentBase: './dist',
        historyApiFallback: true,
        hot: ENV!=='production',
        onListening: server => {
            const port = server.listeningApp.address().port;
            // this is needed for ReactDevelopmentServer in .NET startup
            console.log('Starting the development server');
            console.log('Running on: ', port);
        },
        proxy: {
            // OPTIONAL: proxy configuration:
            // '/optional-prefix/**': { // path pattern to rewrite
            //   target: 'http://target-host.com',
            //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
            // }
        }
    }
};
