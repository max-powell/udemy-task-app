const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ({email, name}) => {
  sgMail.send({
      to: email,
      from: 'maxfpowell@gmail.com',
      subject: 'Thanks for joining',
      text: `Hi ${name}! Welcome.`
    })
}

const sendGoodbyeEmail = ({email, name}) => {
  sgMail.send({
    to: email,
    from: 'maxfpowell@gmail.com',
    subject: 'So long...',
    text: `Bye ${name}! It was fun while it lasted.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
