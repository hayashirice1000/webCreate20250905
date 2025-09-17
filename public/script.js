document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
//　HTMLが完全に読み込まれた後に実行される
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // フォームのデフォルトの送信を防止

        const username = form.username.value;
        const password = form.password.value;

        
    });



});