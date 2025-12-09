import { useCallback } from "react";

// Minimal WASM binary (exported function `identity` that returns its input).
// Hex:
// 00 61 73 6d 01 00 00 00
// 01 06 01 60 01 7f 01 7f  (type section size fixed to 0x06)
// 03 02 01 00              (function section)
// 07 0c 01 08 69 64 65 6e 74 69 74 79 00 00 (export identity -> func 0)
// 0a 06 01 04 00 20 00 0b  (code section)
const wasmBytes = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x06, 0x01, 0x60, 0x01, 0x7f, 0x01, 0x7f,
  0x03, 0x02, 0x01, 0x00,
  0x07, 0x0c, 0x01, 0x08, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x74, 0x79, 0x00, 0x00,
  0x0a, 0x06, 0x01, 0x04, 0x00, 0x20, 0x00, 0x0b
]);

type IdentityFn = (value: number) => number;

let wasmInstance: WebAssembly.Instance | null = null;
const loadWasm = async () => {
  if (wasmInstance) return wasmInstance;
  const { instance } = await WebAssembly.instantiate(wasmBytes, {});
  wasmInstance = instance;
  return instance;
};

export const useWasmAvatarRenderer = () => {
  return useCallback(async (canvas: HTMLCanvasElement, url: string) => {
    const instance = await loadWasm();
    const identity = (instance.exports.identity as IdentityFn) ?? ((v: number) => v);
    const scale = identity(1); // keep hook dependent on WASM

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const size = Math.min(canvas.width, canvas.height) * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    ctx.restore();
  }, []);
};

export default useWasmAvatarRenderer;
