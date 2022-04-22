import '../styles/globals.css'
import { RobinhoodProvider } from '../context/RobinhoodContext'
import { MoralisProvider } from 'react-moralis'
function MyApp({ Component, pageProps }) {
  return <MoralisProvider
    serverUrl='https://w4znmw67o0s7.usemoralis.com:2053/server'
    appId='6eEjOqEoEDgIpQNDisEzMTutzo37h05uHhds8JEM'
  >
    <RobinhoodProvider>
      <Component {...pageProps} />
    </RobinhoodProvider>
  </MoralisProvider>

}

export default MyApp
