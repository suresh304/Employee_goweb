const express = require("express")
const Nodedata = require("../data")
const bodyParser = require("body-parser")
const fs = require("fs")
const app = express()
app.use(bodyParser.json())
const PORT = 3001
app.get("/employees",(req,res)=>{
res.json(Nodedata)
})
app.post("/employees/add",(req,res)=>{
    console.log("this is resp body",req.body)
    Nodedata.push(req.body)
    const jsonData=JSON.stringify(Nodedata)
    fs.writeFile("../data.js",jsonData,(err)=>{
        if (err) {
            console.error('Error writing data to file:', err);
            return;
          }
          console.log('Data written to file successfully.');
    })
    
    res.json({
        "message":"employee added"
    })
    })

app.listen(PORT,()=>{
    console.log("server running at port",PORT)
})