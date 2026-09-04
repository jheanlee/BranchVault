use axum::body::Body;
use axum::http;
use axum::http::{StatusCode, Uri};
use axum::response::{Html, IntoResponse, Response};
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "../webui/dist"]
struct Assets;

pub async fn static_handler(uri: Uri) -> impl IntoResponse {
    let path = uri.path().trim_start_matches('/');

    if path.is_empty() || path == "index.html" {
        return index_html().await;
    }

    match Assets::get(path) {
        Some(file) => {
            let content_type = mime_guess::from_path(path).first_or_octet_stream();

            Response::builder()
                .status(StatusCode::OK)
                .header(http::header::CONTENT_TYPE, content_type.as_ref())
                .body(Body::from(file.data))
                .unwrap()
        }
        None => {
            if path.contains('.') {
                return not_found().await;
            }

            index_html().await
        }
    }
}

async fn index_html() -> Response {
    match Assets::get("index.html") {
        Some(content) => Html(content.data).into_response(),
        None => not_found().await,
    }
}

async fn not_found() -> Response {
    StatusCode::NOT_FOUND.into_response()
}
