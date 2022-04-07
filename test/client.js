const KlayDIDClient = require("klay-did-auth");
const klayDID = new KlayDIDClient({
  network: "testnet",
  regABI: "/home/pslab154/project/did-service/util/contract/DIDLedger.json",
  regAddr: "0xdfa99a9c156101d7a764028aec6bb4541fac3cd1",
});

async function test() {
    const create = await klayDID.createDocument();
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

test();