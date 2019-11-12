let mysql = require('mysql');
var gamedb, statdb;

let date = new Date();
let current_date = date_normal(date);
console.log(`start-billing ${current_date}`);

function opengdbConn() {
    gamedb = mysql.createConnection({
        host     : '93.92.205.199',
        user     : 'node',
        password : '93rkVumrAhdkk3q',
        database : 'solmics'
    })

    gamedb.connect();
    global.gdbConn = gamedb;
    
}


function opensdbConn() {

    statdb = mysql.createConnection({
        host     : '93.92.205.199',
        user     : 'node',
        password : '93rkVumrAhdkk3q',
        database : 'Plan'
    })
    
    statdb.connect();
    global.sdbConn = statdb;

}


function date_normal(date) {
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + `.` +
    ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + `.`+
    date.getFullYear() + ` `+
    (date.getHours()<10?`0`+date.getHours():date.getHours()) + `:`+
    (date.getMinutes()<10?`0`+date.getMinutes():date.getMinutes()) + `:`+
    (date.getSeconds()<10?`0`+date.getSeconds():date.getSeconds()) + `.`+
    (date.getMilliseconds()<10?`0`+date.getMilliseconds():date.getMilliseconds());
}

module.exports = {
    async GDB_query(sql) {
        opengdbConn();
        return await new Promise((resolve, reject) => {

            gamedb.query(sql, (error, results, fields) =>{

                if (error) return reject(error);
                return resolve(results[0]);

            });
            gamedb.end();
        })
        .then(res => res)
        .catch((error) => {
            throw error;
        });

    },
    async SDB_query(sql) {
        opensdbConn();
        return await new Promise((resolve, reject) => {

            statdb.query(sql, (error, results, fields) =>{

                if (error) return reject(error);
                return resolve(results[0]);

            });
            statdb.end();
            
        })
        .then(res => res)
        .catch((error) => {
            throw error;
        });

    }
};
