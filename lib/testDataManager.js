var mongo = require('coyno-mongo');
var async = require('async');
var BIP32Wallet = require('coyno-wallets').BIP32;
var Wallet = require('coyno-wallets').Wallet;
var testData = require('./testData');
var bip32wallet = testData.wallet;
var log = require('debug')('coyno:mock-data');


var exchangeRate = {
  "_id" : "551b2e9d85cf6abb6882a5ab",
  "time" : new Date("2010-07-22T00:00:00.000Z"),
  "rates" : {
    "EUR": 0.0619,
    "GBP": 0.0521,
    "USD": 0.07920000000000001
  }
};


var testDataManager = function() {};

var startMongo = function (callback) {
  mongo.start(function (err, db) {
    if (err) {
      return callback(err);
    }
    return callback(null, db);
  });
};

var createWalletsCollection = function (db, callback) {
  db.createCollection('bitcoinwallets', function (err) {
    return callback(err, db);
  });
};

var createAddressesCollection = function (db, callback) {
  db.createCollection('bitcoinaddresses', function (err) {
    return callback(err, db);
  });
};

var createTransfersCollection = function (db, callback) {
  db.createCollection('transfers', function (err) {
    return callback(err, db);
  });
};
var createExchangeRatesCollection = function (db, callback) {
  db.createCollection('exchangeratesfromnpm', function (err) {
    return callback(err);
  });
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
    return result;
};




var deleteTransfers = function (callback) {
    mongo.db.collection('transfers').remove({}, callback);
};
var deleteAddresses = function (callback) {
    mongo.db.collection('bitcoinaddresses').remove({}, callback);
};
var deleteWallets = function (callback) {
    mongo.db.collection('bitcoinwallets').remove({}, callback);
};
var deleteExchangeRates = function (callback) {
    mongo.db.collection('exchangeRates').remove({}, callback);
};

getDeleteFunctions = function (deleteFunctionTypes) {
    var result = [];
    if (deleteFunctionTypes.indexOf('wallets')>-1) {
        result.push(deleteWallets);
    }
    if (deleteFunctionTypes.indexOf('exchangeRates')>-1) {
        result.push(deleteExchangeRates);
    }
    return result;
};

var dropWallets = function (callback) {
    log('Dropping wallets.');
    mongo.db.dropCollection('bitcoinwallets', function(err) {
        callback(err);
    });
};

var dropTransfers = function (callback) {
    log('Dropping transfers.');
    mongo.db.dropCollection('transfers', function(err) {
        callback(err);
    });
};

var dropExchangeRates = function (callback) {
    log('Dropping exchange rates.');
    mongo.db.dropCollection('exchangeratesfromnpm', function(err) {
        callback(err);
    });
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
    async.waterfall([
        startMongo,
        createWalletsCollection,
        createAddressesCollection,
        createTransfersCollection,
        createExchangeRatesCollection
    ], callback);
};

testDataManager.prototype.fillDB = function (dataTypes,callback) {
  log('Data types to be mocked:', dataTypes);
  var functions = getFillFunctions(dataTypes);
  log('Functions to be called for mocking:', functions);
  async.waterfall(functions, callback);
};


testDataManager.prototype.emptyDB = function (dataTypes,callback) {
  log('Data types to be deleted from the db:', dataTypes);
  var deleteFunctions = getDeleteFunctions(dataTypes);
  log('Functions to be called in deletion process:', deleteFunctions);
  async.waterfall(deleteFunctions, callback);
};

testDataManager.prototype.closeDB = function (callback) {
  if (mongo.db) {
    async.waterfall([
      dropWallets,
      dropAddresses,
      dropTransfers,
      dropExchangeRates
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
