const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');

import {init as global_init, initSidebar as global_initSidebar} from './index';


export default class profile {
    constructor(settings){
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_sidebar);
    }
    async init(object){
        Object.assign(this, object.response);
        let date = new Date();
        let head = `http://upload.solmics.ru/heads/head_${this.login}.png?tf=`+date.getMilliseconds();
        let dhead = `/img/head_default.png?tf=`+date.getMilliseconds();

        this.app.innerHTML = `
            <div class="mini_profile"> 
            <div class="minip_1">

                <div class="skin_rank">
                    <div class="mini_skin">
                        <div class="skin_head">
                            <img class="skin_head_img" src="${head}" onerror="this.src='${dhead}'" alt="">
                            <div class="ranknum">
                                <img src="img/rank.png" alt="Какой ранг">
                            </div>
                        </div>

                        <div class="rankbar">
                            <div class="ranklvl"></div>
                        </div>
                    </div>
                    <div class="nick">
                        <div class="wcm">
                            <div class="wlcm_mp">Привет</div>
                            <div class="ext_mp" data-action="user-logout" title = "Выход"><i class="fas fa-sign-out-alt" data-action="user-logout"></i></div>
                        </div>
                        <div title="???" class="nickname">${this.login}</div>
                    </div>
                </div>
                <br>
                <div class="balance_bar">
                    <div class="lc_balancenum">${this.realmoney}</div>
                    <div class="lc_balance" title="Solmics Point">SP</div>
                    <button class="fill_btn" type="submit" title="Пополнить">Пополнить</button>
                </div>
            </div>
            <div class="minip_2">

                <div class="mp_menu" data-module="lk">
                    <div class="mp_i" data-module="lk">
                        <i class="fas fa-user-alt" data-module="lk"></i>
                    </div>
                    <div class="mp_name" data-module="lk">Личный кабинет</div>
                </div>

                <div class="mp_menu" data-module="itemshop">
                    <div class="mp_i" data-module="itemshop">
                        <i class="fas fa-shopping-cart" data-module="itemshop"></i>
                    </div>
                    <div class="mp_name" data-module="itemshop">Магазин предметов</div>
                </div>

                <div class="mp_menu" data-module="vote">
                    <div class="mp_i" data-module="vote">
                        <i class="fas fa-gift" data-module="vote"></i>
                    </div>
                    <div class="mp_name" data-module="vote">Голосование</div>
                </div>

                <div class="mp_menu" data-module="support">
                    <div class="mp_i" data-module="support">
                        <i class="fas fa-headset" data-module="support"></i>
                    </div>
                    <div class="mp_name" data-module="support">Техническая поддержка</div>
                </div>
            </div>
        </div>
        `;
        document.getElementsByClassName('wcm')[0].addEventListener('click', async (e)=>{
            if (e.target.dataset['action'] == 'user-logout') {
        
                cook.delAll();
                global_initSidebar();
                global_init();
            }
        })

        document.getElementsByClassName('minip_2')[0].addEventListener('click', async (e)=>{
            if (e.target.dataset['module']) {
        
                window.location.hash = e.target.dataset['module'];
                global_initSidebar();
                global_init();
            }
        })


    }

    date_normal(date) {
        date = new Date(date);
        return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + `.` +
        ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + `.`+
        date.getFullYear() + ` `+
        (date.getHours()<10?`0`+date.getHours():date.getHours()) + `:`+
        (date.getMinutes()<10?`0`+date.getMinutes():date.getMinutes()) + `:`+
        (date.getSeconds()<10?`0`+date.getSeconds():date.getSeconds()) + `.`+
        (date.getMilliseconds()<10?`0`+date.getMilliseconds():date.getMilliseconds());
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
