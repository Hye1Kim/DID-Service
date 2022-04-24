//함수 하나씩 실행해보는 서버 없는 테스트 클라이언트 

const KlayDIDClient = require("./index.js");
const ACCOUNT = require('./config/account.js');
const CONTRACT = require('./config/contract.js');
const ACCESS=require('./config/access.js');
const klayDID = new KlayDIDClient({
  network: 'https://api.baobab.klaytn.net:8651',
  regABI: CONTRACT.DEPLOYED_JSON_DIDLedger,
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
  const did = 'did:kt:1111ec18df5395bf2ca7611f0648bfc1c935bdd1773c1bb411c42f23318ba9ab';
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
  const svcInfo = '2222ec18df5395bf2ca7611f0648bfc1c935bdd1773c1bb411c42f23318ba9ab'
  const endPoint = ACCESS.VERIFIER;
  const svcType = 'presentation verifier (online ship)'
  const publicKey =ACCOUNT.SVC_ADDRESS

  const createSvc = await klayDID.createSvc(svcInfo,endPoint,svcType,publicKey);
  
  console.log(createSvc);

}

async function test() {
  const privateKey = ACCOUNT.SVC_PRIVATE_KEY; // Enter your private key;
  const address = ACCOUNT.SVC_ADDRESS; // Enter your private key;
  const keyInfo = {'privateKey': privateKey, 'account': address};

  const userInfo = {'name':'kimhyewon','regNum':'990114-2xxxxxx','phone':'01000000000'};
  // const userInfo = { //'0x180150aa48b9ebae77e569eacc31c807f81d2031'
  //   'name': '이영은',
  //   'regNum': '980828-2222222',
  //   'phone': '01900000000'
  // }
  const createPubKey = address;

  //or login({path: 'key store file(json)', password: '1234'});
  klayDID.auth.login(keyInfo);
  
  //createTest(userInfo,createPubKey)

  //addPubKey(userInfo)
  getDocTest()
  //createService()
  //view_did('1111ec18df5395bf2ca7611f0648bfc1c935bdd1773c1bb411c42f23318ba9ab',address)
  


}

test();