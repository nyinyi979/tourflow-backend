import { DataResponse } from "./types";

export interface TemporaryFile {
  url: string;
  filename: string;
}

export type TemporaryFileResponse = DataResponse<TemporaryFile>;
