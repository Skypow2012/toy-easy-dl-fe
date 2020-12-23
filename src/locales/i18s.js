const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function main() {
  const fileName = process.argv[2];
  if (!fileName) {
    console.log('Need input: node ./i18s.js locale.ts');
    return;
  }
  let msg = fs.readFileSync(path.join(__dirname, fileName)).toString();
  let hasExport;
  if (msg.indexOf('export default ') > -1) {
    msg = msg.replace('export default ', '').replace(/\'/g, '"').replace(/\;/g, '').replace(/\,\r\n}/, '\n}');
    hasExport = true;
  }
  const json = JSON.parse(msg);
  for (const i in json) {
    const val = json[i];
    console.log('val', val);
    const result = await axios.get(encodeURI(`https://tekii.cn/market/q/trans?i=${val}`));
    try {
      const tarVal = result.data.info.translateResult[0][0].tgt;
      json[i] = tarVal;
    } catch(err) {
      console.log(err);
    }
  }
  let out = `${hasExport?'export default ':''}${JSON.stringify(json)}`;
  out = out.replace('{', '{\r\n  ').replace(/,"/g, ',\r\n  "').replace(/":"/g, '": "').replace('}', ',\r\n};\r\n').replace(/"/g, '\'');
  fs.writeFileSync(fileName.replace(/\.(.*?)$/, '.trans.$1'), out);
}
main();