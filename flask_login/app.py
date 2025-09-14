# Flaskアプリケーションのインスタンスを作成
from flask import Flask, render_template, request, redirect, url_for

# Flaskアプリケーションのインスタンスを作成
app = Flask(__name__)

# 学習用の簡易ユーザー情報（本番ではDBで管理）
USERS = { # ユーザー名とパスワードの辞書    
    "admin": "1234", 
    "user1": "abcd"
}
# ルートURLに対するルーティング
@app.route("/", methods=["GET", "POST"]) # GETとPOSTメソッドを許可
def login():# ログインページの表示と処理
    error = ""# エラーメッセージの初期化
    if request.method == "POST":# フォームが送信された場合
        username = request.form["username"]# フォームからユーザー名を取得
        password = request.form["password"]# フォームからパスワードを取得
         # ユーザー名とパスワードの検証
        if username in USERS and USERS[username] == password:
            # ログイン成功時はウェルカムページへリダイレクト
            return redirect(url_for("welcome", username=username))
        else:
            error = "ユーザー名かパスワードが間違っています。"
    # ログインページの表示
    return render_template("login.html", error=error)
# ウェルカムページのルーティング
@app.route("/welcome/<username>")
def welcome(username):
    # ウェルカムページの表示
    return render_template("welcome.html", username=username)
# アプリケーションのエントリーポイント
if __name__ == "__main__":
    # デバッグモードでアプリケーションを起動
    app.run(debug=True)
