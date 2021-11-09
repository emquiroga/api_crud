const express = require('express');
const mysql = require('mysql');

const PORT = process.env.PORT || 9500;

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());

//Heroku connection
const connection = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b3be6737765176',
    password: '3ba2ec56',
    database: 'heroku_3bc0c18972b169d',
    port: 3306
});

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, results) => {
        if (err) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No users found')
        }
})
})

app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(sql, (err, results) => {
        if (err) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No users found')
        }
})
})
app.post('/add', (req,res) => {
    const sql = `INSERT INTO users SET ?`;
    const userObj = {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password
    }
    connection.query(sql, userObj, err => {
        if (err) throw err;
        res.send('User added');
    });
});
app.put('/update/:id', (req, res) => {
    const {id} = req.params;
    const {user_name, email, password} = req.body;
    const sql = `UPDATE users SET user_name = '${user_name}', email = '${email}', password = '${password}' WHERE id = ${id}`;
    connection.query(sql, err => {
        if (err) throw err;
        res.send('User updated');
    });
})
app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM users WHERE id = ${id}`;
    connection.query(sql, err => {
        if (err) throw err;
        res.send('User deleted successfully');
    });
})
//Check connection
connection.connect(error => {
    if (error) throw error;
    console.log('Connected to database');
});

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});