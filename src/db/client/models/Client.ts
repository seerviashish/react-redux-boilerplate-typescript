export interface IClient {
  key: string;
  value: any;
}

export class Client implements IClient {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}
