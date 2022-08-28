import path from 'path';
import webpack, {Configuration} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';

const webpackConfig = (env): Configuration => ({
    entry: './src/index.tsx',
    ...(env.production || !env.development ? {} : {devtool: 'eval-source-map'}),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'css', 'scss'],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json',
                    transpileOnly: true,
                    ...(env.development && {
                        getCustomTransformers: () => ({
                            before: [ReactRefreshTypeScript()]
                        })
                    })
                },
                exclude: /dist/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        env.development && new ReactRefreshPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.PRODUCTION': env.production || !env.development,
            'process.env.NAME': JSON.stringify(require('./package.json').name),
            'process.env.VERSION': JSON.stringify(require('./package.json').version)
        }),
        new ForkTsCheckerWebpackPlugin()
    ]
});

export default webpackConfig;
