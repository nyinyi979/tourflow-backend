import { apiFetchWrapper } from "@/lib/api/client";
import type { TemporaryFileResponse } from "./types";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadTemporaryFile = async (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be 5 MB or less");
  }

  const body = new FormData();
  // The API multipart handler expects the field name to be `file`.
  body.append("file", file);

  return apiFetchWrapper<TemporaryFileResponse>({
    endpoint: "file/",
    method: "POST",
    body,
  });
};
