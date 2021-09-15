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
        var select_stmt = `SELECT [AWB Number] from api_test.TBL_API_Master WHERE [AWB Number] = '${awb}' AND [Consignment Status] = 'Active'`
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
        var stmt = `UPDATE api_test.TBL_API_Master SET [Consignment Status] = 'Cancelled', [Cancellation Reason] = '${cancellationReason}',
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
// router.post('/items',async(req, res, next)=>{
//     try {
//         const {items} = req.body
//         let pool = await sql.connect(config)
//         let stmt = `INSERT INTO api_test.TBL_API_Items([AWB No], [Item Code], [Item Name], [Item Type], [Height], [Length], [Width], [Weight]) VALUES`
//         let awb = 'RUH1000062'
//         items.forEach(item => {
//             stmt = stmt + `('${awb}', '${item.item_code}', '${item.item_name}', '${item.item_type}', '${item.item_height}', '${item.item_length}', '${item.item_width}', '${item.item_weight}'),`
//             //console.log(item.item_code, item.item_name)
//         });
//         stmt = stmt.substring(0, stmt.length - 1);
        
//         console.log(stmt)
        
//        let result = await pool.request().query(stmt)
//        res.json({
//            message: result
//        })
//     } catch (error) {
//         console.log(error)
//     }
// })
router.post('/addOrder', async (req, res, next)=>{
    const {Customer_Name, Order_Id, Cust_Contact_Person, Cust_Mobile_No, Cust_Email_ID, Cust_Address, Cust_City
        , Cust_PIN_Code, Cust_State, Receiver_Name, Recv_Contact_Person
        , Recv_Mobile_No, Recv_Email_ID, Recv_Address, Recv_City
        , Recv_PIN_Code, Recv_State, Return_To, Return_Contact_Person
        , Return_Mobile_No,Return_Email_ID,Return_Address
        , Return_City,Return_PIN_Code,Return_State, Customer_Promise_Date, Same_Day_Delivery
        , Order_Type, Collectible_Amount, Pickup_Type, Total_Quantity, Remarks, items} = req.body
        let errors = []
        if(Customer_Name == undefined)
        {
            //console.log("Customer_Name is missing")
            errors.push("Principal Client Name not provided")
        }
        if(Receiver_Name == undefined)
        {
            errors.push("Receiver_Name not provided")
        }
        if(Recv_Contact_Person == undefined)
        {
            errors.push("Contact Person Name not provided")
        }
        if(errors.length > 0)
        {
            //console.log("sending error")
            return res.status(500).json({
              ResponseCode: 103,  
              errors: errors
            })
        }
        //var itemWeight = parseInt(Item_Weight)
        //console.log(itemWeight)
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
            var stmt = "SELECT COUNT(*) orders from TBL_API_Master"
            let result_count = await pool.request()
            .query(stmt)
            var count = result_count.recordset[0].orders
            count = count + 1000001
            var awb = "RUH"+count
            stmt = `INSERT INTO api_test.TBL_API_Master ([AWB Number],[Order ID],[Record Date], [Record Time],\
                        [Customer Name],[Cust Contact Person],[Cust Mobile No],[Cust Email ID],[Cust Address],\
                        [Cust City],[Cust PIN Code],[Cust State], [Receiver Name],[Recv Contact Person],[Recv Mobile No],\
                        [Recv Email ID], [Recv Address], [Recv City],[Recv PIN Code],[Recv State],[Return To],[Return Contact Person],\
                        [Return Mobile No],[Return Email ID], [Return Address],[Return City],[Return PIN Code],[Return State],[Customer Promise Date],\
                        [Same Day Delivery], [Order Type], [Collectible Amount], [Pickup Type], [Total Quantity],\
                        [Consignment Status], [Remarks], [Last Updated On]) VALUES ('${awb}', '${Order_Id}','${date}','${time}','${Customer_Name}','${Cust_Contact_Person}',\
                        '${Cust_Mobile_No}','${Cust_Email_ID}','${Cust_Address}', '${Cust_City}','${Cust_PIN_Code}',\
                        '${Cust_State}','${Receiver_Name}','${Recv_Contact_Person}','${Recv_Mobile_No}','${Recv_Email_ID}','${Recv_Address}',\
                        '${Recv_City}','${Recv_PIN_Code}','${Recv_State}','${Return_To}','${Return_Contact_Person}','${Return_Mobile_No}','${Return_Email_ID}',\
                        '${Return_Address}','${Return_City}','${Return_PIN_Code}', '${Return_State}','${Customer_Promise_Date}','${Same_Day_Delivery}',\
                        '${Order_Type}',${Collectible_Amount},'${Pickup_Type}',${Total_Quantity},N'Active', '${Remarks}', '${Str}')`

            let result = await pool.request()
            .query(stmt)
            stmt = `INSERT INTO api_test.TBL_API_Items([AWB No], [Item Code], [Item Name], [Item Type], [Height], [Length], [Width], [Weight], [Quantity]) VALUES`
            
            items.forEach(item => {
                stmt = stmt + `('${awb}', '${item.item_code}', '${item.item_name}', '${item.item_type}', ${item.item_height}, ${item.item_length}, ${item.item_width}, ${item.item_weight}, ${item.item_quantity}),`
                //console.log(item.item_code, item.item_name)
            });
            stmt = stmt.substring(0, stmt.length - 1);
            
            //console.log(stmt)
        
            result = await pool.request().query(stmt)
            res.json({
                        success: true,
                        message: "Order created successfully",
                        awb
                    })
        
        
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
            const url = req.params.url
            let pool = await sql.connect(config)
            var stmt = `SELECT [Key ID], [AWB No], Date, Time, [Parcel Status], [Status Note] from TBL_API_Tracking where [AWB No] = '${awb}' order by [Key ID] ASC`
            let result = await pool.request()
            .query(stmt)
            //var count = result.recordset[0].orders
           
            let json_result = result.recordset
            
            json_result.forEach( data => {
                var dt = new Date(data.Date)
                var tt = new Date(data.Time)
                var Str =
                ("00" + dt.getDate()).slice(-2)
                + "/" + ("00" + (dt.getMonth() + 1)).slice(-2)
                + "/" + dt.getFullYear() 
                var tstr= ("00" + tt.getHours()).slice(-2) + ":"
                + ("00" + tt.getMinutes()).slice(-2)
                + ":" + ("00" + tt.getSeconds()).slice(-2);
                data.Date = Str
                data.Time = tstr
                //delete data['Updated By']
            });

           
            res.json(result.recordset)
    } catch (error) {
        res.json({ error})
    }
})
router.post('/update/:awb', async (req, res, next) => {
    const awb = req.params.awb
   
    var {Customer_Name, Cust_Contact_Person, Cust_Mobile_No, Cust_Email_ID, Cust_Address, Cust_City,
    Cust_PIN_Code, Cust_State, Receiver_Name, Recv_Contact_Person, Recv_Mobile_No, Recv_Email_ID,
    Recv_Address, Recv_City, Recv_PIN_Code, Recv_State, Return_To, Return_Contact_Person, Return_Mobile_No,
    Return_Email_ID, Return_Address, Return_City, Return_PIN_Code, Return_State, Item_Code, Item_Name, 
    Item_Type, Item_Weight, Item_Height, Item_Width, Item_Breadth, Item_Price, Payment_Type } = req.body
    console.log(Cust_Contact_Person)
       
   try{
        let pool = await sql.connect(config)
            var stmt = `SELECT * from TBL_Purplle where [AWB Number] = '${awb}'`
            let result = await pool.request()
            .query(stmt)
            //var count = result.recordset[0].orders
           
            let json_result = result.recordset[0]
            if(Customer_Name == undefined)
            {
                Customer_Name = json_result['Customer Name']
            }
            if(Cust_Contact_Person == undefined) {
                Cust_Contact_Person = json_result['Cust Contact Person']
            }
            if(Cust_Mobile_No == undefined) {
                Cust_Mobile_No = json_result['Cust Mobile No']
            }
            if(Cust_Email_ID == undefined) {
                Cust_Email_ID = json_result['Cust Email ID']
            }
            if(Cust_Address == undefined) {
                Cust_Address = json_result['Cust Address']
            } 
            if(Cust_City == undefined) {
                Cust_City = json_result['Cust City']
            }
            if(Cust_PIN_Code == undefined) {
                Cust_PIN_Code = json_result['Cust PIN Code']
            }
            if(Cust_State == undefined){
                Cust_State = json_result['Cust State']
            }
            if(Receiver_Name == undefined)
            {
                Receiver_Name = json_result['Receiver Name']
            }
            if(Recv_Contact_Person == undefined){
                Recv_Contact_Person = json_result['Recv Contact Person']
            }
            if(Recv_Mobile_No == undefined){
                Recv_Mobile_No = json_result['Recv Mobile No']
            }
            if(Recv_Email_ID == undefined){
                Recv_Email_ID = json_result['Recv Email ID']
            }
            if(Recv_Address == undefined){
                Recv_Address = json_result['Recv Address']
            }
            if(Recv_City == undefined){
                Recv_City = json_result['Recv City']
            }
            if(Recv_PIN_Code == undefined){
                Recv_PIN_Code = json_result['Recv PIN Code']
            }
            if(Recv_State == undefined){
                Recv_State = json_result['Recv State']
            }
            if(Return_To == undefined){
                Return_To = json_result['Return To']
            }
            if(Return_Mobile_No == undefined){
                Return_Mobile_No = json_result['Return Mobile No']
            }
            if(Return_Email_ID == undefined){
                Return_Email_ID = json_result['Return Email ID']
            }
            if(Return_Address == undefined){
                Return_Address = json_result['Return Address']
            }
            if(Return_City == undefined){
                Return_City = json_result['Return City']
            }
            if(Return_PIN_Code == undefined){
                Return_PIN_Code = json_result['Return PIN Code']
            }
            if(Return_State == undefined){
                Return_State = json_result['Return State']

            }
            if(Item_Code == undefined){
                Item_Code = json_result['Item Code']
            }
            if(Item_Name == undefined){
                Item_Name = json_result['Item Name']
            }
            if(Item_Type == undefined){
                Item_Type = json_result['Item Type']
            }
            if(Item_Weight == undefined){
                Item_Weight = parseInt(json_result['Item Weight'])
            }
            if(Item_Height == undefined){
                Item_Height = json_result['Item Height']
            }
            if(Item_Width == undefined){
                Item_Width = json_result['Item Width']
            }
            if(Item_Breadth == undefined){
                Item_Breadth = json_result['Item Breadth']
            }
            if(Item_Price == undefined){
                Item_Price = json_result['Item Price']
            }
            if(Payment_Type == undefined)
            {
                Payment_Type = json_result['Payment Type']
            }
            stmt = `update TBL_Purplle set [Customer Name] = '${Customer_Name}', [Cust Contact Person] = '${Cust_Contact_Person}',
            [Cust Mobile No] = '${Cust_Mobile_No}', [Cust Email ID] = '${Cust_Email_ID}', [Cust Address] = '${Cust_Address}',
             [Cust City] = '${Cust_City}', [Cust PIN Code] = '${Cust_PIN_Code}', [Cust State] = '${Cust_State}',
              [Receiver Name] = '${Receiver_Name}',
              [Recv Mobile No] = '${Recv_Mobile_No}', [Recv Contact Person] = '${Recv_Contact_Person}', 
              [Recv Address] = '${Recv_Address}', [Recv Email ID] = '${Recv_Email_ID}',
              [Recv City] = '${Recv_City}', [Recv PIN Code] = '${Recv_PIN_Code}', [Recv State] = '${Recv_State}', 
              [Return To] = '${Return_To}', [Return Contact Person] = '${Return_Contact_Person}', [Return Mobile No] = '${Return_Mobile_No}', 
              [Return Email ID] = '${Return_Email_ID}', [Return Address] = '${Return_Address}', [Return City] = '${Return_City}', 
              [Return PIN Code] = '${Return_PIN_Code}', [Return State] = '${Return_State}', [Item Code] = '${Item_Code}', 
              [Item Name] = '${Item_Name}', [Item Type] = '${Item_Type}', [Item Weight] = ${Item_Weight}, 
              [Item Height] = '${Item_Height}', [Item Width] = '${Item_Width}', [Item Breadth] = '${Item_Breadth}', [Item Price] = '${Item_Price}', 
              [Payment Type] = '${Payment_Type}' where [AWB Number] = '${awb}'`
   
              let updatedResult = await pool.request()
              .query(stmt)
            res.json({ message:"Data Updated successfully"})

    } catch (error) {
        console.log(error)
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
