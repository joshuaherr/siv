import { Switch } from '@material-ui/core'
import Image from 'next/image'
import esignatureIcon from 'public/esignature.png'
import { useState } from 'react'

import { api } from '../../api-helper'
import { Spinner } from '../Spinner'
import { revalidate, useStored } from '../useStored'

export const RequestEsignatures = () => {
  const [updating, setUpdating] = useState(false)
  const { election_id, esignature_requested } = useStored()

  async function toggleESignature() {
    setUpdating(true)
    const response = await api(`election/${election_id}/admin/set-esignature-requested`, {
      esignature_requested: !esignature_requested,
    })

    if (response.status === 201) {
      revalidate(election_id)
      setUpdating(false)
    } else {
      throw await response.json()
    }
  }

  return (
    <section>
      <label onClick={toggleESignature}>
        <div style={{ display: 'inline-block', marginRight: 5, position: 'relative', top: 2 }}>
          <Image height={(218 / 700) * 70} layout="fixed" src={esignatureIcon} width={70} />
        </div>
        Request <i>eSignatures</i>?
      </label>
      <div style={{ bottom: 3, display: 'inline-block', left: 10, position: 'relative' }}>
        <Switch checked={!!esignature_requested} color="primary" onClick={toggleESignature} />
      </div>
      {updating && <Spinner />}
      <style jsx>{`
        section {
          margin-bottom: 30px;
        }

        label {
          cursor: pointer;
        }

        i {
          font-weight: 500;
        }
      `}</style>
    </section>
  )
}
