
export default class wiki {
    constructor(settings){
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_id);
    }
    async init(target, action){
        this.app.innerHTML = `
        <div class="main_content">wiki</div>
        `;
    }

}
