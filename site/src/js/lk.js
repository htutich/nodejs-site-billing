const cook = require('./cookie');
const access = require('./access');
const notify = require('./notify');

import {init as global_init, initSidebar as global_initSidebar} from './index';


export default class lk {
    constructor(settings){
        this.settings       = settings;
        this.ajax_url       = settings.ajax_url;
        this.app            = document.getElementById(settings.app_id);
    }
    async init(target, action){
        this.access = await access.chechauthtoken(this.settings);

        if (this.access.success) {
            this.app.innerHTML = ` <input type="file" name="upload" multiple="multiple" id="uploadfile"style="background-color: chartreuse;">`;

            document.getElementById('uploadfile').addEventListener('change', async () => {
                var uploadfile = document.getElementById('uploadfile').files[0];
                var formData = new FormData();
        
                formData.append("file", uploadfile);
                let aurl = this.ajax_url+`user/${cook.get('id')}/upload?token=${cook.get('token')}`;
                
                var send = await this.postDataFile(formData, aurl);
                //console.log(send.success)
                if (send.success == false) {
                    if (send.message == 'incorrect skin format') { notify.set('Ошибка!', 'Неверный формат скина!'); }
                    if (send.message == 'incorrect hd skin format') { notify.set('Ошибка!', 'Неверный формат hd скина!'); }
                    if (send.message == 'incorrect file') { notify.set('Ошибка!', 'Неверный тип файла!'); }
                    if (send.message == 'undefined file') { notify.set('Ошибка!', 'Выберите файл для загрузки!'); }
                    if (send.message == 'hd access denied') { notify.set('Ошибка!', 'Вы не можете установить HD скин!'); }
                    if (send.message == 'access denied') { notify.set('Ошибка!', 'Доступ запрещен!'); }
                } else {
                  global_initSidebar();
                  global_init();
                }
            })

        } else {
            this.app.innerHTML = `main`;
        }
    }
    async postDataFile(data,ajax_url = this.ajax_url) {

        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("POST", ajax_url);

            request.onload = function () {
              if (this.status >= 200 && this.status < 300) {
                resolve(request.response);
              } else {
                reject({
                  status: this.status,
                  statusText: request.statusText
                });
              }
            };
            request.send(data);
  
          }).then(response => JSON.parse(response));

    }
}
