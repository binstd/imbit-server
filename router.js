// const router = require('koa-router')()
import Router from 'koa-router';
import HomeController from './controller/home'
import ApiController from './controller/api'




import config from './config';
const router = Router();
import koajwt from 'koa-jwt';

module.exports = (app) => {
    router.get( '/', HomeController.index )
    router.get('/home', HomeController.home)
    router.get('/home/:id/:name', HomeController.homeParams)
    router.get('/user', HomeController.login)
    router.post('/user/register', HomeController.register)

    // router.get('/api/:id', ApiController.hello)
    
    //提交auth申请
    router.post('/api/auth', ApiController.postOuth)
    
    //查询用户信息(公用)
    router.get('/api/users', ApiController.getapiuser)
    

     //查询用户信息(公用)
    //  router.get('/api/users', ApiController.getApiUserByTelephone)
    //提交用户信息
    router.post('/api/users', ApiController.insertapiuser)

    //获取用户信息
    router.get('/api/users/:userId', koajwt({ secret: config.secret }), ApiController.apiuserinfo)
    

    //修改用户信息  + koajwt({ secret: config.secret }),
    router.patch('/api/users/:userId',  ApiController.patchapiuser)
    
    router.get('/api/virify/massegecode',  ApiController.getVerifyMassegeCode)
    

    // ‘/api/usercontact’ 提交联系人 
    // router.post('/api/user/contact', ApiController.postApiUsercontact)

    // ‘/api/usercontact/:address' 获取联系人
    // router.get('/api/user/contact/:address',ApiController.getApiUsercontact)

    //获取用户联系人
    //router.get('/usercontact/:address', ApiController.getUsercontact)    
    
    //根据address获取dapp列表
    // router.get('/api/dapp/:publicaddress', koajwt({ secret: config.secret }), ApiController.dappcontract)


    // router.get('/api/dapp/:publicaddress',  ApiController.dappcontract)
    //提交新dapp
    // router.post('/api/dapp', ApiController.postDapp)

    

    // router.get('/api/coffee/ticket', ApiController.getCoffeeTicket)

    app.use(router.routes())
        .use(router.allowedMethods())
}