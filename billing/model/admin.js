const mysqli = require(`../mysqli`);

const Admin = async (user_id) => {
    this.id = ~~user_id;
    this.type = `admin`;
    this.type_id = 3;
    
    this.update = async () => {
        let res = await mysqli.GDB_query(getInfo(this.id));
        Object.assign(this, res);
        let res_perms = await mysqli.GDB_query(getPerms(this.id));
        Object.assign(this, res_perms);
        let res_rank = await mysqli.GDB_query(getPermsRank(this.id));
        Object.assign(this, res_rank);
    }
    await this.update();

    this.getID          = () => { return this.id;}
    this.getGroupID     = () => { return this.group_id;}
    this.getEmail       = () => { return this.email;}
    this.getUUID        = () => { return this.uuid;}
    this.getLogin       = () => { return this.login;}
    this.getTimeLast    = () => { return this.time_last;}
    this.getBalance     = () => { return this.realmoney;}
    this.getPerm        = () => { return this.permission;}
    this.getPermExpiry  = () => { return this.expiry;}
    this.getPermRank    = () => { return this.rank;}


    return this;
}

const getInfo = (uid) =>
    `   SELECT
            mcr_users.id,
            gid as group_id,
            email,
            mcr_users.uuid,
            login,
            time_last,
            mcr_iconomy.realmoney as realmoney
        FROM
            mcr_users
            LEFT JOIN mcr_iconomy ON mcr_iconomy.username = mcr_users.login
            LEFT JOIN luckperms_user_permissions lpup ON lpup.uuid = mcr_users.uuid
        WHERE
            mcr_users.id = ${uid}
    `;
    const getPerms = (uid) =>
    `   SELECT
            lpgp.permission as lpgpp,
            lpup.permission as permission,
            lpup.expiry
        FROM
            mcr_users
            LEFT JOIN luckperms_user_permissions lpup ON lpup.uuid = mcr_users.uuid
            LEFT JOIN luckperms_group_permissions lpgp ON CONCAT('group.',lpgp.name) = lpup.permission
        WHERE
            mcr_users.id = ${uid} 
            AND lpup.permission LIKE "group.%" 
            AND lpup.permission NOT LIKE "group.rank_%" 
            AND lpgp.permission LIKE "weight.%"
        order by lpgpp desc
        LIMIT 1
    `;
    const getPermsRank = (uid) =>
    `   SELECT
            permission as rank
        FROM
            mcr_users
            LEFT JOIN luckperms_user_permissions lpup ON lpup.uuid = mcr_users.uuid
        WHERE
            mcr_users.id = ${uid} AND permission LIKE "group.rank_%"
    `;

module.exports = Admin;