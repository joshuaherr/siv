import Link from 'next/link'

import { voters } from './election-parameters'
import { Paper } from './Paper'

const redHex = '#e67e37'

const AuthToken = ({ s }: { s?: boolean }) => (
  <span style={{ color: redHex, fontWeight: 'bold' }}>Voter Auth Token{s ? 's' : ''}</span>
)
const Highlight = (props: { children: string }) => (
  <span style={{ backgroundColor: `${redHex}44`, border: `1px solid ${redHex}`, padding: '0 2px' }} {...props} />
)

export const Invitation = () => (
  <Paper marginBottom noFade style={{ position: 'relative' }}>
    <img
      src="/protocol/step-1-invitation-icon.png"
      style={{ maxWidth: 35, opacity: 0.5, position: 'absolute', right: 'calc(1vw + 5px)', width: '7vw' }}
    />
    <p>
      From: <b>elections@local.gov</b> <br />
      To: <b>you@email.com</b> <br />
      Subject: <b>Your Vote Invitation</b>
    </p>
    <p>Voting for our next Mayor is now open.</p>
    <p>Votes accepted for the next 14 days.</p>
    <p>
      Click here to securely cast your vote: <br />
      <a style={{ cursor: 'pointer' }}>
        www.local.gov/2020election?auth=
        <Highlight>{voters[0].auth}</Highlight>
      </a>
    </p>
    <p>
      <i style={{ fontSize: 12 }}>
        This link is unique for you. Don&apos;t share it with anyone, or they&apos;ll be able to take your vote. (
        <a style={{ cursor: 'pointer' }}>Help</a>)
      </i>
    </p>
  </Paper>
)

export const InvitationExplanation = () => (
  <>
    <p>
      The point of this step is to get each voter their {<AuthToken />}, highlighted in <Highlight>orange</Highlight>.
    </p>
    <div>
      <p style={{ fontWeight: 'bold' }}>Key Properties of {<AuthToken s />}</p>
      <ul style={{ bottom: 10, paddingInlineStart: 15, position: 'relative' }}>
        {[
          'required to vote',
          'unique per voter',
          'generated by election admin',
          'infeasible to guess',
          'can only be used once',
          'election admin can invalidate individual Auth Tokens, & generate new ones, if necessary',
          'after the election, the public can see all Auth Tokens generated, invalidated, or used (but not content of any votes)',
        ].map((item, index) => (
          <li key={index} style={{ fontSize: 7, marginBottom: 5 }}>
            <span style={{ fontSize: 14, position: 'relative', top: 2 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <br />
    <p>
      Here we use an easy distribution channel — a simple email. But election administrators can offer other options,
      including 2-factor methods with SMS, TOTP, or IP address geolocation.
    </p>
    <p>
      Admins can even send Voter Auth Tokens via traditional postal mail. This makes it easy for jurisdictions already
      offering Vote by Mail to begin accepting returned ballots online, gaining the powerful Speed, Privacy, &amp;
      Verification features of SIV.{' '}
      <em>
        See{' '}
        <Link href="/faq">
          <a>How does SIV authenticate voters</a>
        </Link>{' '}
        for more.
      </em>
    </p>
  </>
)
