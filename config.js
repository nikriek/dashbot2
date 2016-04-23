module.exports = {
  secret: process.env.SECRET || 'secret',
  slack: {
    clientID: process.env.SLACK_CLIENT_ID || 'deezIds',
    clientSecret: process.env.SLACK_CLIENT_SECRET || 'deezSecrets',
    redirectUri: process.env.SLACK_REDIRECT_URI || 'deezUris'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost'
  },
  mongo: {
    url: process.env.MONGODB_URI || 'mongodb://localhost'
  }
}
