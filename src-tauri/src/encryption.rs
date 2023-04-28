use aes_gcm_siv::{
    aead::{generic_array::GenericArray, Aead, KeyInit},
    Aes256GcmSiv,
};
use anyhow::anyhow;
use rand::{rngs::OsRng, RngCore};
use std::str;
use std::{
    fs::File,
    io::{Read, Write},
};
use zeroize::Zeroize;

// Based on a code by Sylvain Kerkour: https://github.com/skerkour/kerkour.com/tree/main/blog/2021/rust_file_encryption
// Based on a code by Sylvain Kerkour: https://github.com/skerkour/kerkour.com/tree/main/blog/2022/rust_file_encryption_with_password

/// Encrypts a specified file content string to a specified file name with specified password.
/// # Arguments
///
/// * `file_name` - the file name to save the data in encrypted form.
/// * `password` - the password to use for encryption.
/// * `content` - the contents to save into the file in encrypted form.
///
/// # Remarks
/// * The data is encrypted using [Aes256GcmSiv](https://en.wikipedia.org/wiki/AES-GCM-SIV) algorithm with [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function.
/// * If the file already exists it is overridden.
pub fn encrypt_small_file(
    file_path: &str,
    password: &str,
    content: &str,
) -> Result<(), anyhow::Error> {
    let argon2_config = argon2_config();

    let mut salt = [0u8; 32];
    let mut nonce = [0u8; 12];
    OsRng.fill_bytes(&mut salt);
    OsRng.fill_bytes(&mut nonce);

    let mut key = argon2::hash_raw(password.as_bytes(), &salt, &argon2_config)?;

    let pass = GenericArray::clone_from_slice(&key[..32]);

    let cipher = Aes256GcmSiv::new(&pass);

    let encrypted_file = cipher
        .encrypt(nonce.as_ref().into(), content.as_bytes())
        .map_err(|err| anyhow!("Encrypting small file: {}", err))?;
    let len: u64 = encrypted_file.len().try_into().unwrap();

    let mut file = File::create(file_path)?;
    file.write(&salt)?;
    file.write(&nonce)?;
    file.write(&len.to_le_bytes())?;
    file.write(&encrypted_file)?;

    salt.zeroize();
    nonce.zeroize();
    key.zeroize();

    Ok(())
}

/// Decrypts a specified file content to a string using the specified password.
/// # Arguments
///
/// * `file_name` - the file to decrypt the data from.
/// * `password` - the password to use for encryption.
///
/// # Returns
/// A string with the file contents decrypted or an error.
///
/// # Remarks
/// * The data is decrypted using [Aes256GcmSiv](https://en.wikipedia.org/wiki/AES-GCM-SIV) algorithm with [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function.
pub fn decrypt_small_file(file_path: &str, password: &str) -> Result<String, anyhow::Error> {
    let mut salt = [0u8; 32];
    let mut nonce = [0u8; 12];
    let mut size_data = [0u8; 8];

    let mut file = File::open(file_path)?;

    let mut read_count = file.read(&mut salt)?;
    if read_count != salt.len() {
        return Err(anyhow!("Error reading salt."));
    }

    read_count = file.read(&mut nonce)?;
    if read_count != nonce.len() {
        return Err(anyhow!("Error reading nonce."));
    }

    read_count = file.read(&mut size_data)?;
    if read_count != size_data.len() {
        return Err(anyhow!("Error reading saved data size."));
    }

    let len: usize = u64::from_le_bytes(size_data).try_into().unwrap();

    let argon2_config = argon2_config();

    let mut key = argon2::hash_raw(password.as_bytes(), &salt, &argon2_config)?;

    let mut data_buff = vec![0u8; len];

    let pass = GenericArray::clone_from_slice(&key[..32]);

    let cipher = Aes256GcmSiv::new(&pass);

    file.read(&mut data_buff)?;

    let decrypted_data = cipher
        .decrypt(nonce.as_ref().into(), data_buff.as_slice())
        .map_err(|err| anyhow!("Decrypting small file: {}", err))?;

    let result = str::from_utf8(&decrypted_data)?;

    salt.zeroize();
    nonce.zeroize();
    key.zeroize();

    Ok(result.to_string())
}

/// Creates an [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function configuration.
/// # Returns
/// An [Argon2](https://en.wikipedia.org/wiki/Argon2) / Argon2id key derivation function configuration.
fn argon2_config<'a>() -> argon2::Config<'a> {
    return argon2::Config {
        variant: argon2::Variant::Argon2id,
        hash_length: 32,
        lanes: 8,
        mem_cost: 16 * 1024,
        time_cost: 8,
        ..Default::default()
    };
}
