/* eslint-disable no-console */
const http = require(`http`);
const url = require(`url`);
const post = require(`querystring`);
const formidable = require("formidable");

const fail = resp => new Object({ success: false, message: resp });
const success = resp => new Object({ success: true, response: resp });


const model = {
    token: require(`./controller/token/token`),
    user: require(`./controller/user/user`),
    ticket: require(`./controller/ticket/ticket`),
}

http
    .createServer(async function (req, res) {
            console.time(`e`);
            const parts = url.parse(req.url, true);
            const query = parts.query;
            var [module, target, action] = parts.pathname.split(`/`).splice(1, 3);
            if (action == undefined) action = `main`;
            if (module == `help`) return writeHelp(res);
            if (model[module] == undefined) return sendResponse(fail(`module not found`), res);
            if (model[module][req.method] == undefined) return sendResponse(fail(`method not found`), res);
            if (model[module][req.method][action] == undefined) return sendResponse(fail(`action not found`), res);
            
            
            let form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.maxFieldsSize = 2 * 1024 * 1024;

            form.uploadDir = "../upload_temp";
            let upfile =  new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve(files); 
                });
            }).then(async results => await results )
            
            var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

            let body = ``;
            req
                .on(`data`, chunk => { body += chunk.toString(); })
                .on(`end`, () => {
                    Object.assign(query, post.parse(body));
                    query.ip = ip;
                    model[module][req.method][action](query, target, upfile)
                        .then(async response => {
                            if (response.result) {
                                return unitpayResponse(await response, res)
                            } else {
                                return sendResponse(success(await response), res)

                            }
                        })
                        .catch(err => sendResponse(fail(err.toString()), res));
                });

            

    
            console.log(`\n` + module + ` ` + action);
            console.timeEnd(`e`);
        

    })
    .listen(3000);

var sendResponse = function (object, res) {
    res.setHeader(`Content-Type`, `application/json; charset=UTF-8`);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`Access-Control-Allow-Methods`, `*`);
    let resp = JSON.stringify(object, null, 2);
    res.write(resp);
    res.end();
    return true;
};

var unitpayResponse = function (object, res) {
    res.setHeader(`Content-Type`, `application/json; charset=UTF-8`);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`Access-Control-Allow-Methods`, `*`);
    let resp = JSON.stringify(object, null, 2);
    res.write(resp);
    res.end();
    return true;
};



const writeHelp = (res) => {
    let help_list = ``;
    let models = model;
    for (let model in models) {
        help_list += `<h1>${model}</h1>`;
        for (let method in models[model]) {
            help_list += `<h2>${method}</h2>`;
            for (let action in models[model][method]) {
                if (action == `main`) {
                    action = ``;
                }
                help_list += `<div>${model}/@id/${action}</div>`;
            }
        }
        help_list += `<hr>`;
    }
    res.write(help_list);
    res.end();
};
