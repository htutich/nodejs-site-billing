module.exports = {
    selfRight(worker, target) {
        if (worker.type == target.type && worker.id == target.id) {
            return true;
        }
        return false;
    },
    isEnoughParameters(get_data, params) {
        let result = [];
        params.forEach(field => {
            if (get_data[field] == undefined) throw `need ${field}`;
            result.push(get_data[field]);
        });
        return result;
    }
};
