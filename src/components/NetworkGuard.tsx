import { useChainId, useSwitchChain } from "wagmi"
import { base } from "viem/chains"

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (chainId === base.id) return <>{children}</>

  return (
    <div className="card">
      <div className="card-dot" style={{ background: "var(--error)" }} />
      <p className="card-label">wrong network</p>
      <p className="card-sub">
        hiven runs on Base — switch networks to continue
      </p>
      <button
        className="btn-primary"
        onClick={() => switchChain({ chainId: base.id })}
        disabled={isPending}
      >
        {isPending ? "switching…" : "switch to Base"}
      </button>
    </div>
  )
}
