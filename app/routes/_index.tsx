import type { MetaFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "~/components/ui/pagination";
import { db, fetchFile } from "~/lib/db";
import { extractTitle, generateHash, removeTitle } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const displayCount = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const [files, setFiles] = useState<[string, string, string][]>([]);
  const [markdownContents, setMarkdownContents] = useState<
    [string, string, string, string, string][]
  >([]);
  let path = "";
  if (process.env.NODE_ENV === "development") {
    path = `${window.location.origin}/file-list.local.json`;
  } else {
    path = "https://storage.noeter.com/file-list.json";
  }

  // Markdownファイル一覧を取得
  useEffect(() => {
    fetchFile(db, path)
      .then(async (res) => JSON.parse(await res.text()))
      .then((data) => {
        setFiles([]);
        for (const key in data) {
          for (const file of data[key]) {
            setFiles((prev) => [...prev, [key, file.path, file.date]]);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Markdownファイルの内容を取得
  useEffect(() => {
    if (files.length > 0) {
      setMarkdownContents([]);
      // 日付順にソート
      files.sort((a, b) => {
        return new Date(b[2]).getTime() - new Date(a[2]).getTime();
      });
      const sliceFiles = files.slice(
        displayCount * (page - 1),
        displayCount * page
      );
      // 表示件数に制限
      sliceFiles.forEach((file) => {
        fetchFile(db, `${file[1]}`)
          .then((res) => res.text())
          .then((text) => {
            setMarkdownContents((prev) => {
              const title = extractTitle(text);
              if (!prev.find((content) => content[1] === file[1])) {
                return [...prev, [file[0], file[1], file[2], title, text]];
              }
              return prev;
            });
          })
          .catch(console.error);
      });
    }
  }, [files]);

  return (
    <div className="h-screen pt-5">
      <ul className="w-full flex flex-col items-center">
        {markdownContents.map((content, index) => (
          <li key={index} className="mb-5 w-2/3">
            <Link to={`${content[0]}/${generateHash(content[1])}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{content[3]}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    <Markdown>{removeTitle(content[4])}</Markdown>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Badge variant="secondary">{content[0]}</Badge>
                  <div className="text-sm text-slate-500">{content[2]}</div>
                </CardFooter>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination>
        <PaginationContent className="w-1/4 justify-between">
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`${window.location.pathname}?page=${(
                  page - 1
                ).toString()}`}
              />
            </PaginationItem>
          )}
          {page <= 1 && <div></div>}

          {displayCount * page < files.length && (
            <PaginationItem>
              <PaginationNext
                href={`${window.location.pathname}?page=${(
                  page + 1
                ).toString()}`}
              />
            </PaginationItem>
          )}
          {displayCount * page >= files.length && <div></div>}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
