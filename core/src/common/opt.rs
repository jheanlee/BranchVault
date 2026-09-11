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
