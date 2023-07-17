const CustomAPIError = require("./custom-api");
const BadRequest = require("./badrequest");
const NotFoundError = require("./notfound");
const UnauthenticatedError = require("./unauthorized");

module.exports = {
  CustomAPIError,
  BadRequest,
  NotFoundError,
  UnauthenticatedError,
};
