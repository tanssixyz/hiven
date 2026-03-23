import { createConfig, http } from "wagmi"
import { base, mainnet } from "viem/chains"
import { injected, walletConnect } from "wagmi/connectors"

const projectId = "6ba1bf292b158f48a08b2056365fcd65"

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC ?? "https://cloudflare-eth.com"),
  },
})
