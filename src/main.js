import path from 'path';
import os from 'os';
import configparser from 'configparser';

const hmac = require('./veracode-hmac.js');

var VeracodeHMAC = function () {
  this.getProfile = function () {
    return this.veracodeCredsProfile === undefined ? "default" : this.veracodeCredsProfile.name;
  }

  this.evaluate = function (context) {

    var request = context.getCurrentRequest();
    var method = request.method;
    var urlBase = request.urlBase
    var urlQuery = request.urlQuery;
    var message = '' + method + urlBase + urlQuery;

    console.log(message)

    var veracodeId = "123";
    var veracodeSecret = "ABC";

    console.log(1)
    let url = new URL(context.request.getUrl());
    console.log(2)
    let params = context.request.getParameters();

    if (url.protocol === 'https:' && hosts.includes(url.hostname)) {
      let authProfile = context.request.getEnvironmentVariable('veracode_auth_profile');
      if (!authProfile) {
        authProfile = 'default';
      }
      let veracodeCredsFile = path.join(os.homedir(), '.veracode', 'credentials');
      let config = new configparser();
      config.read(veracodeCredsFile);
      let id = config.get(authProfile, 'veracode_api_key_id');
      let key = config.get(authProfile, 'veracode_api_key_secret');

      let paramStringInitialValue = url.search === '' ? '?' : url.search + '&';
      let paramsString = params.reduce((accum, item, index, arr) => {
        if (item.name === '') {
          return accum;
        } else if (item.value === '') {
          return `${accum}${item.name}&`
        } else {
          return `${accum}${item.name}=${item.value}&`
        }
      }, paramStringInitialValue);
      paramsString = paramsString.slice(0, -1);

      let header = hmac.calculateAuthorizationHeader(id, key, url.hostname, url.pathname, paramsString, context.request.getMethod());
      context.request.setHeader('Authorization', header);
    }

    var dynamicValue = "dynamicVALUEEE"; // generate some dynamic value

    return dynamicValue;
  }

  this.title = function (context) {
    return "Veracode HMAC Authorization";
  }

  this.text = function (context) {
    return this.getProfile(); // TODO test how this works with default/none
  }
}

VeracodeHMAC.inputs = [
  InputField("veracodeCredsProfile", "Veracode Credentials Profile", "EnvironmentVariable", { persisted: true })
];

VeracodeHMAC.identifier = "com.veracode.PawExtensions.VeracodeHMAC";

VeracodeHMAC.title = "Veracode My Dynamic Value";

VeracodeHMAC.help = "https://luckymarmot.com/paw/doc/";

registerDynamicValueClass(VeracodeHMAC);