var Express = require("express");
var bodyParser = require("body-parser");

//----- Initilize Application -----//
var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//---- Import Mongodb ----//
var MongoClient = require("mongodb").MongoClient;
const { request, response } = require("express");
var CONNECTION_STRING = "mongodb+srv://admin:root@cluster0.gdemrye.mongodb.net/?retryWrites=true&w=majority"; // Connection string copied from atlas






//---- Import File Upload Using Express ----//
var fileUpload = require('express-fileupload');
var fs = require('fs'); //installed by default
app.use(fileUpload());
app.use('/photos', Express.static(__dirname+'/photos')); //In order to use directory for photos


//---- Enable Cors Security For All Domains ----//
var cors = require('cors');
app.use(cors());


//---- Define db Name ----//
var DATABASE = "testdb";
var database;

//---- App Listening ----//
//App will send to the http req that come from this port http://localhost:49147
app.listen(49147,()=>{

    MongoClient.connect(CONNECTION_STRING,{useNewUrlParser:true},(error,client)=>{
        database=client.db(DATABASE);
        console.log("Mongo Db Connection Successful!");
    })

});

/*
//------- API  Methods--------//
app.get('/', (request, response)=>{
    response.json('Hello World');
})
*/

//---- Department Methods ----//
//---- Get ----//
app.get('/api/department', (request, response)=>{
    database.collection("Department").find({}).toArray((error, result)=>{
        if(error)
            console.log(error);

        response.json(result);
    })
})

//---- Post ----//
app.post('/api/department', (request, response)=>{
    database.collection("Department").count({}, function(error,numOfDocs){
        if(error)
            console.log(error);

        database.collection("Department").insertOne({
            DepartmentId: numOfDocs+1,
            DepartmentName: request.body['DepartmentName']
        });
        response.json("Posted Successfully!");
    })
})

//---- Update method ----//
app.put('/api/department', (request, response)=>{

        database.collection("Department").updateOne(
           //Filter Criteria
           {
                "DepartmentId":request.body['DepartmentId']
           },
           //Update Criteria
           {$set:
                {
                    "DepartmentName":request.body['DepartmentName']
                }
           }

        );

        response.send("Updated Successfully!");
})

//---- Delete Method ----//
app.delete('/api/department/:id',(request,response)=>{

    database.collection("Department").deleteOne({
        DepartmentId:parseInt(request.params.id)
    });

    response.json("Deleted Succesfully!");

})


//------------ API Employee Methods ------------//
//---- Find Method ----//
app.get('/api/employee',(request,response)=>{

    database.collection("Employee").find({}).toArray((error,result)=>{ //.find({FILTERGOESHERE}), we get all data so no filter needed!
        if(error)
            console.log(error); //Log any errors

        response.json(result);
    })
})

//---- Post Method ----//
//Remember to post as JSON instead of text in Postman App!!
app.post('/api/employee',(request,response)=>{

    database.collection("Employee").count({}, function(error, numOfDocs){
        if(error)
            console.log("error");

        database.collection("Employee").insertOne({
            EmployeeId : numOfDocs+1,
            EmployeeName : request.body['EmployeeName'],
            Department: request.body['Department'],
            DateOfJoining: request.body['DateOfJoining'],
            PhotoFileName: request.body['PhotoFileName'],
        });

        response.json("Added Succesfully!");
    })
})

//---- Update Method ----//
app.put('/api/employee',(request,response)=>{

        database.collection("Employee").updateOne(
            //Filter Criteria
            {
                "EmployeeId":request.body['EmployeeId']
            },
            //Update Criteria
            {$set:
                {
                    EmployeeName : request.body['EmployeeName'],
                    Department: request.body['Department'],
                    DateOfJoining: request.body['DateOfJoining'],
                    PhotoFileName: request.body['PhotoFileName'],
                }

            }
        );

        response.json("Updated Succesfully!");

})

//---- Delete Method ----//
app.delete('/api/employee/:id',(request,response)=>{

    database.collection("Employee").deleteOne({
        EmployeeId:parseInt(request.params.id)
    });

    response.json("Deleted Succesfully!");

})

//---- Image Post Method ----//
app.post('/api/employee/savefile',(request,response)=>{

    fs.writeFile("./photos/"+request.files.file.name, request.files.file.data, function(err){
        if(err)
            console.log(err);

        response.json(request.files.file.name);
    }
    )
})
