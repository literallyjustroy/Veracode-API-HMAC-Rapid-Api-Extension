const hmac = require('./veracode-hmac.js');

var VeracodeHMAC = function () {

  this.getProfile = function () {
    if (this.veracodeCredsProfile === undefined) {
      return "default";
    }

    return this.veracodeCredsProfile === undefined ? "default" : this.veracodeCredsProfile.getCurrentValue();
  }

  this.evaluate = function (context) {
    // TODO: Get api id from config file
    console.log(readFile('~/.veracode/credentials'))

    var request = context.getCurrentRequest();

    return hmac.calculateVeracodeAuthHeader(request.method, request.url);
  }

  this.title = function (context) {
    return "Veracode HMAC Authorization";
  }

  this.text = function (context) { // TODO: Show ERROR if fail to load file/creds or maybe just actually throw an error since it shows as warning symbol
    return this.getProfile();
  }
}

VeracodeHMAC.inputs = [
  InputField("veracodeCredsProfile", "Profile Environment Variable", "EnvironmentVariable", { persisted: true })
];

VeracodeHMAC.identifier = "com.veracode.PawExtensions.VeracodeHMAC";

VeracodeHMAC.title = "Veracode HMAC Authorization Dynamic Value";

VeracodeHMAC.help = "https://luckymarmot.com/paw/doc/";

registerDynamicValueClass(VeracodeHMAC);