import { $, $$ } from '../../core/dom.js';
import { BITRATE_CONFIG } from '../../data/stage1.js';

export function initBitrateLab() {
  let sceneKey = 'talk';

  function update() {
    const resolution = BITRATE_CONFIG.resolutions[Number($('#resolution').value)];
    const fps = BITRATE_CONFIG.fps[Number($('#fps').value)];
    const motion = BITRATE_CONFIG.motion[Number($('#motion').value)];
    const scene = BITRATE_CONFIG.scenes[sceneKey];
    const bitrate = Math.max(0.5, 4.2 * resolution.factor * fps.factor * motion.factor * scene.factor);

    $('#resolutionOut').textContent = resolution.name;
    $('#fpsOut').textContent = fps.name;
    $('#motionOut').textContent = motion.name;
    $('#bitrateValue').textContent = bitrate.toFixed(1);
    $('#uplinkValue').textContent = `${(bitrate * 1.5).toFixed(1)} Mbps`;
    $('#qualityMeter').style.width = `${Math.min(100, 22 + bitrate * 8)}%`;
    $('#bitrateHint').textContent = `${resolution.name} ${scene.name}在${motion.name}运动、${fps.name}下，可以从 ${bitrate.toFixed(1)} Mbps 左右开始测试，再以真实画质和网络条件调整。`;
  }

  ['resolution', 'fps', 'motion'].forEach((id) => $(`#${id}`).addEventListener('input', update));
  $$('#sceneOptions button').forEach((button) => {
    button.addEventListener('click', () => {
      sceneKey = button.dataset.scene;
      $$('#sceneOptions button').forEach((item) => item.classList.toggle('active', item === button));
      update();
    });
  });
  update();
}
