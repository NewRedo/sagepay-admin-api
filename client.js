"use strict";

const assert = require("assert");
const crypto = require("crypto");
const extend = require("extend");
const request = require("request-promise-native");
const xmlJs = require("xml-js");

class SagepayAdminApiClient {
    constructor(options) {
        assert(options, "options must be provided");
        assert(options.user, "options.user must be provided");
        assert(options.password, "options.password must be provided");
        assert(options.vendor, "options.vendor must be provided");

        this.options = extend({
            endpoint: "https://test.sagepay.com/access/access.htm"
        }, options);
    }

    request(options) {
        options = extend({}, {
            vendor: this.options.vendor,
            user: this.options.user,
            password: this.options.password
        }, options);

        const xml = sign(options);
        return request({
            method: "POST",
            url: this.options.endpoint,
            form: {
                "XML": xml
            }
        }).then((xmldata) => {
            var element = xmlJs.xml2js(xmldata);
            var packed = pack(element);
            return packed.vspaccess[0];
        });
    }
}
module.exports = SagepayAdminApiClient;

function sign(options) {
    const format = function(name) {
        if (options[name] == null) return "";
        return xmlJs.js2xml({
            elements: [{
                type: "element",
                name: name,
                elements: [{
                    type: "text",
                    text: options[name]
                }]
            }]
        });
    };
    const knownNames = [
        "command",
        "vendor",
        "user",
        "password",
        "signature"
    ];
    var names = ["command", "vendor", "user"];
    for (var name in options) {
        if (knownNames.indexOf(name) < 0) {
            names.push(name);
        }
    }
    names.push("password");
    var value = names.map(name => format(name)).join("");

    const md5 = crypto.createHash("md5").update(value).digest();
    delete options.password;
    options.signature = md5.toString("hex");

    names = ["command", "vendor", "user"];
    for (var name in options) {
        if (knownNames.indexOf(name) < 0) {
            names.push(name);
        }
    }
    names.push("signature");
    value = names.map(name => format(name)).join("");
    value = "<vspaccess>" + value + "</vspaccess>";

    return value;
}
module.exports._sign = sign;

function pack(element) {
    var ret = {};
    element.elements.forEach(element => {
        if (!element.elements || element.elements.length === 0) {
            ret[element.name] = null;
        } else if (element.elements && element.elements.length === 1 && element.elements[0].type === "text") {
            ret[element.name] = element.elements[0].text;
        } else {
            ret[element.name] = ret[element.name] || [];
            ret[element.name].push(pack(element));
        }
    });
    return ret;
}
module.exports._pack = pack;