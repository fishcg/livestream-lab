export const PIPELINE_STEPS = ['采集', '编码', '封装', '推流', '流媒体服务器', '拉流', '播放'];

export const PIPELINE_LESSONS = [
  {
    step: '采集', en: 'CAPTURE', icon: 'capture', role: '把现实世界翻译成数字信号',
    explanation: '摄像头把连续光线变成一张张原始视频帧；麦克风把声波变成一串音频采样。此时数据很真实，也非常庞大。',
    analogy: '像摄像师和录音师先把现场素材完整拍下来，还没有剪辑和压缩。',
    output: '原始视频帧 + PCM 音频采样',
    checkpoint: '采集异常通常表现为黑屏、无声、花屏或帧率不稳。'
  },
  {
    step: '编码', en: 'ENCODE', icon: 'encode', role: '删掉重复信息，让数据变小',
    explanation: '编码器利用画面内部和相邻帧之间的大量相似内容进行压缩。视频常用 H.264，音频常用 AAC。',
    analogy: '像给羽绒被抽真空。不是把羽绒被扔掉，而是去掉占空间的空气，方便运输。',
    output: 'H.264 视频流 + AAC 音频流',
    checkpoint: '编码参数决定码率、清晰度、延迟、算力消耗和设备兼容性。'
  },
  {
    step: '封装', en: 'MUX', icon: 'container', role: '把音频、视频和时间表装进同一个箱子',
    explanation: '视频和音频是两条独立轨道，封装器按照规则把它们组织起来，并带上时间戳等信息。',
    analogy: '像把视频、音频分别装进带标签的快递箱，标签告诉收件人先拆什么、何时使用。',
    output: '连续的 FLV 等封装数据',
    checkpoint: '封装不是再次压缩；它主要解决“怎样组织和读取”。'
  },
  {
    step: '推流', en: 'PUBLISH', icon: 'publish', role: '主播主动把连续数据送到服务器',
    explanation: '推流工具和流媒体服务器建立长连接，把刚产生的数据源源不断发出去。RTMP 是常见推流协议。',
    analogy: '像主播开着一辆不停装货的运输车，边生产、边装车、边送往仓库。',
    output: '通过 RTMP 上行的实时数据',
    checkpoint: '推流最依赖主播上行网络；带宽不足、抖动和丢包都会影响所有观众。'
  },
  {
    step: '流媒体服务器', en: 'MEDIA SERVER', icon: 'server', role: '接住一路流，处理后分给很多人',
    explanation: '服务器接入主播流，可以做转码、录制、鉴权、转协议，再把内容交给 CDN 或直接分发。',
    analogy: '像直播物流中心：收货、分拣、换包装，再发往各地区配送站。',
    output: '多档清晰度与多种播放协议',
    checkpoint: '一位主播可以服务大量观众，关键就在服务端的一对多分发。'
  },
  {
    step: '拉流', en: 'SUBSCRIBE', icon: 'subscribe', role: '观众选择路线，向服务器索取直播',
    explanation: '播放器根据终端和业务场景，通过 HLS、HTTP-FLV 或 WebRTC 等方式持续取得数据。',
    analogy: '像收件人选择普通快递、同城急送或专车直送：速度、成本和覆盖范围不同。',
    output: '抵达播放器的网络数据包',
    checkpoint: '同一直播可以同时提供多种拉流协议，不同协议的延迟差异很大。'
  },
  {
    step: '播放', en: 'PLAYBACK', icon: 'playback', role: '拆箱、还原，并按时间表展示',
    explanation: '播放器先解封装，再分别解码视频和音频，最后根据时间戳同步渲染到屏幕和扬声器。',
    analogy: '像收件人拆开快递，按说明书组装，并让画面演员与声音台词准时登场。',
    output: '观众看到的画面 + 听到的声音',
    checkpoint: '播放端还会用缓冲区抵抗网络抖动，但缓冲越大，直播延迟通常越高。'
  }
];

export const MEDIA_TERMS = [
  ['H.264', 'codec'], ['AAC', 'codec'], ['Opus', 'codec'],
  ['FLV', 'container'], ['MP4', 'container'], ['MPEG-TS', 'container'],
  ['RTMP', 'protocol'], ['HLS', 'protocol'], ['WebRTC', 'protocol']
];

