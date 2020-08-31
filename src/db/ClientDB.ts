import Dexie from "dexie";
import { Client, IClient } from "./client/models/Client";

export class ClientDB extends Dexie {
  client: Dexie.Table<IClient, string>;
  constructor() {
    super("ClientDB");
    var cdb = this;
    cdb.version(1).stores({
      client: "&key",
    });
    this.client = this.table("client");
    cdb.client.mapToClass(Client);
  }
}

export var cdb = new ClientDB();
