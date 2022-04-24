const Caver = require("caver-js");
const Auth = require("./auth");
const secp256k1 = require('secp256k1');
const {randomBytes} = require('crypto');
const {Keccak} = require('sha3');
const hash = new Keccak(256);
const keccak256 = require('keccak256')

const ACCOUNT = require('./config/account.js');
const keyInfo = {'privateKey': ACCOUNT.PRIVATE_KEY, 'account': ACCOUNT.ADDRESS};

//financeDID
module.exports = class vcManagementClient {

  /**
   * @param cfg {
   *  network: blockchain endpoint
   *  vcABI: did reg abi path 
   *  vcAddr: did reg address
   * }  */
  constructor(cfg) {
    this.caver = new Caver(cfg.network);
    this.auth = new Auth(this.caver);
    this.vc = new this.caver.contract(cfg.vcABI.abi, cfg.vcAddr);
  }

  async create_view(userInfo,publicKey,isReSearch){
    try{
      if(isReSearch==true && isReSearch!='None') return {'reSearch':isReSearch}; //true
      const hashUserInfo = this._createUserInfoHash(userInfo); //userInfo는 json
      const dom = await this.didReg.methods.create_view(hashUserInfo).call();
      const publicKeys = dom.publicKeys;
      for(let i=0; i< publicKeys.length; i++){
        if(publicKeys[i].pubKeyData == publicKey){
          const did = dom.id;
          const pubKeyID = publicKeys[i].id;
          const keyType = publicKeys[i].keyType;
          return {'did':did,'publicKeyID':pubKeyID,'publicKey':publicKey,'keyType':keyType,'reSearch':isReSearch}; //false
         }
      }
    }
    catch(e){
      return this._returnMsg(-2, e.message);
    }

  }

  /**
   * @param userInfo: the user's personal information (name, resident registration number, phone number, etc.)
   * @returns returnMsg{statusCode, msg}
   * @return statusCode
   *           -1: Login is required!    -2: error.msg
   *            1: success  */

  async register(uDid,iDid,cid,ciid){ 
  
    if(!this._isLogin()){ //login 확인
      return this._returnMsg(-1,'Login is required!');
    }
    

    try{
      const from = this.auth.getAccount();registry
      return {'isReSearch': false ,'msg' :this._returnMsg(1,'Success register vc')}; 
    }catch(e){
      return {'isReSearch': true ,'msg' : this._returnMsg(-2, e.message)}; 
    }
  }

  /**@dev get document for did
   * @param dom: did to find document of did in registry
   * @return document
   */
  async getList(cid,uDid) { //fin
    try{
      const cid = await this.didReg.methods.getDocument(did).call();
      return dom; 
    }catch(e
      console.log(e);
      return {contexts:[]}
    }
  }  


  /**
  * @param did: 'did:kt:deFF..2x'
  * @param type: EcdsaSecp256k1RecoveryMethod2020 or EcdsaSecp256k1VerificationKey2019
  * @param publicKey: klaytn account address or public key(hex string)
  * @param controller: 'did:kt:feFF..Xx' 
  * @returns returnMsg{statusCode, msg}
  * @return statusCode: 
  *           -1: Login is required!    -2: error.msg
  *           -3: Not vaild key type     1: success  */
   async addPubKey(userInfo, type, publicKey){ //
    // if(!this.auth.isLogin()){
    //   return this._returnMsg(-1,'Login is required!');
    // }
    if(!this._isLogin()){ //login 확인
      return this._returnMsg(-1,'Login is required!');
    }

    try{
      const from = this.auth.getAccount();
      console.log(from,typeof(from));
      const gas = this.auth.getGas();

      const hashUserInfo = this._createUserInfoHash(userInfo); //userInfo는 json
      if(type == 'EcdsaSecp256k1RecoveryMethod2020'){
        await this.didReg.methods.addAddrKey(hashUserInfo, publicKey).send(
          {
            from: from, 
            gas: gas 
          });
      }else if(type == 'EcdsaSecp256k1VerificationKey2019'){
        await this.didReg.methods.addPubKey(hashUserInfo, publicKey).send(
          {
            from: from, 
            gas: gas
          });
      }else{
        return this._returnMsg(-3, 'Not valid type!');
      }

      return this._returnMsg(1,'Success add pubKey');
    }catch(e){
      return this._returnMsg(-2, e.message);
    }
  }

  /**
  * @param svcInfo: service information => svcType, endPoint, publicKey 
  * @param publicKey: klaytn account address or public key(hex string)
  * @param svcType: '(string). [ex. company type]'
  * @param endPoint: '(string) [ex. example.com]' 
  * @returns returnMsg{statusCode, msg}
  * @return statusCode: 
  *           -1: Login is required!  -2: error.msg  1: success  */    
  async createSvc(svcInfo,endPoint,svcType,publicKey){
    // if(!this.auth.isLogin()){
    //   return this._returnMsg(-1,'Login is required!');
    // }

    try{
      const from = this.auth.getAccount();
      const gas = this.auth.getGas();
      await this.didReg.methods.createSvc(svcInfo,endPoint,svcType,publicKey).send({from: from, gas: gas});

      return this._returnMsg(1,'Success add service');
    }catch(e){
      return this._returnMsg(-2, e.message);
    }
  }

  /**@dev Extract the key to be used in the did document
   * @param dom: Did document
   * @param pubKeyID: ID of the key you are looking for in the document
   * @returns pubKey info
   */
   extractPubKey(dom, pubKeyID){
    const publicKeys = dom.publicKeys;
    for(let i=0; i< publicKeys.length; i++){
      if(publicKeys[i].id ==pubKeyID){
        return publicKeys[i];
      }
    }
  }


  /**
   * @param did: 'did:kt:dFdd..0F'
   * @param pubKeyId: id excluding "did#"" of public key obj in document
   * @returns returnMsg{statusCode, msg}
   * @return statusCode: 
   *           -1: Login is required!  -2: error.msg  1: success  */    
  async revokePubKey(did, pubKeyId){
    // if(!this.auth.isLogin()){
    //   return this._returnMsg(-1,'Login is required!');
    // }

    try{
      const from = this.auth.getAccount();
      const gas = this.auth.getGas();
      await this.didReg.methods.disableKey(did, pubKeyId).send({from: from, gas: gas});

      return this._returnMsg(1,'Revoked public key');
    }catch(e){
      return this._returnMsg(-2, e.message);
    }    
  }



  /**
   * @param did: 'did:kt:dFdd..0F'
   * @param scvId: id excluding "did#"" of service obj in document
   * @returns returnMsg{statusCode, msg}
   * @return statusCode: 
   *           -1: Login is required!  -2: error.msg  1: success  */  
  async revokeService(did, scvId){
    if(!this.auth.isLogin()){
      return this._returnMsg(-1,'Login is required!');
    }

    try{
      const from = this.auth.getAccount();
      const gas = this.auth.getGas();
      await this.didReg.methods.disableService(did, scvId).send({from: from, gas: gas});

      return this._returnMsg(1,'Revoke service');
    }catch(e){
      return this._returnMsg(-2, e.message);
    }  
  }




  /**
   * @param statusCode: -n: failed, 1: successful
   * @param msg: result msg 
   */
  _returnMsg(statusCode, msg){
    return {status: statusCode, msg: msg };
  }


  /**
  * @dev internal function
  * @param signature: value signed file metadata with private key (0x{hex}:65byte:module->caver.klay.accounts.sign)
  * @param data: data contained in signature
  * @param pubKey: public key(address) in document (0x{Hex.toLowCase})
  */
  _isValid_Secpk1_Recovery2020(signature, data, pubKeyAddr){
    const signerAddress = this.caver.klay.accounts.recover(data, signature);
    return (pubKeyAddr == signerAddress.toLowerCase());
  }


  /**
  * @dev internal function 
  * @param signature: value signed file metadata with private key (0x{hex}:64byte:module->secp256k1)
  * @param data: data contained in signature
  * @param pubKey: public key in document (0x{Hex})
  */
  _isValid_Secpk1_2019(signature, data, pubKey){
    const pureHexKey = pubKey.replace("0x", "");
    const uint8ArrPubKey = Uint8Array.from(Buffer.from(pureHexKey,'hex'));

    const msg32 = hash.update(Buffer.from(data)).digest();
  
    const pureHexSig = signature.replace("0x","");
    const bytesSig = Buffer.from(pureHexSig,'hex'); 

    return secp256k1.ecdsaVerify(bytesSig, msg32, uint8ArrPubKey);
  }

  /**
   * @param userInfo: the user's personal information (name, resident registration number, phone number, etc.)
   * @returns hashUserInfo: value created by hashing the userInfo  */
   _createUserInfoHash(userInfo){
    const hashUserInfo = keccak256(Buffer.from(JSON.stringify(userInfo))).toString('hex')
    return hashUserInfo

  }

  _isLogin(){
    var result = true;
    if(!this.auth.isLogin()){ //login 확인
      this.auth.login(keyInfo);
      if(!this.auth.isLogin()) result=false;
    }
    return result;
  }

  /**
     * @param statusCode: -n: failed, 1: successful
     * @param msg: result msg 
     */
  _returnMsg(statusCode, msg){
    return {status: statusCode, msg: msg };
  }


};