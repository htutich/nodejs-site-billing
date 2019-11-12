const Worker = require(`../../model/worker`);
const User = require(`../../model/user`);
const Admin = require(`../../model/admin`);
const ACCESS = require(`../../access`);
const fs = require("fs");
const Calipers = require('calipers')('png');
var jimp = require('jimp');
const uuidv1 = require('uuid/v1');

var crypto = require(`crypto`);
const mysqli = require(`../../mysqli`);
const tokens = require(`../token/get`);

module.exports = {

    async upload(query, user_id, uplfiles) {
        let [token] = ACCESS.isEnoughParameters(query, [`token`]);
        let worker = await Worker(token);
        let user = await User(user_id);
        let admin = await Admin(user_id);

        if (!worker.isEqual(user) && !worker.isEqual(admin)) {
            throw `access denied`;
        }

        let auser;
        if (worker.isEqual(user)) { auser = user; }
        if (worker.isEqual(admin)) { auser = admin; }

        let dirpath = '../upload/';
        let dirpath_heads = '../upload/heads/';
        uplfiles = await uplfiles;
        if (uplfiles.file == undefined) {
            throw 'undefined file'
        }

        let imginfo = await new Promise((resolve, reject) => {
            Calipers.measure(uplfiles.file.path, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).then((results) => {
            return results;
        })

       if (imginfo.type == 'png') {

            let upfilename = auser.getLogin()+'.png';
            let upfilesize = uplfiles.file.size;
            let maxfilesize = 128*1024;
            let maxwidth = 64;
            let maxheight = 32;
            let isdonateuser = false;

            switch (auser.getPerm()) {
                case 'group.vip':
                    maxfilesize = 256*1024;
                    maxwidth = 128;
                    maxheight = 64;
                    isdonateuser = true;
                    break;
                case 'group.premium':
                    maxfilesize = 384*1024;
                    maxwidth = 256;
                    maxheight = 128;
                    isdonateuser = true;
                    break;
                case 'group.gold':
                    maxfilesize = 512*1024;
                    maxwidth = 512;
                    maxheight = 256;
                    isdonateuser = true;
                    break;
                case 'group.ultra':
                    maxfilesize = 1024*1024;
                    maxwidth = 1024;
                    maxheight = 512;
                    isdonateuser = true;
                    break;
            }
            if (auser.getGroupID() == 3) {
                maxfilesize = 2*1024*1024;
                maxwidth = 2048;
                maxheight = 1024;
                isdonateuser = true;
            }

            let multiple = imginfo.pages[0].width / 64;

            console.log(upfilename)
            //console.log(upfilesize)
            
            if (multiple > 1 && !isdonateuser) {
                throw 'hd access denied';
            }
            if (multiple == 1) {
                /* Обычные скины */
                if (
                    (imginfo.pages[0].width <= maxwidth && !(imginfo.pages[0].width % 64)) && 
                    ((imginfo.pages[0].height <= maxheight && !(imginfo.pages[0].height % 32)) || 
                    (imginfo.pages[0].height <= maxwidth && !(imginfo.pages[0].height % 64))) && 
                    upfilesize < maxfilesize
                    ) {

                    let uploaded_file = await new Promise((resolve, reject) => {
                        fs.unlink(dirpath+upfilename, (err) => { });

                        fs.rename(uplfiles.file.path, dirpath+upfilename, (err) => { 
                            if (err) reject(err);
                            else resolve(dirpath+upfilename);
                        });

                    }).then((results) => { return results; })

        
                    if (uploaded_file) {

                        //console.log(uploaded_file)
                        //console.log(maxfilesize)
                        //console.log(maxwidth)
                        //console.log(maxheight)

                        jimp.read(uploaded_file, (err, head) => {
                            if (err) throw err;
                            fs.unlink(dirpath_heads+'head_'+upfilename, (err) => { });

                            head
                            .crop( 8, 8, 8, 8 )
                            .resize(80, 80, jimp.RESIZE_NEAREST_NEIGHBOR)
                            .write(dirpath_heads+'head_'+upfilename);
                        });
                        return {status: 'scin uploaded'};
                    }
                } else {
                    fs.unlink(dirpath+upfilename, (err) => { });
                    throw 'incorrect skin format';
                }
                /* Обычные скины - конец*/
            }

            if (multiple > 1) {
                /* HD скины */
                if (
                    (imginfo.pages[0].width <= maxwidth && !(imginfo.pages[0].width % 256)) && 
                    (imginfo.pages[0].height <= maxheight && !(imginfo.pages[0].height % 128)) && 
                    upfilesize < maxfilesize
                    ) {

                    let uploaded_file = await new Promise((resolve, reject) => {
                        fs.unlink(dirpath+upfilename, (err) => { });

                        fs.rename(uplfiles.file.path, dirpath+upfilename, (err) => { 
                            if (err) reject(err);
                            else resolve(dirpath+upfilename);
                        });

                    }).then((results) => { return results; })

        
                    if (uploaded_file) {

                        //console.log(uploaded_file)
                        //console.log(maxfilesize)
                        //console.log(maxwidth)
                        //console.log(maxheight)

                        jimp.read(uploaded_file, (err, head) => {
                            if (err) throw err;
                            fs.unlink(dirpath_heads+'head_'+upfilename, (err) => { });

                            head
                            .crop( 8*multiple, 8*multiple, 8*multiple, 8*multiple )
                            .resize(80, 80, jimp.RESIZE_NEAREST_NEIGHBOR)
                            .write(dirpath_heads+'head_'+upfilename);
                        });
                        return {status: 'scin uploaded'};
                    }
                } else {
                    fs.unlink(dirpath+upfilename, (err) => { });
                    throw 'incorrect hd skin format';
                }
                /* HD скины - конец*/
            }
        } else {
            throw 'incorrect file';
        }
    },

    async register(query) {
        query = JSON.parse(query.json);
        let username        = query.username;
        let password        = query.password;
        let re_password     = query.re_password;
        let email_address   = query.email_address;
        let reg_access = true;

        if (!username) { 
            reg_access = false;
            console.log(1)
        }

        if (!username.match('^[a-zA-Z0-9]{4,16}$')) { 
            reg_access = false;
            console.log(2)
        }

        if (!password) { 
            reg_access = false;
            console.log(3)
        }

        if (!password.match('(?=^.{12,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$')) { 
            reg_access = false;
            console.log(4)
        }

        if (!re_password) { 
            reg_access = false;
            console.log(5)
        }

        if (re_password != password) { 
            reg_access = false;
            console.log(6)
        }

        if (!email_address) { 
            reg_access = false;
            console.log(7)
        }

        if (!email_address.match('^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$')) { 
            reg_access = false;
            console.log(8)
        }

        if (!reg_access) {
            throw "bad register"
        } else {
            let result,sql_gdb;

            sql_gdb = `
                SELECT count(*) as count
                FROM mcr_users where login = '${username}'`;
            result = await mysqli.GDB_query(sql_gdb);
    
            if (result['count'] > 0) { throw "bad login" }

            sql_gdb = `
                SELECT count(*) as count
                FROM mcr_users where email = '${email_address}'`;
            result = await mysqli.GDB_query(sql_gdb);
    
            if (result['count'] > 0) { throw "bad email" }

            let hash_password;
            hash_password = crypto.createHash('md5').update(password).digest("hex");
            hash_password = crypto.createHash('md5').update(hash_password).digest("hex");
        
            let uuid = uuidv1();
            
            await mysqli.GDB_query(`
            INSERT INTO mcr_users 
            (gid, email, password, login, uuid, salt, tmp, is_skin, is_cloak, ip_create, ip_last, color, time_create, time_last, firstname, lastname, gender, birthday, ban_server, accessToken, serverID)
            VALUES ('2', '${email_address}', '${hash_password}', '${username}', '${uuid}', '0', '0', '0', '0', '127.0.0.1', '127.0.0.1', '0', '0', '0', '0', '0', '0', '0', '0', NULL, NULL);
            `);

            await mysqli.GDB_query(`
            INSERT INTO mcr_iconomy (username, balance, realmoney, bank, status) VALUES ('${username}', '0.00', '0.00', '0.00', '1');
            `);

            let token = await tokens.cToken(username, password);

            return token;
        }
    }

};










