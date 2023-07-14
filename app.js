//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const homeStartingContent = "Welcome to my humble corner of the internet! This is where words come alive, ideas take flight, and stories unfold. As a blog writer, I invite you to make yourself at home and embark on a journey of discovery. From thought-provoking articles to captivating narratives, this space is designed to engage, inspire, and entertain. Explore a diverse range of topics, from the latest trends to timeless wisdom, as we navigate the ever-changing landscape of knowledge. Join me as we delve into the power of words and embrace the beauty of storytelling. Together, let's create a community of curious minds and passionate readers.";
const aboutContent = "As a passionate blog writer, I strive to bring insightful and engaging content to my readers. With a deep love for words and a curiosity for the world, I embark on a journey of exploration through my writing. Whether it's sharing my thoughts on current events, delving into niche interests, or offering practical tips and advice, I aim to inform, inspire, and entertain. Through well-crafted articles and captivating storytelling, I aim to ignite meaningful conversations and provide valuable perspectives. Join me on this literary adventure as we navigate the vast landscape of ideas and discover the power of words together.";
const contactContent = "I would be delighted to hear from you! Whether you have a question, a suggestion, or simply want to connect, feel free to reach out. Your feedback and thoughts are immensely valuable to me as a blog writer. You can contact me directly through the provided email address, and I will do my best to respond promptly. Let's engage in meaningful conversations, exchange ideas, and explore the fascinating world of blogging together. I look forward to connecting with you and being a part of your journey as a reader.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}).then(function(posts){

    res.render("home", {
  
      startingContent: homeStartingContent,
  
      posts: posts
  
      });
  
  })
  .catch(function(err){
    console.log(err);
  })
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({

    title: req.body.postTitle,
  
    content: req.body.postBody
  
  });
  
  post.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }
 
  });

});

app.get("/posts/:postId", function(req, res){
  // const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).then(function( post){

    res.render("post", {
 
      title: post.title,
 
      content: post.content
 
    });
 
  })
  .catch(function(err){
    console.log(err);
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
