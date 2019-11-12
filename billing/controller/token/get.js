var crypto = require(`crypto`);
const mysqli = require(`../../mysqli`);

module.exports = {
    async main(query/*, target*/) {
        let data = query.password;
        return createToken(query.login, query.password);
    },
    async cToken(login, password){
        return createToken(login, password);
    }

};

var getUserByAuth = async (login, password) => {

    let hash_password;
    hash_password = crypto.createHash('md5').update(password).digest("hex");
    hash_password = crypto.createHash('md5').update(hash_password).digest("hex");

    let sql_gdb = `
        SELECT 
        id,
        count(*) as count,
        gid as group_id
        FROM mcr_users where login = '${login}' AND password = '${hash_password}'
    `;
    result = await mysqli.GDB_query(sql_gdb);

    return result;
};


const createToken = async (login = undefined, password = undefined, type = undefined, code = undefined) => {

    if (login == undefined) throw `need login`;
    if (password == undefined) throw `need password`;

    let user;

    user = await getUserByAuth(login, password);
    if (user.count != 1) {
        throw `unknown user`;
    }
    if (user.group_id == 0) {
        throw `user is blocked`;
    }


    let hash = crypto.createHash(`sha256`).update(Math.random() + new Date().toLocaleString() + user.id).digest(`hex`);
    
    await mysqli.GDB_query(
        `UPDATE mcr_users_tokens SET is_active = 0 WHERE user_fk = '${user.id}'`
    );

    await mysqli.GDB_query(
        `INSERT INTO mcr_users_tokens (user_fk, token, group_id) VALUES ('${user.id}', '${hash}', '${user.group_id}')`
    );

    await mysqli.GDB_query(
        `UPDATE mcr_users SET time_last = now() WHERE id = '${user.id}'`
    );

    delete user.group_id;
    delete user.count;
    user.token = hash;
    return await user;
};
