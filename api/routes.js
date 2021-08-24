const express = require('express')
const sql = require('mssql')
const config = require('../config/config')
const router = express.Router()
function formattedDate() {
   // var d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
   var d = new Date()
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
   //return `${day}/${month}/${year}`;
    return `${year}/${month}/${day}`;
  }

  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }

router.post('/cancel/:awb/:cancellation_reason', async (req, res, next) => {
    const awb = req.params.awb
    const cancellationReason = req.params.cancellation_reason
    console.log(cancellationReason)
    try {
        let pool = await sql.connect(config)
        var select_stmt = `SELECT [AWB Number] from TBL_Purplle WHERE [AWB Number] = '${awb}' AND [Consignment Status] = 'Active'`
        let query_res = await pool.request()
        .query(select_stmt)
        console.log(query_res.recordset)
        if(query_res.recordset.length < 1 ){
            return res.json({
                success: false,
                message: `No AWB Number found for ${awb}`
            })
        }
        // var datetime_stmt = 'SELECT CAST( GETDATE() AS Date ) as Server_Date, Convert(Time, GetDate()) as Server_Time'
        // let datetimeRes = await pool.request()
        // .query(datetime_stmt)
        
        
        // var server_date = datetimeRes.recordset[0].Server_Time
        // var server_time = datetimeRes.recordset[0].Server_Time
        // console.log(server_date)
        // console.log(server_time)
        var date = formattedDate()
        console.log(date)
        var cdate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        var dt = cdate.split(',')
        var time = convertTime12to24(dt[1].trim())+':00.00000'
        console.log(time)
        // var d = new Date()
        // // , [Cancellation Date] = '${date}', [Cancellation Time] = '${time}'
        // var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()+'.00000';
        console.log(time)
        var stmt = `UPDATE TBL_Purplle SET [Consignment Status] = 'Cancelled', [Cancellation Reason] = '${cancellationReason}',
                    [Cancellation Date] = '${date}', [Cancellation Time] = '${time}' WHERE [AWB Number] = '${awb}'`
        let result = await pool.request()
        //console.log(result)
        .query(stmt)
        res.json({
            success: true,
            message: "Order Cancelled successfully",
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Internal Server Error",
            
        })
    }
})

