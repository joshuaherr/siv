import { DownloadOutlined } from '@ant-design/icons'
import { Accordion, AccordionSummary as Summary } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import styles from './protocol.module.css'
import steps, { ImageLine, Subsection, header } from './steps'

export default function Protocol(): JSX.Element {
  return (
    <>
      <hr style={{ width: '100%' }} />
      <a href="./Overview.png" style={{ margin: '2rem 0 3rem' }} target="_blank">
        <DownloadOutlined />
        &nbsp;Download single image
      </a>

      {/* Header */}
      <div className={styles.protocol}>
        <div style={{ padding: '10px 16px' }}>
          {header.map((line, lineIndex) => {
            const type = Object.keys(line)[0]
            const text = Object.values(line)[0] as string

            return (
              <p className={styles[type]} key={lineIndex}>
                {text}
              </p>
            )
          })}
        </div>

        {/* All the other steps */}
        {steps.map(({ name, rest }, stepIndex) => (
          <Accordion key={stepIndex}>
            <Summary expandIcon={<ExpandMore />}>
              <p className={styles.name}>{name}</p>
            </Summary>
            <div className={styles.expanded}>
              {rest.map((line, lineIndex) => {
                // Special handling for breaks
                if (line === '') {
                  return <br key={lineIndex} />
                }

                const type = Object.keys(line)[0]

                // Special handling for images
                if (type === 'image') {
                  const filename = (line as ImageLine).image[0]
                  const maxWidth = (line as ImageLine).image[1]

                  return <img key={lineIndex} src={`./overview/${filename}`} style={{ maxWidth, width: '100%' }} />
                }

                // Specially handling for subsections
                if (type === 'subsection') {
                  const { header, list } = (line as Subsection).subsection
                  return (
                    <div key={lineIndex} style={{ margin: '3rem' }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{header}:</p>
                      <ul style={{ fontSize: 7, paddingInlineStart: 13 }}>
                        {list.map((item, listIndex) => (
                          <li key={listIndex} style={{ marginBottom: 15 }}>
                            <span
                              dangerouslySetInnerHTML={{ __html: item }}
                              style={{ fontSize: 14, position: 'relative', top: 2 }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                }

                // Otherwise it's text
                const text = Object.values(line)[0] as string

                // Special handling to embed html
                if (type === 'html') {
                  return <div dangerouslySetInnerHTML={{ __html: text }} key={lineIndex} />
                }

                return (
                  <p className={styles[type]} key={lineIndex}>
                    {/* label for 'Example:' */}
                    {type === 'example' && <em>Example: </em>}

                    {/* Split on newlines */}
                    {text.split('\n').map((item, key) => (
                      <span key={key}>
                        {item}
                        <br />
                      </span>
                    ))}
                  </p>
                )
              })}
            </div>
          </Accordion>
        ))}
      </div>

      {/* Fin step */}
      <div style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
        <img src={`./overview/step-fin.png`} width="100%" />
      </div>
    </>
  )
}
