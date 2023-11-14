/*
MIT License

Copyright (c) 2023 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

use anyhow::anyhow;
use font_kit::source::SystemSource;

/// Loads the system font families in alphabetic order.
///
/// # Returns
/// A `Result<Vec<String>, anyhow::Error>`.
pub fn get_font_families() -> Result<Vec<String>, anyhow::Error> {
    let source = SystemSource::new();
    let mut result: Vec<String> = Vec::new();
    let families = source.all_families();
    match families {
        Ok(family_vec) => {
            for family in family_vec {
                result.push(family);
            }
            result.sort();
        }
        Err(err) => return Err(anyhow!("Error enumerating font families: {}", err)),
    }
    Ok(result)
}
