var jsonfile = require('jsonfile');
 
var file = '/temp/testjson.json'
var obj = {name: 'JP'}
 
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})