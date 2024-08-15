import { NextApiRequest, NextApiResponse } from 'next'

import { sendEmail } from './_services'

const { ACCEPTS_LOCALHOST_EMAILS = 'none set' } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => res.status(401).send('Deprecated')

export const buildSubject = (election_title?: string) => `Vote Invitation${election_title ? `: ${election_title}` : ''}`

export const send_invitation_email = ({
  from,
  link,
  subject_line,
  tag,
  voter,
}: {
  from?: string
  link: string
  subject_line: string
  tag: string
  voter: string
}) => {
  // Don't accidentally send localhost emails
  if (link.includes('localhost')) {
    // Unless the recipient is a whitelisted admin address
    const toAdmin = voter.endsWith(ACCEPTS_LOCALHOST_EMAILS)
    if (!toAdmin)
      throw `Blocking sending 'localhost' email link to ${voter}. Override with env.ACCEPTS_LOCALHOST_EMAILS`
  }

  // Make sure auth_token is well formed
  if (!/auth=(\d|[a-f]){10}$/.test(link)) throw `Blocking sending malformed auth invite ${link} to ${voter}`

  return sendEmail({
    from,
    preheader: `Click here to securely cast your vote: ${link}`,
    recipient: voter,
    subject: subject_line,
    tag,
    text: `<h2 style="margin: 0">${subject_line}</h2>
Click here to securely cast your vote: 
<a href="${link}" style="font-weight: bold;">${link}</a> 

<em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
  })
}
