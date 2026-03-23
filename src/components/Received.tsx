import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useEffect, useState } from "react"
import { HIVEN_ADDRESS } from "../constants"
import HivenABI from "../abi/Hiven.json"
import { shortAddress, formatTimestamp } from "../lib/utils"

interface HivenMark {
  id: bigint
  initiator: string
  initiatedAt: bigint
  acknowledged: boolean
}

export function Received() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [marks, setMarks] = useState<HivenMark[]>([])
  const [loading, setLoading] = useState(false)

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (!address || !publicClient) return
    setLoading(true)

    publicClient.getLogs({
      address: HIVEN_ADDRESS,
      event: {
        type: "event",
        name: "Initiated",
        inputs: [
          { name: "id", type: "uint256", indexed: true },
          { name: "initiator", type: "address", indexed: false },
          { name: "receiver", type: "address", indexed: false },
        ],
      },
      fromBlock: 0n,
      toBlock: "latest",
    }).then(async (logs) => {
      // filter client-side for logs where receiver matches connected address
      const myLogs = logs.filter((log: any) =>
        log.args?.receiver?.toLowerCase() === address.toLowerCase()
      )

      const resolved = await Promise.all(
        myLogs.map(async (log: any) => {
          const id = log.args.id as bigint
          const mark = await publicClient.readContract({
            address: HIVEN_ADDRESS,
            abi: HivenABI,
            functionName: "marks",
            args: [id],
          }) as readonly [string, string, bigint, bigint, number]

          return {
            id,
            initiator: log.args.initiator as string,
            initiatedAt: mark[2],
            acknowledged: mark[4] === 1,
          }
        })
      )
      setMarks(resolved.reverse())
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [address, publicClient, isSuccess])

  function acknowledge(id: bigint) {
    writeContract({
      address: HIVEN_ADDRESS,
      abi: HivenABI,
      functionName: "acknowledge",
      args: [id],
    })
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-dot" />
        <p className="card-label">received</p>
        <p className="card-sub">looking…</p>
      </div>
    )
  }

  if (marks.length === 0) {
    return (
      <div className="card">
        <div className="card-dot" />
        <p className="card-label">received</p>
        <p className="card-sub">no hivens have been sent to this address yet</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-dot" />
      <p className="card-label">received</p>
      <p className="card-sub">hivens sent to your address</p>

      <div className="marks-list">
        {marks.map((mark) => (
          <div
            key={mark.id.toString()}
            className={`mark-item ${mark.acknowledged ? "mark-item-done" : ""}`}
          >
            <div className="mark-item-row">
              <span className="mark-item-from">{shortAddress(mark.initiator)}</span>
              <span className="mark-item-time">{formatTimestamp(mark.initiatedAt)}</span>
            </div>
            <div className="mark-item-row">
              <span className="mark-item-id">#{mark.id.toString()}</span>
              {mark.acknowledged ? (
                <span className="mark-item-status">acknowledged</span>
              ) : (
                <button
                  className="mark-item-ack"
                  onClick={() => acknowledge(mark.id)}
                  disabled={isPending || isConfirming}
                >
                  {isPending || isConfirming ? "…" : "acknowledge"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="field-error" style={{ marginTop: "8px" }}>
          {(error as any).shortMessage ?? error.message}
        </p>
      )}
    </div>
  )
}
