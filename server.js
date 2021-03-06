const express = require("express");
const pg=require("pg").Pool;
const bodyParser = require('body-parser'); 


const app = express();

const pool=new pg({host:'ec2-54-195-252-243.eu-west-1.compute.amazonaws.com',database:'ddoemageso3s33',user:'yrehtpfxstugzm',password:'8e0c210ad37d7846ed055f5b7c42e9858759b2757f3f8396e4fc27f999d19e99',port:'5432',ssl:true});
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
                {   console.log(request.body);
                    return console.log(err1);}
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