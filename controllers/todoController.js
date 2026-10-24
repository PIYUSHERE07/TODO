exports.getHome = (req,res,next)=>{
  res.render("home",{
    isLoggedIn : req.session.isLoggedIn
  })
}