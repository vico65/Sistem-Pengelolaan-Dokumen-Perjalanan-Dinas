import express from "express"
import {body, validationResult, check} from 'express-validator'

const app = express()
const port = 3000

import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'

import {connect} from "mongoose"

connect('mongodb://localhost:27017/sistem-pengelolaan-dokumen-perjalanan-dinas', {
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
        errors : req.flash('errors')
    })
})

// app.get('/coba', async (req, res) => {
//     const coba = await Employee.find()
//     res.send(coba)
// })

app.post('/login', [
    body('nip')
        .notEmpty().withMessage('NIP must not be empty').bail()
        .isLength({min : 8}).withMessage('NIP length must be 8').bail()
        .isInt().withMessage('NIP length must be number').bail()
        .custom(async (value) => {
            const employee = await Employee.find({nip : value})
            console.log(employee)
            if (employee.length == 0) throw new Error('NIP not found in databases')
            return true
        }),
    body('pin')
        .notEmpty().withMessage('PIN must not be empty').bail()
        .isLength({min : 6}).withMessage('PIN length must be 8').bail()
        .isInt().withMessage('PIN length must be number').bail()
        .custom(async (value, {req}) => {
            const employee = await Employee.find({nip : req.body.nip, pin : value})
            console.log(employee)
            if (employee.length == 0 ) throw new Error('NIP and PIN not match, try again ')
            return true
        })
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
        req.flash('errors', errors.array())
        res.redirect('/login')
        // res.send(errors.array())
    }else {
        res.send(`<h1>ok</h1>`)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})