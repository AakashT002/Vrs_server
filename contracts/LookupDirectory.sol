pragma solidity 0.4.22;

import 'browser/Ownable.sol';
contract LookupDirectory is Ownable{

    mapping (bytes32 => Url) public directory;
    mapping (address => bool) public authorizedAddresses;
    
    modifier isAuthorized{
        require(authorizedAddresses[msg.sender] == true);
        _;
    }
    
    struct Url {
        string requestType;
        string entityType;
        string entityId;
        string url;
    }

    function LookupDirectory() public {
        owner = msg.sender;
    }
    
    function setLookup
    (
        bytes32 _gtin,
        string _requestType,
        string _entityType,
        string _entityId,
        string _url
    ) 
        public 
        isAuthorized 
    {
        Url memory setUrl = Url(_requestType, _entityType, _entityId, _url);
        directory[_gtin] = setUrl;
    }
    
    function queryLookup(bytes32 _gtin) 
        view 
        public
        isAuthorized
    returns(string, string, string, string) {
        return (
        directory[_gtin].requestType,
        directory[_gtin].entityType,
        directory[_gtin].entityId,
        directory[_gtin].url);
    }
    
    function addValidAddress(address _address) public onlyOwner {
        authorizedAddresses[_address] = true;
    }
    
    function removeValidAddress(address _address) public onlyOwner {
        authorizedAddresses[_address] = false;
    }
}
