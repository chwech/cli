interface callback {
  (source: Error): void;
}

interface options {
  clone?: boolean,
  [params: string]: any
}

declare function download(repository: string, destination: string, options: options, callback: callback): void;
declare function download(repository: string, destination: string, callback: callback): void;

export default download;