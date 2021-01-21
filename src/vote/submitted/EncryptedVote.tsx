import { Fragment } from 'react'

import { State } from '../vote-state'

export const EncryptedVote = ({ auth, columns, state }: { auth: string; columns: string[]; state: State }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>auth</th>
          {columns.map((c) => (
            <th colSpan={2} key={c}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Column subheadings */}
        <tr className="subheading">
          <td></td>
          {columns.map((c) => (
            <Fragment key={c}>
              <td>encrypted</td>
              <td>unlock</td>
            </Fragment>
          ))}
        </tr>
        <tr>
          <td>{auth}</td>
          {columns.map((key) => (
            <Fragment key={key}>
              <td>{state.encrypted[key]?.encrypted}</td>
              <td>{state.encrypted[key]?.unlock}</td>
            </Fragment>
          ))}
        </tr>
      </tbody>
    </table>
    <style jsx>{`
      table {
        border-collapse: collapse;
        display: block;
        overflow: scroll;
        overflow-wrap: break-word;
      }

      th,
      td {
        border: 1px solid #ccc;
        padding: 3px 10px;
        margin: 0;
        max-width: 360px;
      }

      th,
      .subheading td {
        font-size: 11px;
        font-weight: 700;
      }
    `}</style>
  </div>
)