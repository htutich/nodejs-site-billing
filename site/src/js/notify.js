module.exports = {
    set(header, text){
        document.getElementById('notify-block').insertAdjacentHTML('afterbegin', `
            <div class="notifycation">
                <div class="nhead"><b>${header}</b> ${text}</div>
            </div>
        `);
        setTimeout(rem, 2000);
    },
    modal(head, text){

        if (document.getElementById('notifycation_modal')) {
            document.getElementById('notifycation_modal').remove();
        }

        document.body.insertAdjacentHTML('beforeend', `
            <div class="notifycation_modal" id="notifycation_modal">
                <div class="mclose" data-modal="close"><i class="fas fa-window-close" data-modal="close"></i></div>
                <div class="nhead">${head}</div>
                <div class="nbody">${text}</div>
            </div>
        `);

        document.getElementById('notifycation_modal').addEventListener('click', (e)=>{
            if (e.target.dataset['modal'] == 'close') { document.getElementById('notifycation_modal').remove(); }
        })

    }
};

function rem(){
    document.getElementsByClassName('notifycation')[document.getElementsByClassName('notifycation').length-1].remove();
}