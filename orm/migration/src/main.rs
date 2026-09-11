use dotenv::dotenv;
use migration::{Migrator, MigratorTrait};
use sea_orm_migration::prelude::*;

#[async_std::main]
async fn main() {
    let _ = dotenv();
    let database_url = std::env::var("MIGRATION_DATABASE").unwrap();
    let connection = sea_orm::Database::connect(database_url).await.unwrap();
    Migrator::up(&connection, None).await.unwrap();
}
