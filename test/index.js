
var TestDataManager = require('../index').Manager;

var mongo = require('coyno-mongo');
var should = require('should');
var debug = require('debug')('coyno:mock-data-tests');
var testDataManager = new TestDataManager();

describe('Tests for Package Coyno Mockup Data', function() {
    describe('Unit tests', function () {
        describe('Basic tests', function() {
            describe('Initializing the db', function() {
                it('should initialize the DB', function (done) {
                    testDataManager.initDB(done);
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
            describe('Adding wallets', function() {
                it('should add a wallet', function(done) {
                       testDataManager.fillDB('wallets', done);
                    });
            });
            describe('Deleting wallets', function() {
                it('should add a wallet', function(done) {
                    testDataManager.emptyDB('wallets', done);
                });
            });
        })
    })
});