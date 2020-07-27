import { Line } from './Line'
import { Step as StepObj } from './steps'

export const Step = ({ name, subheader, then }: StepObj, stepIndex: number) => (
  <div key={stepIndex} style={{ background: 'white', padding: '3rem 15px' }}>
    <p className="step-name">{name}</p>
    <p className="subheader">{subheader}</p>
    <div className="columns">
      <div className="left">{then.left.map(Line)}</div>
      <div className="right">{then.right?.map(Line)}</div>
    </div>
    <style jsx>{`
      .step-name {
        margin: 0;
        color: #000c;
        font-size: 16px;
        font-weight: 700;
      }

      .subheader {
        margin-top: 10px;
        font-size: 15px;
        font-weight: 700;
        max-width: calc(50vw - 110px);
      }

      .columns {
        display: flex;
      }

      .left,
      .right {
        flex: 1;
      }

      .left {
        margin-right: 30px;
      }

      .right {
        position: relative;
        bottom: 40px;
      }

      /* Sidebar disappears */
      @media (max-width: 1030px) {
        .subheader {
          max-width: 48vw;
        }
      }

      /* Single column for small screens */
      @media (max-width: 750px) {
        .subheader {
          max-width: 100vw;
        }

        .columns {
          flex-direction: column-reverse;
        }

        .left {
          margin-right: 0;
        }

        .right {
          bottom: 0;
        }
      }
    `}</style>
  </div>
)
