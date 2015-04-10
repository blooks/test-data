var addresses = require('./addresses');
var wallet = require('./wallet');
var transfers = require('./transfers');
var exchangeRate = require('./exchangeRates');
var exchange = require('./exchanges');
module.exports = {
  addresses: addresses,
  wallet: wallet,
  transfers: transfers,
  exchangeRate: exchangeRate,
  exchange: exchange
};
