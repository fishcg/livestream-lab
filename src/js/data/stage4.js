export const TRIAGE_STOPS = [
  {
    id: 'symptom', name: '症状挂号', en: 'SYMPTOM', icon: 'warning', target: 'stage4-overview', image: 'emergency-triage',
    role: '先让故障说人话：是看不到、看不动，还是跟不上现场',
    story: '观众冲进急诊室只会说“直播卡了”。分诊员不会立刻开药，而是把模糊抱怨翻译成可观察症状：黑屏、首开慢、周期卡顿、延迟上涨、掉帧，或音画不同步。症状不同，第一条检查路线也不同。',
    truth: '故障描述至少要带上发生时间、影响范围、协议、终端和可复现条件。没有这些坐标，“卡”只是情绪，不是诊断输入。',
    output: '带时间和范围的症状描述', check: '先问谁受影响、何时开始、一直发生还是偶发。'
  },
  {
    id: 'scope', name: '范围分诊', en: 'SCOPE', icon: 'network', target: 'stage4-metrics', image: 'metrics-control-room',
    role: '同一个症状，先分清是一位病人还是整个候诊厅',
    story: '只有一个观众卡，可能是终端、家庭网络或播放器；同一地区卡，先看区域 CDN 和运营商；所有观众一起卡，故障更可能靠近主播、源站或公共链路。范围像地图上的等高线，会快速缩小检查半径。',
    truth: '单点、区域、全局是三种不同证据。用用户、地域、协议、版本和时间窗口切片，比直接看一条平均值更可靠。',
    output: '用户 × 地域 × 协议 × 时间窗口', check: '平均值正常不代表尾部用户正常，至少看分位数和分组。'
  },
  {
    id: 'layer', name: '分层定位', en: 'LAYER', icon: 'container', target: 'stage4-incidents', image: 'incident-war-room',
    role: '把整条链路切成病区，先找到哪一层发烧',
    story: '采集、编码、发布、分发、网络、播放器、渲染像七个相连的病区。输入帧率已经下降，就不该先调 CDN；媒体请求根本没到，就不该先怪解码器。沿数据流逐层验证，能让排障从猜谜变成二分查找。',
    truth: '每一层都要找“输入是否正常、处理是否跟得上、输出是否连续”三类证据。发现第一个异常点后，再向上下游各验证一步。',
    output: '最小可疑故障层', check: '不要跨层开药；修复动作必须能解释现有证据。'
  },
  {
    id: 'evidence', name: '指标读片', en: 'EVIDENCE', icon: 'bitrate', target: 'stage4-metrics', image: 'metrics-control-room',
    role: '日志、指标和抓包是三张片子，要放在同一时间轴上看',
    story: '监控室里有帧率、队列、丢包、抖动、缓冲和掉帧。单看 CPU 80% 不能直接宣判；如果同一时刻编码 FPS 下降、发送队列上涨、观众缓冲见底，证据才开始连成因果链。',
    truth: '指标回答趋势和范围，日志回答具体事件，抓包回答协议事实。三者时间戳要对齐，相关性也不能自动当作因果。',
    output: '同时间窗的证据链', check: '先验证采样口径、单位和时间，再解释曲线。'
  },
  {
    id: 'experiment', name: '最小实验', en: 'EXPERIMENT', icon: 'gop', target: 'stage4-latency', image: 'latency-budget-tunnel',
    role: '一次只动一个旋钮，让故障自己暴露因果关系',
    story: '医生不会同时换五种药。排障也一样：只降低一路编码复杂度、只切换一个播放协议、只在同网络换一台终端。变量越少，结果越能说明问题；一次全改完，即使恢复也不知道是谁起效。',
    truth: '最小实验要写清假设、单一变量、预期信号和回滚方式。实验失败也是证据，它排除了一个方向。',
    output: '可证伪的诊断结论', check: '变更前保存基线，变更后观察同一组指标。'
  },
  {
    id: 'closure', name: '复盘出院', en: 'CLOSURE', icon: 'publish', target: 'stage4-incidents', image: 'incident-war-room',
    role: '恢复播放不是终点，还要确认病因不会换个时间再回来',
    story: '红灯熄灭后，急诊室还要留下病历：根因是什么、为什么监控没提前发现、临时止血和长期修复分别是什么。最后补上告警、自动化检查或容量边界，才算真正出院。',
    truth: '恢复、根因、预防是三个不同状态。只记录“重启后恢复”不等于找到了根因。',
    output: '根因、修复、验证与预防项', check: '用恢复后的数据证明正常，并记录仍未知的边界。'
  }
];

