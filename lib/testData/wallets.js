var bip32wallet = {
  '_id': 'E2kQargHKujeY442B',
  'label': 'Android Phone',
  'type': 'bitcoin-wallet',
  'hdseed': 'xpub69FouPJPQuntZoFnvcTd1eifGCYy8Jxc8hWDbrzFHhQPFWcNaxmC4Mc5SQxiseDHNAifQtrL3AoJmrBWfBfgznecsa5dzcbMrjx3fv6f6dE',
  'userId': 'fX9qJ4c92CwLTZABK',
  'updating': true,
  'createdAt': new Date('2015-04-08T13:33:05.608Z'),
  'updatedAt': new Date('2015-04-08T13:33:05.662Z')
}

var singleAddressesWallet = {
  '_id': '2GcQTptXnESL3g2Zc',
  'label': 'Single Addresses',
  'type': 'single-addresses',
  'userId': 'fX9qJ4c92CwLTZABK',
  'updating': true,
  'createdAt': new Date('2015-04-12T12:10:32.798Z'),
  'updatedAt': new Date('2015-04-12T12:10:38.382Z')
}

var electrumWallet = {
  '_id': 'gXPjpp5GYNHaGevBN',
  'label': 'Label',
  'type': 'electrum',
  'hdseed': '180c26c772da9f306c8ffc6a8b659de810d814b127685245a3bf778d436dc91c8386b603b9caef0a96b03954460387a3d2673b2ffad184792d9b25fa8e30f6d2',
  'userId': 'fX9qJ4c92CwLTZABK',
  'updating': true,
  'createdAt': new Date('2015-05-05T14:35:51.452Z'),
  'updatedAt': new Date('2015-05-05T14:35:51.474Z')
}

var armoryWallet = {
  '_id': '7XKFKQANPktZEW5KS',
  'label': 'Armory',
  'type': 'armory',
  'hdseed': {
    'id': 'wsoodgjfaohgaatrii',
    'data': 'whnhaegafeirfdijnukfgehasnjoikntguedwtaharooetoitkrndhrikuetntiutouwftouhdtgagrwjfdrfwohkheuoejjagrtghorsskrsakntrknrijnhwnjdsiewkowifrotwaogsgn'
  },
  'userId': 'fX9qJ4c92CwLTZABK',
  'updating': true,
  'createdAt': new Date('2015-05-05T16:16:22.712Z'),
  'updatedAt': new Date('2015-05-05T16:16:22.741Z')
}

module.exports = {
  bip32wallet: bip32wallet,
  singleAddressesWallet: singleAddressesWallet,
  electrumWallet: electrumWallet,
  armoryWallet: armoryWallet
}
