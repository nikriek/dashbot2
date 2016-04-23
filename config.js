module.exports {
  secret: (process.ENV.SECRET || 'secret'),
  slack: {
    clientID: process.ENV.SLACK_CLIENT_ID,
    clientID: process.ENV.SLACK_CLIENT_SECRET,
    redirectUri: process.ENV.SLACK_REDIRECT_URI
  }
}
