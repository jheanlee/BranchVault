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

use jsonwebtoken::{DecodingKey, EncodingKey};
use std::fmt::Formatter;
use std::path::Path;

pub struct JwtKeyPair {
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
}

#[derive(Debug)]
pub enum JwtKeyError {
    TokioError(tokio::io::Error),
    JwtError(jsonwebtoken::errors::Error),
}

impl From<jsonwebtoken::errors::Error> for JwtKeyError {
    fn from(error: jsonwebtoken::errors::Error) -> Self {
        Self::JwtError(error)
    }
}
impl From<tokio::io::Error> for JwtKeyError {
    fn from(error: tokio::io::Error) -> Self {
        Self::TokioError(error)
    }
}

impl std::fmt::Display for JwtKeyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            JwtKeyError::TokioError(e) => write!(f, "TokioError: {e}"),
            JwtKeyError::JwtError(e) => write!(f, "JwtError: {e}"),
        }
    }
}

pub async fn init_jwt_keys(
    private_key_path: &Path,
    public_key_path: &Path,
) -> Result<JwtKeyPair, JwtKeyError> {
    let priv_bytes = tokio::fs::read(private_key_path).await?;

    let encoding_key = EncodingKey::from_rsa_pem(priv_bytes.as_slice())
        .or_else(|_| EncodingKey::from_ec_pem(priv_bytes.as_slice()))
        .or_else(|_| EncodingKey::from_ed_pem(priv_bytes.as_slice()))?;

    let pub_bytes = tokio::fs::read(public_key_path).await?;

    let decoding_key = DecodingKey::from_rsa_pem(pub_bytes.as_slice())
        .or_else(|_| DecodingKey::from_ec_pem(pub_bytes.as_slice()))
        .or_else(|_| DecodingKey::from_ed_pem(pub_bytes.as_slice()))?;

    Ok(JwtKeyPair {
        encoding_key,
        decoding_key,
    })
}
