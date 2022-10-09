const express = require('express');
const https = require('https');
const BodyParser = require('body-parser');

const app = express();

app.use(BodyParser.urlencoded({extended:true})); //Body-Parser

const port = 3200;

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/Index.html");
})

//==>Post Request;
app.post('/',(req,respost)=>{ 
        respost.set('content-type','text/html');
        const City = req.body.CityName;
        const Unit = "metric" ; // For Celcius
        const APIKey = "5bcde58c15f52bc02344278a36090c23";
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+City+"&units="+Unit+"&appid="+APIKey;

        https.get(url,(responseofurl)=>{
        console.log(responseofurl.statusCode);
        
        responseofurl.on("data",(data)=>{

            const WeatherData = JSON.parse(data); //==> Cnvrt into JS Object;
            const Tempvalue = WeatherData.main.temp ;// ==> JSobject ma Main ma Temp ki value; 
            // console.log(Tempvalue);
            const WeatherDes = WeatherData.weather[0].description;
            const WeatherIcon = WeatherData.weather[0].icon;
            const IMGurl = "http://openweathermap.org/img/wn/" + WeatherIcon + "@2x.png" ;

            // Sending this Response to the Client Browser.
            respost.write ("<img src= " + IMGurl + ">");
            respost.write("<h3>The Weather Description of the City is : " + WeatherDes +"<h3>");
            respost.write("<h1>The Temp in "+City+" is: " + Tempvalue + " Celcius.</h1>");
            respost.send();
        }) // Response from the 3rd site ended
    });
});// Post Request ended

app.listen(port,()=>{
    console.log(`You are listening to " ${port} " port`)
})