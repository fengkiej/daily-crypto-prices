const request = require('request');
const { parse } = require('json2csv');
const { writeFileSync } = require('fs');
const args = process.argv;

const API_URI = "https://min-api.cryptocompare.com/data/v2/histoday"

let params = {
    limit: 365,
    tsym: "IDR"
};

args.forEach((item, index) => {
    if(index > 1) {
        let split_str = item.split('=');
        let key = split_str[0].replace(/-/g, '');
        if(key == 'asset') {
            let value = split_str[1];

            params['fsym'] = value;
        }
    }
});

const x = request.get({
    uri: API_URI,
    qs: params
}, (error, response, body) => {
    let data = JSON.parse(body)["Data"]["Data"];
    data.forEach((data) => {
        data.time = new Date(data.time*1e3);
    });

    let fields = ['time', 'high', 'low', 'open', 'volumefrom', 'volumeto', 'close', 'conversionType', 'conversionSymbol']

    let csv = parse(data, { fields });
    writeFileSync(`${ __dirname }/csv/${ params['fsym'] }.csv`, csv)
    console.log(csv);
});