const enumParamsRequest = require("../constants/enumParamsRequest");

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

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email.toString().toLowerCase());
};

const isValidPhone = (phone) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  return regexPhoneNumber.test(phone.toString());
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
  if (Array.isArray(arrayParams) && arrayParams.length > 0) {
    const formatArray = translateParams(arrayParams);
    const formatText = capitalizeFirstLetter(formatArray.join(", ").trim());
    return {
      message:
        formatText +
        " " +
        (enumParamsRequest.typeErrorTranslate[typeError] || "không hợp lệ"),
      error: handleGenerateErrorForDev(arrayParams, typeError) || null,
    };
  }
  return {
    message: arrayParams,
    error: typeError,
  };
};

// Check params request is Valid
const handleShowErrorParamsInValid = (params) => {
  const paramsRequiredError = [];
  const paramsTypeError = [];
  if (params && typeof params === "object") {
    const keys = Object.keys(params);
    if (Array.isArray(keys) && keys.length > 0) {
      keys.forEach((item) => {
        const { type, value, required, customValidate } = params[item];

        if (required && !checkRequired(value)) {
          paramsRequiredError.push(item);
        } else if (type && !checkTypeValue(value, type)) {
          paramsTypeError.push(item);
        } else if (Array.isArray(customValidate) && customValidate.length > 0) {
          customValidate.forEach((validate) => {
            if (!validate(value)) {
              paramsTypeError.push(item);
            }
          });
        }
      });
    }
    if (paramsRequiredError.length > 0) {
      return handleGenerateErrorResponse(paramsRequiredError, "requiredError");
    }
    if (paramsTypeError.length > 0) {
      return handleGenerateErrorResponse(paramsTypeError, "typeError");
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
        return handleGenerateErrorResponse(duplicateParams, "duplicateError");
      }
    }
  }
  return {};
};

module.exports = {
  handleShowErrorParamsInValid,
  handleShowErrorParamsDuplicate,
  generateUniqueID,
  isValidEmail,
  isValidPhone,
};
