const stripHexPrefix = require('strip-hex-prefix');
var dhjo = stripHexPrefix('0xghjk')
let jsonFile = require('jsonfile');
jsonFile.writeFile('JSONDATA.json',dhjo)