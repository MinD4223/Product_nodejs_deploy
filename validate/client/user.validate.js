module.exports.resetPasswordPost = (req, res, next) =>{
    if (req.body.password == "") {
        req.flash("error", "Mật khẩu không được để trống")
        res.redirect("back")
        return;
    }
   
    if (req.body.confirmPassword=="") {
        req.flash("error", "Mật khẩu không được để trống")
        res.redirect("back")
        return;
    }


    if (req.body.confirmPassword != req.body.password) {
        req.flash("error", "Mật khẩu không trung khớp")
        res.redirect("back")
        return;
    }
    next();
}