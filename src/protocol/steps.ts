import { AllSubmittedBallots } from './AllSubmittedBallots'
import { Ballot } from './Ballot'
import { EncryptedVote } from './EncryptedVote'
import { EncryptionReceipt } from './EncryptionReceipt'
import { Invitation, InvitationExplanation } from './Invitation'
import { Plaintext } from './Plaintext'
import { Reencryption } from './Reencryption'
import { RemoveVoteTokens } from './RemoveVoteTokens'
import { ShuffleVotes } from './ShuffleVotes'
import { Unlocked } from './Unlocked'
import { VerificationSecret } from './VerificationSecret'
import { VoterList } from './VoterList'
import { YourSubmittedBallot } from './YourSubmittedBallot'

const colorize = (color: string) => (text: string) => `<span style="color: ${color};">${text}</span>`
const blue = colorize('#1332fe')
const orange = colorize('#e67e37')
const purple = colorize('#9013fe')

const semibold = (text: string) => `<span style="font-weight: 600;">${text}</span>`
const light = (text: string) => `<span style="font-size: 12px; opacity: 0.65;">${text}</span>`
const em = (text: string) => `<em>${text}</em>`

export type ImageLine = { image: string; maxWidth: number }
export type Subsection = { subsection: { header: string; list: string[] } }
export type ReactLine = { react: () => JSX.Element }

export type Line = Record<string, string> | ImageLine | Subsection | ReactLine | ''

export type Step = { leftFirst?: boolean; name: string; subheader: string; then: { left: Line[]; right?: Line[] }[] }

type Group = { group: string; steps: Step[] }

