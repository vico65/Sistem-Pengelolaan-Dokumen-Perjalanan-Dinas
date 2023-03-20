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
import {
    Kwitansi
} from "./model/collection/kwitansi.js"

//import dari model docx
import {
    createSppd
} from "./model/docx/sppd.js"
import {
    createKwitansi
} from "./model/docx/kwitansi.js"

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

const nipTypeCheck = async (req, res) => {
    const title = 'home'
    const employee = await Employee.findOne({
        nip: req.session.nip
    })

    if (req.session.nip == '12345678')
        res.render('admin/home', {
            title,
            employee
        })
    else {

        const sppds = await Sppd.find({nip : req.session.nip})

        res.render('non-admin/home', {
            title,
            employee,
            sppds
        })
    }
        
}

const getSppdsPerGu = async () => {
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

const getKwitansisPerGu = async () => {
    let init = 19999

    let kwitansi = []

    for (let i = 0; i < 10; i++) {
        kwitansi.push(await Kwitansi.find({
            nomor_kwitansi: {
                $gt: init + (i * 20)
            }
        }).limit(10))
    }

    return kwitansi
}

const getEmployeeNamesPerGuForSppd = async (gu) => {
    const sppds = await getSppdsPerGu()
    let employee = ""
    let employees = []

    for(let i =0; i < sppds[gu - 1].length ; i++) {
        employee = await Employee.findOne({nip : sppds[gu - 1][i].nip})
        employees.push(employee.nama)
    }
    
    return employees
}

const getEmployeeNamesPerGuForKwitansi = async(gu) => {
    const kwitansi = await getKwitansisPerGu()

    let sppds = []

    for(let i = 0; i < kwitansi[gu - 1].length; i++) {
        sppds.push(await Sppd.findOne({nomor_sppd: kwitansi[gu - 1][i]}))
    }

    let employee = ""
    let employees = []

    for(let i =0; i < sppds[gu - 1].length ; i++) {
        employee = await Employee.findOne({nip : sppds[gu - 1][i].nip})
        employees.push(employee.nama)
    }

    return employees
}

const getEmployeeNames = async() => {
    const sppds = await Sppd.find()

    let employee = ""
    let employees = []

    for (let i = 0; i < sppds.length; i++) {
        employee = await Employee.findOne({nip : sppds[i].nip})
        employees.push(employee.nama)
    }

    return employees
}

//route get untuk halaman utama
app.get('/', (req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else
        nipTypeCheck(req, res)
})

//route get untuk halaman sppd
app.get('/sppd', async (req, res) => {

    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
            nip: req.session.nip
        })
    
        const sppds = await getSppdsPerGu()
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
    }
})

//route get buat tambah data
app.get('/sppd/add', async (req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
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
    }   
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
            res.redirect('/download/sppd/' + nomor_sppd)
        }
    }
})

//route get buat menampilkan data per gu
app.get('/sppd/:gu', async (req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const sppds = await getSppdsPerGu()
    const employeeNames = await getEmployeeNamesPerGuForSppd(req.params.gu)

    res.render('admin/sppd-gu', {
        title: 'Sppd GU ' + req.params.gu,
        gu: req.params.gu,
        sppds: sppds[req.params.gu - 1],
        employee,
        employeeNames,
        msg : req.flash('msg')
    })
    }

    
}
)

//route get buat menampilkan kwitansi
app.get('/kwitansi', async (req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const kwitansis = await getKwitansisPerGu()
    let gukwitansis = []

    kwitansis.forEach((kwitansi, index) => {
        gukwitansis.push({
            title: `GU ${index + 1}`,
            jumlah: kwitansi.length
        })
    })

    res.render('admin/kwitansi', {
        title: 'Kwitansi',
        employee,
        guKws : gukwitansis
    })
    }
})

//route get buat menampilkan tambah data kwitansi
app.get('/kwitansi/add', async (req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
         const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const sppds = await Sppd.find()
    const employeeNames = await getEmployeeNames()

    res.render('admin/tambah-kwitansi', {
        title: 'Tambah Kwitansi',
        employee,
        employeeNames,
        sppds,
        errors : req.flash('errors')
    })
    }
    
   
})

