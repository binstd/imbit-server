import Sequelize from 'sequelize';

export default function(sequelize) {
  const user_dapp_info = sequelize.define('user_dapp_info', {
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: false,
    //   validate: { isLowercase: true }
    },
    dappName: {
        type: Sequelize.STRING,
        unique: false
    },
    txHash: {
        type: Sequelize.STRING,
        unique: false
    },
    contractAddress: {
        type: Sequelize.STRING,
        unique: false,
        // validate: { isLowercase: true }
    },
    contractInfo: {
        type: Sequelize.STRING
    },
    dappChain: {
      type: Sequelize.STRING,
      unique: false
    },
    // 状态 0 未生成合约, 1 已生成合约 2.删除
    status: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    }
  });
}

