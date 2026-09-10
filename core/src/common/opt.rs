use std::net::SocketAddr;
use std::str::FromStr;

#[derive(clap::Parser)]
pub struct Args {
    #[arg(short = 'b', long, default_value_t = {SocketAddr::from_str("0.0.0.0:3000").unwrap()})]
    pub bind_address: SocketAddr,
    #[arg(short = 'd', long, default_value_t = {"sqlite://./walnut.sqlite?mode=rwc".to_string()})]
    pub database: String,
    #[arg(short = 'j', long, default_value_t = {"./credentials".to_string()})]
    pub jwt_credentials: String,
    #[arg(long, default_value_t = false)]
    pub allow_signup: bool,
}
