import Sequelize from 'sequelize';

import api_users from './models/user.model';



//载入配置文件
// import prd_config from './utils/prdConfig'

//判断是否载入正式环境配置
// if (Object.keys(prd_config).length == 0) { 

//     console.log('node_env is:', process.env.NODE_ENV);
// } else {

//     console.log(prd_config);
// }

const sequelize = new Sequelize('d3iaad1gg3dn66', 'shfwkmwouxjplm', '630dfc0a4896ceeceeda9608f3fc972a0cc2a9587eb0a71bb37f121cfbc73116', {
    host: 'ec2-54-235-159-101.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    
    dialectOptions: {
        ssl: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: console.log
    // logging: false
});

// Init all models
api_users(sequelize);

sequelize.sync();

//爬虫表设置
const dbspider = new Sequelize('d3iaad1gg3dn66', 'shfwkmwouxjplm', '630dfc0a4896ceeceeda9608f3fc972a0cc2a9587eb0a71bb37f121cfbc73116', {
    host: 'ec2-54-235-159-101.compute-1.amazonaws.com',
// const dbspider = new Sequelize('d57eko2bomf4t3', 'qdgcpndksdlevz', '17a866b7f00703519c0cfaf0b493ece3977144bfcc492c21c9ed4e8a9322f839', {
//     host: 'ec2-54-243-147-162.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        'underscored': true
    },
    dialectOptions: {
        ssl: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    // logging: false
    logging: console.log
});

// article_spider(dbspider);
// tags_spider(dbspider);
//article_spider.sync({alter: true})
// dbspider.sync();

export {sequelize, dbspider};
