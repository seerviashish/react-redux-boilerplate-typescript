export interface IApp {
  key: string;
  value: any;
}

export class App implements IApp {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}
