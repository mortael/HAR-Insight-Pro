export interface HARLog {
  version: string;
  creator: { name: string; version: string };
  entries: HAREntry[];
}

export interface HAREntry {
  _id?: string; // Internal unique ID
  startedDateTime: string;
  time: number;
  request: HARRequest;
  response: HARResponse;
  cache: object;
  timings: HARRequestTimings;
  serverIPAddress?: string;
  connection?: string;
  pageref?: string;
}

export interface HARRequest {
  method: string;
  url: string;
  httpVersion: string;
  cookies: HARCookie[];
  headers: HARHeader[];
  queryString: HARQueryParam[];
  postData?: HARPostData;
  headersSize: number;
  bodySize: number;
}

export interface HARResponse {
  status: number;
  statusText: string;
  httpVersion: string;
  cookies: HARCookie[];
  headers: HARHeader[];
  content: HARContent;
  redirectURL: string;
  headersSize: number;
  bodySize: number;
}

export interface HARHeader {
  name: string;
  value: string;
}

export interface HARCookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
}

export interface HARQueryParam {
  name: string;
  value: string;
}

export interface HARPostData {
  mimeType: string;
  params?: HARParam[];
  text?: string;
}

export interface HARParam {
  name: string;
  value?: string;
  fileName?: string;
  contentType?: string;
}

export interface HARContent {
  size: number;
  compression?: number;
  mimeType: string;
  text?: string;
  encoding?: string;
}

export interface HARRequestTimings {
  blocked?: number;
  dns?: number;
  connect?: number;
  send: number;
  wait: number;
  receive: number;
  ssl?: number;
}

export type CodeExportType = 'curl' | 'powershell' | 'python';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
}
