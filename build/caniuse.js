"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caniuse = exports.fetchCaniuseDataJson = exports.updateCaniuseVersion = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const progress_1 = __importDefault(require("progress"));
let log = console.log;
const fsPromise = fs_1.default.promises; // fs的promise api node版本10+
async function updateCaniuseVersion() {
    const configPath = path_1.default.join(__dirname, './data/config.json');
    try {
        let data = await fsPromise.readFile(configPath);
        let config = JSON.parse(data.toString('utf8'));
        config.CANIUSE_DATA_VERSION = await checkVersion();
        await fsPromise.writeFile(configPath, JSON.stringify(config));
        console.log('当前使用caniuse数据库版本为：', config.CANIUSE_DATA_VERSION);
    }
    catch (error) {
        console.error('更新caniuse数据库版本号失败:', error);
    }
}
exports.updateCaniuseVersion = updateCaniuseVersion;
function fetchCaniuseDataJson() {
    return new Promise((resolve, reject) => {
        const req = https_1.default.get('https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json', (res) => {
            var len = parseInt(res.headers['content-length'], 10);
            let rawData = '';
            var bar = new progress_1.default('downloading [:bar] :rate/bps :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 40,
                total: len
            });
            res.on('data', (d) => {
                bar.tick(d.length);
                rawData += d;
            });
            // 获取数据完成
            res.on('end', () => {
                fs_1.default.writeFile('data.json', rawData, (err) => {
                    if (err)
                        throw err;
                    console.log('caniuse数据库已更新');
                });
                resolve(rawData);
            });
        });
        req.on('error', (e) => {
            console.error('获取caniuse数据的data.json出错', e);
            reject(e);
        });
        req.end();
    });
}
exports.fetchCaniuseDataJson = fetchCaniuseDataJson;
function fetchCaniusePackageJson() {
    return new Promise((resolve, reject) => {
        const req = https_1.default.get('https://raw.githubusercontent.com/Fyrd/caniuse/master/package.json', (res) => {
            let rawData = '';
            res.on('data', (d) => {
                rawData += d;
            });
            // 获取数据完成
            res.on('end', () => {
                resolve(rawData);
            });
        });
        req.on('error', (e) => {
            console.error('获取caniuse数据的package.json出错', e);
            reject(e);
        });
        req.end();
    });
}
async function checkVersion() {
    let packageJson = await fetchCaniusePackageJson();
    packageJson = JSON.parse(packageJson);
    return packageJson.version;
}
function search(feature) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path_1.default.join(__dirname, './data/data.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            var data1 = JSON.parse(data);
            let result = [];
            for (let [, value] of Object.entries(data1.data)) {
                const keywords = value.keywords;
                if (keywords.indexOf(feature) !== -1) {
                    result.push(value);
                }
            }
            resolve(result);
        });
    });
}
async function caniuse(feature) {
    const { CANIUSE_DATA_VERSION } = require('./data/config');
    try {
        // 检查caniuse数据库是否过期
        let version = await checkVersion();
        if (version !== CANIUSE_DATA_VERSION) {
            log(`提示：caniuse数据库版本有更新, 当前版本号${chalk_1.default.green(CANIUSE_DATA_VERSION)},最新版本号${chalk_1.default.green(version)}, 
      你可以运行${chalk_1.default.red('chwech caniuse update')}更新数据库`);
        }
        const result = await search(feature);
        result.forEach((item) => {
            log('==================================================');
            log('特性:', item.title);
            log('浏览器支持情况:');
            let findOneSupport = false;
            let isCheckVersion = [];
            for (const [browser, versions] of Object.entries(item.stats)) {
                for (const [version, isSupport] of Object.entries(versions)) {
                    if (isCheckVersion.includes(version)) {
                        findOneSupport = false;
                        continue;
                    }
                    if (findOneSupport) {
                        continue;
                    }
                    if (isSupport === 'y') {
                        log(browser + '支持版本' + version + '以上');
                        findOneSupport = true;
                        isCheckVersion.push(version);
                    }
                }
            }
            log('==================================================');
        });
    }
    catch (error) {
        log('查找失败：', error);
    }
}
exports.caniuse = caniuse;
