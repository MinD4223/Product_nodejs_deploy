const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.route")
const productCategoryRouter = require("./product-category.route")
const roleRouter = require("./role.route");
const accountRouter = require("./account.route")
const authRouter = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware")
const myAccountRouter = require("./my-account.route")
const settingRouter = require("./setting.route")
module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use( PATH_ADMIN+"/dashboard",authMiddleware.requireAuth , dashboardRouter);

    app.use( PATH_ADMIN + "/products",authMiddleware.requireAuth , productRouter);

    app.use( PATH_ADMIN + "/product-category",authMiddleware.requireAuth , productCategoryRouter)

    app.use( PATH_ADMIN + "/roles",authMiddleware.requireAuth , roleRouter);

    app.use( PATH_ADMIN + "/accounts",authMiddleware.requireAuth , accountRouter);

    app.use( PATH_ADMIN + "/my-account",authMiddleware.requireAuth , myAccountRouter);

    app.use( PATH_ADMIN + "/auth", authRouter)

    app.use( PATH_ADMIN + "/settings", authMiddleware.requireAuth,settingRouter)
}