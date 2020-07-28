import { CaretDownOutlined } from '@ant-design/icons'

import { useScrollContext } from './scroll-context'
import { groupedSteps } from './steps'

export const Topbar = () => {
  const { state } = useScrollContext()

  return (
    <div>
      <label htmlFor="topbar-select">
        {state.current}
        <CaretDownOutlined style={{ color: '#0005', left: 4, position: 'relative' }} />
      </label>
      <select
        id="topbar-select"
        onChange={({ target }) => {
          const $Protocol = document.getElementById('protocol') as HTMLElement
          const offset = state[target.value]
          $Protocol.scrollTop = Number(offset)
        }}
      >
        {groupedSteps.map(({ group, steps }) => (
          <optgroup key={group} label={group}>
            {steps.map((step) => (
              <option key={step.name} value={step.name}>
                {step.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <style jsx>{`
        div {
          align-items: center;
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          display: flex;
          min-height: 45px;
          padding-left: 30px;
          position: fixed;
          width: 100%;
          z-index: 100;
        }

        label {
          font-size: 16px;
          font-weight: 500;
          opacity: 0.8;
        }

        select {
          color: rgba(0, 0, 0, 0);
          background: transparent;
          font-size: 15px;
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          position: absolute;
          padding: 10px 5px;
          border: none;
        }

        select:focus {
          outline: none;
        }

        /* Hide for large screens */
        @media (min-width: 1030px) {
          div {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}