const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bodyParser = require('body-parser');
const log4js = require('log4js');
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'node-server.log' ,keepFileExt: true,maxLogSize:104857}
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'debug' }
    }
});
const logger = log4js.getLogger();
//const config = require("./config.js");
console.log("start");
logger.debug("start loading")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', '*');
    //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-refresh-token');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
logger.debug("end loading")
const userRoutes = require('./routes/User');
const statsRoutes = require('./routes/Stats');
const groupRoutes = require('./routes/Group');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', function(req, res){
    logger.debug("Please use api endpoints to get or post data!")
    res.send('Please use api endpoints to get or post data!');
});
app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/stats', statsRoutes);


const port = 7001;
app.listen(process.env.PORT || port);
console.log("server started on port: " + port);
