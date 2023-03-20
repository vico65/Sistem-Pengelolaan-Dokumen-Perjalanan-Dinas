import mongoose from "mongoose"

export const Kwitansi = mongoose.model('Kwitansi', {
   nomor_kwitansi: {
      type: Number,
      required: true
   },
   nomor_sppd : {
      type: Number,
      required: true,
   },
   tanggal_dikeluarkan : {
      type: String,
      required: true
   },
   besar_uang : {
      type: Number,
      required: true
   },
   status_perjalanan :  {
      type: String
   },
   tahun_anggaran : {
      type: Number,
      required: true 
   },
   biaya_tiket_pesawat : {
      type: Number,
   },
   biaya_tiket_ferry : {
      type: Number,
   },
   nama_biaya_khusus : {
      type : String
   },
   biaya_tiket_khusus : {
      type: Number,
   },
   biaya_taxi : {
      type: Number,
   },
   biaya_transport_darat : {
      type: Number,
   },
   biaya_tol : {
      type: Number,
   },
   biaya_bbm : {
      type: Number,
   },
   biaya_representasi_per_hari : {
      type: Number,
   },
   uang_harian_dalam_provinsi : {
      type: Number
   },
   uang_harian_luar_provinsi : {
      type: Number
   },
   uang_penginapan : {
      type: Number
   },
   biaya_tes_covid : {
      type: Number
   },
   status_kwitansi: {
      type: String,
      required: true
   }
})