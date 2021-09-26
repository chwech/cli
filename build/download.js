"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const download_git_repo_1 = __importDefault(require("download-git-repo"));
function downloadTemplate(template, target = 'tmp') {
    return new Promise((resolve, reject) => {
        console.log('download...');
        download_git_repo_1.default(`chwech/${template}`, target, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(target);
            }
        });
    });
}
exports.default = downloadTemplate;
