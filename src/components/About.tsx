import { useState } from "react"

export function About() {
  const [open, setOpen] = useState(true)

  return (
    <div className="about">
      <button
        className="about-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        what is hiven{open ? " ↑" : " ↓"}
      </button>

      {open && (
        <div className="about-body">
          <p>
            A hiven is a small on-chain gesture directed at
            someone's wallet address.
          </p>
          <p>
            No message. No value. No notification.
          </p>
          <p>
            The sender knows they sent it.
            The chain recorded it.
            The receiver may never find it.
            That's enough.
          </p>
          <p>
            You send it because you thought of someone.
          </p>
          <p className="about-etymology">
            from Finnish — <em>hiven</em>, a trace,
            the smallest possible amount of something
          </p>
        </div>
      )}
    </div>
  )
}
