const fs = require('fs');
const { get } = require('http');
const KlayDIDClient = require("./test.js")
const didLedgerJson = require("/home/pslab154/project/did-registry-dev/build/contracts/DIDLedger.json")
// const contractJson = fs.readFileSync("/home/pslab154/project/did-service/test/contract/DIDLedger.json")
// const abi = JSON.parse(contractJson)
const klayDID = new KlayDIDClient({
  network: 'https://api.baobab.klaytn.net:8651',
  regABI: didLedgerJson,
  regAddr: "0x797a7335209f4b7f9a2f114edb570d2b4a35b756",
});

async function createTest(){
    const userInfo = '6f4303aa6cea2b0fae462fa9cc792443c03a0609';
    const create = await klayDID.createDocument(userInfo);
    console.log('dd');
}

async function getDocTest(){
  //did:kt:6f4303aa6cea2b0fae462fa9cc792443c03a0609
  const document = await klayDID.getDocument("did:kt:6f4303aa6cea2b0fae462fa9cc792443c03a0609");
  console.log(document);
}
async function test() {
  const document = await klayDID.getDocument("did:kt:eFefe...");
  const nonce = await klayDID.getNonce("did:kt:eFefe..."); //????

  //or login({path: 'key store file(json)', password: '1234'});
  klayDID.auth.login({ account: "0x..", privateKey: "0x.." });

  console.log(klayDID.auth.isLogin());
  // >> true

  const result1 = await klayDID.createDocument();
  if (result1.status == -1 || result1.status == -2) {
    console.log(result1.msg); // >> Login is required  or Failed create document
  }

  const result2 = await klayDID.addPubKey(
    "did:kt:eFefe...",
    "EcdsaSecp256k1RecoveryMethod2020",
    "0xdmFkem..",
    "did:kt:Femfd.."
  );
  if (result2.status == 1) {
    console.log(result2.msg); // >> Success add pubKey
  }
}
//createTest();
getDocTest();
//test();