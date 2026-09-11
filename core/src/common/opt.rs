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

use std::net::SocketAddr;
use std::path::PathBuf;
use std::str::FromStr;

#[derive(clap::Parser)]
pub struct Args {
    /// Address and port to listen on
    #[arg(short = 'b', long, default_value_t = {SocketAddr::from_str("0.0.0.0:3000").unwrap()})]
    pub bind_address: SocketAddr,
    /// Database connection string; refer to the SeaORM documentation
    #[arg(short = 'd', long, required = true)]
    pub database: String,
    /// Public key for verifying JSON Web Tokens
    #[arg(short = 'P', long, required = true)]
    pub jwt_key_public: PathBuf,
    /// Private key for signing JSON Web Tokens
    #[arg(short = 'p', long, required = true)]
    pub jwt_key_private: PathBuf,
    /// Enable user self-registration
    #[arg(long, default_value_t = false)]
    pub allow_signup: bool,
}
