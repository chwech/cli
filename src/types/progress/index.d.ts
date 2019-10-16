interface options {
  curr?: number,
  total?: number,
  width?: number,
  stream?: any,
  head?: string,
  complete?: string
  incomplete?: string,
  renderThrottle?: number,
  clear?: boolean,
  callback?: any
}

export default class ProgressBar {
  constructor(tokens: string, options: options);
  tick(p: string): void;
}