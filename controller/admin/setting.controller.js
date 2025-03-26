const SettingGeneral = require("../../models/setting-general.model")
module.exports.index = async(req, res) => { 
    const settingGeneral = await SettingGeneral.findOne({})
    res.render("admin/page/setting/index", { 
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral 
    });
};

module.exports.update = async(req, res) => { 
    console.log(req.body)
    const settingGeneral = await SettingGeneral.findOne({})
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id,
        }, req.body)
    }else{
        const record = new SettingGeneral(req.body);
        await record.save();
    }

    req.flash("success", "Cập nhật thành công")

    res.redirect("back")
};