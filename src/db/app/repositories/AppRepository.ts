import { App, IApp } from "../models/App";
import { AppDB } from "src/db/AppDB";

export const save = async (app: App, db: AppDB): Promise<any> => {
  return db.app.put(app);
};

export const getByKey = async (key: string, db: AppDB): Promise<any> => {
  return db.app.get({ key });
};

export const deleteByKey = async (key: string, db: AppDB): Promise<any> => {
  return db.app.where({ key }).delete();
};

export const isKeyExist = async (
  key: string,
  db: AppDB
): Promise<IApp | undefined> => {
  return db.app.get(key);
};
