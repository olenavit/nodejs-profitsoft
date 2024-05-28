const config = {
  log4js: {
    appenders: {
      console: {
        type: 'console',
      },
      ms: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        filename: 'log/ms',
        maxLogSize: 1000000,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ['ms', 'console'],
        level: 'debug',
      },
    },
  },

  app:{
    address:"0.0.0.0",
    port:8888,
  },

  mongo:{
    address:"mongodb://127.0.0.1:27017"
  },

  playerResource:{
    url:"http://localhost:8080/api/player"
  }
};

export default config;