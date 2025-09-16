document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
//　HTMLが完全に読み込まれた後に実行される
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // フォームのデフォルトの送信を防止

        const username = form.username.value;
        const password = form.password.value;

        // 簡単なバリデーション
        if (username === 'admin' && password === '1234') {
            alert('ログイン成功!');
            window.location.href = 'firsthtml.html'; // ログイン成功後のリダイレクト先
        } else {
            alert('ユーザー名またはパスワードが間違っています。');
        };
    });



});