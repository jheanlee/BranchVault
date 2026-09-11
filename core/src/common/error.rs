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

use axum::http::StatusCode;
use axum::response::Response;
use std::fmt::Formatter;
use tracing::warn;

#[derive(Debug)]
pub enum ApiError {
    Error(anyhow::Error),
    StatusCode(StatusCode),
}

impl axum::response::IntoResponse for ApiError {
    fn into_response(self) -> Response {
        match self {
            ApiError::Error(e) => {
                warn!("ApiError: {e}");
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
            ApiError::StatusCode(code) => code.into_response(),
        }
    }
}

impl<E> From<E> for ApiError
where
    E: Into<anyhow::Error>,
{
    fn from(error: E) -> Self {
        Self::Error(error.into())
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::Error(e) => write!(f, "{e}"),
            ApiError::StatusCode(e) => write!(f, "Error code: {}", e.as_str()),
        }
    }
}
