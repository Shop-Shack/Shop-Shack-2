const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const user_det = require("./models/user_credentials");

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }))


const connectDb = () => {
  mongoose.connect("mongodb+srv://MD:MD2022@shopsackcluster.ersgwpa.mongodb.net/ShopShack", { useNewUrlParser: true });
  console.log("Connected to the database ");
}

connectDb();

var database=mongoose.connection;

let email, password, confPassword, name;


app.get("/", (req, res) => {
  // res.json(
  //   { message: "Hello World!" });

  console.log('Hello ');

});
// app.post("/hey", (req, res) => {
//   res.json(
//     { message: "Hey momo!" });

//   const { body } = req;
//   console.log(body.json);


// });



app.post("/register", (req, res) => {
  const { body } = req;

  var credential= new user_det();
console.log(req.body);

  email = req.body.reg_email;
  password = req.body.reg_pass;
  confPassword = req.body.reg_pass_conf;
  name = req.body.reg_name;

  // console.log(`hola! ${name}`);
  console.log({ ...req.body });

  credential.email_id = email;
  credential.password = password;
  credential.name = name;
  credential.confirm_password = confPassword;

  database.collection('usercredentials').find({ email_id :email}).toArray(function(err,items){

     
    if(err){
      console.log(err);
    }
    if(items.length==0)
    {
      if (password !== confPassword) {
        res.redirect('/register');
        // swal.alert('Dummy!');
        // alert('Dummy!');
      } else {
        // console.log("unique");
        database.collection('usercredentials').insertOne(credential, (err,collection)=> {
          if(err){
            console.log(err);
            throw err;
          }
          console.log("Record inserted successfully");
        });

        res.redirect('/login');
      }
     
    }
    else
    {
      console.log('Email ID exists')
     return  res.redirect('/register');
    }
  })

  
});

app.post("/login", (req, res) => {
  let name, email;
  var credential= new user_det();
  //for google auth



  const userGoogdata = req.body;
  console.log(userGoogdata);

  if(userGoogdata.userIsGoog){
    credential.email_id = userGoogdata.email;
    email=userGoogdata.email;
    credential.name = userGoogdata.name;
    credential.userIsGoog = userGoogdata.userIsGoog;

    database.collection('usercredentials').find({ email_id :email}).toArray(function(err,items){

      if(err){
        console.log(err);
      }

      if(items.length==0){

        database.collection('usercredentials').insertOne(credential, (err,collection)=> {
          if(err){
            console.log(err);
            throw err;
          }
          console.log("Record inserted successfully");
          
          let redir = { redirect: "/", ...userGoogdata};
        return res.json(redir);
          
        });

      }else{

        console.log("This google user is existing");
      let redir = { redirect: "/" };
        return res.json(redir);

      }

    });

    
    // console.log(email,name);
  }else{

  


    const { body } = req;
    email = req.body.log_email;
    password = req.body.log_pass;

    // console.log({...body});
    // console.log(res);

    

    database.collection('usercredentials').find({ email_id :email, password :password}).toArray(function(err,items){

     
      if(err){
        console.log(err);
      }
      if(items.length==0)
      {
       console.log("not found");
       res.redirect('/login');
      }
      else
      {
        res.redirect('/');
      }
    });

  }
});

app.post("/post", (req, res) => {
  console.log("Connected to React");
  res.redirect("/");
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));