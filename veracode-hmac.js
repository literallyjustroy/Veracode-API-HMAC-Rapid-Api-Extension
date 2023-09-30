// crypto-js 4.1.1 https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
var CryptoJS = require('crypto-js.min.js');

const authorizationScheme = 'VERACODE-HMAC-SHA-256';
const requestVersion = "vcode_request_version_1";
const nonceSize = 16;

const URL_HOSTNAME_PATTERN = /https?:\/\/([A-Za-z_0-9.-]+).*/;
const URL_PATH_AND_PARAMS_PATTERN = /.+?\:\/\/.+?(\/.+?)(?:#|$)/;

function getHostname(url) {
    var result = url.match(URL_HOSTNAME_PATTERN);
    return result && result.length > 1 ? result[1] : '';
}

function getPathAndQueryParams(url) {
    var result = url.match(URL_PATH_AND_PARAMS_PATTERN);
    return result && result.length > 1 ? result[1] : '';
}

function computeHashHex(message, key_hex) {
    return CryptoJS.HmacSHA256(message, CryptoJS.enc.Hex.parse(key_hex)).toString(CryptoJS.enc.Hex);
}

function calculateDataSignature(apikey, nonceBytes, dateStamp, data) {
    let kNonce = computeHashHex(nonceBytes, apikey);
    let kDate = computeHashHex(dateStamp, kNonce);
    let kSig = computeHashHex(requestVersion, kDate);
    return computeHashHex(data, kSig);
}

function newNonce() {
    return CryptoJS.lib.WordArray.random(nonceSize).toString().toUpperCase();
}

function toHexBinary(input) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(input));
}

function removePrefixFromApiCredential(input) {
    return input.split('-').at(-1);
}

function calculateVeracodeAuthHeader(httpMethod, requestUrl, apiId, apiSecret) {
    const formattedId = removePrefixFromApiCredential(apiId);
    const formattedKey = removePrefixFromApiCredential(apiSecret);
    const hostname = getHostname(requestUrl);
    const pathAndParams = getPathAndQueryParams(requestUrl);

    let data = `id=${formattedId}&host=${hostname}&url=${pathAndParams}&method=${httpMethod}`;
    let dateStamp = Date.now().toString();
    let nonceBytes = newNonce();
    let dataSignature = calculateDataSignature(formattedKey, nonceBytes, dateStamp, data);
    let authorizationParam = `id=${formattedId},ts=${dateStamp},nonce=${toHexBinary(nonceBytes)},sig=${dataSignature}`;
    return authorizationScheme + " " + authorizationParam;
}

exports.calculateVeracodeAuthHeader = calculateVeracodeAuthHeader;