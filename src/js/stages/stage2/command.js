import { $, setFeedback } from '../../core/dom.js';

const SOURCES = {
  file: '-re -i demo.mp4',
  camera: '-f avfoundation -framerate {fps} -i "0:0"',
  screen: '-f avfoundation -framerate {fps} -i "1:0"'
};

let simulationTimer;

function buildCommand() {
  const fps = Number($('#stage2CmdFps').value);
  const bitrate = Number($('#stage2CmdBitrate').value);
  const size = $('#stage2CmdSize').value;
  const preset = $('#stage2CmdPreset').value;
  const source = SOURCES[$('#stage2CmdSource').value].replace('{fps}', fps);
  return [
    'ffmpeg', source,
    `-vf scale=${size} -r ${fps}`,
    `-c:v libx264 -preset ${preset} -b:v ${bitrate}k -g ${fps * 2}`,
    '-c:a aac -b:a 128k -ar 48000',
    '-f flv rtmp://localhost/live/demo'
  ].join(' ' + String.fromCharCode(92) + '\n  ');
}

function renderCommand() {
  $('#stage2CommandOutput').textContent = buildCommand();
  const bitrate = Number($('#stage2CmdBitrate').value);
  const fps = Number($('#stage2CmdFps').value);
  const size = $('#stage2CmdSize').value;
  const preset = $('#stage2CmdPreset').value;
  const resolutionFactor = { '854:480': 0.35, '1280:720': 0.62, '1920:1080': 1 }[size];
  const presetFactor = { veryfast: 0.78, faster: 1, fast: 1.24 }[preset];
  const encoderLoad = Math.min(100, Math.round(58 * resolutionFactor * (fps / 30) * presetFactor));
  const uplinkLoad = Math.min(100, Math.round(bitrate * 1.5 / 100));
  $('#stage2CommandHint').textContent = `视频约 ${(bitrate / 1000).toFixed(1)} Mbps，建议稳定上行至少 ${(bitrate * 1.5 / 1000).toFixed(1)} Mbps；GOP 固定为 2 秒。`;
  $('#stage2EncoderLoad').style.width = `${encoderLoad}%`;
  $('#stage2EncoderLoad').parentElement.setAttribute('aria-valuenow', String(encoderLoad));
  $('#stage2EncoderLoadText').textContent = `${encoderLoad}%`;
  $('#stage2UplinkLoad').style.width = `${uplinkLoad}%`;
  $('#stage2UplinkLoad').parentElement.setAttribute('aria-valuenow', String(uplinkLoad));
  $('#stage2UplinkLoadText').textContent = `${uplinkLoad}%`;
  const warnings = [];
  if (encoderLoad >= 85) warnings.push('编码压力很高，弱设备可能无法保持实时速度');
  if (uplinkLoad >= 85) warnings.push('上行余量很小，网络轻微波动就可能堆积队列');
  if (!warnings.length) warnings.push('当前组合仍有一定余量，下一步应以真实设备和真实网络试推验证');
  $('#stage2TradeoffHint').textContent = warnings.join('；') + '。';
}

function simulatePush() {
  window.clearInterval(simulationTimer);
  const log = $('#stage2CommandLog');
  const button = $('#stage2CommandRun');
  const lines = [
    '读取输入：时钟正常，音视频轨道已发现',
    '启动编码：H.264 + AAC，关键帧间隔 2 秒',
    '连接服务器：tcp://localhost:1935',
    'RTMP publish：app=live, stream=demo',
    'frame= 180  fps=30  speed=1.00x  status=publishing'
  ];
  let index = 0;
  log.textContent = '';
  button.disabled = true;
  setFeedback($('#stage2CommandFeedback'), '', '这是浏览器内的流程模拟，不会真的连接服务器。');
  const appendLine = () => {
    log.textContent += `${index ? '\n' : ''}> ${lines[index]}`;
    index += 1;
    if (index === lines.length) {
      window.clearInterval(simulationTimer);
      button.disabled = false;
      setFeedback($('#stage2CommandFeedback'), 'success', '模拟推流成功。你已经把输入、编码、封装和输出地址串成一条命令。');
    }
  };
  appendLine();
  simulationTimer = window.setInterval(appendLine, 450);
}

export function initFfmpegCommandLab() {
  ['stage2CmdSource', 'stage2CmdSize', 'stage2CmdFps', 'stage2CmdBitrate', 'stage2CmdPreset']
    .forEach((id) => $(`#${id}`)?.addEventListener('change', renderCommand));
  $('#stage2CommandRun')?.addEventListener('click', simulatePush);
  renderCommand();
}
