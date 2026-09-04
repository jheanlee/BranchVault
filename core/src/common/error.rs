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
