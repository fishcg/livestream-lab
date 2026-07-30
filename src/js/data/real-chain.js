export const REAL_CHAIN_MISSION = {
  title: '十万人观看的线上发布会',
  constraints: '主播使用 OBS；网页与手机观看；允许约 3～8 秒延迟；需要多档清晰度、CDN 扩展与故障退路。',
  goal: '把一条可信的生产链路从主播身份接到观众屏幕，并为每一站留下验证证据。'
};

export const REAL_CHAIN_STEPS = [
  {
    id: 'login', phase: '控制面', name: '主播登录平台', en: 'CREATOR LOGIN', icon: 'reality',
    story: '直播先从身份开始。平台要知道“谁准备开播”，才能决定他能创建什么直播间、使用哪些功能。',
    input: '主播账号与登录凭据', action: '完成账号或 SSO 鉴权，建立主播会话', output: '已认证的 creator_id 与会话', evidence: '登录成功、会话未过期、账号拥有开播权限',
    correct: 'auth', hint: '这里处理的是人的身份，不是媒体流。',
    choices: [
      { id: 'auth', label: '完成账号 / SSO 登录', note: '先建立主播身份与开播权限。' },
      { id: 'stream', label: '直接输入任意 RTMP 地址', note: '地址不能替代平台账号鉴权。' },
      { id: 'cdn', label: '先购买 CDN 流量', note: '分发发生在媒体进入系统之后。' }
    ]
  },
  {
    id: 'room', phase: '控制面', name: '创建直播场次', en: 'LIVE SESSION', icon: 'reality',
    story: '点击“创建直播”后，平台生成这场直播的业务坐标，并发放短期有效的推流凭据。',
    input: '已认证主播 + 标题/封面/分类', action: '创建 room_id 与 live_session，生成推流地址和密钥', output: 'Server URL、Stream Key、room_id', evidence: '场次状态为待开播；密钥仅对授权主播可见且可轮换',
    correct: 'session', hint: '这一站要交给 OBS 一张“去哪儿推、凭什么推”的路线票。',
    choices: [
      { id: 'session', label: '创建场次并领取临时推流凭据', note: '让平台业务与媒体流拥有同一个可追踪身份。' },
      { id: 'publicKey', label: '把永久 Stream Key 公布在页面', note: '密钥泄露会让别人冒充主播推流。' },
      { id: 'playlist', label: '先让观众请求 M3U8', note: '此时媒体还没有产生，播放产品也未生成。' }
    ]
  },
  {
    id: 'obs', phase: '主播端', name: '打开 OBS 组装场景', en: 'OBS SCENE', icon: 'capture',
    story: 'OBS 把摄像头、麦克风、桌面、图片和字幕组织成场景。开播前先确认画面尺寸、音量和监听。',
    input: '摄像头、麦克风、屏幕与素材', action: '添加 Source、混合场景并检查音频电平', output: '连续原始画面与 PCM 音频', evidence: '预览正常；音频不过载；采集 FPS 稳定；无隐私画面误入',
    correct: 'scene', hint: 'OBS 的第一份工作是采集和合成，不是 CDN 分发。',
    choices: [
      { id: 'scene', label: '添加来源并检查画面与音量', note: '先保证原料真实、连续、没有爆音。' },
      { id: 'decode', label: '在 OBS 中解码观众播放器', note: '播放器解码发生在观众端。' },
      { id: 'cache', label: '让 OBS 缓存所有 CDN 切片', note: 'OBS 不承担观众分发缓存。' }
    ]
  },
  {
    id: 'mediaEngine', phase: '主播端', name: '进入媒体加工链', en: 'OBS + FFMPEG', icon: 'encode',
    story: 'OBS 内部已有媒体处理、编码和输出能力，并会使用 FFmpeg 相关组件；复杂场景也可能把媒体交给独立 FFmpeg 进程做滤镜、转码或中继。外部 FFmpeg 不是每场直播的必选项。',
    input: 'OBS 合成后的原始音视频', action: '选择 OBS 内置媒体栈，或按需求接入受控 FFmpeg 管线', output: '进入编码工位的音视频帧', evidence: '处理速度持续 ≥ 1×；滤镜没有阻塞；音视频轨道均存在',
    correct: 'controlled', hint: '真实关系是“内置或旁路加工”，不是固定再启动一个重复编码进程。',
    choices: [
      { id: 'controlled', label: '使用 OBS 内置栈，必要时接 FFmpeg', note: '按真实需求决定内置处理还是独立媒体工人。' },
      { id: 'alwaysTwo', label: 'OBS 编一次，FFmpeg 必须再编一次', note: '无意义的二次编码会增加损耗、算力和延迟。' },
      { id: 'none', label: '原始像素直接发给十万观众', note: '未压缩媒体的带宽规模不可接受。' }
    ]
  },
  {
    id: 'encode', phase: '主播端', name: '编码并建立时间轴', en: 'ENCODE + TIMESTAMPS', icon: 'timestamp',
    story: '视频压成 H.264，音频压成 AAC；同时为帧建立 PTS/DTS，后面每一站才能知道播放与解码顺序。',
    input: '原始视频帧 + PCM 音频', action: '设置分辨率、FPS、码率、GOP，并生成单调时间戳', output: 'H.264 NALU + AAC 帧 + PTS/DTS', evidence: '编码 FPS ≥ 采集 FPS；speed≈1×；关键帧间隔稳定；时间戳不倒退',
    correct: 'encode', hint: '这一站既要压缩，也要给媒体贴上可连续解释的时间标签。',
    choices: [
      { id: 'encode', label: 'H.264 + AAC，并维护 PTS/DTS', note: '兼顾兼容性、带宽和后续同步。' },
      { id: 'rename', label: '把 RAW 文件后缀改成 .flv', note: '改名不会产生编码码流或时间轴。' },
      { id: 'max', label: '永远使用最高分辨率与无限码率', note: '编码速度与上行带宽会先失控。' }
    ]
  },
  {
    id: 'mux', phase: '主播端', name: '封装连续货柜', en: 'FLV MUX', icon: 'container',
    story: '封装器依据时间戳，把 H.264、AAC 和元数据交错写成连续 FLV Tag，准备交给 RTMP。',
    input: '已编码的视频、音频与时间戳', action: 'Mux 为 FLV，并写入音视频序列头与元数据', output: '连续 FLV Tag 流', evidence: '轨道与 codec 配置完整；Tag 时间戳连续；播放器可正确解封装',
    correct: 'flv', hint: 'RTMP 常运输 FLV 消息结构；封装不是再编码一次。',
    choices: [
      { id: 'flv', label: '把 H.264/AAC 复用进 FLV', note: '按时间交错装箱，再交给传输协议。' },
      { id: 'mp4End', label: '等待完整 MP4 写完再开播', note: '直播不能等整场结束后才交付媒体。' },
      { id: 'decode', label: '先解码回原始像素再发送', note: '这会抵消刚完成的压缩。' }
    ]
  },
  {
    id: 'uplink', phase: '上行传输', name: '选择主播上行协议', en: 'RTMP PUBLISH', icon: 'publish',
    story: '本任务使用 OBS 推向传统流媒体入口。RTMP 跑在 TCP 上，依次完成握手、connect、createStream 与 publish。',
    input: 'FLV Tag + Server URL + Stream Key', action: '通过 RTMP 长连接持续 publish', output: '抵达接入网关的上行媒体', evidence: 'TCP/握手/connect/publish 均成功；发送队列不持续增长',
    correct: 'rtmp', hint: 'HLS 更常用于观众下行；这一步是主播持续发布。',
    choices: [
      { id: 'rtmp', label: '用 RTMP 将 FLV 持续推向 Ingest', note: '与 OBS、SRS 等传统推流链路匹配。' },
      { id: 'hlsUpload', label: '让 OBS 等观众逐片来取', note: '主播端不是面向十万观众的 HLS 源站。' },
      { id: 'mse', label: '用 MSE 把媒体上传到服务器', note: 'MSE 是浏览器播放入口，不是推流协议。' }
    ]
  },
  {
    id: 'ingest', phase: '服务端', name: '接入网关验流', en: 'INGEST / SRS', icon: 'server',
    story: 'SRS 或其他 Ingest 校验 vhost、app、stream 与 token，阻止未授权或重复发布，再维护这一路在线源流。',
    input: 'RTMP 会话与发布凭据', action: '鉴权、限流、流名占用检查并接收首帧', output: '平台内部可信源流', evidence: 'publish 成功；在线流出现；首帧时间正常；无重复流名与鉴权错误',
    correct: 'verify', hint: '网络通了还不够，服务端必须确认这一路流属于刚才创建的场次。',
    choices: [
      { id: 'verify', label: '校验凭据并绑定 room_id 与 stream', note: '把平台身份、场次和媒体源流接在一起。' },
      { id: 'anonymous', label: '接受所有匿名 publish', note: '任何人都可能覆盖或伪造直播源。' },
      { id: 'render', label: '在 Ingest 上渲染观众屏幕', note: '接入层维护源流，不替终端显示画面。' }
    ]
  },
  {
    id: 'mediaCore', phase: '服务端', name: '媒体核心分流', en: 'MEDIA CORE', icon: 'media',
    story: '源流进入内部媒体总线后，被复制给录制、审核、截图、转码和下行封装。主播仍只上传一路。',
    input: '经过鉴权的稳定源流', action: '维护会话与路由，把轨道送往多个处理消费者', output: '可供转码、录制与封装消费的媒体轨道', evidence: '输入/输出 FPS 一致；内部队列稳定；各消费者互不阻塞',
    correct: 'fanout', hint: '这一站负责“一进多出”，不是让主播重复上传多份。',
    choices: [
      { id: 'fanout', label: '服务端复制一路源流给多个处理任务', note: '把分流压力留在可扩展的媒体核心。' },
      { id: 'obsMany', label: '要求 OBS 为每位观众各推一路', note: '主播网络和连接数无法承担。' },
      { id: 'singleBlock', label: '录制失败就阻塞整条直播', note: '非关键消费者不应拖停主媒体链路。' }
    ]
  },
  {
    id: 'transcode', phase: '服务端', name: '生产 ABR 多档', en: 'TRANSCODE LADDER', icon: 'encode',
    story: '一条高质量源流被转成 1080p、720p、480p 等档位，并保持 GOP 与关键帧对齐，方便播放器平滑切档。',
    input: '高质量源视频与音频', action: '按 Encoding Profile 解码、缩放并重新编码多档', output: '对齐的多码率 Rendition', evidence: '各档编码 FPS 达标；关键帧对齐；画质、码率与算力符合预算',
    correct: 'abr', hint: '十万观众网络不同，需要给播放器准备退路。',
    choices: [
      { id: 'abr', label: '生成关键帧对齐的多档清晰度', note: '让 ABR 播放器能根据网络安全切换。' },
      { id: 'one8k', label: '只输出一档 8K 超高码率', note: '绝大多数终端和网络没有可消费的退路。' },
      { id: 'randomGop', label: '每档使用完全随机的关键帧位置', note: '切档时容易等待或出现时间轴问题。' }
    ]
  },
  {
    id: 'package', phase: '播放产品', name: '生成 HLS 播放产品', en: 'HLS PACKAGE', icon: 'container',
    story: '封装服务把多档码流切成 TS 或 fMP4 媒体片段，并生成 Master/Media Playlist。这里才出现给观众使用的 M3U8。',
    input: '时间轴与关键帧对齐的多档码流', action: '切片、写 EXTINF、更新清单并维护 Media Sequence', output: 'Master M3U8 + 多档清单 + 媒体切片', evidence: '清单连续；切片按时生成；多档时间轴对齐；旧窗口按策略淘汰',
    correct: 'hls', hint: '本任务优先规模和终端兼容，因此选择可被 CDN 高效缓存的播放产品。',
    choices: [
      { id: 'hls', label: '生成 HLS 清单与 fMP4/TS 切片', note: '适合网页、移动端与大规模 CDN 分发。' },
      { id: 'raw', label: '把原始像素文件放到源站', note: '无法按直播时间轴高效传输和播放。' },
      { id: 'signal', label: '把 WebRTC 信令消息当作视频切片', note: '信令只协商连接，不承载主要媒体。' }
    ]
  },
  {
    id: 'origin', phase: '分发网络', name: '源站与回源保护', en: 'ORIGIN SHIELD', icon: 'server',
    story: '源站提供播放产品，Origin Shield 汇聚大量边缘 Miss，把重复回源合并，避免 CDN 节点同时冲击媒体核心。',
    input: '持续更新的 M3U8 与媒体切片', action: '稳定供给上游内容，并通过保护层聚合回源', output: '可被多 CDN 安全获取的上游', evidence: '源站响应、Shield 命中、回源连接数与峰值带宽均在容量内',
    correct: 'shield', hint: '源站是总仓，不应该直接接住十万观众。',
    choices: [
      { id: 'shield', label: '用 Origin Shield 汇聚边缘回源', note: '降低重复请求和源站峰值压力。' },
      { id: 'direct', label: '让所有观众直连唯一源站', note: '连接与出口会形成明显单点。' },
      { id: 'obsOrigin', label: '把主播电脑当全国源站', note: '主播端不具备生产分发容量和可靠性。' }
    ]
  },
  {
    id: 'delivery', phase: '分发网络', name: '调度 CDN 与 P2P', en: 'DELIVERY', icon: 'network',
    story: '观众被调度到附近 CDN POP。P2P 可在合适终端中交换已有切片，但必须由 CDN 供给并兜底；多 CDN 提供区域故障退路。',
    input: '源站/Shield 提供的 HLS 产品', action: '按地域、运营商、质量和容量选择边缘；可选 P2P 协助', output: '靠近观众且可切换的下行路径', evidence: '边缘命中率、回源、地域错误率、P2P 分享率与切换成功率',
    correct: 'cdn', hint: 'P2P 是协助，不是免费且无限可靠的 CDN 替代品。',
    choices: [
      { id: 'cdn', label: '多 CDN 主干 + 可选 P2P + CDN 兜底', note: '同时覆盖规模、地域质量和失败路径。' },
      { id: 'p2pOnly', label: '完全关闭 CDN，只依赖观众互传', note: '冷启动、NAT、上传受限时会失去稳定供给。' },
      { id: 'oneEdge', label: '全国观众固定到一个边缘节点', note: '跨地域距离、容量和单点风险都不可控。' }
    ]
  },
  {
    id: 'request', phase: '观众端', name: '播放器请求直播', en: 'PLAYBACK ENTRY', icon: 'subscribe',
    story: '观众点击播放，播放器先请求 Master M3U8，选择一个安全档位，再刷新 Media Playlist 并下载新切片。',
    input: '播放 URL、终端能力与当前网络', action: '从 CDN 获取清单，ABR 选择档位并持续拉取切片', output: '进入播放器缓冲的媒体字节', evidence: '播放 URL 有效；清单更新；切片状态 2xx；下载速率高于当前播放码率',
    correct: 'playlist', hint: '观众先拿路线表，再按地址拿真正的媒体片段。',
    choices: [
      { id: 'playlist', label: '请求 M3U8，选档并下载媒体切片', note: '让 ABR、CDN 缓存与滚动直播窗口共同工作。' },
      { id: 'streamKey', label: '把主播 Stream Key 发给播放器', note: '推流密钥不应出现在观众端。' },
      { id: 'loginObs', label: '要求每位观众安装 OBS', note: 'OBS 是制作与推流工具，不是普通播放入口。' }
    ]
  },
  {
    id: 'demuxDecode', phase: '观众端', name: '缓冲、解封装与解码', en: 'BUFFER → DEMUX → DECODE', icon: 'playback',
    story: '切片先进入缓冲，Demux 拆出音视频轨道；解码器再把 H.264 还原成像素帧，把 AAC 还原成 PCM。',
    input: '下载完成的 fMP4/TS 媒体片段', action: '维护缓冲水位，拆轨并送入音视频解码器', output: '带 PTS 的视频像素帧与 PCM 音频', evidence: '缓冲不见底；解封装无错；解码 FPS 达标；Dropped Frames 不持续上升',
    correct: 'pipeline', hint: '数据到了也不能直接显示，必须先拆箱，再把压缩内容还原。',
    choices: [
      { id: 'pipeline', label: 'Buffer → Demux → Decode', note: '按播放器真实消费顺序逐层还原媒体。' },
      { id: 'renderBytes', label: '把 M3U8 文本直接画到屏幕', note: '清单不是像素，也不是音频采样。' },
      { id: 'remuxOnly', label: '只换封装，不做任何解码', note: '最终屏幕和扬声器仍需要原始像素与 PCM。' }
    ]
  },
  {
    id: 'syncRender', phase: '观众端', name: '按 PTS 同步呈现', en: 'SYNC + RENDER', icon: 'timestamp',
    story: '播放器选择主时钟，根据 PTS 决定每一帧何时送往屏幕和扬声器。必要时会丢迟到帧、微调播放速度或重采样音频。',
    input: '已解码且带 PTS 的音视频帧', action: '比较主时钟与 PTS，调度音画同时呈现', output: '观众看到嘴型与声音对齐的直播', evidence: '首帧成功；音画差在目标窗口；卡顿率、掉帧和直播延迟符合目标',
    correct: 'pts', hint: '网络到达时间不等于播放时间，最终登场顺序由播放器时钟和 PTS 决定。',
    choices: [
      { id: 'pts', label: '以主时钟和 PTS 调度音画', note: '让早到的数据等待，让迟到的数据按策略处理。' },
      { id: 'arrival', label: '哪个网络包先到就先播放哪个', note: '抖动会立即变成音画错位和乱序。' },
      { id: 'ignoreAudio', label: '只对齐视频，音频自由播放', note: '嘴型与声音会失去共同时间基准。' }
    ]
  },
  {
    id: 'qoe', phase: '闭环', name: '用 QoE 证明观看成功', en: 'QOE FEEDBACK', icon: 'bitrate',
    story: '屏幕亮起不是终点。播放器把首开、卡顿、延迟、清晰度、错误与掉帧回报给观测系统，帮助平台发现区域或版本问题。',
    input: '播放器事件、网络与解码统计', action: '按场次、地域、版本和 CDN 聚合 QoE，并关联服务端链路指标', output: '可发现、可定位、可验证的直播闭环', evidence: '首开成功率、卡顿率、p95 延迟、播放失败率和清晰度分布',
    correct: 'feedback', hint: '服务器返回 200 不代表观众一定看得好，最后要用终端体验闭环。',
    choices: [
      { id: 'feedback', label: '回传 QoE，并与各层证据对齐', note: '证明观众真的看到了，而且体验达到目标。' },
      { id: 'noMetric', label: '画面出现后关闭所有监控', note: '后续卡顿、区域异常和版本回归将无法发现。' },
      { id: 'onlyCpu', label: '只看源站 CPU 就宣布成功', note: '单个服务端指标不能代表端到端体验。' }
    ]
  }
];
