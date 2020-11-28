const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

const LOCAL_HOST = "http://localhost:8080";

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { connection } = require('./connector')

app.get(`/totalRecovered`,(req,res)=>{
    let sum =0 ;
    connection.find().then(stats => {
        stats.forEach(stat => {
            sum+=stat.recovered;
        });
        res.send({data: {_id: "total", recovered:sum}});
    });
    
})

app.get(`/totalActive`,(req,res)=>{
    let sum =0 ;
    connection.find().then(stats => {
        stats.forEach(stat => {
            sum+=(stat.infected-stat.recovered);
        });
        res.send({data: {_id: "total", active:sum}});
    });
    
})


app.get(`/totalDeath`,(req,res)=>{
    let sum =0 ;
    connection.find().then(stats => {
        stats.forEach(stat => {
            sum+=(stat.death);
        });
        res.send({data: {_id: "total", death:sum}});
    });
    
})

app.get(`/hotspotStates`,(req,res)=>{
    let result ={data:[]}
    

    
    
})








app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;