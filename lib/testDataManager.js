var Mongo = require('@blooks/mongo')
var async = require('async')

var testData = require('./testData')
var bip32wallet = testData.wallets.bip32wallet
var electrumWallet = testData.wallets.electrumWallet
var singleAddressesWallet = testData.wallets.singleAddressesWallet
var armoryWallet = testData.wallets.armoryWallet

var addressWithLotsOfTx = testData.addresses.lotsoftransactions
var bip32addresses = testData.addresses.bip32addresses
var disconnectedBitcoinTransfers = testData.transfers.disconnectedBitcoinTransfers
var exchangeRate = testData.exchangeRate

var exchanges = testData.exchanges
var log = require('@blooks/log').child({component: 'Test Data Manager'})
var _ = require('lodash')

var TestDataManager = function (mongoUrl) {
  if (!mongoUrl) {
    throw new Error('No Mongo URL set')
  }
  this.mongo = new Mongo(mongoUrl)
}

/**
 * Checks whether the dataTypes array contains illegal values
 * @param dataTypes
 * @returns {boolean}
 */
TestDataManager.prototype.checkDataTypes = function (dataTypes) {
  return (dataTypes.length === _.intersection(dataTypes,
      ['wallets', 'exchangeRates', 'exchanges', 'addresses', 'transfers']
    ).length)
}

TestDataManager.prototype.createWalletsCollection = function (callback) {
  log.debug('Creating Wallets Collection')
  this.db.createCollection('bitcoinwallets', callback)
}

TestDataManager.prototype.createAddressesCollection = function (callback) {
  log.debug('Creating Addresses Collection')
  this.db.createCollection('bitcoinaddresses', callback)
}

TestDataManager.prototype.createTransfersCollection = function (callback) {
  log.debug('Creating Transfers Collection')
  this.db.createCollection('transfers', callback)
}
TestDataManager.prototype.createExchangeRatesCollection = function (callback) {
  log.debug('Creating ExchangeRates Collection')
  this.db.createCollection('exchangeratesfromnpm', callback)
}
TestDataManager.prototype.createExchangesCollection = function (callback) {
  log.debug('Creating Exchanges Collection')
  this.db.createCollection('exchanges', callback)
}

TestDataManager.prototype.insertWallet = function (callback) {
  log.debug('Inserting Wallets')
  this.db.collection('bitcoinwallets').insertMany([bip32wallet, singleAddressesWallet, electrumWallet, armoryWallet], callback)
}
TestDataManager.prototype.insertExchangeRate = function (callback) {
  log.debug('Inserting Exchangerates')
  this.db.collection('exchangeratesfromnpm').insert(exchangeRate, callback)
}
TestDataManager.prototype.insertExchanges = function (callback) {
  log.debug('Inserting Exchange')
  var exchangesArray = _.toArray(exchanges)
  this.db.collection('exchanges').insertMany(exchangesArray, callback)
}
TestDataManager.prototype.insertAddresses = function (callback) {
  log.debug('Inserting Addresses')
  this.db.collection('bitcoinaddresses').insert(bip32addresses, callback)
}
TestDataManager.prototype.insertTransfers = function (callback) {
  log.debug('Inserting Transfers')
  this.db.collection('transfers').insert(disconnectedBitcoinTransfers, callback)
}

TestDataManager.prototype.getFillFunctions = function (toBeMockedUp) {
  var result = []
  var self = this
  if (!self.checkDataTypes(toBeMockedUp)) {
    log.debug('Throwing error for trying to fill db for unsupported datatype.')
    throw new Error('Trying to fill for unsupported datatype!')
  }
  if (toBeMockedUp.indexOf('wallets') > -1) {
    result.push(self.insertWallet.bind(self))
  }
  if (toBeMockedUp.indexOf('exchangeRates') > -1) {
    result.push(self.insertExchangeRate.bind(self))
  }
  if (toBeMockedUp.indexOf('exchanges') > -1) {
    result.push(self.insertExchanges.bind(self))
  }
  if (toBeMockedUp.indexOf('addresses') > -1) {
    result.push(self.insertAddresses.bind(self))
  }
  if (toBeMockedUp.indexOf('transfers') > -1) {
    result.push(self.insertTransfers.bind(self))
  }
  return result
}

