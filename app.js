//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { request } = require("express");
const lodash = require("lodash")
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/postsDB", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "No name added!!"]
    },
    body: String
});
const Post = mongoose.model("Post", postSchema);
const posts = Post.find({});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = []

app.get("/", function(req, res) {
	Post.find({}, function(err, data) {
		if(!err) {
			if(data) {
				res.render('home', { homeContent : data });
			}
		}
		else throw err;
	});
});

app.get("/posts/:postID", function(req, res) {
	const requestedPostId = req.params.postID;
	Post.findOne({ _id: requestedPostId }, function(err, foundPost) {
		if(!err) {
			if(foundPost) {
				console.log(foundPost);
				res.render("post", { element_title : foundPost['title'], element_body : foundPost['body']});
			}
		}
	});

	// posts.forEach(function(post) {
	// 	if(lodash.kebabCase(post.title) === lodash.kebabCase(req.params.topic)) {
	// 		res.render("post", { element : post });
	// 	}
	// });
});

app.get("/about", function(req, res) {
	res.render("about", { aboutContent : aboutContent });
});

app.get("/contact", function(req, res) {
	res.render("contact", { contactContent : contactContent });
});

app.get("/compose", function(req, res) {
	res.render("compose");
});

app.post("/compose", function(request, response) {
	const post = new Post({
		title: request.body.newItem,
		body: request.body.description
	});
	post.save(function(err){
		if (!err){	 
		  response.redirect("/");	 
		}	 	 
	});
	// posts.push(postObject);
	// response.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
