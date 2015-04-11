var addresses = require('./addresses');
var wallet = require('./wallet');
var transfers = require('./transfers');
var exchangeRate = require('./exchangeRates');
var exchanges = require('./exchanges');
module.exports = {
  addresses: addresses,
  wallet: wallet,
  transfers: transfers,
  exchangeRate: exchangeRate,
  exchanges: exchanges
};
