var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.listen('1997');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

app.get('/',(req,res)=>{
  res.render('start');
});

app.get('/:name',(req,res)=>{
  res.render(req.params.name);
});

app.post('/login',urlencodedParser,(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;

  con.query(`SELECT PASSWORD FROM data WHERE USERNAME = '${username}'`, (err,result)=>{
    if(err) throw err;
    bcrypt.compare(password, result[0].PASSWORD, function(err, rep) {
      if(rep){res.render('message',{message: "Logged in successfully."});}
      else{res.render('message',{message: "Wrong data, try again."});}
    });
  });

});

app.post('/signup',urlencodedParser,(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;

    con.query(`SELECT USERNAME FROM data WHERE USERNAME = '${username}'`, (err, result)=> {
      if (err) throw err;
      if(result.length == 0){
        bcrypt.hash(password, 10, function(err, hash) {
          con.query(`INSERT INTO data SET ?` , {USERNAME: username, PASSWORD: hash}, (err,result)=>{
            if(err) throw err;
            else{res.render('message',{message: "Signed up successfully"});}
          });
        });
      }
      else{
        res.render('message',{message: "USERNAME ALREADY TAKEN!"});
      }
    });


});
