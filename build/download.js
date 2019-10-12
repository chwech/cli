"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const download = require('download-git-repo');
function downloadTemplate(template, target = 'tmp') {
    return new Promise((resolve, reject) => {
        download(`chwech/${template}`, target, function (err) {
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
