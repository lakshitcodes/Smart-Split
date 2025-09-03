import React from "react";

export default function PaymentLoading({ message }) {
  return (
    <>
      <style>{`
        :root {
          --green-700: #15803d;
          --green-600: #16a34a;
          --green-500: #22c55e;
          --green-400: #34d399;
          --green-300: #86efac;
          --ring-size: 120px;
          --bg: #ffffff;
          --text: #0f172a;
        }

        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
            Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .stage {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .card {
          position: relative;
          width: 180px;
          height: 112px;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--green-600), var(--green-500));
          box-shadow: 0 10px 24px rgba(22, 163, 74, 0.25), 0 2px 6px rgba(22,163,74,0.2) inset;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0 40%, rgba(255,255,255,.25) 50%, transparent 60% 100%);
          transform: translateX(-100%);
          animation: shimmer 1.8s linear infinite;
        }

        .card::after {
          content: "";
          position: absolute;
          top: 18px; left: 0; right: 0;
          height: 16px;
          background: rgba(0,0,0,0.2);
        }

        .chip {
          position: absolute;
          width: 28px; height: 22px;
          border-radius: 4px;
          background: linear-gradient(180deg, #d1fae5, #86efac);
          left: 14px; top: 48px;
          box-shadow: 0 1px 0 rgba(0,0,0,.08) inset, 0 4px 8px rgba(0,0,0,.12);
        }
        .chip:before, .chip:after {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(0,0,0,.18);
          border-radius: 3px;
        }
        .chip:after { inset: 8px 10px; border-top: 0; border-bottom: 0; }

        .slot {
          position: absolute;
          bottom: -12px; left: 50%; transform: translateX(-50%);
          width: 200px; height: 36px;
          background: #ecfdf5;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(15,23,42,.06) inset, 0 2px 8px rgba(15,23,42,.06);
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .slot::after{
          content: "";
          width: 160px; height: 6px;
          background: linear-gradient(90deg, rgba(21,128,61,.15), rgba(34,197,94,.35), rgba(21,128,61,.15));
          border-radius: 4px;
          filter: blur(0.3px);
        }

        .waves {
          position: absolute;
          right: 14px; top: 52px;
          width: 16px; height: 12px;
        }
        .waves span{
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,255,255,.85);
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50% 50% 0 0;
          transform-origin: bottom left;
          animation: ping 1.8s ease-out infinite;
        }
        .waves span:nth-child(2){ inset: -6px; animation-delay: .2s; opacity: .7; }
        .waves span:nth-child(3){ inset: -12px; animation-delay: .4s; opacity: .45; }

        .rig {
          position: relative;
          width: 360px; height: 220px;
          display: grid; place-items: center;
        }
        .rig .card {
          animation: swipe 2.2s ease-in-out infinite;
          transform-origin: 50% 90%;
        }

        .ring {
          position: absolute;
          width: var(--ring-size);
          height: var(--ring-size);
          border-radius: 50%;
          display: grid; place-items: center;
          filter: drop-shadow(0 6px 14px rgba(22,163,74,.25));
        }
        .ring::before{
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--green-600), var(--green-400), var(--green-600));
          mask: radial-gradient(farthest-side, transparent calc(50% - 8px), #000 calc(50% - 8px));
          -webkit-mask: radial-gradient(farthest-side, transparent calc(50% - 8px), #000 calc(50% - 8px));
          animation: spin 1.2s linear infinite;
        }
        .ring::after{
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          background: #f0fdf4;
          box-shadow: inset 0 0 0 1px rgba(34,197,94,.25);
        }

        .center-icon {
          position: relative;
          font-size: 40px;
          font-weight: 700;
          color: var(--green-700);
          animation: bob 1.6s ease-in-out infinite;
          letter-spacing: -1px;
        }

        .caption {
          margin-top: 18px;
          font-size: 14px;
          color: #065f46;
          letter-spacing: .2px;
        }

        .dots {
          display: inline-flex;
          gap: 6px;
          margin-left: 6px;
          translate: 0 2px;
        }
        .dots i{
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green-500);
          opacity: .4;
          animation: blink 1.2s infinite;
        }
        .dots i:nth-child(2){ animation-delay: .2s; }
        .dots i:nth-child(3){ animation-delay: .4s; }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes ping {
          0% { transform: rotate(-10deg) scale(.7); opacity: .0; }
          30% { opacity: .9; }
          80% { opacity: .0; }
          100% { transform: rotate(-10deg) scale(1.15); opacity: 0; }
        }
        @keyframes swipe {
          0%   { transform: translateX(-120px) rotate(-8deg); }
          40%  { transform: translateX(0) rotate(0deg); }
          60%  { transform: translateX(10px) rotate(2deg); }
          100% { transform: translateX(140px) rotate(6deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes blink {
          0%, 100% { opacity: .25; transform: scale(.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .card::before, .waves span, .rig .card, .ring::before, .center-icon, .dots i { animation-duration: 3s; }
        }
      `}</style>

      <main className="stage" aria-busy="true" aria-live="polite">
        <div
          className="rig"
          role="img"
          aria-label="Processing payment animation"
        >
          <div className="ring" aria-hidden="true">
            <div className="center-icon">₹</div>
          </div>

          <div className="card" aria-hidden="true">
            <div className="chip"></div>
            <div className="waves">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="slot" aria-hidden="true"></div>
        </div>

        <div className="caption" id="status">
          {message}
          <span className="dots" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </span>
        </div>
        <span
          className="sr-only"
          style={{ position: "absolute", left: "-9999px" }}
        >
          Payment is being processed
        </span>
      </main>
    </>
  );
}
