import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTitle(markdown: string) {
  const headingMatch = markdown.match(/^#\s(.+)/m);
  return headingMatch ? headingMatch[1] : "Untitled";
}

export function removeTitle(markdown: string) {
  return markdown.replace(/^#\s.+\n/, "");
}

export function removeExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

export function removeDomain(url: string) {
  return url.replace(/https?:\/\/[^/]+/, "");
}

export function generateHash(input: string): string {
  return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex).substring(0, 15);
}