TestDataManager.prototype.deleteTransfers = function (callback) {
  this.db.collection('transfers').remove({}, callback)
}
TestDataManager.prototype.deleteAddresses = function (callback) {
  this.db.collection('bitcoinaddresses').remove({}, callback)
}
TestDataManager.prototype.deleteWallets = function (callback) {
  this.db.collection('bitcoinwallets').remove({}, callback)
}
TestDataManager.prototype.deleteExchangeRates = function (callback) {
  this.db.collection('exchangeRates').remove({}, callback)
}
TestDataManager.prototype.deleteExchanges = function (callback) {
  this.db.collection('exchanges').remove({}, callback)
}
TestDataManager.prototype.getDeleteFunctions = function (deleteFunctionTypes) {
  var self = this
  var result = []
  if (deleteFunctionTypes.indexOf('wallets') > -1) {
    result.push(self.deleteWallets.bind(self))
  }
  if (deleteFunctionTypes.indexOf('exchangeRates') > -1) {
    result.push(self.deleteExchangeRates.bind(self))
  }
  if (deleteFunctionTypes.indexOf('transfers') > -1) {
    result.push(self.deleteTransfers.bind(self))
  }
  if (deleteFunctionTypes.indexOf('addresses') > -1) {
    result.push(self.deleteAddresses.bind(self))
  }
  if (deleteFunctionTypes.indexOf('exchanges') > -1) {
    result.push(self.deleteExchanges.bind(self))
  }
  if (deleteFunctionTypes.indexOf('addresses') > -1) {
    result.push(self.deleteAddresses.bind(self))
  }
  return result
}

TestDataManager.prototype.dropWallets = function (callback) {
  log.debug('Dropping wallets.')
  this.db.dropCollection('bitcoinwallets', callback)
}

TestDataManager.prototype.dropTransfers = function (callback) {
  log.debug('Dropping transfers.')
  this.db.dropCollection('transfers', callback)
}

TestDataManager.prototype.dropExchangeRates = function (callback) {
  log.debug('Dropping exchange rates.')
  this.db.dropCollection('exchangeratesfromnpm', callback)
}

TestDataManager.prototype.dropExchanges = function (callback) {
  log.debug('Dropping exchanges.')
  this.db.dropCollection('exchanges', callback)
}

TestDataManager.prototype.dropAddresses = function (callback) {
  log.debug('Dropping addresses.')
  this.db.dropCollection('bitcoinaddresses', function (err) {
    callback(err)
  })
}

TestDataManager.prototype.start = function (callback) {
  log.trace('Initialising Database for mockup data:')
  var self = this
  this.mongo.start(function (err, database) {
    if (err) return callback(err)
    log.debug('Opened Mongo.')
    self.db = database
    async.parallel([
      self.createWalletsCollection.bind(self),
      self.createAddressesCollection.bind(self),
      self.createTransfersCollection.bind(self),
      self.createExchangeRatesCollection.bind(self),
      self.createExchangesCollection.bind(self)
    ], callback)
  })
}

TestDataManager.prototype.fillDB = function (dataTypes, callback) {
  var self = this
  log.debug('Data types to be mocked:', dataTypes)
  try {
    var functions = self.getFillFunctions(dataTypes)
  } catch(err) {
    return callback(err)
  }
  log.debug('Functions to be called for mocking:', functions)
  async.parallel(functions, callback)
}

TestDataManager.prototype.emptyDB = function (dataTypes, callback) {
  var self = this
  log.debug('Data types to be deleted from the db:', dataTypes)
  var deleteFunctions = self.getDeleteFunctions(dataTypes)
  log.debug('Functions to be called in deletion process:', deleteFunctions)
  async.parallel(deleteFunctions, callback)
}

TestDataManager.prototype.stop = function (callback) {
  var self = this
  if (this.db) {
    this.db.dropDatabase(function (err) {
      if (err) {
        return callback(err)
      }
      self.mongo.stop(callback)
    })
  } else {
    return callback && callback('No Db open', null)
  }
}

TestDataManager.prototype.getWallet = function (type) {
  switch (type) {
    case 'bip32':
      return bip32wallet
    case 'single-addresses':
      return singleAddressesWallet
    case 'electrum':
      return electrumWallet
    case 'armory':
      return armoryWallet
  }
  throw new Error('Dont have mockup data for wallet type:', type)
}

TestDataManager.prototype.getTransfers = function () {
  return testData.transfers.disconnectedBitcoinTransfers
}

TestDataManager.prototype.getAddresses = function () {
  return testData.addresses
}
TestDataManager.prototype.getJobs = function () {
  return testData.jobs
}

TestDataManager.prototype.getExchange = function (exchange) {
  switch (exchange) {
    case 'coinbase':
      if (!process.env.COINBASE_ACCESS_TOKEN) {
        throw new Error('Trying to mock exchange without providing coinbase access token as env variable COINBASE_ACCESS_TOKEN')
      }
      return exchanges.coinbase
  }
}

module.exports = TestDataManager
