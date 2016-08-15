var log = require('@blooks/log').child({ component: 'Coyno Test Data Manager Tests' })

var TestDataManager = require('../index').Manager
var randomstring = require('randomstring')
var mongoUrl = 'mongodb://localhost/mockup-data-tests' + randomstring.generate(7)

var Mongo = require('@blooks/mongo')
var mongo = new Mongo(mongoUrl)
require('should')
var testDataManager = new TestDataManager(mongoUrl)

describe('Tests for Package Coyno Mockup Data', function () {
  before(function (done) {
    mongo.start(done)
  })
  after(function (done) {
    mongo.stop(done)
  })
  describe('Unit tests', function () {
    describe('Basic tests', function () {
      describe('Initializing the db', function () {
        it('should initialize the DB', function (done) {
          testDataManager.start(function (err) {
            if (err) {
              return done(err)
            }
            mongo.db.listCollections({ name: 'bitcoinwallets' }).toArray(function (err, items) {
              if (err) {
                return done(err)
              }
              items.length.should.be.above(0)
              done()
            })
          })
        })
      })
      describe('Closing the db', function () {
        it('should close the DB', function (done) {
          testDataManager.stop(done)
        })
      })
    })
    describe('Filling the DB with data and deleting it again', function () {
      before(function (done) {
        testDataManager.start(done)
      })
      after(function (done) {
        testDataManager.stop(done)
      })
      describe('Wallets', function () {
        before(function (done) {
          testDataManager.fillDB([ 'wallets' ], done)
        })
        after(function (done) {
          testDataManager.emptyDB([ 'wallets' ], done)
        })
        describe('Check wallet', function () {
          it('should find the right wallet', function (done) {
            done()
          })
        })
      })
      describe('Transfers', function () {
        before(function (done) {
          testDataManager.fillDB([ 'transfers' ], done)
        })
        after(function (done) {
          testDataManager.emptyDB([ 'transfers' ], done)
        })
        describe('Check transfers', function () {
          it('should find correct transfers', function (done) {
            mongo.db.collection('transfers').find().toArray(function (err, result) {
              result.length.should.be.above(30)
              done()
            })
          })
        })
      })
    })
    describe('Exchange mocking', function () {
      before(function (done) {
        testDataManager.start(done)
      })
      after(function (done) {
        testDataManager.stop(done)
      })
      describe('Adding all exchanges', function () {
        it('should add a wallet', function (done) {
          testDataManager.fillDB([ 'exchanges' ], done)
        })
      })
      describe('Deleting all exchanges', function () {
        it('should delete all wallets', function (done) {
          testDataManager.emptyDB([ 'exchanges' ], done)
        })
      })
      if (process.env.COINBASE_ACCESS_TOKEN) {
        describe('Getting coinbase', function () {
          it('should get coinbase exchange', function (done) {
            var coinbase = testDataManager.getExchange('coinbase')
            coinbase.exchange.should.be.equal('coinbase')
            done()
          })
        })
      }
    })
  })
})
