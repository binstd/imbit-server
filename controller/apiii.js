const router = require('koa-router')();
var mysql = require('./utils/mysql');
var crypto = require('crypto');
var moment = require('moment');
var axios = require('axios');
router.prefix('/api')
import ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import koajwt from 'koa-jwt';

import sequelize from './db';
import config from './utils/config';
const api_users = sequelize.models.api_users;
const user_dapp_info = sequelize.models.user_dapp_info;
const user_contact = sequelize.models.user_contact;
import {
    CustomError,
    HttpError
} from './utils/response/customError'
import constants from './utils/response/constants'


// 短信接口对接
router.get('/verify', async (req, res) => {
    let rows = {};
    let paramMsg = {};
    rows['code'] = Math.random().toString().slice(-4);
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
    paramMsg['mobile'] = req.query.telephone;
    paramMsg['content'] = rows['code'];
    paramMsg['productid'] = '170831';
    console.log(paramMsg);
    let response = await axios.get("http://www.ztsms.cn/sendNSms.do", {
        params: paramMsg
    });

    req.body = rows;
});