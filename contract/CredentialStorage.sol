pragma solidity 0.8.7;

contract CredentialStorage{

    mapping(string => Credential) vCredential; //key: CredentialID, value: Credential

    struct Credential{
        string credentialIID;
        string ownerDID;
        string issuerDID;
        bool disable;
    }

    string[] issuerList;

}
