use dotenv::dotenv;
use migration::{Migrator, MigratorTrait};
use sea_orm_migration::prelude::*;

#[async_std::main]
async fn main() {
    let _ = dotenv();
    let database_url = format!("sqlite://{}", std::env::var("DB_PATH").unwrap());
    let connection = sea_orm::Database::connect(database_url).await.unwrap();
    Migrator::up(&connection, None).await.unwrap();
}
