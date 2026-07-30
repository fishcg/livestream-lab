export function responsivePicture(base, alt) {
  return `<picture><source srcset="${base}.webp" type="image/webp"><img src="${base}-fallback.jpg" alt="${alt}"></picture>`;
}
