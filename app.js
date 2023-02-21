const express = require('express')
const {body, validationResult, check} = require('express-validator')

const app = express()
const port = 3000

require('./utils/db')
const {Employee} = require('./model/employee')

const cookieParser = require('cookie-parser')
let session = require('express-session')
const flash = require('connect-flash')

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

var sessions 

app.get('/login', (req, res) => {
    // req.session.userId = "vicoooo"
    // console.log(req.session)

    res.render('login', {
        title: 'login',
        msg: req.flash('msg')
    })

    
})


app.post('/login',[
    body('nip').custom(async (value) => {
        const data = await Employee.findOne({nip: value})
        if (!data) throw new Error('Nip not found in database')
        return true
    }),
],
    // check('nip', 'nip tidak valid').isMobilePhone('id-ID'),
    // check('nomor', 'Nomor tidak valid').isMobilePhone('id-ID')
   (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash('msg', errors.array()[0].msg)
        res.redirect('/login')

        
        // res.render('login', {
        //     title: 'login',
        //     msg: errors.array()[0].msg
        // })
    } 
    // else {
    //     Contact.insertMany(req.body, (error, result) => {
    //       req.flash('msg', 'Data berhasil ditambah')
    //       res.redirect('/contact')
    //     })
    // }
    
 })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})