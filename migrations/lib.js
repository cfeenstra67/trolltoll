var fs = require("fs");
var path = require("path");

module.exports = {
  unlockAccount(eth, interval) {
    let passwordPath = path.join(process.env.HOME, ".shnailpi", "password");
    let addressPath = path.join(process.env.HOME, ".shnailpi", "address");
    let password = fs.readFileSync(passwordPath, "utf8").trim();
    let address = fs.readFileSync(addressPath, "utf8").trim();
    eth.personal.unlockAccount(address, password, interval);
  }
}
