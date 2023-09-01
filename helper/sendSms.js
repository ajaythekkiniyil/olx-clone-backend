const user = require('../model/user')

const sendSms = async (phone) => {
  const otp = Math.floor(Math.random() * 10000)

  const newUser = new user(
    {
      phone: phone,
      otp: otp,
      verified: false,
    }
  )
  try {
    const resp = await newUser.save()
    // after 5 minutes need to delete otp from db
    deleteStoredOtp(phone)
    return true
  }
  catch {
    return false
  }
}

const deleteStoredOtp = (phone) => {
  setTimeout(() => {
    user.findOneAndUpdate(
      { phone: phone },
      { $unset: { otp: 1 } },
      { new: true },
    )
      .then((resp) => {
        // console.log('otp deleted');
      })
      .catch(err => {
        console.log('otp not deleted, error occored');
      })
  }, 300000);
}

module.exports = sendSms