export const METRIC_REPORTS = [
  { id: 'fps', name: '输入 / 编码 FPS', unit: '帧/秒', icon: 'fps', normal: '两者长期接近目标帧率', warning: '输入正常但编码 FPS 下降', story: '像急诊室的脉搏。输入先掉，问题更靠近采集；输入稳定而编码掉，优先检查编码负载和资源。', first: '把输入 FPS 与编码 FPS 放到同一时间轴，不要只看其中一条。' },
  { id: 'queue', name: '发送队列', unit: '毫秒或字节', icon: 'buffer', normal: '围绕低水位波动并能回落', warning: '持续单向上涨', story: '像门口越排越长的担架。生产速度大于发送速度时，延迟会被队列一点点存起来。', first: '同时看出口带宽、发送速率和队列趋势，确认是短峰值还是持续积压。' },
  { id: 'loss', name: '丢包与抖动', unit: '% / ms', icon: 'network', normal: '短时波动后可恢复', warning: '丢包、抖动与卡顿同窗上升', story: '丢包是货物消失，抖动是送货间隔忽快忽慢。平均带宽够，也可能因为到达节奏糟糕而卡。', first: '按地区、网络类型和路径分组，并核对重传、NACK 或协议反馈。' },
  { id: 'buffer', name: '播放缓冲', unit: '秒', icon: 'container', normal: '围绕目标水位小幅波动', warning: '频繁见底或持续增长', story: '像播放器的小水库。见底对应卡顿；持续涨高却很流畅，往往意味着离直播现场越来越远。', first: '同时看下载速度、消费速度和直播边缘距离。' },
  { id: 'drop', name: '解码 / 渲染掉帧', unit: '帧', icon: 'playback', normal: '偶发且不持续增长', warning: '请求正常但掉帧持续增加', story: '数据已经送到病房，却来不及被处理。常见方向是设备性能、硬件解码回退、分辨率或编码能力不匹配。', first: '先确认缓冲有数据，再看解码耗时、CPU/GPU 和 codec 支持。' },
  { id: 'avdiff', name: '音画时间差', unit: '毫秒', icon: 'timestamp', normal: '围绕 0 小幅摆动', warning: '绝对值扩大或持续漂移', story: '嘴型和声音在同一条时间轴上赛跑。固定偏差可以补偿，持续漂移更像时钟源或时间戳问题。', first: '比较音视频 PTS、解码耗时和主时钟，不要只凭肉眼猜。' }
];

export const INCIDENTS = [
  {
    id: 'encoder', title: '主播画面像慢动作', scope: '该主播所有观众同时出现',
    evidence: 'capture_fps=30\nencode_fps=17\ncpu=97%\nsend_queue=80ms',
    clue: '采集仍稳定，但编码产出明显跟不上，发送队列尚未堆积。',
    options: [
      { label: '先检查编码负载、预设和硬件编码是否回退', correct: true, why: '正确。第一个异常发生在编码产出，CPU 也提供了同向证据。' },
      { label: '先把播放器缓冲增加到 10 秒', correct: false, why: '所有观众拿到的源帧已经不足，增加播放缓冲只能掩盖一小段时间。' },
      { label: '先修改 CDN 域名', correct: false, why: '当前证据还没有指向分发层。' }
    ]
  },
  {
    id: 'egress', title: '全站延迟缓慢上涨', scope: '多个协议、多个地区同时发生',
    evidence: 'encode_fps=30\nout_bitrate=8Mbps\negress_capacity=6Mbps\nsend_queue=18.4s',
    clue: '编码正常，但出口能力小于持续发送量，队列一直把时间存起来。',
    options: [
      { label: '先检查出口容量、限速和发送队列', correct: true, why: '正确。队列持续增长是延迟上升的直接证据，容量差解释了它为什么增长。' },
      { label: '先校准音视频 PTS', correct: false, why: 'PTS 不会让整个发送队列增长到 18 秒。' },
      { label: '只降低播放器音量', correct: false, why: '声音大小与链路延迟没有因果关系。' }
    ]
  },
  {
    id: 'regional', title: '某地区观众周期卡顿', scope: '仅移动网络用户明显',
    evidence: 'packet_loss_p95=9.8%\njitter_p95=146ms\nplayer_buffer=0.2s\norigin_health=ok',
    clue: '源站正常，异常集中在特定网络，丢包和抖动与缓冲见底同窗出现。',
    options: [
      { label: '按运营商和路径检查网络质量与区域节点', correct: true, why: '正确。范围和网络指标都把问题指向区域传输路径。' },
      { label: '重启所有主播的采集软件', correct: false, why: '其他地区正常，主播采集不是最小可疑范围。' },
      { label: '重做直播间封面图', correct: false, why: '静态封面不会改变媒体丢包与缓冲。' }
    ]
  },
  {
    id: 'player', title: '越播越流畅，也越播越慢', scope: '仅某播放器版本出现',
    evidence: 'download_rate=1.4x\nplayback_rate=1.0x\nbuffered=26.2s\nlive_delay=22.7s',
    clue: '下载持续快于消费，缓冲不见底而是越来越深。',
    options: [
      { label: '检查缓冲上限、追赶直播边缘和旧数据清理', correct: true, why: '正确。当前不是“没数据”，而是播放器把过多数据留在身后。' },
      { label: '继续增加启动缓冲', correct: false, why: '缓冲已经过深，再增加只会让延迟更大。' },
      { label: '提高主播麦克风增益', correct: false, why: '音量不会控制播放器消费速度。' }
    ]
  },
  {
    id: 'sync', title: '嘴型先动，声音越来越晚', scope: '录制回看和直播都可复现',
    evidence: 'video_pts=42.000s\naudio_pts=42.410s\nav_diff=-410ms\ndrift=+12ms/min',
    clue: '音频时间线比视频晚，并且偏差还在持续扩大。',
    options: [
      { label: '检查音视频时钟源、PTS 生成和重采样策略', correct: true, why: '正确。固定偏差叠加持续漂移，优先沿时间戳和时钟源排查。' },
      { label: '只把 CDN 缓存时间调大', correct: false, why: '音视频一起被缓存，不会自动修正两条轨道的相对时间。' },
      { label: '把分辨率从 1080p 改成 720p 后不再观察', correct: false, why: '降低负载可作为实验，但不能解释已观测到的时间戳漂移。' }
    ]
  }
];

