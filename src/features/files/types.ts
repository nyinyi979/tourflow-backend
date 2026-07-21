import type { DataResponse } from "@/lib/api/types";

export interface TemporaryFile {
  url: string;
  filename: string;
}

export type TemporaryFileResponse = DataResponse<TemporaryFile>;
