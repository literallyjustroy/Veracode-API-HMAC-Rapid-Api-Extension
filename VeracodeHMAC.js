const hmac = require('./veracode-hmac.js');

// ini 4.1.1 https://github.com/npm/ini/releases/tag/v4.1.1
const ini = require('./ini.js');

var VeracodeHMAC = function () {

  this.getProfile = function () {
    if (this.veracodeCredsProfile === undefined) {
      return "default";
    }

    return this.veracodeCredsProfile === undefined ? "default" : this.veracodeCredsProfile.getCurrentValue();
  }

  this.evaluate = function (context) {
    var config;
    var profile;
    var api_id;
    var api_secret;

    var profileName = this.getProfile();
    if (this.veracodeCredsFile === undefined) {
      throw new Error("Veracode credentials file is required, see help documentation.");
    }

    try {
      config = ini.parse(this.veracodeCredsFile);
    } catch (e) {
      throw new Error("Unable to parse provided credentials file, see help documentation. From Error: " + e.message);
    }

    profile = config[profileName];

    if (profile === undefined) {
      throw new Error("Profile value '" + profileName + "' was not found in the credentials file");
    }

    api_id = profile.veracode_api_key_id
    api_secret = profile.veracode_api_key_secret

    if (api_id === undefined || api_secret === undefined) {
      throw new Error("veracode_api_key_id or veracode_api_key_secret not found for profile '" + profileName + "'");
    }

    var request = context.getCurrentRequest();

    return hmac.calculateVeracodeAuthHeader(request.method, request.url, api_id, api_secret);
  }

  this.text = function (context) {
    return this.getProfile();
  }
}

VeracodeHMAC.inputs = [
  InputField("veracodeCredsProfile", "Profile Environment Variable", "EnvironmentVariable", { persisted: true }),
  InputField("veracodeCredsFile", "Veracode Credentials File", "String", { persisted: true, placeholder: "Add a file input for the Veracode credentials file.." }),
];

VeracodeHMAC.identifier = "com.veracode.PawExtensions.VeracodeHMAC";

VeracodeHMAC.title = "Veracode HMAC Authorization Dynamic Value";

VeracodeHMAC.help = "https://luckymarmot.com/paw/doc/"; // TODO update docs

registerDynamicValueClass(VeracodeHMAC);