import mongoose from "mongoose"

export const Employee = mongoose.model('Employee', {
   nama: {
      type: String,
      required: true
   },
   nip: {
      type: String,
      required: true
   },
   pin: {
      type: String,
      required: true
   },
   image: {
      type: String
   }
})



