
import main from "./main.js";
import reg from "./reg.js";
import wiki from "./wiki.js";
import rules from "./rules.js";
import servers from "./servers.js";
import shop from "./shop.js";
import lk from "./lk.js";
import itemshop from "./itemshop.js";
import vote from "./vote.js";

import auth from "./auth.js";
import profile from "./profile.js";

const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');

const settings = {
    ajax_url        :   'http://'+window.location.hostname+':3000/',
    app_id          :   'app',
    app_sidebar     :   'app_sidebar'
}

const model = {
    main: new main(settings),
    register: new reg(settings),
    wiki: new wiki(settings),
    rules: new rules(settings),
    servers: new servers(settings),
    shop: new shop(settings),
    lk: new lk(settings),
    itemshop: new itemshop(settings),
    vote: new vote(settings)
}

const noauthblock = {
    lk: new lk(settings),
    itemshop: new itemshop(settings)
}
const authblock = {
    register: new reg(settings)
}

const model_sidebar = {
    auth: new auth(settings),
    profile: new profile(settings)
}

export async function init() {
    var [module, action, target] = window.location.href.replace(window.location.origin, '').replace('#', '').split(`/`).splice(1, 3);

    if (model[module] == undefined){
        module = 'main';
        window.location.hash = module;
    }

    let status = await access.chechauthtoken(settings);

    if (status.success == false) {
        cook.delAll();
    }

    if (status.success) {
        if (authblock[module]){
            module = 'main';
            window.location.hash = module;
        }
    } else { 
        if (noauthblock[module]){
            module = 'main';
            window.location.hash = module;
        }
    }

    for(let i in document.getElementsByClassName('menu_list')){
        let item = document.getElementsByClassName('menu_list')[i]
        if (item.className != undefined) {
            if ((item.className == 'menu_list menu_active') && (item.dataset['module'] != module)) {
                item.className = 'menu_list';
            }
            if ((item.className != 'menu_list menu_active') && item.dataset['module'] == module) {
                item.className = 'menu_list menu_active';
            }
        }
    }

    for(let i in document.getElementsByClassName('mp_menu')){
        let item = document.getElementsByClassName('mp_menu')[i]
        if (item.className != undefined) {
            if ((item.className == 'mp_menu mp_menu_active') && (item.dataset['module'] != module)) {
                item.className = 'mp_menu';
            }
            if ((item.className != 'mp_menu mp_menu_active') && item.dataset['module'] == module) {
                item.className = 'mp_menu mp_menu_active';
            }
        }
    }

    model[module].init(target?target:'show', action?action:'main');
     
}

export async function initSidebar(){
    let status = await access.chechauthtoken(settings)

    if (status.success) {
        model_sidebar['profile'].init(status);
    } else {
        model_sidebar['auth'].init();
    }
}

initSidebar();
init();

document.getElementsByClassName('menu')[0].addEventListener('click', async (e)=>{
    if (e.target.dataset['module']) {
        window.location.hash = e.target.dataset['module'];
        initSidebar();
        init();
    }
})
