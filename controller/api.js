import {sequelize} from '../db';
import config from '../config';

import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';

import Web3 from 'web3';
import axios from 'axios';


const moment = require('moment');
const crypto = require('crypto');
// import config from './utils/config';
const api_users = sequelize.models.api_users;

const user_contact = sequelize.models.user_contact;


class ApiController {
    
    // 进行授权 api/auth post
    /**
     *   @api {post} api/auth 进行授权登陆
     */
    async postOuth(ctx, next) {
        // console.log(ctx.request.body);
        const { signature, publicAddress } = ctx.request.body;
        if (!signature || !publicAddress)
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, '此账户没有权限')
        let accessToken = await api_users.findOne({ where: { publicAddress } }).then(api_users => {
            if (!api_users)
                ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR, `User with publicAddress ${publicAddress} is not found in database`)
            return api_users;
        })
        .then(api_users => {
            const msg = `I am signing: ${api_users.nonce}`;
            const msgBuffer = ethUtil.toBuffer(msg);
            const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
            const signatureBuffer = ethUtil.toBuffer(signature);
            const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
            const publicKey = ethUtil.ecrecover(
                msgHash,
                signatureParams.v,
                signatureParams.r,
                signatureParams.s
            );
            const addressBuffer = ethUtil.publicToAddress(publicKey);
            const address = ethUtil.bufferToHex(addressBuffer);
            if (address.toLowerCase() === publicAddress.toLowerCase()) {
                return api_users;
            } else {
                throw new HttpError(constants.HTTP_CODE.UNAUTHORIZED,
                    `Signature verification failed`);
            }
        })
        .then(api_users => {
            api_users.nonce = Math.floor(Math.random() * 10000);
            return api_users.save();
        }).then(
            api_users =>
                new Promise((resolve, reject) =>
                    jwt.sign(
                        {
                            payload: {
                                id: api_users.id,
                                publicAddress
                            }
                        },
                        config.secret,   //私钥是非常关键,有了它jwt才能解析
                        null,
                        (err, token) => {
                            if (err) {
                                console.log('err \n ', err);
                                return reject(err);
                            }
                            console.log('token \n ', token);
                            return resolve(token);
                        }
                    )
                )
        );
        ctx.body = { accessToken };
    }

    /**
     * @api {post} /api/users 提交用户信息
     */
    async insertapiuser(ctx, next) {
        // console.log('\n \n \n request.body===:', ctx.request.body);
        let resultData  = ''
        try {
            resultData = await api_users.create(ctx.request.body); 
        }catch (error) {
            resultData  = { code:1200, message:'添加失败' }
        }

        ctx.send(resultData);
    }

    //根据publicAddress获取用户信息
    // api/users?publicAddress=
    async getapiuser(ctx, next) {
        console.log("router.get('/users', async (ctx, next) => {");
        ctx.body = await api_users.findAll({ where: { publicAddress: ctx.query.publicAddress } }); 
    }

    /**
     *   @api {get} /api/users 获取用户信息
     */
    async apiuserinfo(ctx, next) {
        if (ctx.state.user.payload.id !== +ctx.params.userId) {
            console.log(ctx.params.userId);
            ctx.apierror(ctx.customCode.CONTRACT_ADDRESS_ERROR,
                `You can can only access yourself`);
        }
        let resultData = await api_users.findById(ctx.params.userId);
        console.log('resultData:',resultData);
        ctx.send(resultData);
    }

    /**
     *   @api {patch} /api/users 设置用户信息
     */
    async patchapiuser(ctx, next) {

        ctx.body = await api_users.findById(ctx.params.userId)
        .then(api_users => {
            Object.assign(api_users, ctx.request.body);
            return api_users.save();
        });
    }


    /**
     *  @api {get} /api/users/contact 获取联系人信息
     *  
     *  /api/user/contact/0x81d723361d4f3e648f2c9c479d88dc6debf4fa5f
     */
    async getApiUsercontact(ctx, next) {
        console.log('\n ctx.params.address:', ctx.params.address);
        ctx.body = await user_contact.findAll({ where: { address: ctx.params.address } });
    }

    /**
     *   @api {post} /api/users/contact 提交联系人
     */
    async postApiUsercontact(ctx, next) {
        console.log('222'); 
        console.log('\n \n \n :',ctx.request.body);
        ctx.body = await user_contact.create(ctx.request.body); 
    }

  

  

  
    async getCoffeeTicket(ctx, next) {
        const telephone = ctx.query.telephone;
        //活动码
        const inviteCode = 'MK20181214003';

        //时间戳
        //const timestamp = '4343434343';
        //签名
        // const signature = '434343434';

        let param = {}; 
        param['mobile'] = ctx.query.telephone.toString(); //telephone; 
        param['inviteCode'] = 'MK20181214003';
        param['timestamp'] = Date.parse( new Date()).toString();//数量
    
        const hash = crypto.createHash('sha1');
        // 可任意多次调用update():
        hash.update(param['inviteCode']);
        hash.update(param['mobile']);
        hash.update(param['timestamp']);
        param['signature'] = hash.digest('hex'); 
        console.log('param', param);
        // console.log('hash.digest:', hash.digest('hex')); // 7e1977739c748beac0c0fd14fd26a544
        //https://mkt.luckincoffee.com/extapi/coupon
        let response = await axios.get('https://mkt.luckincoffee.com/extapi/coupon', {
            params: param
        });    
        console.log(response.data);
        
        ctx.body = response.data
        // ctx.apidata({response}); 
    }

    async getVerifyMassegeCode(ctx, next) {
        let rows = {};
        let paramMsg = {};
        rows['code'] = Math.random().toString().slice(-6);
        console.log(rows);
        var today = moment();
        var time = today.format('YYYYMMDDHHmmss'); /*现在的年*/
        // YYYY-MM-DD HH:mm:ss
        //   console.log('time:', time);
        let password = 'jhD72SVM';
        let md5password = crypto.createHash('md5').update(password).digest('hex');
        let msgpass = crypto.createHash('md5').update(md5password + time).digest('hex');
        console.log('msgpass:', msgpass);
        paramMsg['username'] = "proginn1";
        paramMsg['tkey'] = time;
        paramMsg['password'] = msgpass;
        paramMsg['mobile'] = ctx.query.telephone.toString(); 
        // paramMsg['mobile'] = req.query.telephone;
        paramMsg['content'] = rows['code'];
        paramMsg['productid'] = '170831';
        console.log(paramMsg);
        let response = await axios.get("http://www.ztsms.cn/sendNSms.do", {
            params: paramMsg
        });
   

        const result = response.data.split(",");
        // console.log(':::::=>>>',result[0]);
        if(result[0] == 1){
            ctx.body = rows;
        }else{
            ctx.body =  result;
        }
       
    }
}

export default new ApiController();

