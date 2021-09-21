const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//To connect to mongoDB using mongoose
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req,res){
  res.send("Try 'localhost:3000/articles'");
});

//get method to fetch our data
app.get("/articles", function(req,res){
  Article.find(function(err, foundArticles){
    res.send(foundArticles);
  });
});

//post method to add data
app.post("/articles", function(req, res){
  const newArticle =  new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(function(err){
    if(!error){
      res.send("Successfully Added new article");
    }
    else{
      res.send(err);
    }
  });
});

//delete method
app.delete("/articles", function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted ALL articles");
    }
    else{
      res.send(err);
    }
  });
});




app.listen(3000, function(){
  console.log("Server started on port 3000");
});
