#[derive(clap::Parser)]
pub struct Args {
    #[arg(short = 'd', long, default_value_t = {"sqlite://./walnut.sqlite?mode=rwc".to_string()})]
    pub database: String,
    #[arg(short = 'j', long, default_value_t = {"./credentials".to_string()})]
    pub jwt_credentials_dir: String,
    #[arg(long, default_value_t = false)]
    pub allow_signup: bool,
}
