import express from "express"
import {body, validationResult, check} from 'express-validator'

const app = express()
const port = 3000

import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'

import {connect} from "mongoose"

connect('mongodb://localhost/belajar-mongo', {
   useNewUrlParser: true, 
   useUnifiedTopology: true
}).then(() => console.log('Connected!'));

import {Employee} from "./model/employee.js"

app.set('view engine', 'ejs')

app.use(cookieParser('secret'))
app.use(
    session({
        cookie: {maxAge:  6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(flash())

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    let nik = ""
    if (typeof req.session.nip === 'undefined') res.redirect('/login')
    else nik = `<h1>Nik ditemukan</h1>`
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'login',
        msg : req.flash('msg')
    })
})

app.post('/login', [
    check('nip')
        .notEmpty().withMessage('NIP must not be empty').bail()
        .isLength({min : 8}).withMessage('NIP length must be 8').bail()
        .isInt().withMessage('NIP length must be number').bail()
        .custom(async (value) => {
            const employee = await Employee.find({nip : value})
            console.log(employee)
            if (employee.length == 0) throw new Error('NIP not found in databases')
            return true
        }).bail(),
    check('pin')
        .notEmpty().withMessage('PIN must not be empty').bail()
        .isLength({min : 6}).withMessage('PIN length must be 8').bail()
    // body('nip').custom(async (value) => {
    //     const employee = await Employee.find({nip: value})
    //     if (employee.length == 0) throw new Error("Nip not found")
    //     return true
    // }),
    // body('pin').custom( async (value) => {
    //     const employee = await Employee.find({pin: value})
    //     if (!employee) throw new Error('Pin ')
    //     return true
    // }),
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash('msg', errors.array())
        console.log(errors.array())
        res.redirect('/login')
        // res.send(errors.array())
    }else {
        res.send(`<h1>ok</h1>`)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})