const Product = require("../../models/product.model")
const newPriceHelper = require("../../helpers/products")
module.exports.index = async(req, res) => {
    const keyword = req.query.keyword;
    let newPriceProducts = [];

    if(keyword){
        const keywordRegex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        newPriceProducts = newPriceHelper.priceNewProduct(products)
    }

    res.render("client/page/search/index", {
        titlePage: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newPriceProducts
    })
}