interface callback {
  (source: Error): void;
}
export default function download(repository: string, destination: string, callback: callback): void;