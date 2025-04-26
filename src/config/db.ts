import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "hr_new",
});

export default db;
