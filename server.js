import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {urlModel} from './urlmdel.js';
import dns from 'dns';
import cors from 'cors';
import { URL } from 'url';
const app = express();
  

app.use(cors())
app.use(express.json())
app.post('/shortUrl',async (req,res)=>{
const urlFunction = async (userInof)=>{
// builld connecton to db 
const connectToDb = async ()=>{
 try{ 
    await mongoose.connect(process.env.KEY)
 } catch(err){
    console.log(err)
 }
} 
// test connection to db 
const testConnectionToDb = async  ()=>{
await connectToDb()
await console.log(mongoose.connection.readyState)

}
//excute connection to db and see if connected successfully 
await testConnectionToDb()


 //check if the url is a real domain name 
 let  ipAdress;
 try{
  
  await new Promise((resolve, reject)=>{
    
   dns.lookup(userInof,(err,adress,family)=>{
    
   if (err || !adress){
    
    reject(err)
    
   } else{
    resolve(ipAdress = true)
    
   }
  
  })})
  } catch(err){
  ipAdress=false
  
  }

  let chekModel;
  typeof userInof==='string'? chekModel=  await urlModel.findOne({url:userInof}):chekModel=  await urlModel.findOne({shortnedUrl:userInof});
 if(chekModel){
 

 res.json({'urlResponse':`the short url for ${userInof} is ${chekModel.shortnedUrl}`})
 
 } else if(!ipAdress){
  console.log('Domain name must be for a real website or the domain name is not puplic anymore')
  res.json({'urlResponse':'Domain name must be for a real website or the domain name is not puplic anymore'})
 }else{
  
  //INCREMENT THE COUNTER VARIABLE WHICH ALLOWS US TO USE it AS AN INDEX AND GENERATE THE SHORTENED URL BASED ON IT 
 
 const incrementedUrl = await mongoose.connection.collection('neurls').findOneAndUpdate(
  { _id: new mongoose.Types.ObjectId('665797f8d9851dfac836f570')},{$inc:{counter:1}}, { returnDocument: 'after' } // Filter by _id
);  


  
  const urlInstance= urlModel({
    url:userInof,
    shortnedUrl: incrementedUrl.counter
  })
  // save the document and send the response to the client 
  try{
  await urlInstance.save().then(resolved=>{
    const{shortnedUrl}= resolved
    
    res.json({'urlResponse':`the short url for ${userInof} is ${shortnedUrl}`})
    

  }
  )
  }catch(err){
    console.log(err.message)
   
  }
  
}
} 

  try{
   await urlFunction(req.body.url)
  }catch(err){
    console.log(err)
  }
 
})


app.listen(3000,()=>{
    console.log('app running')
})
