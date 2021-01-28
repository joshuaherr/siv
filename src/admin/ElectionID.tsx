import Link from 'next/link'
import { useRouter } from 'next/router'

import { subscribe_to_pusher } from './subscribe-to-pusher'

export const ElectionID = () => {
  const election_id = useElectionID()

  subscribe_to_pusher(election_id)

  if (!election_id) return null

  return (
    <div>
      Election ID:{' '}
      <Link as={`/election/${election_id}`} href="/election/[election_id]">
        <a target="_blank">{election_id}</a>
      </Link>
      <style jsx>{`
        div {
          float: right;
          opacity: 0.5;

          position: relative;
          bottom: 37px;
        }

        a {
          font-weight: bold;
          color: black;
        }
      `}</style>
    </div>
  )
}

export const useElectionID = () => useRouter().query.election_id as string | undefined
