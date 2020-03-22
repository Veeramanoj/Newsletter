const express=require("express");
const bodyParser=require("body-parser");
const request =require("request");
const https=require("https");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){

  const firstname=req.body.fname;
  const lastname=req.body.lname;
  const email=req.body.email;

  const data= {
    members : [
      {
        email_address : email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstname,
          LNAME:lastname
        }
      }
    ]
  }
  const jsonData=JSON.stringify(data);

  const url="https://us19.api.mailchimp.com/3.0/lists/588f058fe8"
const options={
  method:'post',
  auth:"manoj:316030defd5d8862520788d36c48833c-us19"
}

  const request = https.request(url, options ,function(response){
    response.on("data",function(d){
      console.log(JSON.parse(d));
      if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
      }
      else {
        res.sendFile(__dirname+"/failure.html");
      }
    })
  })
  request.write(jsonData);
  request.end();

})

app.post("/failure", (req,res)=>{
  res.redirect("/");
})

app.listen(process.env.PORT||3000,function(){
  console.log("app started");
})
