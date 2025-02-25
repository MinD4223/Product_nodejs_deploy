const User = require("../../models/user.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail")
const ForgotPassword = require("../../models/forgot-password.model");
module.exports.index = async (req, res) => {
    res.render("client/page/user/register", { 
        titlePage: "Đăng ký" ,
      });
};

module.exports.register = async (req, res) => {

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash("error","email đã tồn tại");
        res.redirect("back")
        return
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
    
};

module.exports.login = async (req, res) => {
    res.render("client/page/user/login",{
        titlePage: "Đăng nhập"
    })
};

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash("error", "Email không tồn tại");
        req.redirect("back");
        return;
    }
    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu");
        req.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash("error", "Tài khoản đang bị khóa");
        req.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
};

module.exports.logout = (req, res) =>{
    res.clearCookie("tokenUser");
    res.redirect("/");
}

module.exports.forgotPassword = (req, res) =>{
    res.render("client/page/user/forgot-password",{
        titlePage: "Quên mật khẩu"
    })
}

module.exports.forgotPasswordPost = async(req, res) =>{
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back")
        return 
    }
    //Viec1 tao ma OTP va luu OTP vao collection password
    const objectForgotPassword = {
        email: email,
        otp: "",
        expireAt: new Date(Date.now() + 180 * 1000)
    };

    objectForgotPassword.otp = generateHelper.generateRandomNumber(8);

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save()

    // Viec 2 gui otp qua email
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `Mã OTP xác minh lấy lại mật khẩu là <b> ${objectForgotPassword.otp}</b> thời hạn sử dụng 3 phút `
    sendMailHelper.sendMail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render("client/page/user/otp-password",{
        pageTitle: "Nhap ma otp",
        email: email
    })
   
}

module.exports.otpPasswordPost = async(req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    
    if(!result){
        req.flash("error", "Hết hạn nhập lại");
        res.redirect("back")
        return 
    }

    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset")
   
}

module.exports.resetPassword = (req, res) => {
    res.render("client/page/user/reset-password",{
        pageTitle: "Cài lại mật khẩu",
    })
}

module.exports.resetPasswordPost = async(req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    })
    
    res.redirect("/")
}

