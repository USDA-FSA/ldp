//
//
//
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLBeautifyPlugin = require('html-beautify-webpack-plugin');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin');
const recursive = require('recursive-readdir');

//const StyleLintPlugin = require('stylelint-webpack-plugin');
//const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');


const prodExt = "." + process.argv.splice(process.argv.length-1);

const basePath = process.cwd();

let customizations = {

  fsaStyleImgPath: path.join(basePath, 'node_modules/fsa-style/src/img/'),
  fsaStyleFontsPath: path.join(basePath, 'node_modules/fsa-style/src/fonts/'),
  fsaStyleSCSSPath: path.join(basePath, 'node_modules/fsa-style/src/stylesheets/fsa-style.scss'),
  fsaStyleJSPath: path.join(basePath, 'node_modules/fsa-style/src/js/main.js'),
  mainStylePath: path.join(basePath, 'src/stylesheets/base.scss')
};

// build array of sources from fsa-style in node_modules
let styleArray = [];

styleArray.push(customizations.fsaStyleSCSSPath);
styleArray.push(customizations.mainStylePath);

const postCssLoader = {
  'loader': 'postcss-loader',
  'options': {
    'ident': 'extracted',
    'sourceMap': true,
    'plugins': [
      require('pixrem')(), // add fallbacks for rem units
      require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
    ]
  }
};

const exportsObject = {

  plugins: [],

  devtool: 'source-map',

  entry: {
    'main': [
      './src/stylesheets/base.scss',
      customizations.fsaStyleJSPath,
      './src/index.js',    
    ]
  },
/*
  output: {
    publicPath: '/',
  },
*/
  resolve: {
    modules: ['node_modules', 'src']
  },

  module: {
    rules: [

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              // needed for HTML Partials to work
              interpolate: true,
              removeAttributeQuotes: false
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            query: {
              inlineRequires: '\/img\/',
              partialDirs: [
                path.join(__dirname, 'src', '/**/')
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "imports-loader?$=jquery"
          }
        ]
      },

      {
        /* Future option - allow customization of paths to include/exclude? */
        'exclude': styleArray,
        'test': /\.css$/,
        'use': [
          {
            'loader': 'raw-loader'
          },
          postCssLoader
        ]
      },

      {
        'exclude': styleArray,
        'test': /\.scss$|\.sass$/,
        'use': [
          {
            'loader': 'raw-loader'
          },
          postCssLoader,
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': true,
              'precision': 8,
              'includePaths': []
            }
          }
        ]
      },
      {
        'include': styleArray,
        'test': /\.css$/,
        'use': [
          MiniCssExtractPlugin.loader,
          'css-loader',
          postCssLoader
        ]
      },
      {
        'include': styleArray,
        'test': /\.scss$|\.sass$/,
        'use': [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          postCssLoader,
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': true,
              'precision': 8,
              'includePaths': []
            }
          },
          {
            loader: "@epegzz/sass-vars-loader",
            options: {
              vars: {
                // below uses site absolute path
                'font-path': JSON.stringify(path.join(basePath, 'node_modules/fsa-style/src/fonts').replace(new RegExp('\\' + path.sep, 'g'), '/')),
                'image-path': JSON.stringify(path.join(basePath, 'node_modules/fsa-style/src/img').replace(new RegExp('\\' + path.sep, 'g'), '/'))
              }
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: styleArray
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../img',
              outputPath: '../dist/img/',
              name: '[name].[ext]',
              limit: 100000
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../fonts/',
              outputPath: '../dist/fonts/',
              name: '[name].[ext]',
              limit: 100000
            }
          }
        ]
      }
    ]
  }
};


function addToPlugins(plugin) {
  exportsObject.plugins.push(plugin);
}

/*
  Method used to perform string manipulation and add a plugin based on Handlebars templates converting to HTML pages
*/
function addPagesPlugins(fn) {

  var fullPath = path.resolve(fn).replace(new RegExp('\\' + path.sep, 'g'), '/');
  var shortPath = fullPath.split('pages/')[1].split('.')[0];
  var splitPathArray = shortPath.split('/');
  var filename = splitPathArray.length > 1 ? splitPathArray[splitPathArray.length - 1] : shortPath;
  
  var newTitle = filename;
  var newTemplate = './src/pages/' + shortPath + '.hbs';
  //var newFilename = path.resolve(__dirname, "./dist/" + shortPath + ".html");
  // Updated to fix Sharepoint .aspx issue
  var newFilename = path.resolve(__dirname, "./dist/" + shortPath + prodExt);

  addToPlugins(
    new HTMLWebpackPlugin(
      {
        "title": newTitle,
        "template": newTemplate,
        "filename": newFilename,
        "inject": "body"
      }
    )
  );
  
};

module.exports = new Promise(
  function(resolve, reject) {
    
    // recursively map files/folders in Pages directory
    recursive('./src/pages/',
      function (err, files) {

        files.map( addPagesPlugins );

        // Add remaining Plugins to module.exports object
        addToPlugins(new HTMLBeautifyPlugin({
            config: {
              html: {
                end_with_newline: true,
                indent_size: 2,
                indent_with_tabs: true,
                indent_inner_html: true,
                preserve_newlines: true,
                unformatted: ['p', 'i', 'b', 'span']
              }
            },
            replace: [' type="text/javascript"']
          })
        );

        addToPlugins(
          new HtmlWebpackStringReplacePlugin(
            {
              "_ext_": prodExt
            }
          )
        );

        addToPlugins(new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "css/[name].css",
          chunkFilename: "[name].css"
        }));

        addToPlugins(
          new CopyWebpackPlugin([
            {
              from: './src/data/',
              to: './data/'
            },
            {
              from: './src/img/',
              to: './img/'
            },
            {
              from: './src/fonts/',
              to: './fonts/'
            },
            {
              from: customizations.fsaStyleImgPath,
              to: './img/'
            },
            {
              from: customizations.fsaStyleFontsPath,
              to: './fonts/'
            }
          ])
        );

        resolve( exportsObject );
      }
    )
  }
);