export const GLOSSARY_TERMS = [
  {
    id: 'pixel', term: '像素', en: 'PIXEL', category: 'media', visual: 'pixel', icon: 'pixel',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/pixel-mosaic-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/pixel-mosaic.svg',
    imageAlt: '由方形瓷砖拼成的帆船马赛克墙，放大镜展示单块瓷砖', imageCaption: '远看是完整帆船，近看是一个个颜色格子',
    summary: '组成数字画面的最小颜色格子。',
    analogy: '像一面用小瓷砖拼成的墙。离远看是完整图案，贴近看都是一个个方格。',
    why: '像素数量决定画面能承载多少细节，但像素多不代表一定清晰，还要有足够码率描述它们。',
    misconception: '像素不是现实中的固定尺寸；同一张图显示在不同屏幕上，每个像素的物理大小可以不同。'
  },
  {
    id: 'resolution', term: '分辨率', en: 'RESOLUTION', category: 'media', visual: 'resolution', icon: 'resolution',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/resolution-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/resolution-fallback.jpg',
    imageAlt: '同一艘帆船分别由粗大瓷砖和密集小瓷砖拼成，右侧保留更多细节', imageCaption: '画面尺寸相同，格子越密，能承载的细节越多',
    summary: '一帧画面横向像素数 × 纵向像素数。',
    analogy: '同一幅拼图，1920×1080 比 640×360 拥有更多、更小的拼图块，所以能留下更多边缘细节。',
    why: '分辨率越高，编码和传输压力通常越大。直播选档时必须和码率、设备性能一起考虑。',
    misconception: '1080P 只说明像素数量，不保证画面没有马赛克，也不代表它一定比高码率 720P 更好看。'
  },
  {
    id: 'fps', term: '帧 / FPS', en: 'FRAME RATE', category: 'media', visual: 'fps', icon: 'fps',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/fps-flipbook-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/fps-flipbook.svg',
    imageAlt: '一本快速翻动的逐帧动画书，每页橙色小球位置逐渐变化', imageCaption: '每页都静止，快速翻动后却形成连续动作',
    summary: '帧是一张静止画面；FPS 是每秒播放多少张。',
    analogy: '像快速翻动一本手绘小人书。翻得越快，动作看起来越连续。',
    why: '高 FPS 让运动更顺滑，也意味着每秒要编码更多画面。游戏和体育常用 60 FPS，访谈通常 25～30 FPS 已够用。',
    misconception: '把 30 FPS 机械补成 60 FPS，不会凭空创造真实动作细节。'
  },
  {
    id: 'bitrate', term: '码率', en: 'BITRATE', category: 'media', visual: 'bitrate', icon: 'bitrate',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/bitrate-pipe-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/bitrate-pipe.svg',
    imageAlt: '大量发光数据颗粒通过透明管道运输', imageCaption: '管道每秒能通过的信息量，就是码率的直觉',
    summary: '每秒用多少比特来描述音视频，常见单位是 Mbps。',
    analogy: '像一根每秒送水的管道。水量太小，大片运动画面就只能“缺斤少两”，出现模糊和色块。',
    why: '它同时影响画质、主播上行压力、CDN 流量和观众下行门槛，是直播成本与体验的核心旋钮。',
    misconception: '码率不是越大越好；超过画面和编码器的有效需求后，成本上涨但肉眼收益很小。'
  },
  {
    id: 'sample-rate', term: '采样率', en: 'SAMPLE RATE', category: 'media', visual: 'sample', icon: 'audio',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/sample-rate-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/sample-rate-fallback.jpg',
    imageAlt: '同一声音波形左侧测量点稀疏而折线粗糙，右侧测量点密集且轮廓平滑', imageCaption: '测量点越密，记录下来的声音轮廓越接近原始波形',
    summary: '每秒对声音波形测量多少次，直播常见 48 kHz。',
    analogy: '像沿着一条曲线密集打点。点越密，复原出的声音轮廓越接近原始波形。',
    why: '音频链路中采样率不一致可能触发重采样，配置不当时还会带来变速、杂音或音画同步问题。',
    misconception: '48 kHz 指每秒采样 48000 次，不是音频码率 48 kbps。'
  },
  {
    id: 'codec', term: '编码', en: 'CODEC', category: 'structure', visual: 'codec', icon: 'encode',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/codec-vacuum-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/codec-vacuum.svg',
    imageAlt: '蓬松羽绒被被压缩进透明真空收纳袋', imageCaption: '内容还在，体积大幅变小，才方便运输',
    summary: '用算法删掉冗余，把庞大的原始音视频压小。',
    analogy: '像给羽绒被抽真空：内容还在，但体积变小，才方便运输。解码就是把它重新展开。',
    why: 'H.264、H.265 编视频，AAC、Opus 编音频。编码器直接影响画质、延迟、算力和兼容性。',
    misconception: '编码不是封装。H.264 数据可以装进 FLV，也可以装进 MP4。'
  },
  {
    id: 'container', term: '封装', en: 'CONTAINER', category: 'structure', visual: 'container', icon: 'container',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/container-box-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/container-box.svg',
    imageAlt: '视频、音频和时间轴卡片被装进同一个快递箱', imageCaption: '多条媒体轨道按照规则装进同一个箱子',
    summary: '把视频、音频、时间戳等轨道按规则装在一起。',
    analogy: '像一个快递箱：视频、音频是箱内物品，标签记录它们什么时候播放以及如何拆箱。',
    why: '播放器先解封装找到各轨数据，再分别解码。FLV、MP4、MPEG-TS 都是常见封装。',
    misconception: '把文件后缀从 .mp4 改成 .flv 不等于完成格式转换，箱子的内部结构并没有变化。'
  },
  {
    id: 'protocol', term: '协议', en: 'PROTOCOL', category: 'structure', visual: 'protocol', icon: 'protocol',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/protocol-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/protocol-fallback.jpg',
    imageAlt: '主播、服务器和观众之间的数据包通过统一检查节点和握手装置传输', imageCaption: '双方遵守同一套路标、关卡和交接规则，数据才能顺利抵达',
    summary: '通信双方共同遵守的数据传输规则。',
    analogy: '像快递公司的运输制度：从哪收件、如何分段、丢了怎么办、收件人怎样确认。',
    why: 'RTMP、HLS、WebRTC 的延迟、兼容性和弱网能力不同，决定直播数据走哪条路线。',
    misconception: '协议也不是编码。使用 RTMP 推流时，视频内容通常仍然是 H.264 编码。'
  },
  {
    id: 'timestamp', term: 'PTS / DTS', en: 'TIMESTAMP', category: 'structure', visual: 'timestamp', icon: 'timestamp',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/timestamp-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/timestamp-fallback.jpg',
    imageAlt: '视频胶片轨道和声音波形轨道在统一时钟下同步抵达播放屏幕', imageCaption: '两条轨道各自赶路，时间戳让画面和声音准时会合',
    summary: 'DTS 告诉解码器何时处理，PTS 告诉播放器何时展示。',
    analogy: '像演出后台的两张时间表：一张安排演员何时准备，另一张规定何时真正登台。',
    why: '视频帧可能因 B 帧而按不同顺序解码和展示；音画同步也依赖连续、正确的时间戳。',
    misconception: '日志里帧顺序变化不一定是乱序故障，可能只是 DTS 与 PTS 分工不同。'
  },
  {
    id: 'gop', term: 'GOP', en: 'GROUP OF PICTURES', category: 'structure', visual: 'gop', icon: 'gop',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/gop-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/gop-fallback.jpg',
    imageAlt: '完整城市画面之后排列多层透明画框，中间帧只保留自行车等变化区域', imageCaption: '先给完整底图，后续只交代哪里变了，直到下一张完整底图',
    summary: '从一个关键帧开始的一组相关视频帧。',
    analogy: '像“完整底图 + 后续修改说明”。I 帧给完整底图，P/B 帧只记录哪里发生了变化。',
    why: 'GOP 长度影响压缩效率、起播速度、拖动定位，以及丢失参考帧后的恢复时间。',
    misconception: 'GOP 不是越短越好；I 帧太密会明显增加码率。'
  },
  {
    id: 'latency', term: '延迟', en: 'LATENCY', category: 'network', visual: 'latency', icon: 'latency',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/latency-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/latency-fallback.jpg',
    imageAlt: '主播挥手动作经过摄像机、编码器、服务器和缓冲节点后才出现在观众屏幕', imageCaption: '每个处理和传输环节都花一点时间，叠起来就是端到端延迟',
    summary: '主播动作发生，到观众真正看到之间的时间差。',
    analogy: '像隔着很远视频通话：你现在挥手，对方过一会儿才看到。',
    why: '总延迟由采集、编码、网络、服务器处理、分发和播放器缓冲共同叠加，不能只盯某一段。',
    misconception: '播放器显示“不卡”不代表低延迟；大缓冲可能很流畅，但会让画面落后更多。'
  },
  {
    id: 'jitter', term: '抖动 / 缓冲', en: 'JITTER & BUFFER', category: 'network', visual: 'jitter', icon: 'buffer',
    image: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/jitter-buffer-generated.webp', fallbackImage: 'https://acgay.oss-cn-hangzhou.aliyuncs.com/livestream-lab/releases/08437ecd3ab8/assets/images/glossary/jitter-buffer.svg',
    imageAlt: '餐盘不均匀到达传菜台，经过暂存后按稳定节奏送出', imageCaption: '到达可以忽快忽慢，送出仍保持稳定节奏',
    summary: '抖动是数据包到达间隔忽快忽慢；缓冲区用存量抵消这种波动。',
    analogy: '像厨房出菜不均匀，服务员先把几盘菜放在传菜台，再按稳定节奏上桌。',
    why: '缓冲太小容易卡顿，太大又增加延迟。播放器会在稳定性和实时性之间做权衡。',
    misconception: '缓冲不能修复已经丢失的数据，它主要处理到达时间不稳定。'
  }
];

