const cloudinary = require('cloudinary').v2
const multer = require('multer')

require('dotenv').config()

const folderName = process.env.CLOUDINARY_FOLDER

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
// need to import upload in router, eg: upload.array('image')
const upload = multer({ storage })

const uploadFile = (files) => {

    return new Promise((resolve, reject)=>{
        try {
            // multiple image upload using promise to cloudinary
            const uploadPromises = files?.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: 'auto', folder: folderName },
                        (error, result) => {
                            if (error) {
                                reject({ 'status': false, 'message': error });
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    ).end(file.buffer);
                });
            });
    
            Promise.all(uploadPromises)
                .then((uploadedImages) => {
                    resolve(uploadedImages)
                })
                .catch((error) => {
                    reject({ status: false, message: error });
                });
    
        }
        catch(error){
            reject({ status: false, message: error });
        }
    })

}

module.exports = { upload, uploadFile }
