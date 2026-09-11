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
use axum::extract::Request;
use axum::http::{HeaderMap, StatusCode};
use axum::middleware::Next;
use axum::response::Response;
use jsonwebtoken::{Algorithm, Header, Validation, get_current_timestamp};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Claims {
    pub sub: String,
    pub exp: u64,
    pub iat: u64,
}

pub async fn get_sub(jwt: &str) -> Result<String, StatusCode> {
    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_required_spec_claims(&["sub", "iat", "exp"]);

    match jsonwebtoken::decode::<Claims>(
        jwt,
        &SHARED_CELL.get().unwrap().jwt_key_pair.decoding_key,
        &validation,
    ) {
        Ok(claims) => Ok(claims.claims.sub),
        Err(_) => Err(StatusCode::UNAUTHORIZED),
    }
}

pub async fn generate_token(sub: String) -> Result<String, ApiError> {
    let claims = Claims {
        sub,
        iat: get_current_timestamp(),
        exp: get_current_timestamp() + 600,
    };
    let token = jsonwebtoken::encode(
        &Header::new(Algorithm::RS256),
        &claims,
        &SHARED_CELL.get().unwrap().jwt_key_pair.encoding_key,
    )?;
    Ok(token)
}

pub async fn verify_token(
    header_map: HeaderMap,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    if let Some(token) = header_map.get("authorization") {
        let mut validation = Validation::new(Algorithm::RS256);
        validation.set_required_spec_claims(&["sub", "iat", "exp"]);

        match jsonwebtoken::decode::<Claims>(
            token.to_str().unwrap_or_default(),
            &SHARED_CELL.get().unwrap().jwt_key_pair.decoding_key,
            &validation,
        ) {
            Ok(_) => {
                let response = next.run(request).await;
                Ok(response)
            }
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}
