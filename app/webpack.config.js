const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;
const pages = [
  { name: 'index', ext: 'pug', script: 'ts' },
  { name: 'about', ext: 'html', script: 'js' },
];

const entry = (pagesList) => {
  const pageCollection = pagesList;

  return pageCollection.reduce((config, { name, script }) => {
    const newConfig = config;

    newConfig[name] = path.resolve(__dirname, `./src/js/${name}.${script}`);

    return newConfig;
  }, {});
};

const HtmlWebpackPluginPages = (pagesList = []) => {
  const pageCollection = pagesList;

  return pageCollection.map(
    ({ name, ext }) =>
      new HtmlWebpackPlugin({
        favicon: './src/img/256x256.png',
        template: `./src/${name}.${ext}`,
        filename: `${name}.html`,
        inject: 'body',
        publicPath: './',
        chunks: [name],
      }),
  );
};

module.exports = {
  mode,

  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    watchFiles: ['./src/**/*'],
  },

  devtool: 'source-map',

  entry: entry(pages),

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  // на выходе создает отдельный js файл подключаемых библиотек
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },

  module: {
    rules: [
      // JS
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // TS
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      // STYLES MODULE
      {
        test: /\.module\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[sha1:hash:hex:7]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // STYLES NO MODULE
      {
        test: /^((?!\.module).)*(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // IMAGES
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      // SVG
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'svg/[name][ext]',
        },
      },
      // FONTS
      {
        test: /\.(woff(2)?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      // HTML
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      // PUG
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },

  plugins:
    [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      ...HtmlWebpackPluginPages(pages),
    ],
};
