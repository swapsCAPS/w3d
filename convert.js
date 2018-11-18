const _        = require('underscore')
const obj2gltf = require('obj2gltf')
const fs       = require('fs')

fs.readdir('./src/assets/objs', (error, files) => {
  if (error) throw error
  console.log('files', files)
  Promise.all([
    obj2gltf(files)
      .then(function(gltf) {
        const data = Buffer.from(JSON.stringify(gltf));
        fs.writeFileSync(`./src/assets/objs/model.gltf`, data);
      })
  ])
})
