from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# 学習用の簡易ユーザー情報（本番ではDBで管理）
USERS = {
    "admin": "1234",
    "user1": "abcd"
}

@app.route("/", methods=["GET", "POST"])
def login():
    error = ""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if username in USERS and USERS[username] == password:
            return redirect(url_for("welcome", username=username))
        else:
            error = "ユーザー名かパスワードが間違っています。"
    return render_template("login.html", error=error)

@app.route("/welcome/<username>")
def welcome(username):
    return render_template("welcome.html", username=username)

if __name__ == "__main__":
    app.run(debug=True)
