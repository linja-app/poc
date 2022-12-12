import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ActiveUserProvider } from '../context/active-user';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ActiveUserProvider>
        <Component {...pageProps} />
      </ActiveUserProvider>
    </ChakraProvider>
  )
}

export default MyApp;