const cook = require('./cookie');
const access = require('./access');


export default class itemshop {
    constructor(settings){
        this.settings       = settings;
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_id);
    }
    async init(target, action){
        this.access = await access.chechauthtoken(this.settings);

        let status = '';
        if (this.access.success) {
            status = 'Вы авторизованы, доступ разрешен.'
        } else {
            status = 'Авторизуйтесь, доступ запрещен'
        }
        this.app.innerHTML = ` 
		<div class="main_content"><p>${status}</p> itemshop</div>
        `;
    }
    async postData(data = {}) {
        return fetch(this.ajax_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'json='+JSON.stringify(data)
        })
        .then(response => response.json());
    }
}
