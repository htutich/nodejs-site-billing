
export default class rules {
    constructor(settings){
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_id);
        this.token          = settings.token;
    }
    async init(target, action){
        this.app.innerHTML = `
        <div class="main_content">rules</div>
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
