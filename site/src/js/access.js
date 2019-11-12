const cook = require('./cookie');

module.exports = {
    async chechauthtoken(settings){
        let data = {success: false}
        if (cook.get('id') && cook.get('token')) {
            data = await fetch(`${settings.ajax_url}user/${cook.get('id')}?token=${cook.get('token')}`).then(response => response.json());
        }
        return data;
    },
    
};
