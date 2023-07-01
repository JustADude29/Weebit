import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dude",
    password: "482903",
    database: "weebit",
    synchronize: false,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
})

export default AppDataSource
