const Role = require("../../models/role.model")
const { prefixAdmin } = require("../../config/system");
module.exports.index = async(req, res) => { 
    let find = {
        deleted: false
    }

    const records = await Role.find(find)
    res.render("admin/page/role/index", { 
        pageTitle: "Nhóm quyền",
        records: records,
    });
};

module.exports.create = (req, res) => { 
    res.render("admin/page/role/create", { 
        pageTitle: "Thêm mới nhóm quyền" 
    });
  };

module.exports.createPost = async(req, res) => { 
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${prefixAdmin}/roles`)
};

module.exports.edit = async(req, res) => { 
    try {
        const id = req.params.id;
        const find = {
            _id: id,
            deleted: false
        }
        const resultRole = await Role.findOne(find)

        res.render("admin/page/role/edit", { 
            pageTitle: "Chỉnh sửa nhóm quyền",
            result: resultRole,
        });
    } catch (error) {
        res.redirect(`${prefixAdmin}/roles`)
    }
};

module.exports.editPatch = async(req, res) => { 
  
    const id = req.params.id;
   
    await Role.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật nhóm quyền thành công")
    res.redirect('back')

};

module.exports.permission = async(req, res) => { 
    let find = {
        deleted: false
    }

    const records = await Role.find(find)
    res.render("admin/page/role/permission", { 
        pageTitle: "Phân quyền",
        records: records
    });
   
};

module.exports.permissionPatch = async(req, res) => { 
    const permission = JSON.parse(req.body.permission)
    for(const item of permission){
        await Role.updateOne({_id: item.id}, {permissions: item.permission})
    }
        

    res.redirect('back')
   
};