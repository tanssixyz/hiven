import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createPublicClient, http, isAddress, fallback } from "viem"
import { normalize, toCoinType } from "viem/ens"
import { mainnet, base } from "viem/chains"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function formatTimestamp(ts: bigint): string {
  const date = new Date(Number(ts) * 1000)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// mainnet client for ENS resolution
// VITE_MAINNET_RPC in .env.local overrides the default
// get a free Alchemy key at dashboard.alchemy.com for production
const mainnetRpc = import.meta.env.VITE_MAINNET_RPC as string | undefined

const ensClient = createPublicClient({
  chain: mainnet,
  transport: mainnetRpc
    ? fallback([http(mainnetRpc), http("https://cloudflare-eth.com")])
    : fallback([
        http("https://cloudflare-eth.com"),
        http("https://rpc.ankr.com/eth"),
        http("https://ethereum.publicnode.com"),
      ]),
})

export async function resolveAddress(input: string): Promise<string | null> {
  const trimmed = input.trim()

  if (isAddress(trimmed)) return trimmed

  if (!trimmed.includes(".")) return null

  try {
    const normalized = normalize(trimmed)

    // for .base.eth names — resolve with Base cointype
    if (trimmed.toLowerCase().endsWith(".base.eth")) {
      const baseAddress = await ensClient.getEnsAddress({
        name: normalized,
        coinType: toCoinType(base.id),
      })
      if (baseAddress) return baseAddress
    }

    // standard ETH address — works for .eth and all other ENS names
    const ethAddress = await ensClient.getEnsAddress({ name: normalized })
    return ethAddress ?? null

  } catch (err) {
    console.error("ENS resolution failed:", err)
    return null
  }
}
