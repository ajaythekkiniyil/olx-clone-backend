const express = require('express')
const router = express.Router()
const car = require('../model/car')
const { verifyJwt } = require('../helper/authenticate')

require('dotenv').config()

const folderName = process.env.CLOUDINARY_FOLDER
const multer = require('multer');
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add-car', verifyJwt, upload.array('image'), async (req, res) => {
    const userId = req.user.userId
    try {
        const { files } = req

        if (files.length === 0) {
            return res.status(400).json({ status: false, message: 'No files were uploaded.' });
        }

        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder: folderName },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading buffer to Cloudinary:', error);
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(file.buffer);
            });
        });

        Promise.all(uploadPromises)
            .then(async(uploadedImages) => {
                const newcar = new car(
                    {
                        "sellerId": userId,
                        "brand": req.body.brand,                          // String
                        "year": req.body.year,                            // Number
                        "fuel": req.body.fuel,                            // String
                        "kilometerDriven": req.body.kilometerDriven,      // Number
                        "owner": req.body.owner,                          // Number
                        "title": req.body.title,                          // String
                        "description": req.body.description,              // String
                        "price": req.body.price,                          // Number
                        "category": req.body.category,                    // String
                        "datePosted": new Date(),                         // Date
                        "image": uploadedImages,                          // Array
                        "location": req.body.location,                    // String
                    }
                )
                const savedcar = await newcar.save()
                res.send({ status: true, message: 'Successfully saved new car' })
            })
            .catch((error) => {
                console.error('Error uploading one or more files:', error);
                res.status(500).json({ status: false, message: 'Error uploading files.' });
            });

    }
    catch (err) {
        console.error('Error uploading one or more files:', error);
        res.status(500).json({ status: false, message: 'Error uploading files.' });
    }
})

router.get('/get-all-products',verifyJwt, async (req, res) => {
    try {
        const totalCount = await car.count()
        const allProducts = await car.find({})
        const productObject = { 'totalCount': totalCount, 'allProducts': allProducts }
        res.status(200).json(productObject)
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router