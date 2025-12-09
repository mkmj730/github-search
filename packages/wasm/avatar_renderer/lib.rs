// Minimal Rust module to accompany the inline WASM used at runtime.
// Build with: wasm-pack build --target web
#[no_mangle]
pub extern "C" fn identity(val: f32) -> f32 {
    val
}
