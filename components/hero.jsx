import React, { useEffect } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { CreditCard } from "lucide-react";

const OFFSETS = [-56, -20, 20, 56];

const DEFAULT_NOTES = [
  { amount: "120", gradient: "from-emerald-500 via-green-600 to-teal-500" },
  { amount: "60", gradient: "from-green-600 via-teal-500 to-emerald-500" },
  { amount: "40", gradient: "from-teal-500 via-emerald-500 to-green-600" },
  { amount: "30", gradient: "from-emerald-500 via-green-600 to-teal-500" },
];

export default function SettlingNotes({
  notes = DEFAULT_NOTES,
  className = "",
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`w-full h-full relative ${className} pointer-events-none`}
      aria-hidden="true"
    >
      {/* background with green tint */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute -left-6 -top-6 w-36 h-36 rounded-full bg-emerald-200/30 blur-3xl transform rotate-12" />
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-teal-200/25 blur-2xl" />
        <div className="absolute inset-0 border border-emerald-100 rounded-lg bg-gradient-to-br from-white to-emerald-50" />
      </div>

      {/* central pool label */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur-sm rounded-full px-3 py-1 shadow">
          <CreditCard size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            Settling pool
          </span>
        </div>
      </div>

      {/* animated notes */}
      {notes.map((n, idx) => (
        <AnimatedNote
          key={idx}
          amount={n.amount}
          gradient={n.gradient}
          index={idx}
          reduce={reduce}
        />
      ))}

      {/* recipients */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-end">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold">
          A
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold">
          B
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-300 flex items-center justify-center text-xs font-semibold">
          C
        </div>
      </div>
    </div>
  );
}

function AnimatedNote({ amount, gradient, index, reduce }) {
  const controls = useAnimation();
  const offset = OFFSETS[index % OFFSETS.length];

  useEffect(() => {
    let mounted = true;
    const enter = async () => {
      if (!mounted) return;

      if (reduce) {
        await controls.set({
          opacity: 1,
          x: offset,
          y: "10%",
          rotate: 0,
          scale: 1,
        });
        return;
      }

      // entrance animation
      await controls.start({
        opacity: 1,
        x: offset,
        y: ["-40%", "10%"],
        rotate: [-8, 0],
        transition: {
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.15,
        },
      });

      // continuous smooth sliding up and down
      controls.start({
        y: ["10%", "0%", "10%"],
        transition: {
          duration: 2.4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      });
    };

    enter();
    return () => (mounted = false);
  }, [controls, index, offset, reduce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: "-40%", x: 0, rotate: -10, scale: 0.95 }}
      animate={controls}
      style={{ left: "50%", top: "12%" }}
      className="absolute -translate-x-1/2 z-30"
    >
      <div
        className={`w-24 h-9 rounded-md flex items-center justify-between px-3 text-sm font-semibold text-white bg-gradient-to-r ${gradient} border border-emerald-50`}
        style={{ boxShadow: "0 10px 24px rgba(16,185,129,0.15)" }}
      >
        <span className="text-xs">₹{amount}</span>
        <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">
          ₹
        </div>
      </div>
    </motion.div>
  );
}
