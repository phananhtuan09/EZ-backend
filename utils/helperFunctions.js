const fs = require("fs");
const path = require("path");

const enumParamsRequest = require("../constants/enumParamsRequest");
const {
  typeImageStorage,
  errorParamAvatar,
} = require("../constants/enumImage");

// Check if a value is required and not empty
const checkRequired = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string" && value.trim() === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return false;
  }
  return true;
};

// Check if the type of a value matches the expected type
const checkTypeValue = (value, expectedType) => {
  if (expectedType === "string" && typeof value === "string") {
    return true;
  }
  if (expectedType === "number" && typeof value === "number") {
    return true;
  }
  if (expectedType === "boolean" && typeof value === "boolean") {
    return true;
  }
  if (
    expectedType === "object" &&
    typeof value === "object" &&
    value !== null
  ) {
    return true;
  }
  if (expectedType === "array" && Array.isArray(value)) {
    return true;
  }
  if (expectedType === "null" && value === null) {
    return true;
  }
  if (expectedType === "undefined" && typeof value === "undefined") {
    return true;
  }
  return false;
};

const customValidateParamsRequest = {
  isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return {
      typeError: enumParamsRequest.typeErrorKey.typeValueError,
      isValid: emailRegex.test(email.toString().toLowerCase()),
    };
  },
  isPhoneValid(phone) {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return {
      typeError: enumParamsRequest.typeErrorKey.typeValueError,
      isValid: regexPhoneNumber.test(phone.toString()),
    };
  },
  isEmailOrPhoneValid(emailOrPhone) {
    return {
      typeError: enumParamsRequest.typeErrorKey.typeValueError,
      isValid:
        customValidateParamsRequest.isEmailValid(emailOrPhone).isValid ||
        customValidateParamsRequest.isPhoneValid(emailOrPhone).isValid,
    };
  },
  isLengthValid(text, minLength = 4, maxLength = 255) {
    return {
      typeError: enumParamsRequest.typeErrorKey.lengthError,
      isValid: text.length >= minLength && text.length <= maxLength,
    };
  },
  isPasswordValid(password) {
    //Password must have more than 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
    return {
      typeError: enumParamsRequest.typeErrorKey.typeValueError,
      isValid: regex.test(password),
    };
  },
};

