import Dexie from "dexie";
import { generateHash } from "./utils";

type File = {
    files: Dexie.Table<{ url: string; data: Blob, date: Date, hash: string }, string>;
}

const db = new Dexie("FileCache") as Dexie & File;
  
db.version(1).stores({
    files: "hash,data"
});

export { db }

export async function cacheFile(db: Dexie & File, url: string, data: Blob) {
    await db.files.put({ url, data, date: new Date(), hash: generateHash(url) });
}

export async function getCachedFileUrl(db: Dexie & File, hash: string): Promise<string | null> {
    const file = await db.files.get(hash);
    return file ? file.url : null;
}

export async function getCachedFile(db: Dexie & File, hash: string): Promise<Blob | null> {
    const file = await db.files.get(hash);
    return file ? file.data : null;
}

export async function fetchFile(db: Dexie & File, url: string): Promise<Blob> {
    const cachedFile = await getCachedFile(db, generateHash(url));
    const expireTime = 1000 * 60 * 60 * 24;
    if (cachedFile) {
        const file = await db.files.get(generateHash(url));
        if (file) {
            const now = new Date();
            if (now.getTime() - file.date.getTime() < expireTime) {
                return cachedFile;
            }
        }
    }

    const response = await fetch(url);
    const blob = await response.blob();
    await cacheFile(db, url, blob);
    return blob;
}