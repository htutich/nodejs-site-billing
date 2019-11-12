const Worker = require(`../../model/worker`);
const User = require(`../../model/user`);
const Admin = require(`../../model/admin`);
const ACCESS = require(`../../access`);
const crypto = require('crypto');
const mysqli = require(`../../mysqli`);


module.exports = {

    async main(query, user_id) {
        let [token] = ACCESS.isEnoughParameters(query, [`token`]);
        let worker = await Worker(token);
        let user = await User(user_id);
        let admin = await Admin(user_id);
        if (!worker.isEqual(user) && !worker.isEqual(admin)) {
            throw `access denied`;
        }
        
        if (worker.isEqual(admin)) {
            return admin;
        }
        return user;
    },
    async payment(query, user_id){
        let u = {
            secretKey: 'efb248ecfedcbdd2664fe4c8aea9c779',
            publicKey: '73561-a5805',
            //secretKey: '525d3d4a59e7d2d09dd052492edf956f',
            //publicKey: '161791-6634c',
        }

        let ip = query.ip.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);

        let uips = new Array ('31.186.100.49','178.132.203.105','52.29.152.23','52.19.56.234')
        let method = query.method;
        let params = query;
        delete params.method;
        delete params.ip;

        let sign = getSignature(params, method, u.secretKey);
        if(uips.indexOf(ip[0]) == -1){ throw `bad payment ip`;}
        if (sign != query['params[signature]']) { throw `bad payment signature`; }

        if (method == 'pay') {

            let sql_text_bonus = `SELECT bonus_percent FROM bonus_settings`;
            let bonus_pers = await mysqli.GDB_query(sql_text_bonus);
            let bonus = query['params[sum]'] / 100 * bonus_pers.bonus_percent;

            let curMoney = ~~query['params[sum]'] + ~~bonus;
            let sql_text_add = `UPDATE mcr_iconomy SET realmoney = realmoney + ${curMoney} WHERE username = '${query['params[account]']}'`;
            await mysqli.GDB_query(sql_text_add);

            let sql_text_add_log = `
            INSERT INTO unitpay_payments 
            (unitpayId, account, sum, itemsCount, dateComplete, status, bonus) VALUES 
            ('${query['params[unitpayId]']}',  '${query['params[account]']}', '${query['params[sum]']}', '${curMoney}', now(), '1', '${bonus}')`;
            await mysqli.GDB_query(sql_text_add_log);
            return new Object({"result": {
                "message": `add ${curMoney} to ${query['params[account]']} bonus ${bonus}`
            }})
        }

        if (method == 'check') {
            return new Object({"result": {
                "message": `check успешен`
            }})
        }
    }
};

function getSignature(params, method, secretKey) {
    let keys = Object.keys(params).sort();
    removeArrayValue(keys, 'params[signature]')
    let data = [];
    data.push(method);
    keys.forEach(v => data.push(params[v]));
    data.push(secretKey);
    return hash(data.join('{up}'), 'sha256');
}

function hash(data, hash = 'sha256') {
	return crypto.createHash(hash)
		.update(data)
        .digest('hex');
}

function removeArrayValue(arr, value) {
	let index = arr.indexOf(value);
	if (index >= 0) {
		arr.splice( index, 1 );
	}

	return arr;
}
