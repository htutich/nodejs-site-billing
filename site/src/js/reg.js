const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');

import {init as global_init, initSidebar as global_initSidebar} from './index';

export default class reg {
    constructor(settings){

        this.ajax_url       = settings.ajax_url+'user/new/register';
        this.app            = document.getElementById(settings.app_id);

    }
    async init(target, action){
        this.app.innerHTML = `
            <div class="reg_page">
                <div class="reg_header">
                    <div class="reg_icon"><i class="fas fa-address-card"></i></div>
                    <div class="reg_name">Регистрация</div>
                </div>
            
                <div class="reg_artc">
                    Регистрация необходима для создания аккаунта, с помощью которого будет осуществляться вход в лаунчер и на наши серверы. 
                </div>

                <div class="reg_error" id="reg_error">
                    <div class="reg_h">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div class="err_reg">Неверные данные</div>
                    </div>
                    <div class="reg_article" id="reg_article">
                    </div>
                </div>

                <div class="reg_form">
                    <label class="rg_form_name" for="username">Никнейм пользователя
                        <br>
                        <span class="rg_fn">От 4 до 16 символов.</span>
                    </label>
                    <input class="rg_form_value" placeholder="Например: Example" type="text" name="username" id="username">
                </div>
                <div class="reg_form">
                    <label class="rg_form_name" for="password">Пароль
                        <br>
                        <span class="rg_fn">Не менее 8 символов, а так-же буквы нижнего и верхнего регистров.</span>
                    </label>
                    <input class="rg_form_value" placeholder="********" type="password" name="password" id="password">
                </div>
                <div class="reg_form">
                    <label class="rg_form_name" for="re_password">Повторите пароль
                        <br>
                        <span class="rg_fn">Убедитесь, что не допустили ошибку.</span>
                    </label>
                    <input class="rg_form_value" placeholder="********" type="password" name="re_password" id="re_password">
                </div>
                <div class="reg_form">
                    <label class="rg_form_name" for="email_address">Ваш E-Mail
                        <br>
                        <span class="rg_fn">Пожалуйста укажите действительный Email адрес!</span>
                    </label>
                    <input class="rg_form_value" placeholder="example@solmics.ru" type="email" name="email_address" id="email_address">
                </div>
                <div class="reg_form">
                    <button class="regi_btn" id="regi_btn" type="button" title="Зарегистрировать аккаунт">Зарегистрировать аккаунт<i class="fas fa-angle-double-right"></i></button>
                </div>
            </div>
        `;

        document.getElementById('regi_btn').addEventListener('click', async (e) => {

            let username        = document.getElementById('username').value;
            let password        = document.getElementById('password').value;
            let re_password     = document.getElementById('re_password').value;
            let email_address   = document.getElementById('email_address').value;

            let message = '';
            let reg_access = true;

            if (!username) { 
                reg_access = false;
                message += `<div class="reg_er">Укажите никнейм!</div>`;
            }

            if (!username.match('^[a-zA-Z0-9]{4,16}$')) { 
                reg_access = false;
                message += `<div class="reg_er">Длина никнейма должна быть от 4 до 16 символов(без спец. символов)!</div>`;
            }

            if (!password) { 
                reg_access = false;
                message += `<div class="reg_er">Укажите пароль!</div>`;
            }

            if (!password.match('(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$')) { 
                reg_access = false;
                message += `<div class="reg_er">Слабый пароль!</div>`;
            }

            if (!re_password) { 
                reg_access = false;
                message += `<div class="reg_er">Повторите пароль!</div>`;
            }

            if (re_password != password) { 
                reg_access = false;
                message += `<div class="reg_er">Пароли не совпадают!</div>`;
            }

            if (!email_address) { 
                reg_access = false;
                message += `<div class="reg_er">Укажите E-mail адрес!</div>`;
            }

            if (!email_address.match('^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$')) { 
                reg_access = false;
                message += `<div class="reg_er">Неверный формат E-mail адреса!</div>`;
            }

            if (!reg_access) {
                document.getElementById('reg_article').innerHTML = message;
                document.getElementById('reg_error').style.height = 'auto';
                document.getElementById('reg_error').style.opacity = '1';
                document.getElementById('reg_error').style.padding = '20px 70px';
            } else {
                document.getElementById('reg_error').style.height = '0';
                document.getElementById('reg_error').style.opacity = '0';
                document.getElementById('reg_error').style.padding = '0';
                let data = {
                    'username': username,
                    'password': password,
                    're_password': re_password,
                    'email_address': email_address
                }

                let result = await this.postData(data);
                if (result.success) {
                    cook.set('id', result.response.id)
                    cook.set('token', result.response.token)
    
                    global_initSidebar();
                    global_init();   
                } else {
                    if (result.message == 'bad login') {
                        document.getElementById('reg_article').innerHTML = '<div class="reg_er">Никнейм занят, выберите другой!</div>';
                        document.getElementById('reg_error').style.height = 'auto';
                        document.getElementById('reg_error').style.opacity = '1';
                        document.getElementById('reg_error').style.padding = '20px 70px';
                    }
                    if (result.message == 'bad email') {
                        document.getElementById('reg_article').innerHTML = '<div class="reg_er">E-mail занят, выберите другой!</div>';
                        document.getElementById('reg_error').style.height = 'auto';
                        document.getElementById('reg_error').style.opacity = '1';
                        document.getElementById('reg_error').style.padding = '20px 70px';
                    }
                    if (result.message == 'bad register') {
                        document.getElementById('reg_article').innerHTML = '<div class="reg_er">Ошибка регистрации, попробуйте ввести другие данные!</div>';
                        document.getElementById('reg_error').style.height = 'auto';
                        document.getElementById('reg_error').style.opacity = '1';
                        document.getElementById('reg_error').style.padding = '20px 70px';
                    }
                }
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
