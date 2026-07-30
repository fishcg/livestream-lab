import { getState, subscribe, updateState } from './store.js';
import { showToast } from './toast.js';

const CERTIFICATE_WIDTH = 1600;
const CERTIFICATE_HEIGHT = 1131;
const COURSE_STAGES = [
  ['01', '信号基础'],
  ['02', '推流接入'],
  ['03', '播放分发'],
  ['04', '故障诊断'],
  ['05', '架构设计']
];

let dialog;
let nameInput;
let shareButton;
let downloadButton;
let statusText;
let previewName;
let previewDate;
let autoOpenScheduled = false;

function isCourseComplete(state) {
  return COURSE_STAGES.every((_, index) => state.completedStages.includes(index + 1));
}

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function displayDate(value) {
  return (value || today()).replaceAll('-', '.');
}

function normalizedName() {
  return nameInput.value.trim().replace(/\s+/g, ' ');
}

function setStatus(message = '', type = '') {
  statusText.textContent = message;
  statusText.className = `certificate-status${type ? ` ${type}` : ''}`;
}

function renderPreview() {
  const name = normalizedName();
  const state = getState();
  previewName.textContent = name || '你的昵称';
  previewName.classList.toggle('placeholder', !name);
  previewDate.textContent = `颁发日期 / ${displayDate(state.certificateIssuedAt)}`;
  shareButton.disabled = !name;
  downloadButton.disabled = !name;
  setStatus(name ? '奖状已就绪，可以分享或下载。' : '请输入昵称，奖状会立即署名。');
}

function persistCertificate(name) {
  const state = getState();
  const issuedAt = state.certificateIssuedAt || today();
  if (state.certificateName !== name || state.certificateIssuedAt !== issuedAt) {
    updateState((current) => ({ ...current, certificateName: name, certificateIssuedAt: issuedAt }));
  }
  return issuedAt;
}

function drawCenteredText(context, text, y) {
  context.fillText(text, CERTIFICATE_WIDTH / 2, y);
}

function fitNameFont(context, name) {
  let size = 92;
  do {
    context.font = `900 ${size}px "Noto Sans SC", sans-serif`;
    size -= 2;
  } while (context.measureText(name).width > 1180 && size > 44);
}

