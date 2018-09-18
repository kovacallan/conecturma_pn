'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const expressApp = express()
const debug = require('debug')('express-test:server')
const http = require('http')
const port = normalizePort(process.env.PORT || '3000')
var server
var Menu = require('menu');
var pckg = require('./package.json');

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)

  mainWindow.loadURL('http://127.0.0.1:3000')
  //mainWindow.toggleDevTools()
}

var mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

var menu = Menu.buildFromTemplate([
 {
    label: 'Menu',
    submenu: [
      {label: 'Fechar', accelerator: 'CmdOrCtrl+Q', click: function() {app.quit();}}
    ]
  },
  {
    label: 'Online',
    submenu: [
      {
        label: 'Plataforma Conecturma',
        click () { require('electron').shell.openExternal('http://web.conecturma.com.br') }
      },
       {type: 'separator'},
      {
        label: 'Conecturma Website',
        click () { require('electron').shell.openExternal('http://www.conecturma.com.br') }
      },
    ]
  },
  {
    label: 'Administrativo',
    submenu: [
      {
        label: 'Atualizar',
        click () { require('electron').shell.openExternal('http://www.conecturma.com.br/atualizacao/atualizar.html?versao='+pckg.version+'&idConecturma='+pckg.idConecturma) }
      },
        {
          label: 'Deupuração',
          click () { mainWindow.toggleDevTools() }
         },
        {type: 'separator'},
        {
          label: "Versão: " + pckg.version,
          enabled: "false"
        }
      
    ]
  }


]);

app.on('ready', function () {
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false
    },
    width: 800,
    height: 600,
    title: "Conecturma"
  })

  mainWindow.setTitle("Conecturma");
  mainWindow.setFullScreen(true);

  // view engine setup
  expressApp.set('views', path.join(__dirname, 'views'))
  expressApp.set('view engine', 'jade')

  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  expressApp.use(logger('dev'))
  expressApp.use(bodyParser.json())
  expressApp.use(bodyParser.urlencoded({ extended: false }))
  expressApp.use(cookieParser())
  expressApp.use(express.static(path.join(__dirname, 'build')))
  expressApp.set('port', port)
  expressApp.use('/', express.static('build'))

  /*expressApp.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })*/

  // development error handler
  // will print stacktrace
  if (expressApp.get('env') === 'development') {
    expressApp.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error: err
      })
    })
  }

  // production error handler
  // no stacktraces leaked to user
  expressApp.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })

  server = http.createServer(expressApp)
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)

  mainWindow.on('closed', function () {
    mainWindow = null
    server.close()
  })
})
