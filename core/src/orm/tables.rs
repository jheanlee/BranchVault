/*
 * Copyright 2026 Jhe-An Lee
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

use crate::SHARED_CELL;
use crate::common::error::ApiError;
use entity::entities::{master, password};
use sea_orm::{ConnectionTrait, Schema};

pub async fn init_tables() -> Result<(), ApiError> {
    let db = SHARED_CELL
        .get()
        .unwrap()
        .database_connection
        .as_ref()
        .unwrap();
    let schema = Schema::new(db.get_database_backend());
    let mut master_stmt = schema.create_table_from_entity(master::Entity);
    master_stmt.if_not_exists();
    db.execute(db.get_database_backend().build(&master_stmt))
        .await?;

    let mut password_stmt = schema.create_table_from_entity(password::Entity);
    password_stmt.if_not_exists();
    db.execute(db.get_database_backend().build(&password_stmt))
        .await?;
    Ok(())
}
