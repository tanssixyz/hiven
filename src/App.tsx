import { useState } from "react"
import { useAccount } from "wagmi"
import { WalletButton } from "./components/WalletButton"
import { NetworkGuard } from "./components/NetworkGuard"
import { Initiate } from "./components/Initiate"
import { Received } from "./components/Received"
import { About } from "./components/About"
import "./App.css"

type Tab = "send" | "received"

export default function App() {
  const { isConnected } = useAccount()
  const [tab, setTab] = useState<Tab>("send")

  return (
    <div id="app">
      <header>
        <span className="wordmark">hiven</span>
        <WalletButton />
      </header>

      <main>
        {!isConnected ? (
          <div className="connect-prompt">
            <div className="connect-dot" />
            <p className="card-label">hiven</p>
            <p className="card-sub" style={{ maxWidth: "260px" }}>
              leave a small trace of your goodwill
              in someone's address
            </p>
          </div>
        ) : (
          <NetworkGuard>
            <nav className="tabs">
              <button
                className={`tab ${tab === "send" ? "tab-active" : ""}`}
                onClick={() => setTab("send")}
              >
                send
              </button>
              <button
                className={`tab ${tab === "received" ? "tab-active" : ""}`}
                onClick={() => setTab("received")}
              >
                received
              </button>
            </nav>

            {tab === "send" && <Initiate />}
            {tab === "received" && <Received />}
          </NetworkGuard>
        )}
      </main>

      <footer>
        <About />
        <div className="footer-links">
          <a
            href="https://basescan.org/address/0x74f00FE7f08B2623dC6f67EEd05dA9A090a9E139"
            target="_blank"
            rel="noreferrer"
          >
            contract
          </a>
          <span>·</span>
          <a href="https://kaarna.xyz" target="_blank" rel="noreferrer">
            kaarna
          </a>
        </div>
        <p className="footer-disclaimer">
          experimental · transactions are permanent · no data collected
        </p>
      </footer>
    </div>
  )
}
