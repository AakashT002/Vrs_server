pragma solidity 0.4.21;

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
        string _url
    ) 
        public 
        isAuthorized 
    {
        Url memory setUrl = Url(_requestType, _entityType, _url);
        directory[_gtin] = setUrl;
    }
    
    function queryLookup(bytes32 _gtin) 
        view 
        public
        isAuthorized
    returns(bytes32, string, string, string) {
        return (_gtin,
        directory[_gtin].requestType,
        directory[_gtin].entityType,
        directory[_gtin].url);
    }
    
    function addValidAddress(address _address) public onlyOwner {
        authorizedAddresses[_address] = true;
    }
    
    function removeValidAddress(address _address) public onlyOwner {
        authorizedAddresses[_address] = false;
    }
}
