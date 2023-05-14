const router = require('express').Router()
const otp = require('../model/otp')
const user = require('../model/user')
const sendSMSFunction = require('../helper/smsApi')

// generate random otp and send otp to user and store in DB
router.post('/send-otp', async (req, res) => {
    const phoneNumber = "91" + req.body.phone

    // Generate a 4-digit OTP
    const generatedOtp = Math.floor(Math.random() * 10000)

    // await sendSMSFunction(phoneNumber, generatedOtp)
    const newOtp = new otp({ number: generatedOtp })
    newOtp.save()
        .then(response => res.status(200).json({ msg: 'otp generated', success: true }))
        .catch(err => res.status(400).json({ 'error': true, 'msg': err.message }))
})

// verify user entered otp with database otp
// after verify delete from DB
router.post('/verify-otp', (req, res) => {
    const userEnteredOtp = req.body.userEnteredOtp
    const phoneNumber = req.body.phone

    // send user info to UI
    // redirected to home page with user profile
    otp.findOne({ number: userEnteredOtp })
        .then(response => {
            if (response) {
                // otp verified, store new user to DB
                const newUser = new user({name: '44sdfsdfsd4s44',phone: phoneNumber,email : 'sdfsdfsdf'})
                newUser.save()
                .then((err, user)=> {
                    const respObj = {'success': true, 'user': user}
                    res.status(200).json(JSON.stringify(respObj))
                    // after verify delete otp
                    otp.deleteOne({number: userEnteredOtp})
                    .then(()=>console.log('otp deleted'))
                    .catch(()=>console.log('otp delete error'))
                })
                .catch(err=> console.log(err))
            }
            if (response === null) {
                res.status(200).json({ 'error': true })
            }
        })
        .catch(err => res.status(200).json({ 'error': true }))
})


module.exports = router