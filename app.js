const express=require("express");

const bodyParser=require("body-parser");

const request=require("request");
const https=require("https")
const { json } = require("body-parser");

const app=express();//this is an instance of express

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"))

/*for our static files to render on our webpage we need to use another method of express wch is as follows
2.we need to send all our static files into a folder and use that folder in exoress static method 
3.now we need to assume that we are in that public folder an change the path of the static files in the html
*/

app.post("/",function(req,res){
    const firstname=req.body.fname;
    const secondname=req.body.sname;
    const Email=req.body.email;
    const data = {
        members:[
            {
                email_address:Email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: secondname,
                }
            }
        ]
    };
   const jsonData=JSON.stringify(data);
   const url="https://us14.api.mailchimp.com/3.0/lists/6eccc6eb85";
   const options ={
       method:"POST",
       auth:"pranith:5b9772fa7bf880b456714d109947985e-us14"//bfr colon it can be anything 
   }
  const request= https.request(url,options,function(response){
      if(response.statusCode===200){
          res.sendFile(__dirname+"/success.html");
      }
      else{
          res.sendFile(__dirname+"/failure.html")
      }
       response.on("data",function(data){
           console.log(JSON.parse(data));
       })
   })

   request.write(jsonData);
   request.end();


})

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000 ,function(){//here what we changed is dynamic ports wch are given by heroku
    //by || we can also host it locally 
    console.log("server started..")
})



//api key
//5b9772fa7bf880b456714d109947985e-us14
//list id
//6eccc6eb85