export const STAGE1_QUIZ = [
  {
    question: 'RTMP、FLV、H.264 分别是什么？',
    options: ['编码、协议、封装', '协议、封装、编码', '封装、编码、协议'],
    answer: 'b'
  },
  {
    question: '1080P 直播运动时马赛克严重，最值得先看什么？',
    options: ['屏幕亮度', '主播昵称', '实际码率与丢包'],
    answer: 'c'
  },
  {
    question: '缩短 GOP 最直接的收益是什么？',
    options: ['丢帧后更快等到完整 I 帧', '分辨率自动提高', '完全不需要带宽'],
    answer: 'a'
  },
  {
    question: '播放器依靠什么把声音和画面对齐？',
    options: ['文件名', 'PTS 等时间戳', '屏幕尺寸'],
    answer: 'b'
  },
  {
    question: '网络包忽快忽慢，播放器通常用什么抵消波动？',
    options: ['提高分辨率', '增加关键帧尺寸', '播放缓冲区'],
    answer: 'c'
  },
  {
    question: '同样大小的画面中，提高分辨率意味着什么？',
    options: ['每秒帧数必然增加', '像素格子更多，细节上限更高', '直播延迟一定降低'],
    answer: 'b'
  },
  {
    question: '从 30 FPS 提高到 60 FPS，最直接改善的是什么？',
    options: ['运动画面的流畅度', '单帧画面的像素数量', '音频的采样精度'],
    answer: 'a'
  },
  {
    question: '音频采样率 48 kHz 表示什么？',
    options: ['音频码率固定为 48 kbps', '每秒播放 48 帧声音', '每秒对声音波形测量 48000 次'],
    answer: 'c'
  },
  {
    question: '编码和封装的分工，哪项描述正确？',
    options: ['编码负责运输，封装负责采集', '编码负责压缩，封装负责组织音视频轨道', '编码和封装是同一件事'],
    answer: 'b'
  },
  {
    question: '主播端建立直播流的正确顺序是什么？',
    options: ['采集 → 编码 → 封装 → 推流', '封装 → 采集 → 拉流 → 编码', '拉流 → 解码 → 采集 → 推流'],
    answer: 'a'
  },
  {
    question: '主播开始推流时，最依赖哪一侧的网络能力？',
    options: ['观众的下行带宽', '服务器硬盘容量', '主播的上行带宽'],
    answer: 'c'
  },
  {
    question: '流媒体服务器为什么能让一位主播服务大量观众？',
    options: ['它把所有观众变成主播', '它接入一路流，再进行一对多分发', '它让视频不再需要编码'],
    answer: 'b'
  },
  {
    question: 'HLS、HTTP-FLV、WebRTC 可以同时存在，主要原因是什么？',
    options: ['不同场景对延迟、兼容性和成本的要求不同', '它们分别只能播放画面的一种颜色', '协议越多，分辨率就一定越高'],
    answer: 'a'
  },
  {
    question: 'DTS 和 PTS 的职责区别是什么？',
    options: ['DTS 管分辨率，PTS 管码率', 'DTS 管网络地址，PTS 管文件名', 'DTS 指示何时解码，PTS 指示何时展示'],
    answer: 'c'
  },
  {
    question: '为了减少卡顿而增大播放缓冲，通常会带来什么代价？',
    options: ['像素数量减少', '端到端延迟增加', '编码格式自动改变'],
    answer: 'b'
  }
];

export const BITRATE_CONFIG = {
  resolutions: [
    { name: '480P', factor: 0.45 }, { name: '720P', factor: 0.7 },
    { name: '1080P', factor: 1 }, { name: '4K', factor: 3.2 }
  ],
  fps: [
    { name: '24 FPS', factor: 0.8 }, { name: '30 FPS', factor: 1 },
    { name: '60 FPS', factor: 1.65 }
  ],
  motion: [
    { name: '较低', factor: 0.72 }, { name: '中等', factor: 1 },
    { name: '剧烈', factor: 1.45 }
  ],
  scenes: {
    talk: { factor: 1, name: '访谈' },
    game: { factor: 1.18, name: '游戏' },
    concert: { factor: 1.38, name: '演唱会' }
  }
};
