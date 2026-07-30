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
  { question: '用户只说“昨晚直播卡了”。为了让日志、指标和用户现象能够对齐，第一轮必须补齐什么？', options: ['只记录直播间标题和主播昵称', '精确时间窗、影响范围、协议、地区/运营商和终端', '先重启所有服务，再询问发生时间'], answer: 'b' },
  { question: '只有华南某运营商的 HLS 用户卡顿，其他地区和 WebRTC 正常。最合理的第一假设是什么？', options: ['区域 CDN/运营商路径或该协议边缘节点异常', '主播编码器一定已经完全停机', '所有播放器都发生相同的解码过载'], answer: 'a' },
  { question: '采集 30 FPS，编码 FPS 长期 17，CPU 接近 100%，发送队列暂时正常。瓶颈首先在哪？', options: ['CDN 缓存命中率', '播放器网络抖动', '编码计算能力或编码参数'], answer: 'c' },
  { question: '编码 FPS 稳定 30，但发送队列持续增长、上行利用率打满。哪项处理最有针对性？', options: ['先把输出码率降到稳定上行以内，再检查丢包与链路容量', '增大播放器缓冲来修复主播上行', '提高编码 preset 计算量'], answer: 'a' },
  { question: '采集 80ms、编码 120ms、上行与处理 300ms、分发 250ms、播放缓冲 2s，端到端延迟约多少？', options: ['750ms，因为缓冲不算延迟', '2.75s，各环节耗时会累积', '2s，因为只看播放器缓冲'], answer: 'b' },
  { question: '播放器缓冲水位呈锯齿状反复触底，同时下载平均速率看似高于码率。最值得继续看什么？', options: ['平均值以外的到达间隔、连续丢包和短时吞吐低谷', '视频标题是否含特殊字符', '主播端显示器刷新率'], answer: 'a' },
  { question: '画面一直流畅，但直播边缘距离从 3 秒涨到 25 秒。哪个指标形状最符合？', options: ['缓冲频繁为零且完全没有媒体到达', '解码掉帧增加但缓冲保持不变', '缓冲持续堆积，消费速度长期追不上生产速度'], answer: 'c' },
  { question: '请求成功、缓冲充足、网络无明显丢包，但 droppedFrames 持续上涨且设备发热。先查什么？', options: ['源站鉴权 token', '终端解码/渲染能力与编码 Profile、分辨率', 'CDN 回源缓存时间'], answer: 'b' },
  { question: '音画始终固定相差 200ms，且差值不随播放时间扩大。最适合先做什么实验？', options: ['模拟播放器同步模块，对单轨做 200ms 时间补偿并观察是否对齐', '不断增加两条轨道相同的缓冲', '把所有 PTS 统一写成 0'], answer: 'a' },
  { question: '音画开始只差 20ms，十分钟后扩大到 600ms。相比固定偏差，它更像什么？', options: ['播放器 CSS 动画速度不同', 'CDN 边缘节点数量不足', '采集时钟、采样率或时间戳持续漂移'], answer: 'c' },
  { question: '日志时间为 UTC，播放器埋点为北京时间，抓包使用本机时间。联合分析前要先做什么？', options: ['统一时区、校准时钟并对齐同一故障窗口', '把三个文件裁成相同大小', '只保留最早产生的一份数据'], answer: 'a' },
  { question: '为了确认“降低码率能否缓解卡顿”，哪种实验更能建立因果证据？', options: ['同时改码率、GOP、CDN 和播放器缓冲', '只降低码率，保持其他主要变量不变并对比同类网络', '先重启全部组件，再把结果归因给码率'], answer: 'b' },
  { question: '重启转码服务后恢复，为什么仍不能把“转码服务故障”当作完整根因？', options: ['重启只说明状态被清除，尚未解释触发条件和恢复机制', '只要恢复就不需要根因', '转码服务永远不会发生故障'], answer: 'a' },
  { question: '某地区错误率下降后，怎样确认故障真的结束而不是“监控变绿”？', options: ['只看服务端 200 比例', '只确认值班群没人继续说话', '同时验证发布、分发、播放器 QoE，并观察一个稳定窗口'], answer: 'c' },
  { question: '下列哪项最接近完整事故闭环？', options: ['发现告警后立刻关闭监控', '恢复业务 → 验证体验 → 定位根因 → 制定并验证预防措施', '记录一次重启时间后结束'], answer: 'b' }
];
