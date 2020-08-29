import Firebase from 'firebase-admin'
import Mailgun from 'mailgun-js'

const {
  ADMIN_EMAIL,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  PUSHOVER_APP_TOKEN,
  PUSHOVER_USER_KEY,
} = process.env

// Init firebase (only once)
export const firebase = !Firebase.apps.length
  ? Firebase.initializeApp({
      credential: Firebase.credential.cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
        projectId: FIREBASE_PROJECT_ID,
      }),
      databaseURL: FIREBASE_DATABASE_URL || 'https://siv-demo.firebaseio.com',
    })
  : Firebase.app()

/** Init mailgun */
const mailgun = Mailgun({
  apiKey: MAILGUN_API_KEY as string,
  domain: MAILGUN_DOMAIN || 'secureinternetvoting.org',
})

export const sendEmail = ({ recipient, subject, text }: { recipient: string; subject: string; text: string }) =>
  mailgun.messages().send({
    from: 'SIV Admin <admin@secureinternetvoting.org>',
    html: `<body style="background-color: #f5f5f5; padding: 2em;">
    <table align="center" style="text-align: left; max-width: 600px; background-color: white;">
        <tr>
          <td align="center" style="text-align:center; background: linear-gradient(90deg, #010b26 0%, #072054 100%);">
            <a href="https://secureinternetvoting.org" style="font-size: calc(0.9vw + 0.9rem); font-weight: 700; color: white; line-height: 60px; text-decoration: none;">
              Secure Internet Voting
            </a>
          </td>
        </tr>
        <tr style="display: block; margin: 30px;">
          ${text.replace(/\n/g, '<br />')}
        </tr>
      </table></body>`,
    subject,
    to: ADMIN_EMAIL || recipient,
  })

/** Helper function to use Pushover */
export const pushover = (title: string, message: string) =>
  fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({ message, title, token: PUSHOVER_APP_TOKEN, user: PUSHOVER_USER_KEY }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
