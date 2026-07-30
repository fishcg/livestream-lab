import { $, $$ } from '../../core/dom.js';

export function initGopLab() {
  function render() {
    const length = Number($('#gopLength').value);
    const visibleFrameCount = 12;
    const seconds = (length / 30).toFixed(2);
    $('#gopOut').textContent = `${length} 帧`;
    $('#gopSeconds').textContent = `约 ${seconds} 秒`;
    $('#recoverSeconds').textContent = `≤ ${seconds} 秒`;
    $('#frameTrack').innerHTML = Array.from({ length: visibleFrameCount }, (_, index) => {
      const isKeyframe = index === 0 || index === visibleFrameCount - 1;
      const frameType = isKeyframe ? 'I' : (index % 3 === 0 ? 'B' : 'P');
      const actualFrame = Math.round(index * length / (visibleFrameCount - 1));
      return `<div class="frame ${isKeyframe ? 'i-frame' : ''}" data-index="${index}">${frameType}<small>${actualFrame}</small></div>`;
    }).join('');
  }

  $('#gopLength').addEventListener('input', render);
  $('#dropPacket').addEventListener('click', () => {
    render();
    const frames = $$('.frame');
    const candidates = frames.filter((frame) => !frame.classList.contains('i-frame') && Number(frame.dataset.index) < frames.length - 2);
    const startIndex = Number(candidates[Math.floor(Math.random() * candidates.length)].dataset.index);
    let affected = 0;
    for (let index = startIndex; index < frames.length; index += 1) {
      if (index > startIndex && frames[index].classList.contains('i-frame')) break;
      frames[index].classList.add('lost');
      affected += 1;
    }
    $('#gopHint').textContent = `示意轨道中有 ${affected} 个采样帧受到影响，直到下一个 I 帧恢复。实际影响帧数取决于丢包位置、编码结构和播放器容错。`;
  });
  render();
}
