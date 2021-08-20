import { DeleteOutlined } from '@ant-design/icons'
import { api } from 'src/api-helper'

import { OnClickButton } from '../../landing-page/Button'
import { revalidate, useStored } from '../useStored'

export const InvalidateVotersButton = ({
  checked,
  num_checked,
  set_error,
}: {
  checked: boolean[]
  num_checked: number
  set_error: (error: string) => void
}) => {
  const { election_id, voters } = useStored()

  if (!voters) return null

  return (
    <OnClickButton
      disabled={!num_checked}
      style={{ borderWidth: 1, margin: 0, marginLeft: num_checked === 1 ? 15 : 5, padding: '5px 10px' }}
      onClick={async () => {
        const voters_selected = checked.reduce((acc: string[], is_checked, index) => {
          if (is_checked) acc.push(voters[index].email)
          return acc
        }, [])

        const amount_to_show = 10

        const confirmed = confirm(
          `Are you sure you want to invalidate ${
            num_checked === 1 ? 'this voter' : `these ${num_checked} voters`
          } & their auth token${num_checked === 1 ? '' : 's'}?\n\n${voters_selected
            .slice(0, amount_to_show)
            .join('\n')}${num_checked > amount_to_show ? `\n\n and ${num_checked - amount_to_show} more.` : ''}`,
        )

        if (!confirmed) return

        const response = await api(`election/${election_id}/admin/invalidate-voters`, {
          voters: voters_selected,
        })

        try {
          if (response.status === 201) {
            revalidate(election_id)
          } else {
            const json = await response.json()
            console.error(json)
            set_error(json?.error || 'Error w/o message ')
          }
        } catch (e) {
          set_error(e.message || 'Caught error w/o message')
        }
      }}
    >
      <DeleteOutlined />
    </OnClickButton>
  )
}