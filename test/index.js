var TestDataManager = require('../index').Manager;

var mongo = require('coyno-mongo');
require('should');
var debug = require('debug')('coyno:mock-data-tests');
var testDataManager = new TestDataManager();

describe('Tests for Package Coyno Mockup Data', function() {
    describe('Unit tests', function () {
        describe('Basic tests', function() {
            describe('Initializing the db', function() {
                it('should initialize the DB', function (done) {
                    testDataManager.initDB(function(err) {
                        if (err) return done(err);
                        mongo.db.listCollections({name: "bitcoinwallets"}).toArray(function(err, items) {
                            if(err) return done(err);
                            items.length.should.be.above(0);
                            done();
                        });
                    });
                })
            });
            describe('Closing the db', function() {
                it('should close the DB', function (done) {
                    testDataManager.closeDB(done);
                })
            });
        });
        describe('Filling the DB with data and deleting it again', function() {
            before(function(done) {
                testDataManager.initDB(done);
            });
            after(function(done) {
                testDataManager.closeDB(done);
            });
            describe('Wallets', function() {
                before(function(done) {
                    testDataManager.fillDB(['wallets'], done);
                });
                after(function (done) {
                    testDataManager.emptyDB(['wallets'], done);
                });
                describe('Check wallet', function() {
                    it('should find the right wallet', function(done){
                        done();
                    });
                });
            });
            describe('Transfers', function() {
                before(function (done) {
                    testDataManager.fillDB(['transfers'], done);
                });
                after(function (done) {
                    testDataManager.emptyDB(['transfers'], done);
                });
                describe('Check transfers', function() {
                    it('should find correct transfers', function(done){
                        mongo.db.collection('transfers').find().toArray(function(err, result) {
                            result.length.should.be.above(30);
                            done();
                        })
                    });
                });
            });
        });
        describe('Exchange mocking', function() {
            before(function(done) {
                testDataManager.initDB(done);
            });
            after(function(done) {
                testDataManager.closeDB(done);
            });
            describe('Adding all exchanges', function() {
                it('should add a wallet', function(done) {
                    testDataManager.fillDB(['exchanges'], done);
                });
            });
            describe('Deleting all exchanges', function() {
                it('should delete all wallets', function(done) {
                    testDataManager.emptyDB(['exchanges'], done);
                });
            });
            if (process.env.COINBASE_ACCESS_TOKEN) {
                describe('Getting coinbase', function () {
                    it('should get coinbase exchange', function (done) {
                        var coinbase = testDataManager.getExchange('coinbase');
                        coinbase.exchange.should.be.equal('coinbase');
                        done();
                    });
                });
            }
        })
    })
});