export const groupedSteps: Group[] = [
  {
    group: 'Before the Election',
    steps: [
      // Pre-req
      {
        name: 'Voter Registration',
        subheader: `Election administrator collects list of all valid voters, using the usual methods (in person, DMV, etc).`,
        then: [
          {
            left: [
              '',
              '',
              {
                p:
                  'Individuals voters should opt-in to SIV by registering an email address with their election administrator.',
              },
            ],
            right: [
              { html: light("For this demo, we'll pretend you're a voter named 'Adam Barton'.") },
              '',
              { react: VoterList },
            ],
          },
        ],
      },

      // Pre-req
      {
        name: 'Ballot Finalized',
        subheader: 'The official ballot is finalized, as with traditional paper elections.',
        then: [
          {
            left: [
              { details: 'There can be multiple questions, as many as the election requires.' },
              {
                html: light(
                  'SIV is 100% compatible with — and makes it easier to adopt — voting methods meant to improve upon the Choose-Only-One system, such as Ranked Choice Voting, Approval Voting, and Score Voting.',
                ),
              },
              '',
            ],
            right: [{ react: Ballot() }],
          },
        ],
      },

      // Pre-req
      {
        name: 'Trustee Registration',
        subheader: `Trustees — who ensure the privacy of the vote — are enrolled ahead of time.`,
        then: [
          {
            left: [
              {
                details: `Requirements:

          1. They will need their phone or computer online with the SIV Shuffling program open when the voting period closes.

          2. To enroll, they need to generate a private key, and take part in a Threshold Key generation process with the election admin to create the corresponding public key.

          Their Shuffling job is explained in Step 4, but their public keys are needed ahead-of-time for voters to encrypt their votes in Step 2.`,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    group: 'Voting Begins',
    steps: [
      // Step 1
      {
        name: 'Step 1: Invitation to Vote',
        subheader: 'Election administrator sends individualized invitations to all enrolled voters.',
        then: [
          {
            left: [{ react: InvitationExplanation }],
            right: [{ react: Invitation }],
          },
        ],
      },

      // Step 2
      {
        leftFirst: true,
        name: 'Step 2: Mark & Encrypt Your Vote',
        subheader: `Voter fills out their ballot, which gets immediately encrypted.`,
        then: [
          {
            left: [{ p: 'Voter sees a GUI to make it easy to fill out their ballot:' }],
            right: [{ react: Ballot(true) }],
          },
          {
            left: [{ html: `At the end, there's a special ${em('Verification Secret')} section.` }],
            right: [{ react: VerificationSecret }],
          },
          {
            left: [{ html: `This example results in a ${blue(semibold('plaintext vote'))} like:` }],
            right: ['', { react: Plaintext }],
          },
          { left: ['', '', ''] },
          {
            left: [
              {
                html: `Then the ${blue(semibold('plaintext vote'))} can be sealed, resulting in an ${purple(
                  semibold('encrypted vote'),
                )} like:`,
              },
            ],
            right: ['', { react: EncryptedVote }],
          },
          {
            left: [
              '',
              {
                html: `Encrypted votes ${semibold('can be safely shared')}, without revealing the vote.<br />
                  ${light('The encryption acts like sealing it inside a locked safe.')}`,
              },
            ],
          },
          { left: ['', '', '', ''] },
          // { html: `This step is completed by using a ${green(semibold('SIV Sealing Tool'))}:` },
          // { image: 'step-2g-tool-options.png', maxWidth: 462 },
          {
            left: [
              {
                html: `You can download an Encryption Receipt, allowing you or 3rd-party auditors to verify that everything worked as intended.<br />
          ${light(`This is optional. It helps prove or disprove claims of improper results.`)}`,
              },
            ],
            right: ['', { react: EncryptionReceipt }],
          },

          {
            left: [
              '',
              '',
              '',
              {
                html: `For extra security, this encryption step can be completed while offline (e.g. in airplane mode) and in a sandboxed incognito tab. <br />
          ${light(
            `This protects against the voting software itself being malicious, ensuring it can't possibly store any private vote information.`,
          )}`,
              },
            ],
          },
        ],
      },

      // Step 3
      {
        leftFirst: true,
        name: 'Step 3: Submit Encrypted Vote',
        subheader: 'The voter sends their encrypted vote + unique Vote Token to the election administrator.',
        then: [
          {
            left: [
              {
                html: `Election admin confirms the ${orange(
                  semibold('Vote Token'),
                )} matches an eligible voter, and hasn't already been used.`,
              },
            ],
            right: ['', '', { react: YourSubmittedBallot }, '', '', '', ''],
          },
          {
            left: [
              {
                details: 'If it passes, the admin adds it to a public list of all votes received so far.',
              },
            ],
            right: ['', { react: AllSubmittedBallots }, '', ''],
          },
          {
            left: [
              {
                html: `The election administrator has no way to know how a voter voted. Still, they can email voters a confirmation that their encrypted vote has been received and accepted.<br />
            ${light(
              `This lets the voter know their job is done. It also alerts the voter in case someone else somehow gained access to their vote token. And it serves as a written receipt that the vote was accepted, to allow for auditing.`,
            )}`,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    group: 'Voting Period Closes',
    steps: [
      // // Step
      // {
      //   name: 'Voters Identified',
      //   subheader: 'Election administrator can generate a list of everyone who submitted a valid Vote Token.',
      //   then: [
      //     {
      //       left: [
      //         {
      //           html: `${light(`Who voted, but not ${em('how')} anyone voted (which they don't know anyway).`)}`,
      //         },
      //         '',
      //         {
      //           html: `This creates greater trust by showing who the voters are. The public can see they’re real valid voters. Not people voting multiple times, or "dead people", or foreigners, etc., as skeptics worry about.<br />
      //   <br />
      //   ${light(
      //     `This also helps watchdogs pick a random sample of voters to conduct independent audits of the vote’s validity. With individual voters' permission, they can check reported results against voter receipts.`,
      //   )}`,
      //         },
      //         '',
      //       ],
      //       right: [{ react: WhoVoted }, '', ''],
      //     },
      //   ],
      // },

      // Step 4
      {
        leftFirst: true,
        name: 'Step 4: Verifiable Shuffle',
        subheader: "Encrypted votes are shuffled by the Trustees for voters' privacy.",
        then: [
          {
            left: [
              {
                html: light("The goal of this step is to unlink voters' identities from the contents of their votes."),
              },
            ],
          },
          {
            left: [
              '',
              '',
              '',
              '',
              {
                html: `First, the ${orange(semibold('Vote Tokens'))} are removed from the list of all encrypted votes.`,
              },
              '',
            ],
            right: [{ react: RemoveVoteTokens }],
          },
          {
            left: [
              '',
              '',
              '',
              '',
              '',
              '',
              {
                html: `Trustee #1 then shuffles the votes.`,
              },
              '',
            ],
            right: [{ react: ShuffleVotes }],
          },
          {
            left: [
              '',
              {
                html: `Although this mixes up the votes, like spinning them inside a giant Bingo wheel, this alone isn't enough to properly anonymize them, because the encrypted data — the outsides of our locked safes — are still distinguishable. Any computer could quickly reconstruct the original list.`,
              },
              '',
            ],
          },
          {
            left: [
              '',
              '',
              '',
              '',
              '',
              '',
              {
                html: `So, Trustee #1 then picks new Randomizer integers for each encrypted field, and ${em(
                  semibold('Re-encrypts'),
                )} the votes.`,
              },
              '',
              {
                html: `This is like ${semibold(
                  em('painting over'),
                )} the outside of the safes. The vote content is still safely locked within, and the Trustee still has no ability to see or modify what's inside.`,
              },
              '',
            ],
            right: [{ react: Reencryption }],
          },
          {
            left: [
              '',
              '',
              {
                html: `Multiple people can shuffle, like multiple people shuffling a deck of cards.<br />
            ${semibold(`Privacy is ensured by ${em('at least one')} honest Trustee.`)}`,
              },
              {
                details: `Thus, greater trust is ensured by more Trustees.


            This entire step can still be completed in just a few minutes.


            The only requirement is that Trustees are online and running the SIV shuffling software. This software automatically handles their parts.`,
              },
            ],
          },
        ],
      },

      // Step 5
      {
        name: 'Step 5: Votes Unlocked & Tallied',
        subheader:
          "Then a quorum of Trustees can sign off that they're ready for the final shuffled list to be Unlocked.",
        then: [
          {
            left: [
              {
                html: `Unlocks only the ${blue(semibold('vote contents'))} of the final list. ${em(
                  'Preserves privacy.',
                )}`,
              },
              '',
            ],
            right: ['', { image: 'step-5-threshold-key.png', maxWidth: 470 }, '', ''],
          },
          {
            left: [
              '',
              '',
              {
                p: `Any voter can Search (Ctrl+F) to find their individual vote, via their Verification Secret, and see that their vote was counted correctly.`,
              },
              '',
              '',
              '',
              { details: `Anyone can tally the final vote count themselves.` },
            ],
            right: [{ react: Unlocked }, ''],
          },
        ],
      },
    ],
  },
]
