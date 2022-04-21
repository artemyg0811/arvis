import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const src = __dirname + '/src'
const PAGES = fs.readdirSync(src).filter(file => file.includes('.html')) // Массив с названиями файлов в папке src с расширением html

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

export default {
  entry: './src/js/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devServer: {
    port: 'auto', // Порт сервера
    open: true, // Открывает бразуер после запуска сервера
    compress: true, // Включает сжатие gzip для более быстрой загрузки страниц
    hot: false, // Обновление страницы после изменений, без перезагрузки
    client: {
      overlay: { // Показывает во весь экран ошибки, если они есть
        errors: true, // Только ошибки
        warnings: false // Предупреждения не показывать
      }
    }
  },
  plugins: [
    // Вывод html файлов
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `./src/${page}`, // Где находится файл
      filename: `./${page}`, // Название файла
      inject: page === 'index.html' ? false : 'body', // Все скрипты помещаются внизу body, кроме страницы index.html
      // minify: isDev ? false : {
      //   caseSensitive: false,
      //   removeComments: true,
      //   collapseWhitespace: false,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   removeScriptTypeAttributes: true,
      //   keepClosingSlash: false,
      //   minifyJS: { compress: { conditionals: false }},
      //   minifyCSS: true,
      //   minifyURLs: true,
      //   sortAttributes: true,
      //   sortClassName: true,
      // }
    })),
    // Очищаем папку dist
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/style.css'
    })
  ],
  module: {
      rules: [
        // HTML
        {
          test: /\.html$/i,
          use: 'html-loader'
        },
        // CSS
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            // 'style-loader',
            'css-loader',
            // 'postcss-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                      autoprefixer({
                        overrideBrowserslist:['ie >= 8', 'last 4 version']
                      })
                  ],
                },
                sourceMap: true
              }
            },
            'sass-loader',
          ]
        },
        // {
        //   test: /\.scss$/,
        //   use: [
        //       {
        //           loader: 'style-loader'
        //       },
        //       {
        //           loader: 'css-loader',
        //           options: {
        //               sourceMap: true
        //           }
        //       },
        //       {
        //           loader: 'postcss-loader',
        //           options: {
        //               plugins: [
        //                   autoprefixer({
        //                     overrideBrowserslist:['ie >= 8', 'last 4 version']
        //                   })
        //               ],
        //               sourceMap: true
        //           }
        //       },
        //       {
        //           loader: 'sass-loader',
        //           options: {
        //               includePaths: [
        //                   helpers.root('src', 'styles', 'global'),
        //               ],
        //               sourceMap: true
        //           }
        //       }
        //   ],
        // },
        // Изображения
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
        // Шрифты
        {
          test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
        // Видео
        {
          test: /\.(mp4|mp3)$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
        // JSON файлы
        {
          test: /\.(json)$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
        // PHP файлы
        {
          test: /\.(php)$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
      ]
  },
}