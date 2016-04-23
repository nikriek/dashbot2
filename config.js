module.exports = {
  secret: (process.env.SECRET || 'secret'),
  slack: {
    clientID: process.env.SLACK_CLIENT_ID || 'deezIds',
    clientSecret: process.env.SLACK_CLIENT_SECRET || 'deezSecrets',
    redirectUri: process.env.SLACK_REDIRECT_URI || 'deezUris'
  },
  redis: {
    host: (process.env.REDIS_URL || 'localhost')
  }
}
