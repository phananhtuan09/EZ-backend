const paramsTranslateEnum = {
  email: "email",
  phone: "số điện thoại",
  userName: "họ và tên",
  password: "mật khẩu",
  emailOrPhone: "email hoặc số điện thoại",
};

const typeErrorKey = {
  requiredError: "required",
  typeValueError: "typeValue",
  duplicateError: "duplicate",
  notFoundError: "notFound",
  unauthorized: "unauthorized",
  lengthError: "length",
};

const typeErrorTranslate = {
  requiredError: "là trường bắt buộc",
  typeValueError: "là trường không hợp lệ",
  duplicateError: "đã tồn tại",
  notFoundError: "không tồn tại",
  unauthorized: "không có quyền",
  lengthError: "là trường có độ dài không hợp lệ",
};

module.exports = {
  typeErrorTranslate,
  paramsTranslateEnum,
  typeErrorKey,
};
