import { NextApiRequest, NextApiResponse } from 'next'

import { getStatus } from '../../../../src/admin/Voters/Signature'
import { firebase } from '../../_services'
import { ReviewLog } from './admin/load-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id, num_new_accepted_votes, num_new_pending_votes } = req.query
  // console.log({ election_id, num_new_accepted_votes, num_new_pending_votes })

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading
  let votesQuery = electionDoc.collection('votes').orderBy('created_at')
  let pendingVotesQuery = electionDoc.collection('votes-pending').orderBy('created_at')
  if (num_new_accepted_votes) votesQuery = votesQuery.limitToLast(+num_new_accepted_votes)
  if (num_new_pending_votes) pendingVotesQuery = pendingVotesQuery.limitToLast(+num_new_pending_votes)
  const loadVotes = votesQuery.get()
  const loadPendingVotes = pendingVotesQuery.get()

  const election = await electionDoc.get()

  // Is election_id in DB?
  if (!election.exists) return res.status(400).json({ error: 'Unknown Election ID.' })

  let votes = (await loadVotes).docs.map((doc) => {
    const { auth, encrypted_vote } = doc.data()
    return { auth, ...encrypted_vote }
  })

  const pendingVotes = (await loadPendingVotes).docs.map((doc) => {
    const { encrypted_vote } = doc.data()
    return { auth: 'pending', ...encrypted_vote }
  })

  // If we need esignatures, we need to load all voters as well to get their esignature status
  if (election.data()?.esignature_requested) {
    type VotersByAuth = Record<string, { esignature_review: ReviewLog[] }>
    const voters = await electionDoc.collection('voters').get()
    const votersByAuth: VotersByAuth = voters.docs.reduce((acc: VotersByAuth, doc) => {
      const data = doc.data()
      return { ...acc, [data.auth_token]: data }
    }, {})

    // Add signature status
    votes = votes.map((vote) => {
      const voter = votersByAuth[vote.auth]
      return { ...vote, signature_approved: getStatus(voter?.esignature_review) === 'approve' }
    })
  }

  return res.status(200).json([...votes, ...pendingVotes])
}
