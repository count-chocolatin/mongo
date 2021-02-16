const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User =  require('./user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, 'public')));


mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://manuel:manuel123@cluster0.tcdf5.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true
})

.then(db =>console.log('DB is connected'))
.catch(er => console.error(err));


app.post('/register', (req, res) =>{
    const {username, password} = req.body;

    const user = new User({user, password});

    user.save(err =>{
        if(err){
            res.status(500).send('ERROR AL REGISTRAR');
        }else{
            res.status(200).send('USUARIO REGISTRADO');
        }
    });

});
app.post('/authenticate', (req, res) =>{
    const {username, password} = req.body;

    User.findOne({username}, (err, user) =>{
        if(err){
            res.status(500).send('ERR0R AL AUTENTICAR AL USUARIO');
        }else if(!user){
            res.status(500).send('EL USUARIO NO EXISTE');
        }else{
            user.isCorrectPassword(password, (err, result) =>{
                if(err){
                    res.status(500).send('ERROR AL AUTENTIFICAR');
                }else if(result){
                    res.status(200).send('USUARIO AUTENTIFICADO CORRECTAMENTE');
                }else{
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
                }
            });
        }
    });

});

app.listen(3000, () =>{
    console.log('server started');
})
module.exports = app;