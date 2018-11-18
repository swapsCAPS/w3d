const _        = require('underscore')
const obj2gltf = require('obj2gltf')
const fs       = require('fs')
const util     = require('util')

DIR = './src/assets/objs'

readdir = util.promisify(fs.readdir)
writeFile = util.promisify(fs.writeFile)

readdir(DIR)
  .then((files) => {
    files = _.filter(files, (file) => { return file.includes('.obj') })

    console.log('files:')
    _.each(files, console.log)

    return Promise.all(
      _.map(files, (file) => {
        const fileName = file.split('.')[0]
        const input = `${DIR}/${file}`

        return obj2gltf(input).then( (gltf) => {
          const data = Buffer.from(JSON.stringify(gltf));
          const output = `./src/assets/gltfs/${fileName}.gltf`

          return writeFile(output, data)
        })
      })
    )
  })
  .catch((error) => {
    throw error
  })
