const LookupDirectory = require("../../utils/directoryContract");
const Web3 = require('web3');
const web3 = new Web3;

module.exports = {
  queryLookup: function queryLookup(gtin) {
    const lookupDirectory = LookupDirectory()
    return web3.toAscii(lookupDirectory.queryLookup(gtin))
  },

  addValidAddress: function addValidAddress(address) {
    const lookupDirectory = LookupDirectory()
    return lookupDirectory.addValidAddress(address)
  },

  removeValidAddress: function removeValidAddress(address) {
    const lookupDirectory = LookupDirectory()
    return lookupDirectory.removeValidAddress(address)
  },

  setLookup: function setLookup(gtin, url) {
    const lookupDirectory = LookupDirectory()
    return lookupDirectory.setLookup(gtin, url, {gas: 4000000})
  },

  transferOwnership: function transferOwnership(address) {
    const lookupDirectory = LookupDirectory()
    return lookupDirectory.transferOwnership(address, {gas: 4000000})
  }
}