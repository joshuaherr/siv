import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

import { firebase, pushover, sendEmail } from './_services'

const { ADMIN_PASSWORD } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { ballot_design, election_id, election_title, password, voters } = req.body

  // 1. Check for password
  if (password !== ADMIN_PASSWORD) return res.status(401).send('Invalid Password.')

  // 2. Generate auth token for each voter
  const auth_tokens = voters.map(generateAuthToken)

  // This will hold all our async tasks
  const promises: Promise<unknown>[] = []

  // 3. Store auth tokens in db
  const election = firebase.firestore().collection('elections').doc(election_id)
  promises.push(election.update({ ballot_design, election_title }))
  promises.push(
    Promise.all(
      voters.map((voter: string, index: number) =>
        election.collection('voters').doc(voter).set({ auth_token: auth_tokens[index], email: voter, index }),
      ),
    ),
  )

  // 4. Email each voter their auth token
  promises.push(
    bluebird.map(
      voters,
      (voter: string, index: number) => {
        const link = `${req.headers.origin}/election/${election_id}/vote?auth=${auth_tokens[index]}`

        return send_invitation_email({ link, subject_line: buildSubject(), voter }).then((result) => {
          console.log(voter, result)
          // Wait a second after sending to not overload Mailgun
          return new Promise((res) => setTimeout(res, 1000))
        })
      },
      { concurrency: 10 },
    ),
  )

  // 5. Send Admin push notification
  promises.push(pushover(`Invited ${voters.length} voters`, voters.join(', ')))

  await Promise.all(promises)

  return res.status(201).end(election_id)
}

export const buildSubject = (election_title?: string) => `Vote Invitation${election_title ? `: ${election_title}` : ''}`

export const send_invitation_email = ({
  from,
  link,
  subject_line,
  voter,
}: {
  from?: string
  link: string
  subject_line: string
  voter: string
}) => {
  // Don't send localhost emails to non-admins
  if (link.includes('localhost') && !voter.endsWith('@dsernst.com'))
    throw `Blocking sending 'localhost' email link to ${voter}`

  // Make sure auth_token is well formed
  if (!/auth=(\d|[a-f]){10}$/.test(link)) throw `Blocking sending malformed auth invite ${link} to ${voter}`

  return sendEmail({
    from,
    preheader: `Click here to securely cast your vote: ${link}`,
    recipient: voter,
    subject: subject_line,
    text: `<h2 style="margin: 0">${subject_line}</h2>
Click here to securely cast your vote: 
<a href="${link}" style="font-weight: bold;">${link}</a> 

<em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
  })
}