function renderCertificateCanvas(name, issuedAt) {
  const canvas = document.createElement('canvas');
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;
  const context = canvas.getContext('2d');

  context.fillStyle = '#f1eee5';
  context.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

  context.strokeStyle = '#12161a';
  context.lineWidth = 10;
  context.strokeRect(34, 34, CERTIFICATE_WIDTH - 68, CERTIFICATE_HEIGHT - 68);
  context.strokeStyle = '#ff6a2a';
  context.lineWidth = 3;
  context.strokeRect(52, 52, CERTIFICATE_WIDTH - 104, CERTIFICATE_HEIGHT - 104);

  context.fillStyle = '#11161b';
  context.fillRect(52, 52, CERTIFICATE_WIDTH - 104, 128);
  context.fillStyle = '#45d5e8';
  context.fillRect(52, 180, CERTIFICATE_WIDTH - 104, 7);
  context.fillStyle = '#ff6a2a';
  context.fillRect(52, 187, 460, 7);

  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';
  context.textAlign = 'left';
  context.font = '900 52px "Noto Sans SC", sans-serif';
  context.fillText('LIVE', 92, 115);
  context.fillStyle = '#ff6a2a';
  context.fillText('LAB', 226, 115);
  context.fillStyle = '#8f9aa3';
  context.textAlign = 'right';
  context.font = '500 20px "DM Mono", monospace';
  context.fillText('STREAMING TECHNOLOGY / COURSE COMPLETION', 1505, 115);

  context.textAlign = 'center';
  context.fillStyle = '#ff6a2a';
  context.font = '500 21px "DM Mono", monospace';
  drawCenteredText(context, 'SCORE 100 / 100 · 05 / 05 STAGES COMPLETE', 263);
  context.fillStyle = '#161a1e';
  context.font = '900 67px "Noto Sans SC", sans-serif';
  drawCenteredText(context, '直播技术学习结业证书', 352);

  context.fillStyle = '#74716a';
  context.font = '500 23px "Noto Sans SC", sans-serif';
  drawCenteredText(context, '兹证明', 434);
  context.fillStyle = '#11161b';
  fitNameFont(context, name);
  drawCenteredText(context, name, 524);
  context.fillStyle = '#ff6a2a';
  context.fillRect(420, 581, 760, 4);

  context.fillStyle = '#53575a';
  context.font = '500 28px "Noto Sans SC", sans-serif';
  drawCenteredText(context, '已完成 LiveLab 五阶段直播推拉流课程及全部阶段考试', 632);
  context.fillStyle = '#81817c';
  context.font = '400 21px "Noto Sans SC", sans-serif';
  drawCenteredText(context, '能够从信号、推流、分发、播放与观测角度解释并搭建完整直播链路', 674);

  context.fillStyle = '#11161b';
  context.fillRect(420, 710, 760, 66);
  context.textAlign = 'left';
  context.fillStyle = '#a6ef67';
  context.font = '900 30px "Noto Sans SC", sans-serif';
  context.fillText('总成绩 100 分', 448, 743);
  context.textAlign = 'right';
  context.fillStyle = '#45d5e8';
  context.font = '500 18px "DM Mono", monospace';
  context.fillText('HTTPS://LIVELAB.ACGAY.CN', 1152, 743);

  const cardGap = 16;
  const cardWidth = 262;
  const startX = (CERTIFICATE_WIDTH - (cardWidth * COURSE_STAGES.length + cardGap * (COURSE_STAGES.length - 1))) / 2;
  COURSE_STAGES.forEach(([index, label], cardIndex) => {
    const x = startX + cardIndex * (cardWidth + cardGap);
    context.fillStyle = cardIndex === COURSE_STAGES.length - 1 ? '#11161b' : '#e2ded3';
    context.fillRect(x, 800, cardWidth, 100);
    context.fillStyle = cardIndex === COURSE_STAGES.length - 1 ? '#45d5e8' : '#ff6a2a';
    context.font = '500 17px "DM Mono", monospace';
    context.textAlign = 'left';
    context.fillText(index, x + 22, 827);
    context.fillStyle = cardIndex === COURSE_STAGES.length - 1 ? '#ffffff' : '#22272a';
    context.font = '700 24px "Noto Sans SC", sans-serif';
    context.fillText(label, x + 22, 866);
  });

  context.strokeStyle = '#c9c4b8';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(92, 938);
  context.lineTo(1508, 938);
  context.stroke();
  context.textAlign = 'left';
  context.fillStyle = '#6f716f';
  context.font = '500 18px "DM Mono", monospace';
  context.fillText(`ISSUED / ${displayDate(issuedAt)}`, 92, 984);
  context.textAlign = 'right';
  context.fillStyle = '#161a1e';
  context.font = '700 20px "DM Mono", monospace';
  context.fillText('HTTPS://LIVELAB.ACGAY.CN / SIGNAL LOCKED', 1508, 984);
  context.fillStyle = '#8b8a84';
  context.font = '400 16px "Noto Sans SC", sans-serif';
  context.fillText('直播技术速通实验室', 1508, 1023);

  return canvas;
}

