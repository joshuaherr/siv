import { Head } from '../Head'
import { AboveFold } from '../landing-page/AboveFold'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { Content } from './Content'
import { HeaderBar } from './HeaderBar'

export const AboutPage = (): JSX.Element => (
  <>
    <Head title="About">
      <link href="/landing-page/typography.css" rel="stylesheet" />
    </Head>

    <HeaderBar />
    <AboveFold height={49} />
    <a id="research" />
    <Content />
    <BlueDivider />
    <Footer />
  </>
)
