import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { base, mainnet } from "viem/chains"
import { http } from "wagmi"

export const config = getDefaultConfig({
  appName: "Hiven",
  appDescription: "The smallest possible on-chain gesture",
  appUrl: "https://hiven.space",
  appIcon: "https://hiven.space/favicon.svg",
  projectId: "6ba1bf292b158f48a08b2056365fcd65",
  chains: [base, mainnet],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC ?? "https://cloudflare-eth.com"),
  },
  ssr: false,
})
