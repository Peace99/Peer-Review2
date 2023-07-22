const cloudinary = require("cloudinary").v2;
// require("dotenv").config({ path: ".env" });

 cloudinary.config({ 
  cloud_name: 'dpa6e1k37', 
  api_key: '978533835362628', 
  api_secret: '***************************' 
});



console.log(cloudinary.config())
module.exports = cloudinary;