//route post buat proses data kwitansi yang akan ditambahkan
app.post('/kwitansi/add', 
    [ body('nomor_sppd')
        .custom(async (value) => {
            const kwitansi = await Kwitansi.find({nomor_sppd : value})
            if (kwitansi.length != 0) throw new Error('Nomor SPPD telah memiliki kwitansi, hapus kwitansi / sppd yang lama')
            return true
        }),
    body('besar_uang')
        .notEmpty().withMessage('Besar uang harus diisi').bail()
        .isInt().withMessage('Besar uang harus berupa angka').bail(),
    body('tahun_anggaran')
        .notEmpty().withMessage('Tahun anggaran harus diisi').bail()
        .isInt().withMessage('Tahun anggaran harus berupa angka').bail()
        .isLength({min : 4}).withMessage('Tahun anggaran harus 4 digit'),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //jika error kirim message
        req.flash('errors', errors.array())
        res.redirect('/kwitansi/add')
    } else {
        //variable
        const sppd = await Sppd.findOne({nomor_sppd : req.body.nomor_sppd})

        const employee = await Employee.findOne({
            nip: sppd.nip
        })

        const lastKwitansi = await Kwitansi.findOne().sort({
            nomor_kwitansi : -1
        })

        let nomor_kwitansi  = 20000

        //buat sppd
        if (lastKwitansi != null) nomor_kwitansi  = lastKwitansi.nomor_kwitansi  + 1

        const statusCreateKwitansi = await createKwitansi(nomor_kwitansi ,employee, sppd,  req.body)

        //simpan ke database
        let kwitansi = new Kwitansi({
            nomor_kwitansi,
            nomor_sppd : req.body.nomor_sppd,
            tanggal_dikeluarkan: moment().format('YYYY-MM-DD'),
            besar_uang : req.body.besar_uang,
            status_perjalanan : req.body.status_perjalanan,
            tahun_anggaran: req.body.tahun_anggaran,
            biaya_tiket_pesawat: req.body.biaya_tiket_pesawat,
            biaya_tiket_ferry: req.body.biaya_tiket_ferry,
            nama_biaya_khusus: req.body.nama_tiket_khusus,
            biaya_tiket_khusus: req.body.biaya_tiket_khusus,
            biaya_taxi: req.body.biaya_taxi,
            biaya_transport_darat: req.body.biaya_transport_darat,
            biaya_tol: req.body.biaya_tol,
            biaya_bbm: req.body.biaya_bbm,
            biaya_representasi_per_hari: req.body.biaya_representasi_per_hari,
            uang_harian_dalam_provinsi: req.body.uang_harian_dalam_provinsi,
            uang_harian_luar_provinsi: req.body.uang_harian_luar_provinsi,
            uang_penginapan: req.body.uang_penginapan,
            biaya_tes_covid: req.body.biaya_tes_covid,
            status_kwitansi: 'belum ttd'
        })

        kwitansi.save()

        if (fs.existsSync('public/data/kwitansi/' + nomor_kwitansi + '.docx')) {
            res.redirect('/download/kwitansi/' + nomor_kwitansi)
        }
    }
})

//route get buat menampilkan kwitansi per gu
app.get('/kwitansi/:gu', async(req, res) => {
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const kwitansis = await getKwitansisPerGu()
    const employeeNames = await getEmployeeNamesPerGuForSppd(req.params.gu)

    res.render('admin/kwitansi-gu', {
        title: 'Kwitansi GU ' + req.params.gu,
        gu: req.params.gu,
        kwitansis: kwitansis[req.params.gu - 1],
        employee,
        employeeNames
    })
    }
    
    
})

//route get buat menampilkan berkas perjadin
app.get('/berkas', async(req, res) => {
    
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const sppds = await Sppd.find()
    const employees = await getEmployeeNames()

    res.render('admin/berkas', {
        title: 'Berkas Perjadin',
        sppds,
        employee,
        employees
    })
    }
})

