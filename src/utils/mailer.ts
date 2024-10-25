// import { ContentWide } from '@core/svg/ContentWide'

import nodemailer from 'nodemailer'

// export const sendEmail = async (email: any, wid: any, sendFor: any) => {

export const sendEmail = async (reqData: any, sendFor: any) => {
  // console.log('start sendEmail')

  try {
    // eslint-disable-next-line import/no-named-as-default-member
    const transport = nodemailer.createTransport({
      host: 'mail.excelink.co.th',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'webmaster@excelink.co.th',
        pass: 'aroonrat'
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const mailOptions: any = {
      // from: 'webmaster@excelink.co.th',
      // to: email,
      // subject: 'New work from RouteFlow',
      // html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/work?wid=${wid}">here</a> please...</p>`
    }

    if (sendFor == 'send-work') {
      const { email, wid } = reqData

      mailOptions.from = 'webmaster@excelink.co.th'
      mailOptions.to = email
      mailOptions.subject = 'New work from RouteFlow'
      mailOptions.html = `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/work?wid=${wid}">here</a> please...</p>`
    }

    if (sendFor == 'forgot-password') {
      const { email } = reqData

      mailOptions.from = 'webmaster@excelink.co.th'
      mailOptions.to = email
      mailOptions.subject = 'New work from RouteFlow'
      mailOptions.html = `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/forgot-password">here</a> for set new password...</p>`
    }

    if (sendFor == 'send-notification') {
      const { title, message, email } = reqData

      mailOptions.from = 'webmaster@excelink.co.th'
      mailOptions.to = email
      mailOptions.subject = title
      mailOptions.html = `<p>${message}</p>`
    }

    // console.log('mailOptions = ')
    // console.log(mailOptions)

    const mailresponse = await transport.sendMail(mailOptions)

    // console.log('mailresponse ----- ')
    // console.log(mailresponse)

    return mailresponse
  } catch (error: any) {
    throw new Error(error.message)
  }
}
