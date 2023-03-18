import express from "express"
import moment from "moment";
import * as fs from "fs";
import {
    body,
    validationResult,
    check
} from 'express-validator'

const app = express()
const port = 3000

import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'

import {
    connect
} from "mongoose"

//import dari model collection
import {
    Employee
} from "./model/collection/employee.js"
import {
    Sppd
} from "./model/collection/sppd.js"

//import dari model docx
import {
    createSppd
} from "./model/docx/sppd.js"

import cors from "cors"

connect('mongodb://localhost:27017/sistem-pengelolaan-dokumen-perjalanan-dinas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')

const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: {
            maxAge: oneDay
        },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(flash())

app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())

const nipTypeCheck = async (req, res) => {
    const title = 'home'
    const employee = await Employee.findOne({
        nip: req.session.nip
    })

    if (req.session.nip == '12345678')
        res.render('admin/home-admin', {
            title,
            employee
        })
    else
        res.render('non-admin/home-non-admin', {
            title,
            employee
        })
}

const getSppds = async() => {
    let init = 111110

    let sppd = []

    for (let i = 0; i < 10; i++) {
        sppd.push(await Sppd.find({
            nomor_sppd: {
                $gt: init + (i * 20)
            }
        }).limit(20))
    }

    return sppd
}

app.get('/coba', async (req, res) => {

    

    const sppds = await getSppds()

    sppds.forEach((s, i) => {
        console.log(s.length)
    })
})

app.get('/', (req, res) => {
    //gek hapus abis tuh nyalain get post login 
    req.session.nip = '12345678'

    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else
        nipTypeCheck(req, res)
})

app.get('/sppd', async (req, res) => {
    req.session.nip = '12345678'
    
    const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const sppds = await getSppds()
    const guSppds = []

    sppds.forEach((sppd, index) => {
        guSppds.push({
            title: `GU ${index + 1}`,
            jumlah: sppd.length
        })
    })

    res.render('admin/sppd', {
        title: 'Sppd',
        employee,
        guSppds
    })
})

app.get('/sppd/add', async (req, res) => {

    req.session.nip = 12345678

    const employee = await Employee.findOne({
        nip: req.session.nip
    })
    const employees = await Employee.find().sort({
        nama: 1
    })

    res.render('admin/tambah-sppd', {
        title: 'Tambah SPPD',
        employee,
        employees
    })


})



//route post buat tambah data sppd
app.post('/sppd/add', [
    body('maksud_perjadin')
    .notEmpty().withMessage('Maksud perjadin harus diisi').bail(),
    body('tempat_berangkat')
    .notEmpty().withMessage('Tempat berangkat harus diisi').bail(),
    body('tempat_tujuan')
    .notEmpty().withMessage('Tempat tujuan harus diisi').bail(),
    body('tanggal_berangkat')
    .notEmpty().withMessage('Tanggal berangkat tidak boleh kosong').bail(),
    body('tanggal_kembali')
    .notEmpty().withMessage('Tanggal kembali tidak boleh kosong').bail(),
    body('nomor_rekening')
    .notEmpty().withMessage('PIN must not be empty').bail()
    .isInt().withMessage('PIN length must be number').bail(),
    body('instansi')
    .notEmpty().withMessage('PIN must not be empty').bail()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // req.flash('errors', errors.array())
        // res.redirect('/login')
        // res.send(errors.array())
    } else {
        //variable
        const employee = await Employee.findOne({
            nip: req.body.nip
        })
        const lastSppd = await Sppd.findOne().sort({
            nomor_sppd: -1
        })
        let nomor_sppd = 111111
        let pengikut = []
        let msg = ""

        //buat sppd
        if (lastSppd != null) nomor_sppd = lastSppd.nomor_sppd + 1

        const statusCreateSppd = await createSppd(nomor_sppd, employee, req.body)

        //isi variabel pengikut
        if (req.body.nama_pengikut1.length != 0) {
            pengikut.push({
                nama: req.body.nama_pengikut1,
                umur: req.body.umur_pengikut1,
                status: req.body.status_pengikut1
            })

            if (req.body.nama_pengikut2.length != 0) {
                pengikut.push({
                    nama: req.body.nama_pengikut2,
                    umur: req.body.umur_pengikut2,
                    status: req.body.status_pengikut2
                })

                if (req.body.nama_pengikut3.length != 0) {
                    pengikut.push({
                        nama: req.body.nama_pengikut3,
                        umur: req.body.umur_pengikut3,
                        status: req.body.status_pengikut3
                    })
                }
            }
        }

        //simpan ke database
        let sppd = new Sppd({
            nomor_sppd,
            tanggal_dikeluarkan: moment().format('YYYY-MM-DD'),
            nip: req.body.nip,
            maksud_perjadin: req.body.maksud_perjadin,
            alat_angkut: req.body.alat_angkut,
            tempat_berangkat: req.body.tempat_berangkat,
            tempat_tujuan: req.body.tempat_tujuan,
            tanggal_berangkat: req.body.tanggal_berangkat,
            tanggal_kembali: req.body.tanggal_kembali,
            pengikut,
            instansi: req.body.instansi,
            nomor_rekening: req.body.nomor_rekening,
            keterangan_lain: req.body.keterangan_lain,
            tanggal_tiba: req.body.tanggal_tiba,
            status_sppd: 'belum ttd'
        })

        sppd.save((error) => {
            error ? msg = error : msg = "Data berhasil ditambah"
        })

        if (fs.existsSync('public/data/sppd/' + nomor_sppd + '.docx')) {
            res.redirect('/download/' + nomor_sppd)
        }
    }
})


