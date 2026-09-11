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
// use aes_gcm_siv::aead::generic_array::GenericArray;
// use aes_gcm_siv::aead::Aead;
// use aes_gcm_siv::{Aes256GcmSiv, KeyInit, Nonce};
// use argon2::Argon2;
// use openssl::base64;
// use openssl::rand::rand_bytes;
//

//
// pub fn aes_256_encrypt(key: &[u8; 32], nonce: &mut [u8; 12], plain_text: String) -> Result<Vec<u8>, ApiError> {
//   let key = GenericArray::from_slice(key);
//   let cipher = Aes256GcmSiv::new(&key);
//   rand_bytes(nonce)?;
//   let nonce = Nonce::from_slice(nonce);
//   let cipher_text = cipher.encrypt(nonce, plain_text.as_bytes());
//   Ok(cipher_text.map_err(|err| anyhow::anyhow!("{}", err.to_string()))?)
// }
//
// pub fn aes_256_decrypt(key: &[u8; 32], nonce: &[u8; 12], cipher_text: Vec<u8>) -> Result<Vec<u8>, ApiError> {
//   let key = GenericArray::from_slice(key);
//   let cipher = Aes256GcmSiv::new(&key);
//   let nonce = Nonce::from_slice(nonce);
//   let plain_text = cipher.decrypt(nonce, cipher_text.as_slice());
//   Ok(plain_text.map_err(|err| anyhow::anyhow!("{}", err.to_string()))?)
// }
