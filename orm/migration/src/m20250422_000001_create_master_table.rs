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

use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Master::Table)
                    .if_not_exists()
                    .col(string_len_uniq(Master::Id, 21).primary_key())
                    .col(string_uniq(Master::Username))
                    .col(string(Master::HashedPassword))
                    .col(string(Master::MasterSalt))
                    .col(boolean(Master::Admin))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Master::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Master {
    Table,
    Id,
    Username,
    HashedPassword,
    MasterSalt,
    Admin,
}
