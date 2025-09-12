document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // フォームのデフォルトの送信を防止

        cosnt username = form.username.value;
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