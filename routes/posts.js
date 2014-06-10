var dorthy = require("../posts.json")

exports.view = function(req, res){
  console.log("WE ARE SEEING THE POSTS AT THE MOMENT!");
  //var user = req.params.user;
  console.log(dorthy);
  console.log(dorthy['posts']);
  res.render("posts", {layout: false, 'user': user, "jobs":dorthy['jobs']});
}

exports.post = function(req, res){
  console.log("making a new post");
  var post = req.body;


  var new_post = {
    "title": post.title,
    "tags": post.tags,
    "itemaction": post.itemaction,
    "condition":post.condition,
    "price":post.price,
    "description":post.description
  }

  // console.log(new_job);
  dorthy['posts'].push(new_post);
  console.log(dorthy);
  res.redirect('/home/?post_job=1');
  // res.redirect("employer_home", {'user':req.params.user ,'suc_msg':'1'})
}