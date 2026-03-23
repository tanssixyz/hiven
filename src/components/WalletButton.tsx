import { ConnectButton } from "@rainbow-me/rainbowkit"
import { shortAddress } from "../lib/utils"

function Avatar({ address, size = 28 }: { address: string; size?: number }) {
  // generate a deterministic colour pair from the address
  const seed = parseInt(address.slice(2, 10), 16)
  const hue1 = seed % 360
  const hue2 = (hue1 + 137) % 360 // golden angle separation

  const id = `grad-${address.slice(2, 8)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={{ borderRadius: "50%", flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={`hsl(${hue1}, 70%, 65%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2}, 60%, 40%)`} />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill={`url(#${id})`} />
    </svg>
  )
}

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        if (!ready) return <div style={{ opacity: 0, pointerEvents: "none" }} />

        if (!account) {
          return (
            <button className="wallet-btn" onClick={openConnectModal}>
              connect
            </button>
          )
        }

        if (chain?.unsupported) {
          return (
            <button className="wallet-btn wallet-btn-error" onClick={openChainModal}>
              wrong network
            </button>
          )
        }

        return (
          <button className="wallet-btn wallet-btn-connected" onClick={openAccountModal}>
            <Avatar address={account.address} size={20} />
            <span>{shortAddress(account.address)}</span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
