"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
async function rssParser(url) {
    const data = await axios_1.default.get(url).then((res) => res.data);
    const parsedData = await new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(data, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
    return parsedData;
}
exports.default = rssParser;
