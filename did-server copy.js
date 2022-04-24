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
const FinDIDClient = require("./did-registry/index.js")
const CredentialClient = require("./credentialManagement");
const ACCOUNT = require('./config/account.js');
const CONTRACT = require('./config/contract.js');
const finDID = new FinDIDClient({
  network: 'https://api.baobab.klaytn.net:8651',
  regABI: CONTRACT.DIDLedger_JSON,
  regAddr: CONTRACT.DEPLOYED_ADDRESS_DIDLedger,
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());



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
    const create = await finDID.createDocument(userInfoJson,publicKey);
    console.log(create);
    const view = await finDID.create_view(userInfoJson,publicKey,create.isReSearch);
    console.log(view);
    res.send(view);



});

//did
app.get('/didDocument',async (req, res)=>
{
    console.log('/didDocument');
    console.log(req.body);
    const did = req.body.did;//or req.body
    const document = await finDID.getDocument(did);
    console.log(document);
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
    
    const addPubKey = await finDID.addPubKey(userInfoJson, type, publicKey);
    console.log(addPubKey);
    const view = await finDID.create_view(userInfoJson,publicKey,isReSearch);
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
    const view = await finDID.create_view(userInfoJson,publicKey,isReSearch);
    console.log(view);
    res.send(view);
})

app.post('/vc',async (req, res)=>{
    const vc = req.body.vc;
    const cid = vc.cid;
    const ciid = vc.ciid;

    
    //크리덴셜 컨트랙트와 did document에 추가 
})
//search credential
  

app.listen(5000,function(){
    console.log("working on port 5000");
});








