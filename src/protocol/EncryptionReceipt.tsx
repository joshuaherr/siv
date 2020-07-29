import { Paper } from '@material-ui/core'
import { map } from 'lodash'

import { encode } from './crypto/encode'
import { public_key } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function EncryptionReceipt(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <div style={{ margin: '15px 0', overflowWrap: 'break-word' }}>
      <Paper elevation={3} style={{ marginTop: 15, padding: '0 1rem' }}>
        <code
          style={{
            fontSize: 11,
            maxWidth: '100%',
            opacity: 0.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {`
Encrypted @ ${new Date().toString()}

Encryption Formula
  sealed_data = encoded * (sealing_target ^ randomizer) % modulo
  sealing_factor = (generator ^ randomizer) % modulo

Public Key
  ${map(public_key, (v, k) => `${k}: ${v.toString()}`).join('\n  ')}

${map(
  state.plaintext,
  (_, key) => `${key}
  plaintext: ${state.plaintext[key]}
  encoded: ${encode(state.plaintext[key])}
  randomizer: ${state.randomizer[key]}
  encrypted: ${state.encrypted[key]}
`,
).join('\n')}
`}
        </code>
      </Paper>
    </div>
  )
}
