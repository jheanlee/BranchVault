use crate::common::error::ApiError;
use log::info;
use rsa::pkcs8::{EncodePrivateKey, EncodePublicKey};
use rsa::{RsaPrivateKey, RsaPublicKey};

pub async fn generate_rsa_key_pair(priv_path: &str, pub_path: &str) -> Result<(), ApiError> {
    info!("Generating RSA key pair");
    let mut rng = rand::thread_rng();
    let bits = 4096;
    let priv_key = RsaPrivateKey::new(&mut rng, bits)?;
    let pub_key = RsaPublicKey::from(&priv_key);
    tokio::fs::write(priv_path, priv_key.to_pkcs8_pem(Default::default())?).await?;
    tokio::fs::write(pub_path, pub_key.to_public_key_pem(Default::default())?).await?;
    Ok(())
}
