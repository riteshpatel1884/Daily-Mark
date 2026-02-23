"use client";
import { useState, useMemo } from "react";
import { useApp, SUBJECTS } from "@/Components/store";

// ── NOTE EDITOR ─────────────────────────────────────────────────────────────
function NoteEditor({
  noteId,
  initialTitle,
  initialBody,
  initialSubject,
  onSave,
  onDelete,
  onClose,
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [body, setBody] = useState(initialBody || "");
  const [subject, setSubject] = useState(initialSubject || "General");

  function save() {
    if (!title.trim() && !body.trim()) return;
    onSave({
      id: noteId,
      title: title.trim() || "Untitled",
      body,
      subject,
      updatedAt: Date.now(),
    });
    onClose();
  }

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && (save(), onClose())}
    >
      <div
        className="sheet"
        style={{ maxHeight: "94dvh", display: "flex", flexDirection: "column" }}
      >
        <div className="drag-handle" />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 10px",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "var(--txt2)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="General">General</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div style={{ flex: 1 }} />
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                background: "var(--red)15",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "var(--red)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={save}
            style={{
              background: "var(--txt)",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--txt)",
            width: "100%",
            marginBottom: 10,
            padding: 0,
          }}
        />

        {/* Subject pill */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 99,
              background: "var(--purple)18",
              color: "var(--purple)",
            }}
          >
            {subject}
          </span>
        </div>

        {/* Body */}
        <textarea
          autoFocus={!initialTitle}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            "Write formulas, key points, references...\n\nTip: Use simple formatting like:\n• Bullet points\n→ Arrows for flow\n# Headers"
          }
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--txt)",
            lineHeight: 1.7,
            resize: "none",
            minHeight: 260,
            padding: 0,
          }}
        />

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "var(--txt3)",
            textAlign: "right",
          }}
        >
          {body.length} chars · {body.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    </div>
  );
}

// ── NOTE CARD ────────────────────────────────────────────────────────────────
function NoteCard({ note, onClick }) {
  const preview = note.body.slice(0, 120).replace(/\n+/g, " ");
  const ago = (() => {
    const diff = Date.now() - note.updatedAt;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  })();

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 13,
        padding: "14px",
        cursor: "pointer",
        transition: "background .15s, box-shadow .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg3)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg2)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* subject tag + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".05em",
            padding: "2px 8px",
            borderRadius: 6,
            background: "var(--purple)18",
            color: "var(--purple)",
          }}
        >
          {note.subject}
        </span>
        <span style={{ fontSize: 11, color: "var(--txt3)" }}>{ago}</span>
      </div>

      {/* title */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "var(--txt)",
          marginBottom: 4,
          lineHeight: 1.3,
        }}
      >
        {note.title}
      </div>

      {/* preview */}
      {preview && (
        <div
          style={{
            fontSize: 12,
            color: "var(--txt2)",
            lineHeight: 1.5,
            fontFamily: "var(--mono)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {preview}
        </div>
      )}
    </button>
  );
}

// ── MAIN VIEW ────────────────────────────────────────────────────────────────
export default function NotesView() {
  const { notes, setNote } = useApp();

  // Store notes as an array in 'gr_notes_list' separately from subject notes
  // We manage a notes list: [{id, title, body, subject, updatedAt}]
  const [notesList, setNotesList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gr_notes_list") || "[]");
    } catch {
      return [];
    }
  });
  const [editing, setEditing] = useState(null); // note object or 'new'
  const [filterSubj, setFilterSubj] = useState("All");
  const [search, setSearch] = useState("");

  function saveNote(updated) {
    setNotesList((prev) => {
      const exists = prev.find((n) => n.id === updated.id);
      const next = exists
        ? prev.map((n) => (n.id === updated.id ? updated : n))
        : [updated, ...prev];
      localStorage.setItem("gr_notes_list", JSON.stringify(next));
      return next;
    });
  }

  function deleteNote(id) {
    if (!confirm("Delete this note?")) return;
    setNotesList((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem("gr_notes_list", JSON.stringify(next));
      return next;
    });
    setEditing(null);
  }

  const subjects = ["All", "General", ...SUBJECTS];

  const filtered = useMemo(() => {
    let list = [...notesList].sort((a, b) => b.updatedAt - a.updatedAt);
    if (filterSubj !== "All")
      list = list.filter((n) => n.subject === filterSubj);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
      );
    }
    return list;
  }, [notesList, filterSubj, search]);

  // Group by subject
  const grouped = useMemo(() => {
    if (filterSubj !== "All" || search) return null;
    const g = {};
    filtered.forEach((n) => {
      if (!g[n.subject]) g[n.subject] = [];
      g[n.subject].push(n);
    });
    return g;
  }, [filtered, filterSubj, search]);

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: "var(--txt)",
          }}
        >
          Notes
        </h1>
        <button
          onClick={() =>
            setEditing({
              id: Date.now().toString(),
              title: "",
              body: "",
              subject: "General",
              updatedAt: Date.now(),
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 14px",
            borderRadius: 10,
            border: "none",
            background: "var(--txt)",
            color: "var(--bg)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>
        Formulas, references, key points — all in one place
      </p>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <svg
          style={{
            position: "absolute",
            left: 11,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--txt3)",
          }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          style={{
            width: "100%",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "10px 12px 10px 34px",
            fontFamily: "var(--font)",
            fontSize: 14,
            color: "var(--txt)",
            outline: "none",
            transition: "border-color .15s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--txt2)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Subject filter chips */}
      <div
        style={{
          display: "flex",
          gap: 5,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 16,
        }}
      >
        {["All", "General", ...SUBJECTS.slice(0, 8)].map((s) => (
          <button
            key={s}
            onClick={() => setFilterSubj(s)}
            style={{
              padding: "5px 12px",
              borderRadius: 99,
              border: `1px solid ${filterSubj === s ? "transparent" : "var(--border)"}`,
              background: filterSubj === s ? "var(--purple)" : "var(--bg2)",
              color: filterSubj === s ? "#fff" : "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              flexShrink: 0,
              transition: "all .15s",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stats row */}
      {notesList.length > 0 && !search && filterSubj === "All" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Total notes", val: notesList.length },
            {
              label: "Subjects",
              val: [...new Set(notesList.map((n) => n.subject))].length,
            },
            {
              label: "Words",
              val: notesList.reduce(
                (s, n) => s + n.body.split(/\s+/).filter(Boolean).length,
                0,
              ),
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--txt)",
                  letterSpacing: "-.02em",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--txt3)",
                  marginTop: 1,
                  fontWeight: 600,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            {search ? "No notes match your search" : "No notes yet"}
          </div>
          <div style={{ fontSize: 13 }}>
            {search
              ? "Try different keywords"
              : 'Tap "New Note" to start writing'}
          </div>
        </div>
      )}

      {/* Grouped notes (default view) */}
      {grouped && Object.keys(grouped).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([subj, notes]) => (
            <div key={subj}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div className="slabel" style={{ margin: 0 }}>
                  {subj}
                </div>
                <div
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                />
                <span style={{ fontSize: 11, color: "var(--txt3)" }}>
                  {notes.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => setEditing(note)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flat list (filtered/search view) */}
      {!grouped && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setEditing(note)}
            />
          ))}
        </div>
      )}

      {/* Editing modal */}
      {editing && (
        <NoteEditor
          noteId={editing.id}
          initialTitle={editing.title}
          initialBody={editing.body}
          initialSubject={editing.subject}
          onSave={saveNote}
          onDelete={
            notesList.find((n) => n.id === editing.id)
              ? () => deleteNote(editing.id)
              : null
          }
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
