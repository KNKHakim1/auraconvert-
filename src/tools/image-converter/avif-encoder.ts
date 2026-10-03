/**
 * AVIF Encoder utility for AuraConvert
 * Loads the WASM encoder via a real ES module script from /jsquash/avif-init.js
 */

let modulePromise: Promise<any> | null = null;

function loadAvifEncoder(): Promise<any> {
  if (modulePromise) return modulePromise;

  // If already loaded by a previous call
  if (typeof window !== 'undefined' && (window as any).__auraconvert_avif_encoder) {
    return Promise.resolve((window as any).__auraconvert_avif_encoder);
  }

  modulePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/jsquash/avif-init.js';

    const onReady = () => {
      window.removeEventListener('auraconvert-avif-ready', onReady);
      clearTimeout(timeoutId);
      const mod = (window as any).__auraconvert_avif_encoder;
      if (mod) {
        resolve(mod);
      } else {
        modulePromise = null;
        reject(new Error('AVIF encoder module not found after load'));
      }
    };

    window.addEventListener('auraconvert-avif-ready', onReady);

    const timeoutId = setTimeout(() => {
      window.removeEventListener('auraconvert-avif-ready', onReady);
      if (!(window as any).__auraconvert_avif_encoder) {
        modulePromise = null;
        reject(new Error('AVIF encoder load timed out'));
      }
    }, 30000);

    script.onerror = () => {
      window.removeEventListener('auraconvert-avif-ready', onReady);
      clearTimeout(timeoutId);
      modulePromise = null;
      reject(new Error('Failed to load AVIF encoder script'));
    };

    document.head.appendChild(script);
  });

  return modulePromise;
}

const defaultOptions = {
  quality: 50,
  qualityAlpha: -1,
  denoiseLevel: 0,
  tileColsLog2: 0,
  tileRowsLog2: 0,
  speed: 6,
  subsample: 1,
  chromaDeltaQ: false,
  sharpness: 0,
  tune: 0,
  enableSharpYUV: false,
  bitDepth: 8,
  lossless: false,
};

export async function encodeAvif(
  imageData: ImageData,
  options: Partial<typeof defaultOptions> = {}
): Promise<ArrayBuffer> {
  const module = await loadAvifEncoder();
  const opts = { ...defaultOptions, ...options };

  const output = module.encode(
    new Uint8Array(imageData.data.buffer),
    imageData.width,
    imageData.height,
    opts
  );

  if (!output) {
    throw new Error('AVIF encoding failed.');
  }

  return output.buffer;
}
