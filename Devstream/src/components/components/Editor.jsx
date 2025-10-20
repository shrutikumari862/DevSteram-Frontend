// Editor.jsx
import { useEffect, useRef, useState } from "react"
import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { cpp } from "@codemirror/lang-cpp"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"
import { useParams } from "react-router-dom"
import { initSocket } from "../../socket"

export default function Editor() {
  const [language, setLanguage] = useState("javascript")
  const socketRef = useRef(null)
  const editorRef = useRef(null)
  const editorContainerRef = useRef(null)
  const roomId = useParams().roomId

  const getDefaultCode = (lang) => {
    switch (lang) {
      case "javascript":
        return `console.log("Hello JavaScript!");`
      case "python":
        return `print("Hello Python!")`
      case "html":
        return `<h1>Hello HTML!</h1>`
      case "css":
        return `body { color: cyan; }`
      case "cpp":
        return `#include <iostream>\nusing namespace std;\nint main() { cout << "Hello C++"; }`
      case "json":
        return `{\n  "message": "Hello JSON"\n}`
      case "markdown":
        return `# Hello Markdown`
      default:
        return ""
    }
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()

      socketRef.current.emit("join", { roomId })

      const parent = editorContainerRef.current
      if (!parent) return

      // 🟢 Clear once before initializing
      parent.innerHTML = ""

      const languageExtensions = {
        javascript: javascript(),
        python: python(),
        html: html(),
        css: css(),
        cpp: cpp(),
        json: json(),
        markdown: markdown(),
      }

      // 🟢 Initialize editor
      const view = new EditorView({
        parent,
        doc: getDefaultCode(language),
        extensions: [
          basicSetup,
          oneDark,
          languageExtensions[language],
          EditorView.updateListener.of((update) => {
            if (update.changes) {
              const code = update.state.doc.toString()
              socketRef.current.emit("code-change", { roomId, code })
            }
          }),
        ],
      })

      editorRef.current = view

      // 🟢 Listen for updates from others
      socketRef.current.on("code-update", ({ code }) => {
        const currentCode = editorRef.current.state.doc.toString()
        if (code !== currentCode) {
          editorRef.current.dispatch({
            changes: {
              from: 0,
              to: currentCode.length,
              insert: code,
            },
          })
        }
      })
    }

    init()

    // 🧹 Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (editorRef.current) {
        editorRef.current.destroy?.()
      }
    }
  }, [roomId])

  // 🟢 Handle language switching without removing the editor completely
  useEffect(() => {
    if (editorRef.current) {
      const languageExtensions = {
        javascript: javascript(),
        python: python(),
        html: html(),
        css: css(),
        cpp: cpp(),
        json: json(),
        markdown: markdown(),
      }
      editorRef.current.dispatch({
        effects: EditorView.reconfigure.of([
          basicSetup,
          oneDark,
          languageExtensions[language],
        ]),
      })
    }
  }, [language])

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-semibold text-blue-400 mb-2">Collaborative Code Editor</h1>

      <div className="flex gap-2 items-center">
        <label className="text-gray-300 font-medium">Language:</label>
        <select
          className="p-2 rounded-md bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="cpp">C++</option>
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      {/* 🟢 Editor container reference */}
      <div
        ref={editorContainerRef}
        id="editor"
        className="w-full h-[75vh] rounded-2xl shadow-[0_0_25px_5px_rgba(59,130,246,0.3)] border border-gray-700 overflow-scroll no-scrollbar"
      ></div>
    </div>
  )
}
