const router = require('express').Router()
const otp = require('../model/otp')
const loginWithPhone = require('../model/loginWithPhone')
const sendSMSFunction = require('../helper/smsApi')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

// generate random otp and send otp to user and store in DB
router.post('/send-otp', (req, res) => {
    const phoneNumber = "91" + req.body.phone
    // check if phone number is already exist
    loginWithPhone.find({ phone: phoneNumber }).then(async (resp) => {
        // find metod return array with phone number if phone number exist otherwise empty array
        if (resp.length === 1) {
            res.status(200).json({ 'msg': 'phone number already exist', isPhoneExit: true })
        }
        else {
            // generate random 4 digit otp
            const generatedOtp = Math.floor(Math.random() * 10000)

            // await sendSMSFunction(phoneNumber, generatedOtp)
            const newOtp = new otp({ number: generatedOtp })
            newOtp.save()
                .then(response => res.status(200).json({ msg: 'otp generated', success: true }))
                .catch(err => res.status(400).json({ 'error': true, 'msg': err.message }))
        }
    })
})

// verify user entered otp with database otp
// after verify delete otp from DB
router.post('/verify-otp', (req, res) => {
    const userEnteredOtp = req.body.userEnteredOtp
    const phoneNumber = '91' + req.body.phone

    otp.findOne({ number: userEnteredOtp })
        .then(async (otp) => {
            // if opt entered is wrong
            if (otp == null) {
                res.json({ error: true, 'msg': 'invalid otp' })
            }
            // otp verified
            else {
                const newPhone = new loginWithPhone({ phone: phoneNumber })
                await newPhone.save()

                // create jwt token and send to front-end
                const token = jwt.sign({ phone: phoneNumber }, process.env.JWT_SECRET)

                // after verify delete otp
                otp.deleteOne({ number: userEnteredOtp })
                    .then(() => console.log('otp deleted'))
                    .catch(() => console.log('otp delete error'))

                res.json({ success: true, 'msg': 'otp verified', token: token })
            }
        })
        .catch(err => console.log(err))
})

module.exports = router