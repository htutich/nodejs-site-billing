const mysqli = require(`../mysqli`);

let  workerStore = {};
const getTypeId = (type) => ({
    2: 'user',
    3: 'admin'
})[type] || 0;

module.exports = async (token) => {
    if (workerStore[token] != undefined) {
        for (let i in workerStore[token]) {
            this[i] = workerStore[token][i];
        }
        return this;
    }
    workerStore[token] = this;
    let res = await mysqli.GDB_query(
        `SELECT count(*) as count, user_fk, mcr_users.gid as group_id 
        FROM mcr_users_tokens 
        Left join mcr_users ON mcr_users.id = mcr_users_tokens.user_fk 
        where token = '${token}' AND is_active = '1'`
    );

    if (res.count != 1) { throw `invalid token`; }
    this.id = ~~res.user_fk;
    this.type_id = ~~res.group_id;
    this.type = getTypeId(this.type_id);

    this.isEqual = (any_entity) => {
        return (~~this.type_id == ~~any_entity.type_id) && (~~this.id == ~~any_entity.id) && (~~any_entity.group_id == ~~any_entity.type_id);
    };
    this.isUser = () => {
        return this.type == `user`;
    };
    this.isAdmin = () => {
        return this.type == `admin`;
    };
    return this;
};
