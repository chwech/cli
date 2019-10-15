// const download = require('download-git-repo')
import download from 'download-git-repo'

export default function downloadTemplate(template: string, target = 'tmp'): Promise<string> {
  return new Promise((resolve, reject) => {
    download(`chwech/${template}`, target, function (err: Error) {
      if (err) {
        reject(err)
      } else {
        resolve(target)
      }
    })
  })
}