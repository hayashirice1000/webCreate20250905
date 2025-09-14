const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const db = new sqlite3.Database("app.db");

// ミドルウェア設定
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secret-key", // 実運用ではもっと強い秘密鍵を！
  resave: false,
  saveUninitialized: true
}));

// DB初期化（最初に一度だけ実行）
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});

// サインアップフォーム
app.get("/signup", (req, res) => {
  res.send(`
    <form method="POST" action="/signup">
      <input type="text" name="username" placeholder="ユーザー名" required><br>
      <input type="password" name="password" placeholder="パスワード" required><br>
      <button type="submit">登録</button>
    </form>
  `);
});

// サインアップ処理
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPw = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPw], (err) => {
    if (err) return res.send("このユーザー名は使えません。");
    res.send("登録成功！<a href='/login'>ログインへ</a>");
  });
});

// ログインフォーム
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="ユーザー名" required><br>
      <input type="password" name="password" placeholder="パスワード" required><br>
      <button type="submit">ログイン</button>
    </form>
    <a href="/signup">新規登録</a>
  `);
});

// ログイン処理
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user) return res.send("ユーザーが存在しません。");
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.username = username;
      res.redirect("/welcome");
    } else {
      res.send("パスワードが間違っています。");
    }
  });
});

// ログイン後ページ
app.get("/welcome", (req, res) => {
  if (!req.session.username) return res.redirect("/login");
  res.send(`ようこそ ${req.session.username} さん！`);
});

// サーバー起動
app.listen(3000, () => {
  console.log("http://localhost:3000 でサーバー起動中");
});
