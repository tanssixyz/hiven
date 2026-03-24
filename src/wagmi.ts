import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { base, mainnet } from "viem/chains"
import { http } from "wagmi"

// ERC-8021 dataSuffix for Base builder code bc_hzjavdn4
// encoded without ox dependency — spec: code_utf8 + code_len + schema_id(0x00) + erc_marker
const DATA_SUFFIX = "0x62635f687a6a6176646e340b0080218021802180218021802180218021" as `0x${string}`

export const config = getDefaultConfig({
  appName: "Hiven",
  appDescription: "The smallest possible on-chain gesture",
  appUrl: "https://hiven.space",
  appIcon: "https://hiven.space/icon-1024.png",
  projectId: "6ba1bf292b158f48a08b2056365fcd65",
  chains: [base, mainnet],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC ?? "https://cloudflare-eth.com"),
  },
  dataSuffix: DATA_SUFFIX,
  ssr: false,
})
