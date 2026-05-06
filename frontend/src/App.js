import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e4e8ee",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    padding: "18px 24px 14px",
    borderBottom: "1px solid #e4e8ee",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconWrap: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#EBF3FD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },
  panelTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  panelSub: {
    fontSize: "12px",
    color: "#6B7280",
    margin: 0,
    marginTop: "2px",
  },
  formBody: {
    padding: "20px 24px",
    flex: 1,
    overflowY: "auto",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 20px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "6px",
  },
  valBase: {
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: "1.5",
    minHeight: "38px",
    transition: "all 0.2s",
  },
  valEmpty: {
    border: "1px dashed #D1D5DB",
    background: "#F9FAFB",
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  valFilled: {
    border: "1px solid #BFDBFE",
    background: "#EFF6FF",
    color: "#1E3A5F",
  },
  textareaEmpty: {
    minHeight: "76px",
  },
  textareaFilled: {
    minHeight: "76px",
    whiteSpace: "pre-wrap",
  },
  statusBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px 24px",
    borderTop: "1px solid #e4e8ee",
    background: "#F9FAFB",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6B7280",
    padding: "4px 10px",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    background: "#fff",
  },
  chipActive: {
    borderColor: "#93C5FD",
    color: "#1D4ED8",
    background: "#EFF6FF",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
    flexShrink: 0,
  },

  // ── Right panel ──
  rightPanel: {
    width: "380px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 40px)",
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "8px",
    padding: "40px 20px",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  emptyIcon: {
    fontSize: "32px",
    marginBottom: "4px",
    opacity: 0.5,
  },
  msgUser: {
    alignSelf: "flex-end",
    maxWidth: "88%",
  },
  msgAI: {
    alignSelf: "flex-start",
    maxWidth: "92%",
  },
  msgLabel: {
    fontSize: "11px",
    color: "#9CA3AF",
    marginBottom: "4px",
    paddingLeft: "2px",
  },
  msgLabelUser: {
    textAlign: "right",
    paddingRight: "2px",
    paddingLeft: 0,
  },
  bubbleUser: {
    padding: "10px 14px",
    borderRadius: "14px",
    borderBottomRightRadius: "4px",
    background: "#1D4ED8",
    color: "#fff",
    fontSize: "13.5px",
    lineHeight: "1.55",
  },
  bubbleAI: {
    padding: 0,
    borderRadius: "14px",
    borderBottomLeftRadius: "4px",
    background: "transparent",
    fontSize: "13.5px",
  },
  aiCard: {
    background: "#fff",
    border: "1px solid #e4e8ee",
    borderRadius: "12px",
    overflow: "hidden",
    fontSize: "12.5px",
  },
  aiCardHeader: {
    padding: "8px 12px",
    background: "#F0FDF4",
    borderBottom: "1px solid #D1FAE5",
    fontWeight: "600",
    color: "#065F46",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12.5px",
  },
  aiCardRow: {
    display: "flex",
    padding: "7px 12px",
    borderBottom: "1px solid #F3F4F6",
    gap: "8px",
  },
  aiCardLabel: {
    color: "#9CA3AF",
    minWidth: "82px",
    flexShrink: 0,
  },
  aiCardVal: {
    color: "#111827",
    lineHeight: 1.4,
  },
  successDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10B981",
    flexShrink: 0,
  },

  // Sentiment badges
  sentimentPositive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    background: "#D1FAE5",
    color: "#065F46",
  },
  sentimentNegative: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    background: "#FEE2E2",
    color: "#991B1B",
  },
  sentimentNeutral: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    background: "#F3F4F6",
    color: "#374151",
  },

  // Input area
  inputArea: {
    padding: "14px 16px",
    borderTop: "1px solid #e4e8ee",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    height: "88px",
    resize: "none",
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "13.5px",
    fontFamily: "inherit",
    background: "#F9FAFB",
    color: "#111827",
    outline: "none",
    lineHeight: "1.5",
    boxSizing: "border-box",
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "10px",
    background: "#1D4ED8",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
  sendBtnDisabled: {
    background: "#E5E7EB",
    color: "#9CA3AF",
    cursor: "not-allowed",
  },

  // Typing indicator
  typingBubble: {
    padding: "12px 14px",
    background: "#F3F4F6",
    borderRadius: "14px",
    borderBottomLeftRadius: "4px",
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
};

// ─── Typing dots ──────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={styles.typingBubble}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#9CA3AF",
          display: "inline-block",
          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
        }}
      />
    ))}
    <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
  </div>
);

// ─── Sentiment badge ──────────────────────────────────────────────────────────
const SentimentBadge = ({ value }) => {
  const v = (value || "").toLowerCase();
  const s = v === "positive" ? styles.sentimentPositive
    : v === "negative" ? styles.sentimentNegative
    : styles.sentimentNeutral;
  const emoji = v === "positive" ? "😊" : v === "negative" ? "😞" : "😐";
  return <span style={s}>{emoji} {value}</span>;
};

// ─── Field value display ──────────────────────────────────────────────────────
const FieldVal = ({ value, multiline }) => {
  const filled = !!value;
  const base = { ...styles.valBase, ...(filled ? styles.valFilled : styles.valEmpty) };
  if (multiline) Object.assign(base, filled ? styles.textareaFilled : styles.textareaEmpty);
  return <div style={base}>{filled ? value : (multiline ? "Awaiting description…" : "Not yet captured")}</div>;
};

