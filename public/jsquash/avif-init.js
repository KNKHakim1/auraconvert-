import Module from './avif-enc/avif_enc.js';

const mod = await Module({
  noInitialRun: true,
  locateFile: (path) => '/jsquash/avif-enc/' + path,
});

window.__auraconvert_avif_encoder = mod;
window.dispatchEvent(new Event('auraconvert-avif-ready'));
