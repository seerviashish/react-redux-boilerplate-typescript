import Dexie from "dexie";
import { App, IApp } from "./app/models/App";

export class AppDB extends Dexie {
  app: Dexie.Table<IApp, string>;
  constructor() {
    super("AppDB");
    var db = this;
    db.version(1).stores({
      app: "&key",
    });
    this.app = this.table("app");
    db.app.mapToClass(App);
  }
}

export var db = new AppDB();