// Translate parameter names for show end user
const translateParams = (params) => {
  if (Array.isArray(params) && params.length > 0) {
    const keys = Object.keys(enumParamsRequest.paramsTranslateEnum);
    return params.reduce((acc, cur) => {
      if (keys.includes(cur)) {
        acc.push(enumParamsRequest.paramsTranslateEnum[cur]);
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
  }
  return params;
};

const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  }

  // Capitalize the first character and concatenate the rest of the string.
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Return error for FE handle logic
const handleGenerateErrorForDev = (arrayParams, typeError) => {
  return {
    typeError,
    paramsError: arrayParams,
  };
};

// Format error and message for params request
const handleGenerateErrorResponse = (arrayParams, typeError) => {
  const removeDuplicate = [...new Set(arrayParams)];
  if (Array.isArray(removeDuplicate) && removeDuplicate.length > 0) {
    const formatArray = translateParams(removeDuplicate);
    const formatText = capitalizeFirstLetter(formatArray.join(", ").trim());
    return {
      message:
        formatText +
        " " +
        (enumParamsRequest.typeErrorTranslate[typeError] || "không hợp lệ"),
      error: handleGenerateErrorForDev(removeDuplicate, typeError) || null,
    };
  }
  return {};
};

// Check params request is Valid
const handleShowErrorParamsInValid = (params) => {
  const paramsRequiredError = [];
  const paramsTypeError = [];
  const paramsLengthError = [];
  if (params && typeof params === "object") {
    const keys = Object.keys(params);
    if (Array.isArray(keys) && keys.length > 0) {
      keys.forEach((item) => {
        const { type, value, required, customValidate } = params[item];

        if (required && !checkRequired(value)) {
          // Check is empty params
          paramsRequiredError.push(item);
        } else if (type && !checkTypeValue(value, type)) {
          // Check is valid type params
          paramsTypeError.push(item);
        } else if (Array.isArray(customValidate) && customValidate.length > 0) {
          customValidate.forEach((validate) => {
            // Execute custom validate for params
            const resultTest = validate(value);
            if (
              !resultTest.isValid &&
              resultTest.typeError ===
                enumParamsRequest.typeErrorKey.typeValueError
            ) {
              paramsTypeError.push(item);
            }

            if (
              !resultTest.isValid &&
              resultTest.typeError ===
                enumParamsRequest.typeErrorKey.lengthError
            ) {
              paramsLengthError.push(item);
            }
          });
        }
      });
    }
    // Error required
    if (paramsRequiredError.length > 0) {
      return handleGenerateErrorResponse(
        paramsRequiredError,
        enumParamsRequest.typeErrorKey.requiredError
      );
    }
    // Error length error
    if (paramsLengthError.length > 0) {
      return handleGenerateErrorResponse(
        paramsLengthError,
        enumParamsRequest.typeErrorKey.lengthError
      );
    }

    // Error type error
    if (paramsTypeError.length > 0) {
      return handleGenerateErrorResponse(
        paramsTypeError,
        enumParamsRequest.typeErrorKey.typeValueError
      );
    }
  }
  return {};
};

// Generate uniqueID at least four character
const generateUniqueID = (lastUserID) => {
  return !isNaN(lastUserID)
    ? (parseInt(lastUserID, 10) + 1).toString().padStart(lastUserID.length, "0")
    : "";
};

// Return properties duplicate value in two object same key
const findDuplicateParamByValue = (obj1, obj2) => {
  const duplicates = [];

  for (const key in obj1) {
    if (
      obj2.hasOwnProperty(key) &&
      obj1[key].toString().toLowerCase() === obj2[key].toString().toLowerCase()
    ) {
      duplicates.push(key);
    }
  }

  return duplicates;
};

const handleShowErrorParamsDuplicate = (params1, params2) => {
  if (
    params1 &&
    typeof params1 === "object" &&
    params2 &&
    typeof params2 === "object"
  ) {
    const keys = Object.keys(params1);
    if (Array.isArray(keys) && keys.length > 0) {
      const duplicateParams = findDuplicateParamByValue(params1, params2);
      if (Array.isArray(duplicateParams) && duplicateParams.length > 0) {
        return handleGenerateErrorResponse(
          duplicateParams,
          enumParamsRequest.typeErrorKey.duplicateError
        );
      }
    }
  }
  return {};
};

// Param imageName is stored in DB
const helperReturnURLImage = async (imageName, typeImage) => {
  return new Promise((resolve, reject) => {
    if (imageName && typeof imageName === "string") {
      if (typeImage === typeImageStorage.avatar) {
        const imagePathInSource = path.join(
          __dirname,
          "..",
          "/uploads/avatars",
          imageName
        );

        // Check if the image file exists
        fs.access(imagePathInSource, fs.constants.F_OK, (err) => {
          if (err) {
            // File doesn't exist
            resolve("");
          } else {
            // File exists
            resolve(
              `${process.env.SERVER_HOST_URL}:${process.env.SERVER_PORT}/uploads/avatars/${imageName}`
            );
          }
        });
      }
    } else {
      resolve("");
    }
  });
};

const returnMessageForMulter = (errorCode) => {
  switch (errorCode) {
    case "LIMIT_FILE_SIZE":
      return {
        message: "Tệp tải lên quá lớn",
        typeError: errorParamAvatar.invalidMaxSize,
      };
    default:
      return {
        message: "Tệp tải lên không hợp lệ",
        typeError: "invalidFile",
      };
  }
};

const generateOtp = () => {
  return (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
};

module.exports = {
  handleShowErrorParamsInValid,
  handleShowErrorParamsDuplicate,
  generateUniqueID,
  customValidateParamsRequest,
  helperReturnURLImage,
  returnMessageForMulter,
  generateOtp,
};
