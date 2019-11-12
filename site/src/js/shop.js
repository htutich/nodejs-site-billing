const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');


export default class shop {
    constructor(settings){
        this.settings       = settings;
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_id);
    }
    async init(target, action){
        this.access = await access.chechauthtoken(this.settings);

        let status = '';

        this.app.innerHTML = ` <div class="main_content"><p>${this.access.success}</p> shop</div>`;
    }

}
