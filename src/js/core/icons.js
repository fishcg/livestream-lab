const SPRITE_PATH = 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/icons/livelab-icons.svg';

export function iconMarkup(name, className = '') {
  const classes = ['line-icon', className].filter(Boolean).join(' ');
  return `<svg class="${classes}" aria-hidden="true" focusable="false"><use href="${SPRITE_PATH}#${name}"></use></svg>`;
}

export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((placeholder) => {
    placeholder.innerHTML = iconMarkup(placeholder.dataset.icon);
  });
}
