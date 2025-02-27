import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { db, fetchFile, getCachedFileUrl } from "~/lib/db";
import remarkGfm from "remark-gfm";

export default function Page() {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const { id } = useParams();
  const task = getCachedFileUrl(db, id!);
  useEffect(() => {
    task.then((url) => {
      fetchFile(db, url!)
        .then((res) => res.text())
        .then((text) => {
          setMarkdownContent(text);
        })
        .catch(console.error);
    });
  });

  return (
    <div className="h-screen pt-5 w-full flex justify-center">
      <div className="w-2/3 markdown">
        <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
      </div>
    </div>
  );
}
