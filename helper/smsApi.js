require('dotenv').config()
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
    apiKey: process.env.NEXMO_APIKEY,
    apiSecret: process.env.NEXMO_API_SECRET,
})

const sendSMSFunction = (phoneNumber, generatedOtp) => {
    const from = "Vonage APIs"
    const to = phoneNumber
    const text = generatedOtp

    async function sendSMS() {
        await vonage.sms.send({ to, from, text })
            .then(resp => { console.log('Message sent successfully'); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    sendSMS();
}

module.exports = sendSMSFunction