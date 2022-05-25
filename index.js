require("dotenv").config();
const http = require("https");

const { blackhawkContacts } = require("./includes/blackhawkContacts");
const { MiningWithBrad } = require("./includes/mailchimp/MiningWithBrad");
const { BlacHawkGroup } = require("./includes/mailchimp/BlackHawkGroup");

// Time to milliseconds conversion
let hours = 3600000;
let minutes = 60000;
let seconds = 1000;

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);

const port = process.env.PORT || 8000;
server.listen(port);

function sendData() {
  blackhawkContacts();
  setTimeout(() => {
    MiningWithBrad();
  }, 5 * seconds);
  setTimeout(() => {
    BlacHawkGroup();
  }, 10 * seconds);
}
sendData();
setInterval(() => {
  sendData();
}, 6 * hours);
