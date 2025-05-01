import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "hrsystem",
  port: 3306,
});

export default db;