export const STAGE4_QUIZ = [
  { question: '用户只说“直播卡了”时，第一步应该补充什么？', options: ['发生时间、影响范围、协议和终端', '主播昵称颜色', '封面图片尺寸'], answer: 'a' },
  { question: '只有某地区移动网络用户卡顿，最有价值的下一步是什么？', options: ['按地域和运营商查看网络指标', '重启全部编码器', '增加所有人的音量'], answer: 'a' },
  { question: '输入 FPS 为 30、编码 FPS 长期为 17，问题首先指向哪里？', options: ['编码处理能力', '播放器 CSS', 'HLS 文件名'], answer: 'a' },
  { question: '发送队列持续上涨通常意味着什么？', options: ['生产或写入速度长期大于发送能力', '像素自动增加', '麦克风过于安静'], answer: 'a' },
  { question: '端到端延迟预算应该怎样理解？', options: ['各环节耗时的累积', '只等于网络 RTT', '只等于播放器缓冲'], answer: 'a' },
  { question: '播放缓冲频繁见底，最直接的体验是什么？', options: ['卡顿', '画面必然变亮', '音量升高'], answer: 'a' },
  { question: '播放很流畅但缓冲从 3 秒涨到 25 秒，说明什么？', options: ['播放器正在远离直播边缘', '网络完全断开', '编码器没有输出'], answer: 'a' },
  { question: '平均带宽足够，为什么仍可能卡顿？', options: ['丢包和到达间隔抖动会让缓冲见底', '协议名称太长', '屏幕尺寸太小'], answer: 'a' },
  { question: '请求与缓冲正常，但掉帧不断增加，应该优先看什么？', options: ['解码与渲染能力', '推流地址拼写', '直播间标题'], answer: 'a' },
  { question: '日志、指标和抓包一起分析时，首先要保证什么？', options: ['时间窗与时间戳对齐', '颜色完全一致', '文件大小一样'], answer: 'a' },
  { question: '音画存在固定 200ms 偏差，通常可以先怎样验证？', options: ['做单轨时间补偿实验', '把缓冲设为 0', '关闭所有监控'], answer: 'a' },
  { question: '音画偏差随时间不断扩大，更像哪类问题？', options: ['时钟源或时间戳漂移', '封面缓存', '网页字体加载'], answer: 'a' },
  { question: '为什么排障实验应该一次只改一个主要变量？', options: ['才能判断哪个变化影响了结果', '可以让日志更长', '能自动避免所有风险'], answer: 'a' },
  { question: '“重启后恢复”为什么还不能算根因？', options: ['它没有解释故障为什么发生及为何恢复', '重启一定无效', '只有硬件故障才有根因'], answer: 'a' },
  { question: '一次完整事故闭环至少包括什么？', options: ['恢复验证、根因、长期预防', '截图、昵称、背景色', '只记录恢复时间'], answer: 'a' }
];
