import { GelirGiderProvider } from "../context/GelirGiderContext";


export default function App({ Component, pageProps }) {
  return (
    <GelirGiderProvider>
      <Component {...pageProps} />
    </GelirGiderProvider>
  );
}
