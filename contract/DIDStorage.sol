pragma solidity 0.5.6;

contract DIDStorage{

    // mapping(string => Document[]) documents; //key: 신원인증고유갑, value: 분산id
    // mapping(string => DIDState) didState;
    // mapping(string => Service[]) services;
    // mapping(string => uint) public nonce;

    // enum DIDState {None, Active, Deactivated}

    //     struct PublicKey{
    //     string id;
    //     string keyType;
    //     string pubKeyData;
    //     bool disable;
    // }

    // struct Document{
    //     string[] contexts;  //"https://www.w3.org/ns/did/v1" 왜 배열이야 ?
    //     string id;
    //     PublicKey[] publicKeys;
    //     string[] credentials;
    // }

    // struct Service{
    //     string id;
    //     PublicKey[] publicKeys;
    //     string serviceType; //issuer, verifier
    //     string endPoint;
    //     bool disable;
    // }



    mapping(string => Document) documents;
    mapping(string => DIDState) didState;
    mapping(string => uint) public nonce;
    
    enum DIDState {None, Active, Deactivated}

    struct PublicKey{
        string id;
        string keyType;
        string pubKeyData;
        bool disable;
    }
    
    struct Service{
        string id;
        string serviceType;
        string serviceEndPoint;
        PublicKey[] publickeys;
        bool disable;
    }
    
    struct Document{
        string id;
        string[] contexts;  //"https://www.w3.org/ns/did/v1" 왜 배열이야 ?
        PublicKey[] publicKeys;
        string[] credentials;
    }


}
