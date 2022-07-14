import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { Content } from './Content'

export const CitizenPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="Citizen" />

      <HeaderBar />
      <div>
        <Content />
        <Footer />
      </div>

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;

          width: 100%;
          overflow-x: hidden;
        }
      `}</style>
    </>
  )
}
