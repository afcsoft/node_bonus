const express = require("express");
const pg=require("pg").Pool;
const bodyParser = require('body-parser'); 


const app = express();

const pool=new pg({host:'localhost',database:'treetest',user:'postgres',password:'postgres',port:'5432'});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

const _port = process.env.PORT || 5000;
const _app_folder = __dirname + '/dist' ;
app.use(express.static(__dirname + '/dist' ));
app.get("/api/data",function(req,res)
{
    pool.query("select row_to_json(t) as DATA from (select name,latitude,longitude,height from trees) t;", (err1, res1) => 
        {   
            if(err1) {return console.log(err1);}
            res.send(res1.rows)        
        });         
});

app.post('/post', function(request, response){
    console.log(request.body.Name);
    pool.query("INSERT INTO trees VALUES('"+request.body.Name+"',"+request.body.Latitude+","+request.body.Longitude+","+request.body.TreeHeight+");", (err1, res1) => 
        {        
            if(err1) 
                {return console.log(err1);}
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
                response.end('Data Store Success!\n');      
        }); 
});

app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});