// ─── AI response card ─────────────────────────────────────────────────────────
const AICard = ({ data }) => {
  const rows = [
    { label: "Doctor", val: data.hcp_name },
    { label: "Date", val: data.date },
    { label: "Time", val: data.time },
    { label: "Summary", val: data.summary },
    { label: "Key points", val: data.key_points },
    { label: "Sentiment", val: data.sentiment },
    { label: "Next action", val: data.next_action },
  ].filter(r => r.val);

  return (
    <div style={styles.aiCard}>
      <div style={styles.aiCardHeader}>
        <span style={styles.successDot} />
        Interaction logged
      </div>
      {rows.map(({ label, val }) => (
        <div key={label} style={styles.aiCardRow}>
          <span style={styles.aiCardLabel}>{label}</span>
          <span style={styles.aiCardVal}>{val}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState({
    hcp_name: "", date: "", time: "",
    summary: "", key_points: "", sentiment: "", next_action: "",
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const chipsActive = {
    name: !!data.hcp_name,
    datetime: !!(data.date || data.time),
    summary: !!data.summary,
    action: !!data.next_action,
  };

  const chip = (label, active) => (
    <div style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}>
      <span style={styles.dot} /> {label}
    </div>
  );

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setLoading(true);
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);

    try {
      // ── Option A: your LangGraph backend ──────────────────────────────────
      // const res = await axios.post("http://127.0.0.1:8000/langgraph-chat", { message: msg });
      // const output = res.data.output || res.data;
      // const extracted = output.data || {};

      // ── Option B: Claude API directly ────────────────────────────────────
      const res = await axios.post(
  "http://127.0.0.1:8000/langgraph-chat",
  {
    message: msg
  }
);

const output = res.data.output || res.data;

const extracted = output.data || {};


// ── Smart merge ───────────────────────────────────────
setData(prev => {

  const next = { ...prev };

  Object.keys(extracted).forEach(k => {

    if (
      k === "sentiment" ||
      (extracted[k] && extracted[k] !== "")
    ) {
      next[k] = extracted[k];
    }
  });

  return next;
});

setMessages(prev => [
  ...prev,
  {
    role: "assistant",
    data: extracted
  }
]);
      setMessages(prev => [...prev, { role: "assistant", data: extracted }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", error: "Something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* ── Left: Form ─────────────────────────────────────────────────────── */}
      <div style={{ ...styles.panel, flex: 1 }}>
        <div style={styles.panelHeader}>
          <div style={styles.iconWrap}>📋</div>
          <div>
            <p style={styles.panelTitle}>Log HCP Interaction</p>
            <p style={styles.panelSub}>Auto-populated via AI assistant</p>
          </div>
        </div>

        <div style={styles.formBody}>
          <div style={styles.twoCol}>
            <div style={styles.field}>
              <label style={styles.label}>HCP Name</label>
              <FieldVal value={data.hcp_name} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Date</label>
              <FieldVal value={data.date} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Time</label>
              <FieldVal value={data.time} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sentiment</label>
              {data.sentiment
                ? <SentimentBadge value={data.sentiment} />
                : <FieldVal value="" />}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Summary</label>
            <FieldVal value={data.summary} multiline />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Key Points</label>
            <FieldVal value={data.key_points} multiline />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Next Action</label>
            <FieldVal value={data.next_action} multiline />
          </div>
        </div>

        <div style={styles.statusBar}>
          {chip("HCP", chipsActive.name)}
          {chip("Date & time", chipsActive.datetime)}
          {chip("Summary", chipsActive.summary)}
          {chip("Next action", chipsActive.action)}
        </div>
      </div>

      {/* ── Right: Chat ────────────────────────────────────────────────────── */}
      <div style={{ ...styles.panel, ...styles.rightPanel }}>
        <div style={styles.panelHeader}>
          <div style={styles.iconWrap}>🤖</div>
          <div>
            <p style={styles.panelTitle}>AI Assistant</p>
            <p style={styles.panelSub}>Describe the interaction in natural language</p>
          </div>
        </div>

        <div style={styles.chatMessages} ref={chatRef}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💬</div>
              Describe your HCP interaction and I'll extract and log the key details automatically.
            </div>
          )}

          {messages.map((m, i) => {
            if (m.role === "user") return (
              <div key={i} style={styles.msgUser}>
                <div style={{ ...styles.msgLabel, ...styles.msgLabelUser }}>You</div>
                <div style={styles.bubbleUser}>{m.content}</div>
              </div>
            );
            return (
              <div key={i} style={styles.msgAI}>

  <div style={styles.msgLabel}>AI</div>

  {m.error ? (

    <div
      style={{
        ...styles.bubbleUser,
        background: "#FEE2E2",
        color: "#991B1B"
      }}
    >
      {m.error}
    </div>

  ) : (

    <div style={styles.bubbleAI}>

      {
        Array.isArray(m.data) ? (

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px"
            }}
          >

            <h4>All Interactions</h4>

            {m.data.map((item, idx) => (

              <div
                key={idx}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0"
                }}
              >

                <strong>{item.hcp_name}</strong>

                <div>{item.summary}</div>

                <div>{item.date}</div>

              </div>

            ))}

          </div>

        ) : (

          <AICard data={m.data} />

        )
      }

    </div>

  )}

</div>
            );
          })}

          {loading && (
            <div style={styles.msgAI}>
              <div style={styles.msgLabel}>AI</div>
              <TypingDots />
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            style={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
            placeholder="e.g. Met Dr. Sharma at 2pm on Tuesday, she was interested in the new dosage guidelines…"
          />
          <button
            style={{ ...styles.sendBtn, ...(loading ? styles.sendBtnDisabled : {}) }}
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Processing…" : "✦ Log interaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
