import type { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");

  // Markdownファイル一覧を取得
  useEffect(() => {
    fetch("/file-list.json")
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, []);

  // 選択したMarkdownファイルの内容を取得
  useEffect(() => {
    if (selectedFile) {
      fetch(`${window.location.origin}/${selectedFile}`)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch(console.error);
    }
  }, [selectedFile]);

  return (
    <div>
      <h2>Markdown Viewer</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* ファイル一覧 */}
        <div>
          <h3>Markdown Files</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <button onClick={() => setSelectedFile(file)}>{file}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Markdownの表示 */}
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "60%" }}>
          <h3>Preview</h3>
          {selectedFile ? (
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          ) : (
            <p>Select a markdown file to view its content.</p>
          )}
        </div>
      </div>
    </div>
  );
}