router.post('/addOrder', async (req, res, next)=>{
    const {Customer_Name, Cust_Contact_Person, Cust_Mobile_No, Cust_Email_ID, Cust_Address, Cust_City
        , Cust_PIN_Code, Cust_State, Receiver_Name, Recv_Contact_Person
        , Recv_Mobile_No, Recv_Email_ID, Recv_Address, Recv_City
        , Recv_PIN_Code, Recv_State, Return_To, Return_Contact_Person
        , Return_Mobile_No,Return_Email_ID,Return_Address
        , Return_City,Return_PIN_Code,Return_State,Item_Code
        , Item_Name, Item_Type, Item_Weight, Item_Height
        , Item_Width, Item_Breadth, Item_Price, Item_Qty, Payment_Type, Remarks} = req.query
        var itemWeight = parseInt(Item_Weight)
        console.log(itemWeight)
    //"last updated on", [Record Date], [Record Time],,[Pickup Date],[Pickup Time] excluded
    // var date = formattedDate()
    // var d = new Date()
    // var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
   
    try {
        var dt = new Date()
            var Str =
            ("00" + (dt.getMonth() + 1)).slice(-2)
            + "/" + ("00" + dt.getDate()).slice(-2)
            + "/" + dt.getFullYear() + " "
            + ("00" + dt.getHours()).slice(-2) + ":"
            + ("00" + dt.getMinutes()).slice(-2)
            + ":" + ("00" + dt.getSeconds()).slice(-2);
            console.log(Str)
        var date = formattedDate()
        console.log(date)
        var cdate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        var dte = cdate.split(',')
        var time = convertTime12to24(dte[1].trim())+':00.00000'
        console.log(time)
            //await sql.connect('mssql://api_test:Password@321@103.21.58.192/api_test')
            let pool = await sql.connect(config)
            var stmt = "SELECT COUNT(*) orders from TBL_Purplle"
            let result_count = await pool.request()
            .query(stmt)
            var count = result_count.recordset[0].orders
            count++
            var awb = "AWB"+count
            stmt = `INSERT INTO TBL_Purplle ([AWB Number],[Record Date], [Record Time],\
                        [Customer Name],[Cust Contact Person],[Cust Mobile No],[Cust Email ID],[Cust Address],\
                        [Cust City],[Cust PIN Code],[Cust State], [Receiver Name],[Recv Contact Person],[Recv Mobile No],\
                        [Recv Email ID], [Recv Address], [Recv City],[Recv PIN Code],[Recv State],[Return To],[Return Contact Person],\
                        [Return Mobile No],[Return Email ID], [Return Address],[Return City],[Return PIN Code],[Return State],[Item Code],\
                        [Item Name], [Item Type],[Item Weight],[Item Height],[Item Width],[Item Breadth],[Item Price],[Item Qty],[Payment Type],\
                        [Consignment Status], [Remarks], [Last Updated On]) VALUES ('${awb}', '${date}','${time}','${Customer_Name}','${Cust_Contact_Person}',\
                        '${Cust_Mobile_No}','${Cust_Email_ID}','${Cust_Address}', '${Cust_City}','${Cust_PIN_Code}',\
                        '${Cust_State}','${Receiver_Name}','${Recv_Contact_Person}','${Recv_Mobile_No}','${Recv_Email_ID}','${Recv_Address}',\
                        '${Recv_City}','${Recv_PIN_Code}','${Recv_State}','${Return_To}','${Return_Contact_Person}','${Return_Mobile_No}','${Return_Email_ID}',\
                        '${Return_Address}','${Return_City}','${Return_PIN_Code}', '${Return_State}', '${Item_Code}','${Item_Name}', '${Item_Type}',\
                        ${itemWeight},'${Item_Height}','${Item_Width}','${Item_Breadth}',${Item_Price},${Item_Qty},'${Payment_Type}',N'Active', '${Remarks}', '${Str}')`

            let result = await pool.request()
            .query(stmt)
            res.json({
                        success: true,
                        message: "Data Inserted successfully",
                        awb
                    })
            // sql.query(stmt, function (err, result_count) {
            //     if (err) throw err;
            //     var count = result_count.recordset[0].orders
            //     count++
            //     var awb = "AWB"+count
            //     stmt = `INSERT INTO TBL_Purplle ([AWB Number],[Record Date],[Record Time],\
            //         [Customer Name],[Cust Contact Person],[Cust Mobile No],[Cust Email ID],[Cust Address],\
            //         [Cust City],[Cust PIN Code],[Cust State], [Receiver Name],[Recv Contact Person],[Recv Mobile No],\
            //         [Recv Email ID], [Recv Address], [Recv City],[Recv PIN Code],[Recv State],[Return To],[Return Contact Person],\
            //         [Return Mobile No],[Return Email ID], [Return Address],[Return City],[Return PIN Code],[Return State],[Item Code],\
            //         [Item Type],[Item Weight],[Item Height],[Item Width],[Item Breadth],[Item Price],[Payment Type],\
            //         [Consignment Status]) VALUES ('${awb}','${date}','${time}',N'souvik',N'souvik',N'7908119947',N'souvik@gmail.com',N'Kolkata',\
            //         N'Kolkata',N'700014',N'WB',N'Souvik',N'Souvik',N'7908119947',N'souvik@gmail.com',N'Barasat',N'Barasat',\
            //         N'700048',N'WB',N'Myntra',N'Myntra',N'7896857485',N'myntra.co',N'Mumbai',N'Mumbai',N'400001',\
            //         N'MH',N'it001',N'Shirt',500.00,N'4',N'3',N'2',1499.00,N'Debit card',N'Active')`
            //     sql.query(stmt, function (err, result) {
            //         if (err) throw err;
            //         res.json({
            //             success: true,
            //             message: "Data Inserted successfully",
            //             awb
            //         })
            //     });

                
            // });
        
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal Server Error",
            
        })
    }
})
router.get('/track/:awb', async (req, res, next)=>{
    try {
            const awb = req.params.awb
            let pool = await sql.connect(config)
            var stmt = `SELECT * from TBL_API_Tracking where [AWB No] = '${awb}'`
            let result = await pool.request()
            .query(stmt)
            //var count = result.recordset[0].orders
           
            let json_result = result.recordset[0]
            console.log(json_result['AWB Number'])
            res.json(result.recordset[0])
    } catch (error) {
        res.json({ error})
    }
})
router.post('/update/:awb', async (req, res, next) => {
    const awb = req.params.awb
   
    const {Customer_Name, Cust_Contact_Person, Cust_Mobile_No, Cust_Email_ID, Cust_Address, Cust_City,
    Cust_PIN_Code, Cust_State, Receiver_Name, Recv_Contact_Person, Recv_Mobile_No, Recv_Email_ID,
    Recv_Address, Recv_City, Recv_PIN_Code, Recv_State, Return_To, Return_Contact_Person, Return_Mobile_No,
    Return_Email_ID, Return_Address, Return_City, Return_PIN_Code, Return_State, Item_Code, Item_Name, 
    Item_Type, Item_Weight, Item_Height, Item_Width, Item_Breadth, Item_Price, Payment_Type } = req.body

    try {
        let pool = await sql.connect(config)
            var stmt = `SELECT * from TBL_Purplle where [AWB Number] = '${awb}'`
            let result = await pool.request()
            .query(stmt)
            //var count = result.recordset[0].orders
           
            let json_result = result.recordset[0]
            console.log(json_result['AWB Number'])
            res.json(result.recordset[0])

    } catch (error) {
        res.json({ error: error })
    }
})
router.get('/fetch',async (req, res, next)=>{
    //const empid = req.params.id

    // try {
    //     let pool = await sql.connect(config)
    //     let result1 = await pool.request()
    //         .input('input_parameter', sql.VarChar, empid)
    //         .query('select employee_name, basic from Tblemployee where empid = @input_parameter')
            
    //     console.dir(result1)
    //     res.json({
    //         success:true,
    //         result: result1
    //     })
    // } catch (error) {
    //     console.log(error)
    //     res.json({
    //         success:false,
    //         message:"Error Occurred"
    //     })
    // }
   try {
        await sql.connect('mssql://api_test:Password@321@103.21.58.192/api_test')
        //const result = await sql.query`select * from Tblemployee1`
        //var stmt = "DROP TABLE testapi3";
        //var stmt = "CREATE TABLE testapi3 (name VARCHAR(255), address VARCHAR(255))";
        var stmt = "SELECT * from TBL_Purplle WHERE [AWB Number] = 'AWB13'"
        sql.query(stmt, function (err, result) {
            if (err) throw err;
            var count = result.recordset[0].orders
            count++
            console.log(count)

            res.json({
                success: true,
                message: "Data Fetched successfully",
                result
            })
        });
        //console.log(result)
        //res.json(result.recordset)
        // let pool = await sql.connect(config)
        // //let pool = await sql.connect('mssql://sa:cmsa019@DESKTOP-TPTM0G5/sample')
        // let result1 = await pool.request()
        //     .input('input_parameter', sql.VarChar, empid)
        //     .query('select employee_name, basic from Tblemployee where empid = @input_parameter')
        // res.json(result1.recordset)
   } catch (error) {
       console.log(error)
   }
    
    // connect to your database
    // sql.connect(config, function (err) {
    
    //     if (err) console.log(err);

    //     // create Request object
    //     var request = new sql.Request();
           
    //     // query to the database and get the records
    //     request.query('select * from Tblemployee', function (err, recordset) {
            
    //         if (err) console.log(err)

    //         // send records as a response
    //         res.send(recordset);
    //     })
    // })
})

router.post('/',async (req, res, next)=>{
   var dbConn =  await sql.connect('mssql://sa:cmsa019@DESKTOP-TPTM0G5/sample')
   var request = new sql.Request(dbConn)
        request.input('empid', sql.VarChar, 'emp102')
        request.input('employee_name', sql.VarChar, 'McDonald')
        request.input('basic', sql.Int, 30000)
        .execute("sp_insert_emp").then(function (recordSet) {
            //4.
            console.log(recordSet)
            res.json(recordSet)
            dbConn.close();
        }).catch(function (err) {
            //5.
            console.log(err);
            dbConn.close();
        })
})

// router.get('/count', async (req, res, next) => {
//     var dbConn =  await sql.connect('mssql://sa:cmsa019@DESKTOP-TPTM0G5/sample')
//     var request = new sql.Request(dbConn);
//     request.output('count_emp', sql.int)
//     .execute("sp_count_emp")
//     .then(doc =>{
//         res.json({
//             "Total Employee":doc.output.count_emp
//         })
//     })
//     .catch(err=>{
//         res.json(err)
//     })
// })
module.exports = router
