import { useReducer, useState } from 'react'
import { api } from 'src/api-helper'

import { useStored } from '../useStored'
import { DeliveriesAndFailures } from './DeliveriesAndFailures'
import { mask } from './mask-token'
import { QueuedCell } from './QueuedCell'
import { Signature, getStatus } from './Signature'
import { use_multi_select } from './use-multi-select'

export const InvalidVotersTable = ({
  hide_approved,
  hide_voted,
  num_voted,
}: {
  hide_approved: boolean
  hide_voted: boolean
  num_voted: number
}) => {
  const { election_id, esignature_requested, voters } = useStored()
  const [mask_tokens, toggle_tokens] = useReducer((state) => !state, true)
  const { last_selected, pressing_shift, set_last_selected } = use_multi_select()
  const [checked, set_checked] = useState<boolean[]>(new Array(voters?.length).fill(false))

  if (!voters) return null

  const shown_voters = voters.filter(
    ({ esignature_review, has_voted, invalidated }) =>
      invalidated && (!has_voted || !hide_voted) && (getStatus(esignature_review) !== 'approve' || !hide_approved),
  )

  if (!shown_voters || !shown_voters.length) return null

  return (
    <table>
      Invalidated voters:
      <thead>
        <tr>
          <th>
            <input
              style={{ cursor: 'pointer' }}
              type="checkbox"
              onChange={(event) => {
                const new_checked = [...checked]
                new_checked.fill(event.target.checked)
                set_checked(new_checked)
                set_last_selected(undefined)
              }}
            />
          </th>
          <th>#</th>
          <th>email</th>
          <th className="hoverable" onClick={toggle_tokens}>
            {mask_tokens ? 'masked' : 'full'}
            <br />
            auth token
          </th>
          <th style={{ width: 50 }}>invite queued</th>
          <th style={{ width: 50 }}>invite delivered</th>
          <th>voted</th>
          {esignature_requested && (
            <th
              className="hoverable"
              onClick={() => {
                if (confirm(`Do you want to approve all ${num_voted} signatures?`)) {
                  api(`election/${election_id}/admin/review-signature`, {
                    emails: shown_voters.filter(({ has_voted }) => has_voted).map((v) => v.email),
                    review: 'approve',
                  })
                }
              }}
            >
              signature
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {shown_voters.map(
          ({ auth_token, email, esignature, esignature_review, has_voted, invite_queued, mailgun_events }, index) => (
            <tr className={`${checked[index] ? 'checked' : ''}`} key={email}>
              {/* Checkbox cell */}

              <td
                className="hoverable"
                onClick={() => {
                  const new_checked = [...checked]
                  if (pressing_shift && last_selected !== undefined) {
                    // If they're holding shift, set all between last_selected and this index to !checked[index]
                    for (let i = Math.min(index, last_selected); i <= Math.max(index, last_selected); i += 1) {
                      new_checked[i] = !checked[index]
                    }
                  } else {
                    new_checked[index] = !checked[index]
                  }

                  set_last_selected(index)
                  set_checked(new_checked)
                }}
              >
                <input readOnly checked={checked[index]} className="hoverable" type="checkbox" />
              </td>
              <td className="show-strikethrough">{index + 1}</td>
              <td className="show-strikethrough">
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{email}</span>
                </span>
              </td>
              <td className="show-strikethrough" style={{ fontFamily: 'monospace' }}>
                {mask_tokens ? mask(auth_token) : auth_token}
              </td>

              <QueuedCell {...{ invite_queued }} />
              <DeliveriesAndFailures {...mailgun_events} />

              <td style={{ fontWeight: 700, textAlign: 'center' }}>{has_voted ? '✓' : ''}</td>

              {esignature_requested &&
                (has_voted ? <Signature {...{ election_id, email, esignature, esignature_review }} /> : <td />)}
            </tr>
          ),
        )}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: collapse;
          display: block;
          overflow: auto;
          width: 100%;

          margin-top: 3rem;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 3px 10px;
          margin: 0;
        }

        th {
          background: #f9f9f9;
          font-size: 11px;
        }

        tr.checked {
          background: #f1f1f1;
        }

        tr td.show-strikethrough {
          color: #aaa;
          position: relative !important;
        }

        tr td.show-strikethrough:before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: 0;
          border-bottom: 1px solid #aaa;
          width: 100%;
        }

        .hoverable:hover {
          cursor: pointer;
          background-color: #f2f2f2;
        }

        td .visible-on-parent-hover {
          opacity: 0;
        }
        td:hover .visible-on-parent-hover {
          opacity: 0.5;
        }

        .visible-on-parent-hover:hover {
          cursor: pointer;
          opacity: 1 !important;
        }
      `}</style>
    </table>
  )
}
