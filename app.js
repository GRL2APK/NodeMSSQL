const express = require('express')
require('dotenv').config()
const router = require('./api/routes')
const app = express()
app.use((req, res, next ) => {
    res.header("Access-Control-Allow-Origin","*") // we can put a specific webpage or website instead of * to allow access to apis
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization") // we can also give * as the second parameter string
    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods","PUT, POST, GET, PATCH, DELETE")
        return res.status(200).json({})
    }
    next() // if we dont put next here, this will block any incoming request and expecting to get OPTIONS here
})


// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

// products middleware
app.use("/api", router)

app.listen(3000,()=>{
    console.log("Server is running at 3000")
})
