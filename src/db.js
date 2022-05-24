/*
contains db object
*/
import PouchDB from "pouchdb"
import { config } from "./config"

const db = new PouchDB(config.APP_NAME)

export {db}
