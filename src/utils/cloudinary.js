const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.config");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "movie-ticket-booking",
    public_id: (req, file) => {
      console.log("file", file)
      const uniqueName = `${file.originalname.split(",")[0]}-${Date.now()}`;
      return uniqueName;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: {
   fileSize: 1 * 1024 * 1024

  },
  fileFilter: (req, file, cb) => {
    const FILE_TYPE = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    if(FILE_TYPE.includes(file.mimetype)){
        cb(null, true)

    }else{
        cb(null, new Error("only images are allowed"))
    }

  },
});


module.exports = upload
