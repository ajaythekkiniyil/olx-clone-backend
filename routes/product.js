const express = require('express')
const router = express.Router()
const car = require('../model/car')
const otherProduct = require('../model/otherProduct')
const { verifyJwt } = require('../helper/authenticate')
const { upload, uploadFile } = require('../helper/fileupload')

router.post('/add-car', verifyJwt, upload.array('image'), async (req, res) => {
    const postInfo = JSON.parse(req.body.postInfo)
    const userId = req.user.userId
    const { files } = req

    if (files.length !== 0) {
        // function to upload
        uploadFile(files)
            .then(async (imageUrlsArray) => {

                if (postInfo.category === 'car') {
                    const newcar = new car(
                        {
                            "sellerId": userId,
                            "brand": postInfo.brand,                          // String
                            "year": postInfo.year,                            // Number
                            "fuel": postInfo.fuel,                            // String
                            "kilometerDriven": postInfo.kilometerDriven,      // Number
                            "owner": postInfo.owner,                          // Number
                            "title": postInfo.title,                          // String
                            "description": postInfo.description,              // String
                            "price": postInfo.price,                          // Number
                            "category": postInfo.category,                    // String
                            "datePosted": new Date(),                         // Date
                            "image": imageUrlsArray,                          // Array
                            "location": postInfo.location,                    // String
                        }
                    )
                    const savedcar = await newcar.save()
                    if (savedcar) {
                        res.send({ status: true, message: 'Successfully saved new post' })
                    }
                    res.send({ status: false, message: 'something went to wrong on saving' })

                }
                else {
                    const newProduct = new otherProduct({
                        "sellerId": userId,
                        "title": postInfo.title,
                        "description": postInfo.description,
                        "price": postInfo.price,
                        "category": postInfo.category,
                        "datePosted": new Date(),
                        "image": imageUrlsArray,
                        "location": postInfo.location,
                    })
                    const savedProduct = await newProduct.save()
                    if (savedProduct) {
                        return res.send({ status: true, message: 'Successfully saved new post' })
                    }
                    return res.send({ status: false, message: 'something went to wrong on saving' })
                }
            })
            .catch(err => {
                res.status(500).json({ status: false, message: err });
            })

        return
    }
    res.status(500).json({ status: false, message: 'check all fields are filled' });
})

router.get('/get-all-products', async (req, res) => {
    try {
        const totalCars = await car.count()
        const totalOtherProducts = await otherProduct.count()
        
        const allCar = await car.find({})
        const allOtherProduct = await otherProduct.find({})
        
        const totalCount = totalCars + totalOtherProducts
        const allProducts = [...allCar, ...allOtherProduct]

        const productObject = { 'totalCount': totalCount, 'allProducts': allProducts }
        res.status(200).json(productObject)
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router