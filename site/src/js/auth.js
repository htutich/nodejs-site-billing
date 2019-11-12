
const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');

import {init as global_init, initSidebar as global_initSidebar} from './index';



export default class auth {
    constructor(settings){
        this.settings       = settings;
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_sidebar);
    }
    async init(){

        this.app.innerHTML = `
            <div class="auth_module">
                <div class="auth_buttons">
                    <div class="reg_btns">ВОЙТИ</div>
                    <div class="reg_btns reg_btn" data-module="register">РЕГИСТРАЦИЯ</div>
                </div>
                <div class="auth">
                    <input type="text" placeholder="Логин" class="auth_form" id="auth_form_login">
                    <input type="password" placeholder="Пароль" class="auth_form" id="auth_form_password">
                    <br>
                    <div class="auth_btn">
                        <div class="fgt_pass">Забыли пароль?</div>
                        <button class="login_btn" title="Войти" data-action="user-login">Войти</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementsByClassName('auth_module')[0].addEventListener('click', async (e)=>{
            if (e.target.dataset['action'] == 'user-login') {
        
                let login = document.getElementById('auth_form_login').value;
                let password = document.getElementById('auth_form_password').value;
                let data = await fetch(`${this.settings.ajax_url}token?login=${login}&password=${password}`).then(response => response.json());
                if (data.success) {
                    cook.set('id', data.response.id)
                    cook.set('token', data.response.token)
        
                    let status = await access.chechauthtoken(this.settings)
        
                    if (status.success == false) {
                        cook.delAll();
                        if (status.message == 'access denied') { notify.set('Ошибка!', 'Доступ запрещен!'); }
                    }
                    global_initSidebar();
                    global_init();    
                } else {
                    notify.set('Ошибка!', 'Неверный логин/пароль');
                }
        
            }
            if (e.target.dataset['module'] == 'register') {
                window.location.hash = e.target.dataset['module'];
                global_initSidebar();
                global_init();    
            }

        })


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
