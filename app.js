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

app.get("/", function(req, res){
  res.send("Try 'localhost:3000/articles'")
});


//Chained Route
app.route("/articles")

//get method to fetch our data
.get(function(req,res){
  Article.find(function(err, foundArticles){
    res.send(foundArticles);
  });
})

//post method to add data
.post(function(req, res){
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
})

//delete method
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted ALL articles");
    }
    else{
      res.send(err);
    }
  });
});

////////// Specific Article ///////////

app.route("/articles/:articleTitle")
.get(function(req, res){
  // Look for an article that has this specific article title in articles document
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No articles matching that title was found.");
    }
  });
})

//put method allows us to update the whole data
//if we miss one field, that fiel will be null, i.e. title is unchecked
.put(function(req, res){
  Article.replaceOne(
    //condition looks for the route with that title
    {title: req.params.articleTitle},
    //update, then it will update the title and content
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Succesfully updated using put method")
      }
      else{
        res.send(err)
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    //condition where title is = route parameter
    {title: req.params.articleTitle},
    //The $set operator replaces the value of a field with the specified value.
    //$set: updates
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated using patch method")
      }
      else{
        res.send(err);
      }
    }
  )
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
