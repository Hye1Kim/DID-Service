const express = require('express');
const app = express();
// const databaseIP = process.argv[3];
const bodyParser = require('body-parser');
const cors = require('cors');

global.atob = require("atob");
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

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

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());


const keyInfo = {'privateKey': ACCOUNT.PRIVATE_KEY, 'account': ACCOUNT.ADDRESS};


app.post('/create',async (req, res)=>
{
    console.log('/create');
    console.log(req.body);
    const userInfo = req.body;
    const userInfoJson = {
        'name':userInfo.name,
        'regNum':userInfo.regNum,
        'phone':userInfo.phone
    } 
    const publicKey = userInfo.address;
    //klayDID.auth.login(keyInfo);
    
    const create = await klayDID.createDocument(userInfoJson,publicKey);
    console.log(create);
    const view = await klayDID.create_view(userInfoJson,publicKey,create.isReSearch);
    console.log(view);
    res.send(view);



});

//did
app.get('/didDocument',async (req, res)=>
{
    console.log('/didDocument');
    console.log(req.body);
    const did = req.body.did;//or req.body
    const document = await klayDID.getDocument(did);
    console.log(document);
    klayDID.auth.login(keyInfo);
    res.send(document);
});



//add PublicKey
app.post('/reSearchDID',async (req, res)=>
{
    console.log('research');
    const isReSearch = 'None';
    console.log(req.body);
    const userInfo = req.body;
    const publicKey = req.body.address;
    const type = req.body.keyType;

    const userInfoJson = {
        'name':userInfo.name,
        'regNum':userInfo.regNum,
        'phone':userInfo.phone
    }
    
    const addPubKey = await klayDID.addPubKey(userInfoJson, type, publicKey);
    console.log(addPubKey);
    const view = await klayDID.create_view(userInfoJson,publicKey,isReSearch);
    console.log(view);
    res.send(view);

});

app.post('/searchDID',async (req, res)=>{
    const isReSearch = 'None';
    const userInfo = req.body;
    const userInfoJson = {
        'name':userInfo.name,
        'regNum':userInfo.regNum,
        'phone':userInfo.phone
    }
    const publicKey = req.body.address;
    const view = await klayDID.create_view(userInfoJson,publicKey,isReSearch);
    console.log(view);
    res.send(view);
})

//search credential
  

app.listen(5000,function(){
    console.log("working on port 5000");
});