//route get buat menampilkan berkas per sppd
app.get('/berkas/:nomor_sppd', async(req, res) => {
    
    if (typeof req.session.nip === 'undefined')
        res.redirect('/login')
    else {
        const employee = await Employee.findOne({
        nip: req.session.nip
    })

    const sppd = await Sppd.findOne({nomor_sppd : req.params.nomor_sppd})

    const employeeReq = await Employee.findOne({nip : sppd.nip})

    const kwitansi = await Kwitansi.findOne({nomor_sppd : req.params.nomor_sppd})

    const listBukti = [true, fs.existsSync('public/data/kwitansi/' + kwitansi.nomor_kwitansi + '.docx')]
    
    let folderName = ['Tiket Pergi', 'Tiket Pulang','Boarding Pergi',  'Boarding Pulang', 'Tiket Tol','Bukti BBM', 'Bukti Tes Covid', 'Bukti Penginapan',]

    folderName.forEach((name) => {
        listBukti.push(fs.existsSync('public/data/Bukti/' + name + '/' + req.params.nomor_sppd + '.jpeg') || 
            fs.existsSync('public/data/Bukti/' + name + '/' + req.params.nomor_sppd + '.jpg'))
    })

    folderName = ['Sppd', 'Kwitansi', 'Tiket Pergi', 'Tiket Pulang','Boarding Pergi',  'Boarding Pulang', 'Tiket Tol','Bukti BBM', 'Bukti Tes Covid', 'Bukti Penginapan',]

    res.render('admin/berkas-detail', {
        title: 'Berkas Perjadin',
        employee,
        sppd,
        kwitansi,
        employeeReq,
        listBukti,
        folderName
    })
    }

    
})

//route get buat download
app.get('/download/sppd/:nomor_sppd', async (req, res) => {
    res.download('public/data/sppd/' + req.params.nomor_sppd + '.docx')
})

app.get('/delete/sppd/:gu/:nomor_sppd', async(req, res) => {
    await Sppd.deleteOne({nomor_sppd : req.params.nomor_sppd})
    fs.unlinkSync('public/data/sppd/' + req.params.nomor_sppd + '.docx')
    res.redirect('/sppd/' + req.params.gu)
})

app.get('/delete/kwitansi/:gu/:nomor_kwitansi', async(req, res) => {
    await Kwitansi.deleteOne({nomor_kwitansi : req.params.nomor_kwitansi})
    fs.unlinkSync('public/data/kwitansi/' + req.params.nomor_kwitansi + '.docx')
    res.redirect('/kwitansi/' + req.params.gu)
})

app.get('/download/kwitansi/:nomor_kwitansi', async (req, res) => {
    res.download('public/data/kwitansi/' + req.params.nomor_kwitansi + '.docx')
})

app.get('/download/bukti/:folderName/:nomor_sppd', async(req, res) => {
    if (fs.existsSync('public/data/Bukti/' + req.params.folderName + '/' + req.params.nomor_sppd + '.jpeg')) 
        res.download('public/data/Bukti/' + req.params.folderName + '/' + req.params.nomor_sppd + '.jpeg')
    else if (fs.existsSync('public/data/Bukti/' + req.params.folderName + '/' + req.params.nomor_sppd + '.jpg'))
        res.download('public/data/Bukti/' + req.params.folderName + '/' + req.params.nomor_sppd + '.jpg')
    else 
        console.log('error happen')    
})

//route get buat logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

//route get buat menampilkan login
app.get('/login', (req, res) => {
    if(typeof req.session.nip !== 'undefined') 
        res.redirect('/')
    else 
        res.render('login', {
            title: 'login',
            errors : req.flash('errors')
        })
})

//route post buat proses data login
app.post('/login', [
    body('nip')
        .notEmpty().withMessage('NIP must not be empty').bail()
        .isLength({min : 8}).withMessage('NIP length must be 8').bail()
        .isInt().withMessage('NIP length must be number').bail()
        .custom(async (value) => {
            const employee = await Employee.find({nip : value})
            if (employee.length == 0) throw new Error('NIP not found in databases')
            return true
        }),
    body('pin')
        .notEmpty().withMessage('PIN must not be empty').bail()
        .isLength({min : 6}).withMessage('PIN length must be 6').bail()
        .isInt().withMessage('PIN must be number').bail()
        .custom(async (value, {req}) => {
            const employee = await Employee.find({nip : req.body.nip, pin : value})
            if (employee.length == 0 ) throw new Error('NIP and PIN not match, try again ')
            return true
        })
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/login')
    }else {
        req.session.nip = req.body.nip
        res.redirect('/')
    }
})

app.get('/coba', async(req, res) => {
    const employee = await Employee.find({pin : 123456})

    res.send(employee)
})

//midlleware buat menampilkan status 404
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