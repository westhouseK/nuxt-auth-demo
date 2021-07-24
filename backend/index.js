const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express().use(express.json()).use(cors()) // jsonをパースする, cros対応する
const port = 5000
const saltRounds = 10

const db = new sqlite3.Database('./database/database.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});


// GET 
//最初のテスト
app.get('/', (request, response) => response.send('Hello World!!'))
// JWTの生成確認のテスト
app.get('/jwttest', (req, res) => {
  const token = jwt.sign('jwttest','secret')
  return res.json({token})
})
// JWTが一致するかのテスト
app.get('/api/auth/user/',(req,res) => {

  // デバッグ用
  // const headers = req.headers
  // return console.log(headers)

  const bearToken = req.headers['authorization']
  const bearer = bearToken.split(' ')
  const token = bearer[1]

  jwt.verify(token,'secret',(err,user) => {
    if(err){
      return res.sendStatus(403)
    }else{
      return res.json({
            user
          });
    }
  })
})
// ユーザを取得できるかのテスト
app.get("/api/users", (req, res, next) => {
  
  const sql = "select * from users"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ "error": err.message })
    }
    return res.json({
      "message": "success",
      "data": rows
    })
  })
})

// POST
// ユーザの登録
app.post('/api/auth/register/', (req, res) => {

  const insert = 'INSERT INTO USERS (name, email, password) VALUES (?,?,?)'
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    db.run(insert, [req.body.name,req.body.email,hash],(err) => {
      if (err) {
        return res.status(400).json({"error":err.message});
      }
      return res.json({
        "message": "create User successfully",
        "data": [req.body.name, req.body.email]
      })
    })
  })
})

// ログイン機能
app.post('/api/auth/login/',(req,res) => {

  // デバック用
  // return console.log(req.body)
  
  const sql = 'select * from users where email = ?'
  const params = [req.body.email]
  db.get(sql, params, (err, user) => {
    if (err) {
      return res.status(400).json({"error":err.message});
    }
    if(!user){
      return res.json({"message": "email not found"})
    }
    bcrypt.compare(req.body.password, user.password, (err,result) => {
      if (err) {
        return res.status(400).json({"error":err.message});
      }
      if (!result) {
        return res.json({"message" : "password is not correct"})
      }
      // return res.json({"message" : "password is correct"})
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email
      }

      const token = jwt.sign(payload,'secret')
      // 暗号方式を変更したい場合
      // const token = jwt.sign(payload, 'secret, { algorithm: "RS256" }')
      // トークンに時間制限をしたい場合
      // const token = jwt.sign({
      //   exp: Math.floor(Date.now() / 1000) + (60 * 60),
      //   id: user.id
      // }, 'secret');
      
      return res.json({token})
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))