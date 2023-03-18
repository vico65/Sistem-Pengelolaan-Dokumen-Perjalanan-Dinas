import mongoose from "mongoose"

export const Sppd = mongoose.model('Sppd', {
   nomor_sppd : {
      type: Number,
      required: true,
   },
   tanggal_dikeluarkan : {
      type: String,
      required: true
   },
   nip: {
      type: Number,
      required: true
   },
   maksud_perjadin:  {
      type: String,
      required: true 
   },
   alat_angkut: {
      type: String,
      required: true 
   },
   tempat_berangkat: {
      type: String,
      required: true    
   },
   tempat_tujuan: {
      type: String,
      required: true
   },
   tanggal_berangkat: {
      type: String,
      required: true,
   },
   tanggal_kembali: {
      type: String,
      required: true
   },
   pengikut: [Object],
   instansi: {
      type: String,
      required: true
   },
   nomor_rekening: {
      type: String,
      required: true
   },
   keterangan_lain: {
      type: String
   },
   tanggal_tiba: {
      type: String
   },
   status_sppd: {
      type: String,
      required: true
   }
})