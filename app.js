var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack-login'
app.use(cors())


const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

  
app.post('/signup', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            
            'INSERT INTO users (email, password, fname, lname, stunum, phone, faculty, branch) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.body.email,hash, req.body.fname, req.body.lname, req.body.stunum ,req.body.phone ,req.body.faculty ,req.body.branch],
            function(err, results, fields) {
             if(err){
                res.json({status:'error',massage: err})
                return
             } 
             res.json({status:'ok'})
            }
        );
    });
    
    
})



app.post('/signin', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
            if(err){res.json({status:'error',massage: err}); return  }
            if (users.length ==0) {res.json({status:'error',massage: 'no user found'}); return  }
            console.log(users);
            if (users[0].role == 'admin'){res.json({status:'error',massage: err}); return  }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
                if (isLogin){
                    var token = jwt.sign({ email: users[0].email }, secret ,{ expiresIn: '1h' });
                    res.json({status:'ok', massage:'login success',token })
                } else {
                    res.json({status:'errrr', massage:'login failed'})
                }
                
            });
          
        }
    );
})


app.post('/signin/admin', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
            if(err){res.json({status:'error',massage: err}); return  }
            if (users.length ==0) {res.json({status:'error',massage: 'no user found'}); return  }
            console.log(users);
            if (users[0].role != 'admin'){res.json({status:'error',massage: err}); return  }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
                if (isLogin){
                    var token = jwt.sign({ email: users[0].email }, secret ,{ expiresIn: '1h' });
                    res.json({status:'ok', massage:'login success',token })
                } else {
                    res.json({status:'errrr', massage:'login failed'})
                }
                
            });
          
        }
    );
})

app.post('/authen', jsonParser, function (req, res, next) {
    try
    {
        const token = req.headers.authorization.split(' ')[1]
         var decoded = jwt.verify(token, secret);
         res.json({status:'ok',decoded })
        } catch(err) {
        res.json({status:'error', massage : err.massage})
    }
    
})

app.listen(3333,  function () {
  console.log('CORS-enabled web server listening on port 3333')
})