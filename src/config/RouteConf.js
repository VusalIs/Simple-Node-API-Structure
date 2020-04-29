const routerConf = (express, app) => {
    app.use('/auth', require('../routes/auth'));
};

module.exports = routerConf;
