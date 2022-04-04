const Caver = require("caver-js");
const Auth = require("./auth");
const secp256k1 = require('secp256k1');
const {randomBytes} = require('crypto');
const {Keccak} = require('sha3');
const hash = new Keccak(256);


module.exports = class KlayDidClient {

  /**
   * @param cfg {
   *  network: blockchain endpoint
   *  regABI: did reg abi path 
   *  regAddr: did reg address
   * }  */
  constructor(cfg) {
    this.caver = new Caver(cfg.network);
    this.auth = new Auth(this.caver);
    this.didReg = new this.caver.contract(require(cfg.regABI), cfg.regAddr);
  }


  /**
   * @param userInfo: the user's personal information (name, resident registration number, phone number, etc.)
   * @returns returnMsg{statusCode, msg}
   * @return statusCode
   *           -1: Login is required!    -2: error.msg
   *            1: success  */
  async createDocument(userInfo){
    if(!this.auth.isLogin()){ //login 확인
      return this._returnMsg(-1,'Login is required!');
    }

    try{
      const from = this.auth.getAccount();
      const gas = this.auth.getGas();
      const hashUserInfo = this._createUserInfoHash(userInfo);
      await this.didReg.methods.create(hashUserInfo).send({from: from, gas: gas});

      return this._returnMsg(1,'Success create document');
    }catch(e){
      return this._returnMsg(-2, e.message);
    }
  }


  /**
   * @param userInfo: the user's personal information (name, resident registration number, phone number, etc.)
   * @returns hashUserInfo: value created by hashing the userInfo  */
   _createUserInfoHash(userInfo){
    const hashUserInfo = HASH.update(userInfo.name,userInfo.regNum,userInfo.phone).digest('hex');
    
    return hashUserInfo

  }




};
