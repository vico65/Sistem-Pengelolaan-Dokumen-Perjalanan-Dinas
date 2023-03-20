import mongoose from "mongoose"

export const Employee = mongoose.model('Employee', {
   nama: {
      type: String,
      required: true
   },
   nip: {
      type: Number,
      required: true
   },
   pin: {
      type: Number,
      required: true
   },
   image: {
      type: String
   },
   nomor_telepon: {
      type: String
   },
   email: {
      type: String
   },
   alamat: {
      type: String
   },
   nomor_pos: {
      type: Number
   },
   tingkat: {
      type: Number
   },
   pangkat: {
      type: String
   },
   gaji_pokok: {
      type: String
   }
})