function canvasToFile(canvas, name) {
  const dataUrl = canvas.toDataURL('image/png');
  const bytes = atob(dataUrl.split(',')[1]);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
  const safeName = name.replace(/[\\/:*?"<>|]/g, '-');
  return new File([buffer], `LiveLab-${safeName}-结业证书.png`, { type: 'image/png' });
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createCertificateFile() {
  const name = normalizedName();
  if (!name) {
    nameInput.focus();
    setStatus('请先输入昵称。', 'error');
    return null;
  }
  const issuedAt = persistCertificate(name);
  return canvasToFile(renderCertificateCanvas(name, issuedAt), name);
}

function shareCertificate() {
  const file = createCertificateFile();
  if (!file) return;
  const shareData = {
    title: 'LiveLab 直播技术学习结业证书',
    text: `${normalizedName()} 以 100 分完成 LiveLab 五阶段直播技术课程：https://livelab.acgay.cn`,
    files: [file]
  };
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    navigator.share(shareData)
      .then(() => setStatus('奖状已成功分享。', 'success'))
      .catch((error) => {
        if (error.name === 'AbortError') setStatus('已取消分享。');
        else setStatus('系统分享暂时不可用，请下载 PNG 后分享。', 'error');
      });
    return;
  }
  downloadFile(file);
  setStatus('当前浏览器不支持图片文件分享，已下载 PNG。', 'success');
  showToast('奖状 PNG 已下载，可发送给好友');
}

function downloadCertificate() {
  const file = createCertificateFile();
  if (!file) return;
  downloadFile(file);
  setStatus('奖状 PNG 已下载。', 'success');
  showToast('奖状 PNG 已下载');
}

export function openCertificate() {
  if (!dialog) return;
  const state = getState();
  nameInput.value = state.certificateName;
  renderPreview();
  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
  document.body.classList.add('certificate-open');
  window.requestAnimationFrame(() => nameInput.focus());
}

function closeCertificate() {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function mountCertificate() {
  const root = document.querySelector('#certificateRoot');
  root.innerHTML = `
    <dialog class="certificate-dialog" id="certificateDialog" aria-labelledby="certificateDialogTitle">
      <div class="certificate-modal">
        <button class="certificate-close" id="certificateClose" type="button" aria-label="关闭奖状">×</button>
        <section class="certificate-controls">
          <span>100 / 100 · 05 / 05 · SIGNAL VERIFIED</span>
          <h2 id="certificateDialogTitle">五个阶段，满分完成</h2>
          <p>输入你希望展示的昵称。奖状只在当前浏览器生成，不会上传昵称。</p>
          <label for="certificateName">奖状署名</label>
          <input id="certificateName" type="text" maxlength="24" autocomplete="nickname" placeholder="输入昵称" aria-describedby="certificateNameHint">
          <small id="certificateNameHint">最多 24 个字符，可使用中文、英文或数字。</small>
          <div class="certificate-actions">
            <button class="primary-button" id="certificateShare" type="button" disabled>分享奖状</button>
            <button class="secondary-button" id="certificateDownload" type="button" disabled>下载 PNG</button>
          </div>
          <p class="certificate-status" id="certificateStatus" role="status"></p>
        </section>
        <div class="certificate-preview-wrap">
          <article class="certificate-paper" id="certificatePaper" aria-label="LiveLab 直播技术学习结业证书预览">
            <div class="certificate-paper-top"><b>LIVE<span>LAB</span></b><small>STREAMING TECHNOLOGY / COURSE COMPLETION</small></div>
            <div class="certificate-paper-body">
              <span>SCORE 100 / 100 · 05 / 05 STAGES COMPLETE</span>
              <h3>直播技术学习结业证书</h3>
              <small>兹证明</small>
              <strong class="placeholder" id="certificatePreviewName">你的昵称</strong>
              <p>已完成 LiveLab 五阶段直播推拉流课程及全部阶段考试</p>
              <div class="certificate-achievement"><span><small>FINAL SCORE</small><b>100 分</b></span><span><small>COURSE WEBSITE</small><b>livelab.acgay.cn</b></span></div>
              <div class="certificate-stage-list">
                ${COURSE_STAGES.map(([index, label]) => `<div><small>${index}</small><b>${label}</b></div>`).join('')}
              </div>
            </div>
            <footer><span id="certificatePreviewDate"></span><b>HTTPS://LIVELAB.ACGAY.CN / SIGNAL LOCKED</b></footer>
          </article>
        </div>
      </div>
    </dialog>`;

  dialog = root.querySelector('#certificateDialog');
  nameInput = root.querySelector('#certificateName');
  shareButton = root.querySelector('#certificateShare');
  downloadButton = root.querySelector('#certificateDownload');
  statusText = root.querySelector('#certificateStatus');
  previewName = root.querySelector('#certificatePreviewName');
  previewDate = root.querySelector('#certificatePreviewDate');

  nameInput.addEventListener('input', renderPreview);
  nameInput.addEventListener('change', () => {
    const name = normalizedName();
    if (name) persistCertificate(name);
  });
  shareButton.addEventListener('click', shareCertificate);
  downloadButton.addEventListener('click', downloadCertificate);
  root.querySelector('#certificateClose').addEventListener('click', closeCertificate);
  dialog.addEventListener('close', () => document.body.classList.remove('certificate-open'));
  dialog.addEventListener('cancel', () => document.body.classList.remove('certificate-open'));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeCertificate();
  });
}

export function initCertificate() {
  mountCertificate();
  const entry = document.querySelector('#openCertificate');
  entry.addEventListener('click', openCertificate);
  subscribe((state) => {
    const complete = isCourseComplete(state);
    entry.hidden = !complete;
    if (!complete && dialog.open) closeCertificate();
    if (complete && !state.certificatePresented && !autoOpenScheduled) {
      autoOpenScheduled = true;
      updateState((current) => ({ ...current, certificatePresented: true }));
      window.setTimeout(openCertificate, 450);
    }
    if (!complete) autoOpenScheduled = false;
  });
}
