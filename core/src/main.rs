use crate::api::item::{
    delete_password_item, get_password_item, list_items, new_password_item, update_password_item,
};
use crate::api::master::{
    delete_master, get_signup_availability, is_username_available, list_master, master_login,
    master_signup, modify_master, new_master, signup_availability_middleware,
};
use crate::auth::jwt::verify_token;
use crate::auth::key::JwtKeyError::TokioError;
use crate::auth::key::{JwtKeyPair, init_jwt_keys};
use crate::common::opt::Args;
use crate::crypto::rsa::generate_rsa_key_pair;
use crate::orm::tables::init_tables;
use axum::middleware;
use axum::routing::{delete, get, post, put};
use clap::Parser;
use log::{LevelFilter, error};
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::process::exit;
use tokio::fs::create_dir_all;

mod api;
mod auth;
mod common;
mod crypto;
mod orm;

pub struct Shared {
    pub database_connection: Option<DatabaseConnection>,
    pub jwt_key_pair: JwtKeyPair,
}

pub struct Config {
    pub jwt_pub_key_path: String,
    pub jwt_priv_key_path: String,
    pub self_signup_enabled: bool,
}

static SHARED_CELL: once_cell::sync::OnceCell<Shared> = once_cell::sync::OnceCell::new();
static CONFIG_CELL: once_cell::sync::OnceCell<Config> = once_cell::sync::OnceCell::new();

#[tokio::main]
async fn main() {
    let args = Args::parse();
    env_logger::Builder::from_default_env()
        .filter_level(args.verbose_level())
        .init();

    if !tokio::fs::try_exists(args.jwt_credentials_dir.clone())
        .await
        .unwrap_or_else(|e| {
            error!("{e}");
            exit(1);
        })
    {
        create_dir_all(args.jwt_credentials_dir.clone())
            .await
            .unwrap_or_else(|e| {
                error!("{e}");
                exit(1);
            })
    }

    CONFIG_CELL
        .set(Config {
            jwt_pub_key_path: args.jwt_credentials_dir.clone() + "/walnut-jwt-public-key.pem",
            jwt_priv_key_path: args.jwt_credentials_dir + "/walnut-jwt-private-key.pem",
            self_signup_enabled: args.self_signup,
        })
        .unwrap_or_else(|_| {
            error!("Failed to set configuration");
            exit(1);
        });

    let mut jwt_key_pair = init_jwt_keys(
        CONFIG_CELL.get().unwrap().jwt_priv_key_path.as_str(),
        CONFIG_CELL.get().unwrap().jwt_pub_key_path.as_str(),
    )
    .await;
    match jwt_key_pair {
        Ok(_) => {}
        Err(TokioError(e)) => match e.kind() {
            tokio::io::ErrorKind::NotFound => {
                generate_rsa_key_pair(
                    CONFIG_CELL.get().unwrap().jwt_priv_key_path.as_str(),
                    CONFIG_CELL.get().unwrap().jwt_pub_key_path.as_str(),
                )
                .await
                .unwrap_or_else(|e| {
                    error!("{e}");
                    exit(1);
                });
                jwt_key_pair = init_jwt_keys(
                    CONFIG_CELL.get().unwrap().jwt_priv_key_path.as_str(),
                    CONFIG_CELL.get().unwrap().jwt_pub_key_path.as_str(),
                )
                .await;
            }
            _ => {
                error!("{e}");
                exit(1);
            }
        },
        Err(e) => {
            error!("{e}");
            exit(1);
        }
    }

    let mut database_option = ConnectOptions::new(args.database);
    database_option.sqlx_logging_level(LevelFilter::Warn);

    SHARED_CELL
        .set(Shared {
            database_connection: Some(Database::connect(database_option).await.unwrap_or_else(
                |e| {
                    error!("{e}");
                    panic!();
                },
            )),
            jwt_key_pair: jwt_key_pair.unwrap(),
        })
        .unwrap_or_else(|_| {
            error!("Failed to set shared resources");
            panic!();
        });

    init_tables().await.unwrap_or_else(|e| {
        error!("{e}");
        panic!();
    });

    let app = axum::Router::new()
        .route("/api/master/list", get(list_master))
        .route("/api/master/new", post(new_master))
        .route("/api/master/modify", post(modify_master))
        .route("/api/master/delete", post(delete_master))
        // .layer(management_layer)
        .route("/api/{user_id}/items", get(list_items))
        .route("/api/{user_id}/items/password", post(new_password_item))
        .route(
            "/api/{user_id}/items/password/{item_id}",
            put(update_password_item),
        )
        .route(
            "/api/{user_id}/items/password/{item_id}",
            delete(delete_password_item),
        )
        .route(
            "/api/{user_id}/items/password/{item_id}",
            get(get_password_item),
        )
        .layer(middleware::from_fn(verify_token))
        .route(
            "/api/master/signup/availability",
            get(get_signup_availability),
        )
        .route(
            "/api/master/signup",
            post(master_signup).layer(middleware::from_fn(signup_availability_middleware)),
        )
        .route("/api/master/username", get(is_username_available))
        .route("/api/master/login", post(master_login));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap_or_else(|e| {
            log::error!("{e}");
            panic!();
        });

    axum::serve(listener, app).await.unwrap_or_else(|e| {
        log::error!("{e}");
        panic!();
    });
}
