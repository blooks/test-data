var coinbase = {
  '_id': '5525067d1614d0a722e83048',
  'userId': 'MvWGRepCZdkn7eNXR',
  'label': 'Coinbase',
  'exchange': 'coinbase',
  'credentials': {
    'exchange': 'coinbase',
    'accessToken': process.env.COINBASE_ACCESS_TOKEN,
    'refreshToken': 'refreshtoken'
  },
  'createdAt': new Date('2015-03-29T17:47:34.332Z'),
  'updating': false
}
module.exports = {
  coinbase: coinbase
}
