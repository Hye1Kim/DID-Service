//함수 하나씩 실행해보는 서버 없는 테스트 클라이언트 

const fs = require('fs');
const { get } = require('http');
const KlayDIDClient = require("./index.js")
const didLedgerJson = require("/home/pslab154/project/did-service/contract/DIDLedger.json")
const ACCOUNT = require('../config/account.js');
const CONTRACT = require('../config/contract.js');
// const contractJson = fs.readFileSync("/home/pslab154/project/did-service/test/contract/DIDLedger.json")
// const abi = JSON.parse(contractJson)
const klayDID = new KlayDIDClient({
  network: 'https://api.baobab.klaytn.net:8651',
  regABI: didLedgerJson,
  regAddr: CONTRACT.DEPLOYED_ADDRESS_DIDLedger,
});

async function view_did (userInfo,publicKey){
  const view = await klayDID.create_view(userInfo,publicKey);
  console.log(view)
}

async function createTest(userInfo,publicKey){
    const create = await klayDID.createDocument(userInfo,publicKey);
    console.log(create);
    const view = await klayDID.create_view(userInfo,publicKey,create.isReSearch);
    console.log(view)

    // const publicKeyID = view.pubKeyID;
    // const keyType = view.keyType;
    // const did = view.did;
    // const publicKey = publicKey;


}

async function getDocTest(){
  const did = 'did:kt:0d82ec18df5395bf2ca7611f0648bfc1c935bdd1773c1bb411c42f23318ba9ab';
  const document = await klayDID.getDocument(did);
  console.log(document);
}

async function addPubKey(userInfo){
  const isResearch = 'None';
  const type = 'EcdsaSecp256k1RecoveryMethod2020';
  const publicKey='0x6f4303aa6cea2b0fae462fa9cc792443c03a0609';
  const addPubKey = await klayDID.addPubKey(userInfo, type, publicKey);
  console.log(addPubKey);
  const view = await klayDID.create_view(userInfo,publicKey,isResearch);
  console.log(view);
}

async function createService(){
  const svcInfo = '1111ec18df5395bf2ca7611f0648bfc1c935bdd1773c1bb411c42f23318ba9ab'
  const endPoint = '203.250.77.154'
  const svcType = 'verifier'
  const publicKey ='0xc785d10da57a63d20d14b54a6b322a136b3dd683'

  const createSvc = await klayDID.createSvc(svcInfo,endPoint,svcType,publicKey);
  
  console.log(createSvc);

}

async function test() {
  const privateKey = ACCOUNT.PRIVATE_KEY; // Enter your private key;
  const address = ACCOUNT.ADDRESS; // Enter your private key;
  const keyInfo = {'privateKey': privateKey, 'account': address};

  const userInfo = {'name':'kimhyewon2','regNum':'990114-2xxxxxx','phone':'01000000000'};
  // const userInfo = {
  //   'name': '이영은',
  //   'regNum': '980828-2222222',
  //   'phone': '01900000000'
  // }
  const createPubKey = address;

  //or login({path: 'key store file(json)', password: '1234'});
  //klayDID.auth.login(keyInfo);
  
  //createTest(userInfo,createPubKey)

  addPubKey(userInfo)
  //getDocTest()
  //createService()
  //view_did(userInfo,'0x180150aa48b9ebae77e569eacc31c807f81d2031')


}

test();