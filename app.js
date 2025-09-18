  const express = require("express");// Expressフレームワーク
  const session = require("express-session");// セッション管理
  const sqlite3 = require("sqlite3").verbose();// SQLite3データベース
  const bcrypt = require("bcrypt");// パスワードハッシュ化
  const path = require("path");// パス操作

  const app = express();// Expressアプリケーション
  app.set("view engine", "ejs");// EJSテンプレートエンジン設定
  app.set("views", path.join(__dirname, "views"));// ビューフォルダ設定

  const db = new sqlite3.Database("app.db");// SQLiteデータベースファイル

  // ミドルウェア設定
  app.use(express.urlencoded({ extended: true }));// フォームデータのパース
  app.use(session({// セッション設定
    secret: "secret-key", // Renderを使用するのがよさそう。
    resave: false,// セッションを常に保存しない
    saveUninitialized: true// 未初期化セッションを保存
  }));

  // DB初期化（最初に一度だけ実行）
  db.serialize(() => {// usersテーブル作成
    // id, username, passwordカラム
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
  });

  // サインアップフォーム
  app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
  });

  // サインアップ処理
  app.post("/signup", async (req, res) => { // 非同期関数
    const { username, password } = req.body; // フォームデータ取得
    const hashedPw = await bcrypt.hash(password, 10);// パスワードハッシュ化

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPw], (err) => { // ユーザー登録
      if (err) return res.send("このユーザー名は使えません。"); // エラー処理
      res.send("登録成功！<a href='/login'>ログインへ</a>"); // 成功メッセージ
    });// DB操作終了
  });// サインアップ処理終了


  // ログインフォーム
  app.get("/login", (req, res) => {
    res.render("login", { error: null });
  });

  // ログイン処理
  app.post("/login", (req, res) => { // フォームデータ取得 
    const { username, password } = req.body; // ユーザー名とパスワード

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => { // ユーザー検索
      if (!user) return res.render("login", { error: "ユーザー名またはパスワードが違います" }); // ユーザーが見つからない場合
      const match = await bcrypt.compare(password, user.password); // パスワード照合
      if (match) { // パスワードが一致した場合
        req.session.username = username; // セッションにユーザー名保存
        res.redirect("/welcome"); // ログイン後ページへリダイレクト
      } else { // パスワードが一致しない場合
        // res.send("パスワードが間違っています。");
        res.render("login", { error: "パスワードが間違っています。" }); // ログインページへリダイレクト
      }// 照合終了
    });// DB操作終了
  });// ログイン処理終了

  // ログイン後ページ
  app.get("/welcome", (req, res) => {
    if (!req.session.username) return res.redirect("/login");
    res.render("welcome", { username: req.session.username });
  });



  // 参考: bcryptの非同期処理に注意
  // 参考: 実運用ではCSRF対策やセキュリティ強化が必要


  // サーバー起動
  const PORT = process.env.PORT || 3000; // ポート設定
  app.listen(PORT, () => { // ポート3000で起動
    console.log("http://localhost:3000 でサーバー起動中"); // 起動メッセージ
  }); // サーバー起動終了
