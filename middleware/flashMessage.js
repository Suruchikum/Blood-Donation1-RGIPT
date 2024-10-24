//middlewares/flashMessage.js

module.exports.flashMessage = function (req, res, next) {
  const successFlashMessageArr = req.flash("success");
  const errorFlashMessageArr = req.flash("error");
  res.locals.successFlashMessage = successFlashMessageArr[0];
  res.locals.errorFlashMessage = errorFlashMessageArr[0];
  console.log("successflsh", successFlashMessageArr);
  console.log("errorflash", errorFlashMessageArr);
  next();
};
