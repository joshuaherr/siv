import { Dispatch, SetStateAction, useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AddTrustees } from './AddTrustees'
import { AddVoters } from './AddVoters'
import { BallotDesigner } from './BallotDesigner'
import { ElectionID } from './ElectionID'
import { ExistingVoters } from './ExistingVoters'
import { HeaderBar } from './HeaderBar'
import { load_existing_election } from './load-existing'
import { ElectionTitle } from './Title/ElectionTitle'

export type StageAndSetter = { set_stage: Dispatch<SetStateAction<number>>; stage: number }

export const AdminPage = (): JSX.Element => {
  const [stage, set_stage] = useState(0)

  load_existing_election({ set_stage, stage })

  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <h1>Create New Election</h1>
        <ElectionID />
        <ElectionTitle {...{ set_stage, stage }} />
        {stage >= 1 && <AddTrustees {...{ set_stage, stage }} />}
        {stage >= 2 && <BallotDesigner {...{ set_stage, stage }} />}
        {stage >= 3 && (
          <>
            <AddVoters />
            <ExistingVoters />
          </>
        )}
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }
      `}</style>
      <style global jsx>{`
        h3 {
          margin-top: 30px;
          margin-bottom: 0;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
