import { useState } from 'react'

import { api } from '../api-helper'
import { OnClickButton } from '../landing-page/Button'
import { public_key } from '../protocol/election-parameters'
import { AddGroup } from './AddGroup'

export const AddParticipants = () => {
  const [pubKey, setPubKey] = useState(false)
  const [election_id, setElectionID] = useState<string>()

  return (
    <>
      <div>
        <AddGroup
          defaultValue="admin@secureinternetvoting.org&#13;&#10;"
          disabled={pubKey}
          message={`Trustees made pub key ${public_key.recipient.toString()}`}
          type="trustees"
          onSubmit={() => {
            setPubKey(true)
            return true
          }}
        />
        <AddGroup
          disabled={!pubKey || !!election_id}
          message={!pubKey ? 'Waiting on Trustees' : !election_id ? '' : `Created election ${election_id}`}
          statusURL={
            election_id ? `api/election/${election_id}/has-submitted-vote?password=${localStorage.password}` : undefined
          }
          type="voters"
          onSubmit={async () => {
            // Grab voters from textarea
            const voters = (document.getElementById('voters-input') as HTMLInputElement).value
              .split('\n')
              .filter((v) => v !== '')

            // Call backend endpoint
            const response = await api('invite-voters', { password: localStorage.password, voters })

            // Success case
            if (response.status === 201) {
              setElectionID(await response.text())

              return true
            }

            // Need to reset password
            if (response.status === 401) {
              localStorage.removeItem('password')
              alert('Invalid Password')
            }
            return false
          }}
        />
      </div>
      {election_id && (
        <OnClickButton
          style={{ float: 'right', marginRight: 0 }}
          onClick={() => api(`election/${election_id}/close?password=${localStorage.password}`)}
        >
          Close Election
        </OnClickButton>
      )}

      <style jsx>{`
        div {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
      `}</style>
    </>
  )
}
