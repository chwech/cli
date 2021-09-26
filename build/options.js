"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOptions = exports.loadOptions = exports.defaultOptions = exports.schema = void 0;
const joi_1 = __importDefault(require("joi"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const process_1 = require("process");
const lodash_1 = require("lodash");
exports.schema = joi_1.default.object({
    docsDirMap: joi_1.default.object().pattern(/\W/, joi_1.default.array().items(joi_1.default.string().required(), joi_1.default.string().required()))
});
exports.defaultOptions = {
    docsDirMap: {}
};
let cachedOptions;
const rcPath = path_1.default.resolve(os_1.default.homedir(), '.chwechrc');
const loadOptions = () => {
    if (cachedOptions) {
        return cachedOptions;
    }
    if (fs_1.default.existsSync(rcPath)) {
        try {
            cachedOptions = JSON.parse(fs_1.default.readFileSync(rcPath, 'utf-8'));
        }
        catch (e) {
            // error(
            //   `Error loading saved preferences: ` +
            //   `~/.vuerc may be corrupted or have syntax errors. ` +
            //   `Please fix/delete it and re-run vue-cli in manual mode.\n` +
            //   `(${e.message})`
            // )
            process_1.exit(1);
        }
        // validate(cachedOptions, schema, () => {
        //   error(
        //     `~/.vuerc may be outdated. ` +
        //     `Please delete it and re-run vue-cli in manual mode.`
        //   )
        // })
        return cachedOptions;
    }
    else {
        return {};
    }
};
exports.loadOptions = loadOptions;
const saveOptions = (toSave) => {
    const options = Object.assign(lodash_1.cloneDeep(exports.loadOptions()), toSave);
    for (const key in options) {
        if (!(key in exports.defaultOptions)) {
            delete options[key];
        }
    }
    cachedOptions = options;
    try {
        fs_1.default.writeFileSync(rcPath, JSON.stringify(options, null, 2));
        return true;
    }
    catch (e) {
        // error(
        //   `Error saving preferences: ` +
        //   `make sure you have write access to ${rcPath}.\n` +
        //   `(${e.message})`
        // )
    }
};
exports.saveOptions = saveOptions;
