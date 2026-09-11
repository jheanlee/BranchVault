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

// use crate::common::error::ApiError;
// use rsa::pkcs8::{EncodePrivateKey, EncodePublicKey};
// use rsa::{RsaPrivateKey, RsaPublicKey};
// use tracing::info;
//
// pub async fn generate_rsa_key_pair(priv_path: &str, pub_path: &str) -> Result<(), ApiError> {
//     info!("Generating RSA key pair");
//     let mut rng = rand::thread_rng();
//     let bits = 4096;
//     let priv_key = RsaPrivateKey::new(&mut rng, bits)?;
//     let pub_key = RsaPublicKey::from(&priv_key);
//     tokio::fs::write(priv_path, priv_key.to_pkcs8_pem(Default::default())?).await?;
//     tokio::fs::write(pub_path, pub_key.to_public_key_pem(Default::default())?).await?;
//     Ok(())
// }
