const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
const md5 = require('md5');
const { prefixAdmin } = require("../../config/system");
module.exports.index = async(req, res) => {
    let find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token");

    for(const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/page/account/index", { 
        titlePage: "Danh sách tài khoản",
        records: records
    });
};

module.exports.create = async(req, res) => {
    let find = {
        deleted: false,
    }
    const role = await Role.find(find)

    res.render("admin/page/account/create", { 
        titlePage: "Tạo mới tài khoản",
        roles: role,
    });
};

module.exports.createPost = async(req, res) => {
    req.body.password = md5(req.body.password);
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back")
    }else{
        const record = new Account(req.body)

        await record.save()

        res.redirect(`${prefixAdmin}/accounts`)
    }
    
};

module.exports.edit = async(req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    }

    try {
        const data = await Account.findOne(find);

        const role = await Role.find({
            deleted: false
        })

        res.render("admin/page/account/edit", { 
            titlePage: "Tạo mới tài khoản",
            roles: role,
            data: data
        });
    } catch (error) {
        res.redirect(`${prefixAdmin}/accounts`)
    }
};

module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id},
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back")
    }else{
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password
        }
        
        await Account.updateOne({_id: id}, req.body);
        req.flash("success", "Cập nhật tài khoản thành công")
        res.redirect("back")
    }
    
};


  