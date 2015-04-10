var mongo = require('coyno-mongo');
var async = require('async');
var BIP32Wallet = require('coyno-wallets').BIP32;
var Wallet = require('coyno-wallets').Wallet;
var testData = require('./testData');
var bip32wallet = testData.wallet;
var exchangeRate = testData.exchangeRate;
var exchange = testData.exchange;
var log = require('debug')('coyno:mock-data');

exchange.credentials.accessToken = process.env.COINBASE_ACCESS_TOKEN;


var testDataManager = function() {};

var createWalletsCollection = function (callback) {
  mongo.db.createCollection('bitcoinwallets',callback);
};

var createAddressesCollection = function (callback) {
  mongo.db.createCollection('bitcoinaddresses',callback);
};

var createTransfersCollection = function (callback) {
  mongo.db.createCollection('transfers',callback);
};
var createExchangeRatesCollection = function (callback) {
  mongo.db.createCollection('exchangeratesfromnpm', callback);
};
var createExchangesCollection = function (callback) {
    mongo.db.createCollection('exchanges', callback);
};


var insertWallet = function(callback) {
    log('Inserting Wallets');
    mongo.db.collection('bitcoinwallets').insert(bip32wallet, callback);
};
var insertExchangeRate = function(callback) {
    log('Inserting Exchangerates');
    mongo.db.collection('exchangeratesfromnpm').insert(exchangeRate, callback);
};




var getFillFunctions = function (toBeMockedUp) {
    var result = [];
    if (toBeMockedUp.indexOf('wallets')>-1) {
        result.push(insertWallet);
    }
    if (toBeMockedUp.indexOf('exchangeRates')>-1) {
        result.push(insertExchangeRate);
    }
    if (toBeMockedUp.indexOf('exchanges')>-1) {
        if (!process.env.COINBASE_ACCESS_TOKEN) {
            throw new Error('Trying to mock exchange without providing coinbase access token as env variable COINBASE_ACCESS_TOKEN');
        }
        result.push(insertExchangeRate);
    }
    return result;
};




var deleteTransfers = function (callback) {
    mongo.db.collection('transfers').remove({},callback);
};
var deleteAddresses = function (callback) {
    mongo.db.collection('bitcoinaddresses').remove({},callback);
};
var deleteWallets = function (callback) {
    mongo.db.collection('bitcoinwallets').remove({},callback);
};
var deleteExchangeRates = function (callback) {
    mongo.db.collection('exchangeRates').remove({},callback);
};
var deleteExchanges = function (callback) {
    mongo.db.collection('exchanges').remove({},callback);
};
getDeleteFunctions = function (deleteFunctionTypes) {
    var result = [];
    if (deleteFunctionTypes.indexOf('wallets')>-1) {
        result.push(deleteWallets);
    }
    if (deleteFunctionTypes.indexOf('exchangeRates')>-1) {
        result.push(deleteExchangeRates);
    }
    if (deleteFunctionTypes.indexOf('transfers')>-1) {
        result.push(deleteTransfers);
    }
    if (deleteFunctionTypes.indexOf('addresses')>-1) {
        result.push(deleteAddresses);
    }
    if (deleteFunctionTypes.indexOf('exchanges')>-1) {
        result.push(deleteExchanges);
    }
    return result;
};

var dropWallets = function (callback) {
    log('Dropping wallets.');
    mongo.db.dropCollection('bitcoinwallets', callback);
};

var dropTransfers = function (callback) {
    log('Dropping transfers.');
    mongo.db.dropCollection('transfers', callback);
};

var dropExchangeRates = function (callback) {
    log('Dropping exchange rates.');
    mongo.db.dropCollection('exchangeratesfromnpm', callback);
};

var dropExchanges = function (callback) {
    log('Dropping exchanges.');
    mongo.db.dropCollection('exchanges', callback);
};


var dropAddresses = function (callback) {
    log('Dropping addresses.');
    mongo.db.dropCollection('bitcoinaddresses', function(err) {
        callback(err);
    });
};


testDataManager.prototype.initDB = function (callback) {

    if (!process.env.MONGO_URL) {
        return callback(Error('No Mongo URL set'));
    }
    mongo.start(function(err) {
            if (err) return callback(err);
            async.parallel([
                createWalletsCollection,
                createAddressesCollection,
                createTransfersCollection,
                createExchangeRatesCollection,
                createExchangesCollection
            ], callback);
        });
};

testDataManager.prototype.fillDB = function (dataTypes,callback) {
  log('Data types to be mocked:', dataTypes);
    try {
        var functions = getFillFunctions(dataTypes);
    } catch(err) {
        return callback(err);
    }
  log('Functions to be called for mocking:', functions);
  async.parallel(functions, callback);
};


testDataManager.prototype.emptyDB = function (dataTypes,callback) {
  log('Data types to be deleted from the db:', dataTypes);
  var deleteFunctions = getDeleteFunctions(dataTypes);
  log('Functions to be called in deletion process:', deleteFunctions);
  async.parallel(deleteFunctions, callback);
};

testDataManager.prototype.closeDB = function (callback) {
  if (mongo.db) {
    async.parallel([
      dropWallets,
      dropAddresses,
      dropTransfers,
      dropExchangeRates,
      dropExchanges
    ], function (err) {
      if(err) return callback(err);
      mongo.stop(callback);
    }); }
  else {
    return callback && callback("No Db open", null);
  }
};

testDataManager.prototype.getWallet = function(type) {
  switch (type) {
    case 'bip32':
      return new BIP32Wallet(bip32wallet);
  }
  return new Wallet(bip32wallet);
};

testDataManager.prototype.getTransfers = function() {
  return testData.transfers;
};

testDataManager.prototype.getAddresses = function() {
  return testData.addresses;
};

module.exports = testDataManager;
