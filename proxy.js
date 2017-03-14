// Import the '@c1/proxy' node module.
const c1Proxy = require('@c1/proxy');
const users = require('./users.config.json');
const username = process.argv[2];
const selectedUser = users[username];

if (!username) {
  displayWarning('Please provide a username and try again.');
} else if (!selectedUser) {
  displayWarning('No matching user found in users.config.js');
}

// Configure the c1Proxy.
c1Proxy({
  // Pattern to match on.
  resolve: '/api/**',

  // Target authentication server.
  authUrl: 'https://cidswaf-it.cloud.capitalone.com/signincontroller-web/signincontroller/signin',

  // Encrypted username (paydata105 used in example).
  username: selectedUser.name,

  // Encrypted password (paydata105 used in example).
  password: selectedUser.pass,

  // Port to listen to.
  port: 1337,

  host: 'localhost',

  // Url to proxy to (it is recommended to use your team server)
  // Overwatch team server is used in example and may not work if the environment is down.
  proxyTarget: 'https://cosqa3.kdc.capitalone.com'
});

function displayWarning(...info) {
  console.warn.apply(console, info);
  process.exit(0);
}
