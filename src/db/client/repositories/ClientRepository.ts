import { Client, IClient } from "../models/Client";
import { ClientDB } from "src/db/ClientDB";

export const save = async (client: Client, db: ClientDB): Promise<any> => {
  return db.client.put(client);
};

export const getByKey = async (key: string, db: ClientDB): Promise<any> => {
  return db.client.get({ key });
};

export const deleteByKey = async (key: string, db: ClientDB): Promise<any> => {
  return db.client.where({ key }).delete();
};

export const isKeyExist = async (
  key: string,
  db: ClientDB
): Promise<IClient | undefined> => {
  return db.client.get(key);
};
