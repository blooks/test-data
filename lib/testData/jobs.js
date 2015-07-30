var addresses = require('./addresses').bip32addresses;
var _ = require('lodash');
var addressStrings = _.pluck(addresses, 'address');
var transactionFetcherJob = {
    addresses: addressStrings,
    userId: "fX9qJ4c92CwLTZABK",
    walletId: "E2kQargHKujeY442B"
};

module.exports = {
    transactionFetcherJob : transactionFetcherJob
};