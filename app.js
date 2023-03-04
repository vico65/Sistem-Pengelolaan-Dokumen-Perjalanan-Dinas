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
})

import {Employee} from "./model/employee.js"

app.set('view engine', 'ejs')

const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge: oneDay },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(flash())

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

const nipTypeCheck = async (req, res) => {
    const title = 'home'
    const employee = await Employee.findOne({nip : req.session.nip})

    if (req.session.nip == '12345678') 
        res.render('home-admin', {
            title,
            employee
        })
    else 
        res.render('home-non-admin', {
            title,
            employee
        })
}

app.get('/', (req, res) => {
    //gek hapus abis tuh nyalain get post login 
    req.session.nip = '12345678'

    if (typeof req.session.nip === 'undefined') 
        res.redirect('/login')
    else 
        nipTypeCheck(req, res)
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

// app.get('/login', (req, res) => {

//     if(typeof req.session.nip !== 'undefined') 
//         res.redirect('/')
//     else 
//         res.render('login', {
//             title: 'login',
//             errors : req.flash('errors')
//         })
// })

// app.post('/login', [
//     body('nip')
//         .notEmpty().withMessage('NIP must not be empty').bail()
//         .isLength({min : 8}).withMessage('NIP length must be 8').bail()
//         .isInt().withMessage('NIP length must be number').bail()
//         .custom(async (value) => {
//             const employee = await Employee.find({nip : value})
//             if (employee.length == 0) throw new Error('NIP not found in databases')
//             return true
//         }),
//     body('pin')
//         .notEmpty().withMessage('PIN must not be empty').bail()
//         .isLength({min : 6}).withMessage('PIN length must be 8').bail()
//         .isInt().withMessage('PIN length must be number').bail()
//         .custom(async (value, {req}) => {
//             const employee = await Employee.find({nip : req.body.nip, pin : value})
//             if (employee.length == 0 ) throw new Error('NIP and PIN not match, try again ')
//             return true
//         })
// ], (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         req.flash('errors', errors.array())
//         res.redirect('/login')
//         // res.send(errors.array())
//     }else {
//         req.session.nip = req.body.nip

//         res.redirect('/')
//     }
// })

app.use((req, res) => {
    req.statusCode = 404
    res.render('404', {
        title: "Halaman tidak ditemukan",
        statusCode: req.statusCode
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

