import mongoose from "mongoose";


 const urlSchema = new mongoose.Schema({
  url: {type: String, unique: true},
  shortnedUrl: Number
})

export const urlModel= new mongoose.model('urlModel',urlSchema)