app.get('/sppd/:gu', async (req, res) => {
    const employee = await Employee.findOne({
        nip: req.session.nip
    })
    const employees = await Employee.find()

    res.render('admin/sppd-gu', {
        title: 'Sppd',
        gu: req.params.gu,
        employee,
        employees
    })


})

app.get('/kwitansi', async (req, res) => {

    const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const guKwitansis = [{
            title: 'Gu 1',
            jumlah: 0
        },
        {
            title: 'Gu 2',
            jumlah: 0
        },
        {
            title: 'Gu 3',
            jumlah: 0
        },
        {
            title: 'Gu 4',
            jumlah: 0
        },
        {
            title: 'Gu 5',
            jumlah: 0
        },
        {
            title: 'Gu 6',
            jumlah: 0
        },
        {
            title: 'Gu 7',
            jumlah: 0
        },
        {
            title: 'Gu 8',
            jumlah: 0
        },
        {
            title: 'Gu 9',
            jumlah: 0
        },
        {
            title: 'Gu 10',
            jumlah: 0
        },
    ]

    res.render('admin/kwitansi', {
        title: 'Kwitansi',
        employee,
        guKwitansis
    })
})

app.get('/kwitansi/add', async (req, res) => {
    //gek hapus abis tuh nyalain get post login 
    req.session.nip = '12345678'

    const employee = await Employee.findOne({
        nip: req.session.nip
    })

    res.render('admin/tambah-kwitansi', {
        title: 'Tambah Kwitansi',
        employee,
        msg: req.flash('msg')
    })
})

app.post('/kwitansi/add', [
    body('maksud_perjadin')
    .notEmpty().withMessage('Maksud perjadin harus diisi').bail(),
    body('tempat_berangkat')
    .notEmpty().withMessage('Tempat berangkat harus diisi').bail(),
    body('tempat_tujuan')
    .notEmpty().withMessage('Tempat tujuan harus diisi').bail(),
    body('tanggal_berangkat')
    .notEmpty().withMessage('Tanggal berangkat tidak boleh kosong').bail(),
    body('tanggal_kembali')
    .notEmpty().withMessage('Tanggal kembali tidak boleh kosong').bail(),
    body('nomor_rekening')
    .notEmpty().withMessage('PIN must not be empty').bail()
    .isInt().withMessage('PIN length must be number').bail(),
    body('instansi')
    .notEmpty().withMessage('PIN must not be empty').bail()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // req.flash('errors', errors.array())
        // res.redirect('/login')
        // res.send(errors.array())
    } else {
        res.send(req.body)
        //variable
        // const employee = await Employee.findOne({
        //     nip: req.body.nip
        // })
        // const lastSppd = await Sppd.findOne().sort({
        //     nomor_sppd: -1
        // })
        // let nomor_sppd = 111111

        // //buat sppd
        // createSppd(employee, req.body)

        //simpan ke database
        // if (data != null) nomor_sppd = lastSppd.nomor_sppd + 1

        // let sppd = new Sppd({
        //     nomor_sppd,
        //     tanggal_dikeluarkan: Date.now(),
        //     nip: req.,
        // })

        // sppd.save((error) => {
        //     if (error) console.log(error)
        //     else {
        //         //klo berhasil nambah, redirect 
        //         req.flash('msg', "Data berhasil ditambah")
        //         res.redirect('/sppd/add')
        //     }
        // })


    }
})

//tambah view kwitansi per gu


//hapus mungkin
app.get('/getAllEmployee/', async (req, res) => {
    const employees = await Employee.find()

    res.json(employees)
})

app.get('/getEmployee/:nama', async (req, res) => {
    const employee = await Employee.find({
        nama: {
            $regex: '^' + req.params.nama
        }
    })

    res.json(employee)
})

app.get('/download/:nomor_sppd', async (req, res) => {
    res.download('public/data/sppd/' + req.params.nomor_sppd + '.docx')
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