import { State } from './keygen-state'
import { YouLabel } from './YouLabel'

export const Trustees = ({ state }: { state: State }) => {
  return (
    <>
      <h3>I. Trustees:</h3>
      <ol>
        {state.trustees?.map(({ email, you }) => (
          <li key={email}>
            {email}
            {you && <YouLabel />}
          </li>
        ))}
      </ol>
    </>
  )
}