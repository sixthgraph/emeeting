import nodemailer from 'nodemailer'

export const sendEmail = async ({ email }: any) => {
  console.log('start sendEmail')

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

    const mailOptions = {
      from: 'webmaster@excelink.co.th',
      to: email,
      subject: 'Email from RouteFlow',
      html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}">here</a> please...</p>`
    }

    console.log('mailOptions = ')
    console.log(mailOptions)

    const mailresponse = await transport.sendMail(mailOptions)

    console.log('mailresponse ----- ')
    console.log(mailresponse)

    return mailresponse
  } catch (error: any) {
    throw new Error(error.message)
  }
}
