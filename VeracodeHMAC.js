function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const os = {};
const __viteBrowserExternal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: os
}, Symbol.toStringTag, { value: "Module" }));
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal);
var path$1 = require$$2;
var fs$1 = require$$2;
var _0777 = parseInt("0777", 8);
var mkdirp$1 = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
function mkdirP(p, opts, f, made) {
  if (typeof opts === "function") {
    f = opts;
    opts = {};
  } else if (!opts || typeof opts !== "object") {
    opts = { mode: opts };
  }
  var mode = opts.mode;
  var xfs = opts.fs || fs$1;
  if (mode === void 0) {
    mode = _0777;
  }
  if (!made)
    made = null;
  var cb = f || /* istanbul ignore next */
  function() {
  };
  p = path$1.resolve(p);
  xfs.mkdir(p, mode, function(er) {
    if (!er) {
      made = made || p;
      return cb(null, made);
    }
    switch (er.code) {
      case "ENOENT":
        if (path$1.dirname(p) === p)
          return cb(er);
        mkdirP(path$1.dirname(p), opts, function(er2, made2) {
          if (er2)
            cb(er2, made2);
          else
            mkdirP(p, opts, cb, made2);
        });
        break;
      default:
        xfs.stat(p, function(er2, stat) {
          if (er2 || !stat.isDirectory())
            cb(er, made);
          else
            cb(null, made);
        });
        break;
    }
  });
}
mkdirP.sync = function sync(p, opts, made) {
  if (!opts || typeof opts !== "object") {
    opts = { mode: opts };
  }
  var mode = opts.mode;
  var xfs = opts.fs || fs$1;
  if (mode === void 0) {
    mode = _0777;
  }
  if (!made)
    made = null;
  p = path$1.resolve(p);
  try {
    xfs.mkdirSync(p, mode);
    made = made || p;
  } catch (err0) {
    switch (err0.code) {
      case "ENOENT":
        made = sync(path$1.dirname(p), opts, made);
        sync(p, opts, made);
        break;
      default:
        var stat;
        try {
          stat = xfs.statSync(p);
        } catch (err1) {
          throw err0;
        }
        if (!stat.isDirectory())
          throw err0;
        break;
    }
  }
  return made;
};
const index = /* @__PURE__ */ getDefaultExportFromCjs(mkdirp$1);
const mkdirp$2 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: index
}, [mkdirp$1]);
const require$$3 = /* @__PURE__ */ getAugmentedNamespace(mkdirp$2);
function DuplicateSectionError(section) {
  this.name = "DuplicateSectionError";
  this.message = section + " already exists";
  Error.captureStackTrace(this, this.constructor);
}
function NoSectionError(section) {
  this.name = this.constructor.name;
  this.message = "Section " + section + " does not exist.";
  Error.captureStackTrace(this, this.constructor);
}
function ParseError(filename, lineNumber, line) {
  this.name = this.constructor.name;
  this.message = "Source contains parsing errors.\nfile: " + filename + " line: " + lineNumber + "\n" + line;
  Error.captureStackTrace(this, this.constructor);
}
function MissingSectionHeaderError(filename, lineNumber, line) {
  this.name = this.constructor.name;
  this.message = "File contains no section headers.\nfile: " + filename + " line: " + lineNumber + "\n" + line;
  Error.captureStackTrace(this, this.constructor);
}
function MaximumInterpolationDepthError(section, key, value, maxDepth) {
  this.name = this.constructor.name;
  this.message = "Exceeded Maximum Recursion Depth (" + maxDepth + ") for key " + key + " in section " + section + "\nvalue: " + value;
  Error.captureStackTrace(this, this.constructor);
}
var errors$2 = {
  DuplicateSectionError,
  NoSectionError,
  ParseError,
  MissingSectionHeaderError,
  MaximumInterpolationDepthError
};
const errors$3 = /* @__PURE__ */ getDefaultExportFromCjs(errors$2);
const errors$4 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: errors$3
}, [errors$2]);
const require$$4 = /* @__PURE__ */ getAugmentedNamespace(errors$4);
const errors$1 = require$$4;
const PLACEHOLDER = new RegExp(/%\(([\w-]+)\)s/);
const MAXIMUM_INTERPOLATION_DEPTH = 50;
function interpolate(parser, section, key) {
  return interpolateRecurse(parser, section, key, 1);
}
function interpolateRecurse(parser, section, key, depth) {
  let value = parser.get(section, key, true);
  if (depth > MAXIMUM_INTERPOLATION_DEPTH) {
    throw new errors$1.MaximumInterpolationDepthError(section, key, value, MAXIMUM_INTERPOLATION_DEPTH);
  }
  let res = PLACEHOLDER.exec(value);
  while (res !== null) {
    const placeholder = res[1];
    const rep = interpolateRecurse(parser, section, placeholder, depth + 1);
    value = value.substr(0, res.index) + rep + value.substr(res.index + res[0].length);
    res = PLACEHOLDER.exec(value);
  }
  return value;
}
var interpolation$1 = {
  interpolate,
  MAXIMUM_INTERPOLATION_DEPTH
};
const interpolation$2 = /* @__PURE__ */ getDefaultExportFromCjs(interpolation$1);
const interpolation$3 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: interpolation$2
}, [interpolation$1]);
const require$$5 = /* @__PURE__ */ getAugmentedNamespace(interpolation$3);
const util = require$$2;
const fs = require$$2;
const path = require$$2;
const mkdirp = require$$3;
const errors = require$$4;
const interpolation = require$$5;
const SECTION = new RegExp(/^\s*\[([^\]]+)]$/);
const KEY = new RegExp(/^\s*(.*?)\s*[=:]\s*(.*)$/);
const COMMENT = new RegExp(/^\s*[;#]/);
const LINE_BOUNDARY = new RegExp(/\r\n|[\n\r\u0085\u2028\u2029]/g);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
util.promisify(fs.stat);
const mkdirAsync = util.promisify(mkdirp);
function ConfigParser() {
  this._sections = {};
}
ConfigParser.prototype.sections = function() {
  return Object.keys(this._sections);
};
ConfigParser.prototype.addSection = function(section) {
  if (this._sections.hasOwnProperty(section)) {
    throw new errors.DuplicateSectionError(section);
  }
  this._sections[section] = {};
};
ConfigParser.prototype.hasSection = function(section) {
  return this._sections.hasOwnProperty(section);
};
ConfigParser.prototype.keys = function(section) {
  try {
    return Object.keys(this._sections[section]);
  } catch (err) {
    throw new errors.NoSectionError(section);
  }
};
ConfigParser.prototype.hasKey = function(section, key) {
  return this._sections.hasOwnProperty(section) && this._sections[section].hasOwnProperty(key);
};
ConfigParser.prototype.read = function(file) {
  const lines = fs.readFileSync(file).toString("utf8").split(LINE_BOUNDARY);
  parseLines.call(this, file, lines);
};
ConfigParser.prototype.readAsync = async function(file) {
  const lines = (await readFileAsync(file)).toString("utf8").split(LINE_BOUNDARY);
  parseLines.call(this, file, lines);
};
ConfigParser.prototype.get = function(section, key, raw) {
  if (this._sections.hasOwnProperty(section)) {
    if (raw) {
      return this._sections[section][key];
    } else {
      return interpolation.interpolate(this, section, key);
    }
  }
  return void 0;
};
ConfigParser.prototype.getInt = function(section, key, radix) {
  if (this._sections.hasOwnProperty(section)) {
    if (!radix)
      radix = 10;
    return parseInt(this._sections[section][key], radix);
  }
  return void 0;
};
ConfigParser.prototype.getFloat = function(section, key) {
  if (this._sections.hasOwnProperty(section)) {
    return parseFloat(this._sections[section][key]);
  }
  return void 0;
};
ConfigParser.prototype.items = function(section) {
  return this._sections[section];
};
ConfigParser.prototype.set = function(section, key, value) {
  if (this._sections.hasOwnProperty(section)) {
    this._sections[section][key] = value;
  }
};
ConfigParser.prototype.removeKey = function(section, key) {
  if (this._sections.hasOwnProperty(section) && this._sections[section].hasOwnProperty(key)) {
    return delete this._sections[section][key];
  }
  return false;
};
ConfigParser.prototype.removeSection = function(section) {
  if (this._sections.hasOwnProperty(section)) {
    return delete this._sections[section];
  }
  return false;
};
ConfigParser.prototype.write = function(file, createMissingDirs = false) {
  if (createMissingDirs) {
    const dir = path.dirname(file);
    mkdirp.sync(dir);
  }
  fs.writeFileSync(file, getSectionsAsString.call(this));
};
ConfigParser.prototype.writeAsync = async function(file, createMissingDirs = false) {
  if (createMissingDirs) {
    const dir = path.dirname(file);
    await mkdirAsync(dir);
  }
  await writeFileAsync(file, getSectionsAsString.call(this));
};
function parseLines(file, lines) {
  let curSec = null;
  lines.forEach((line, lineNumber) => {
    if (!line || line.match(COMMENT))
      return;
    let res = SECTION.exec(line);
    if (res) {
      const header = res[1];
      curSec = {};
      this._sections[header] = curSec;
    } else if (!curSec) {
      throw new errors.MissingSectionHeaderError(file, lineNumber, line);
    } else {
      res = KEY.exec(line);
      if (res) {
        const key = res[1];
        curSec[key] = res[2];
      } else {
        throw new errors.ParseError(file, lineNumber, line);
      }
    }
  });
}
function getSectionsAsString() {
  let out = "";
  let section;
  for (section in this._sections) {
    if (!this._sections.hasOwnProperty(section))
      continue;
    out += "[" + section + "]\n";
    const keys = this._sections[section];
    let key;
    for (key in keys) {
      if (!keys.hasOwnProperty(key))
        continue;
      let value = keys[key];
      out += key + "=" + value + "\n";
    }
    out += "\n";
  }
  return out;
}
var configparser = ConfigParser;
const configparser$1 = /* @__PURE__ */ getDefaultExportFromCjs(configparser);
const hmac = require("./veracode-hmac.js");
var VeracodeHMAC = function() {
  this.getProfile = function() {
    return this.veracodeCredsProfile === void 0 ? "default" : this.veracodeCredsProfile.name;
  };
  this.evaluate = function(context) {
    var request = context.getCurrentRequest();
    var method = request.method;
    var urlBase = request.urlBase;
    var urlQuery = request.urlQuery;
    var message = "" + method + urlBase + urlQuery;
    console.log(message);
    console.log(1);
    let url = new URL(context.request.getUrl());
    console.log(2);
    let params = context.request.getParameters();
    if (url.protocol === "https:" && hosts.includes(url.hostname)) {
      let authProfile = context.request.getEnvironmentVariable("veracode_auth_profile");
      if (!authProfile) {
        authProfile = "default";
      }
      let veracodeCredsFile = os.join(os.homedir(), ".veracode", "credentials");
      let config = new configparser$1();
      config.read(veracodeCredsFile);
      let id = config.get(authProfile, "veracode_api_key_id");
      let key = config.get(authProfile, "veracode_api_key_secret");
      let paramStringInitialValue = url.search === "" ? "?" : url.search + "&";
      let paramsString = params.reduce((accum, item, index2, arr) => {
        if (item.name === "") {
          return accum;
        } else if (item.value === "") {
          return `${accum}${item.name}&`;
        } else {
          return `${accum}${item.name}=${item.value}&`;
        }
      }, paramStringInitialValue);
      paramsString = paramsString.slice(0, -1);
      let header = hmac.calculateAuthorizationHeader(id, key, url.hostname, url.pathname, paramsString, context.request.getMethod());
      context.request.setHeader("Authorization", header);
    }
    var dynamicValue = "dynamicVALUEEE";
    return dynamicValue;
  };
  this.title = function(context) {
    return "Veracode HMAC Authorization";
  };
  this.text = function(context) {
    return this.getProfile();
  };
};
VeracodeHMAC.inputs = [
  InputField("veracodeCredsProfile", "Veracode Credentials Profile", "EnvironmentVariable", { persisted: true })
];
VeracodeHMAC.identifier = "com.veracode.PawExtensions.VeracodeHMAC";
VeracodeHMAC.title = "Veracode My Dynamic Value";
VeracodeHMAC.help = "https://luckymarmot.com/paw/doc/";
registerDynamicValueClass(VeracodeHMAC);
