const uploadToCloudinary = require("../../helpers/uploadToCloudirary")

module.exports.upload = (req, res, next) => {
  if (req.file) {
    uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = result.url;
  }
  next();
};

// module.exports.upload = (req, res, next) => {
//   if (req.file) {
//     uploadToCloudinary(req.file.buffer);
//     req.body[req.file.fieldname] = result.url;
//   }
//   next();
// };
