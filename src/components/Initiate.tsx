import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"
import { isAddress } from "viem"
import { HIVEN_ADDRESS } from "../constants"
import HivenABI from "../abi/Hiven.json"
import { resolveAddress } from "../lib/utils"

type ResolveState = "idle" | "resolving" | "resolved" | "failed"

export function Initiate() {
  const [input, setInput] = useState("")
  const [resolved, setResolved] = useState<string | null>(null)
  const [resolveState, setResolveState] = useState<ResolveState>("idle")
  const { address } = useAccount()

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    const trimmed = input.trim()
    if (!trimmed) { setResolved(null); setResolveState("idle"); return }
    if (isAddress(trimmed)) { setResolved(trimmed); setResolveState("resolved"); return }
    if (trimmed.includes(".")) {
      setResolveState("resolving")
      const timer = setTimeout(async () => {
        const result = await resolveAddress(trimmed)
        if (result) { setResolved(result); setResolveState("resolved") }
        else { setResolved(null); setResolveState("failed") }
      }, 600)
      return () => clearTimeout(timer)
    }
    setResolved(null); setResolveState("idle")
  }, [input])

  const isSelf = resolved?.toLowerCase() === address?.toLowerCase()
  const valid = resolved !== null && isAddress(resolved) && !isSelf

  function handleInitiate() {
    if (!valid || !resolved) return
    writeContract({
      address: HIVEN_ADDRESS,
      abi: HivenABI,
      functionName: "initiate",
      args: [resolved],
    })
  }

  if (isSuccess) {
    return (
      <div className="card sent-card">
        <div className="card-dot fade-in" style={{ "--delay": "0ms" } as React.CSSProperties} />
        <p className="sent-mark fade-in" style={{ "--delay": "120ms" } as React.CSSProperties}>
          sent
        </p>
        <p className="sent-message fade-up" style={{ "--delay": "280ms" } as React.CSSProperties}>
          a hiven is waiting for them
        </p>
        <p className="hash fade-in-dim" style={{ "--delay": "600ms" } as React.CSSProperties}>
          {hash}
        </p>
        <button
          className="btn-ghost fade-in-half"
          style={{ "--delay": "900ms" } as React.CSSProperties}
          onClick={() => { reset(); setInput(""); setResolved(null); setResolveState("idle") }}
        >
          send another
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-dot" />
      <p className="card-label">send</p>
      <p className="card-sub">a silent gesture — sent, witnessed, waiting</p>

      <div className="field">
        <label className="field-label">address or ENS name</label>
        <input
          className="field-input"
          placeholder="0x… or name.eth"
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
        {resolveState === "resolving" && <span className="field-hint">resolving…</span>}
        {resolveState === "resolved" && resolved && !isAddress(input.trim()) && (
          <span className="field-hint resolved">{resolved}</span>
        )}
        {resolveState === "failed" && <span className="field-error">name not found</span>}
        {isSelf && <span className="field-error">cannot send to yourself</span>}
      </div>

      <button
        className="btn-primary"
        onClick={handleInitiate}
        disabled={!valid || isPending || isConfirming}
      >
        {isPending ? "confirm in wallet…" : isConfirming ? "placing mark…" : "send hiven"}
      </button>

      {error && (
        <p className="field-error" style={{ marginTop: "8px" }}>
          {(error as any).shortMessage ?? error.message}
        </p>
      )}
    </div>
  )
}
