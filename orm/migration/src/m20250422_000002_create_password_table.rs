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
                    .table(Password::Table)
                    .if_not_exists()
                    .col(pk_auto(Password::Id))
                    .col(string(Password::Master))
                    .col(string(Password::Name))
                    .col(string(Password::Website))
                    .col(string(Password::Username))
                    .col(string(Password::Email))
                    .col(string(Password::EncryptedPassword))
                    .col(string(Password::Notes))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Password::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Password {
    Table,
    Id,
    Master,
    Name,
    Website,
    Username,
    Email,
    EncryptedPassword,
    Notes,
}
