const express = require('express')
const router = express.Router()
const authenticate = require('../helper/authenticate')
const sendSms = require('../helper/sendSms')
const user = require('../model/user')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    authenticate.createJwt('userData')
    res.send('user route')
})

// delete not verified phone number from db every 1 hour
const deleteNotVerifiedPhone = async () => {
    await user.deleteMany({ $or: [{ verified: false }, { $and: [{ verified: true }, { password: null }] }] })
}

// signup using phone number
router.post('/signup-phone', async (req, res) => {
    await deleteNotVerifiedPhone()

    const phone = req.body.phone

    await user.find({ phone: phone })
        .then(async (resp) => {
            //phone number not registered
            if (resp.length === 0) {
                const isOtpSend = await sendSms(phone)
                res.status(200).json({ status: true, message: 'otp send to phone numbe, otp timeout is 5 minutes' })
            }
            // phone number already registered
            else {
                res.status(200).send({ status: false, registered: true, message: 'phone number already registered' })
            }
        })
        .catch(err => {
            res.status(400).send({ status: false, message: 'bad request', error: err })
        })
})
// 2. using gmail

router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body
    await user.findOneAndUpdate({ phone: phone, otp: otp }, { verified: true, password: null })
    user.find({ phone: phone, otp: otp })
        .then((matchedUser) => {
            if (matchedUser.length != 0) {
                res.status(200).json({ status: true, message: 'User verified' })
            }
            else {
                res.status(200).json({ status: false, message: 'User not verified' })
            }
        })
        .catch(err => {
            res.status(400).json({ status: false, message: 'bad request' })
        })
})

router.post('/create-account', (req, res) => {
    const { password, phone } = req.body

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(200).json({ status: false, message: 'Error occured during account creation' })
        }
        user.findOneAndUpdate({ phone: phone }, { password: hashedPassword })
            .then(resp => {
                res.status(200).json({ status: true, message: 'New account created' })
            })
            .catch(err => {
                res.status(400).json({ status: false, message: 'Error occured during account creation' })
            })
    })
})

router.post('/login-phone', (req, res) => {
    const { password, phone } = req.body

    user.find({ phone: phone })
        .then(resp => {
            if (resp.length === 1) {
                const userId = (resp[0]._id).toString()
                const hashedPassword = (resp[0].password).toString()
                const plainPassword = password?.toString()

                bcrypt.compare(plainPassword, hashedPassword)
                    .then(async result => {
                        if (result) {
                            
                            const user = {
                                userId: userId
                            }

                            const token = await authenticate.createJwt(user)

                            res.status(200).json({ status: true, message: 'Successfully logged_in', token: token })
                        }
                        else {
                            res.status(200).json({ status: false, message: 'Wrong login credentials' })
                        }
                    })
                    .catch(err => {
                        res.status(400).json({ status: false, message: 'error while login' })
                    })
            }
        })
})

module.exports = router