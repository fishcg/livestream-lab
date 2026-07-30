export const PLAYBACK_STEPS = [
  {
    id: 'entry', name: '播放入口', en: 'DISCOVER', icon: 'protocol', target: 'stage3-overview',
    role: '观众按下播放，播放器派出媒体旅行者去找入口',
    story: '你坐在屏幕前点下播放，小流的下行旅程才真正开始。播放器先读取播放地址或会话信息，像在车站确认票面：该拿一张 HLS 清单、打开 HTTP-FLV 长连接，还是先用 WebRTC 信令约好见面方式。',
    truth: '三种协议从第一步就不同。HLS 请求 m3u8，HTTP-FLV 请求持续响应，WebRTC 交换 SDP；入口失败时，后面的缓冲和解码根本还没有发生。',
    output: '清单、长连接，或会话描述',
    check: '第一步失败先查地址、404、鉴权、CORS 或信令服务，不要先调播放器缓冲。',
    image: 'viewer-entry-gate', alt: '橙色媒体旅行者拿着播放路线票走向播放器入口闸机'
  },
  {
    id: 'route', name: '路线分流站', en: 'FETCH', icon: 'subscribe', target: 'stage3-selector',
    role: '小流站在三岔路口：拿便当、钻水管，还是走实时快线',
    story: 'HLS 把内容切成一盒盒媒体便当，播放器照清单逐盒领取；HTTP-FLV 打开一根不断流的透明水管；WebRTC 先找能走通的近路，再让加密媒体包快速通过。没有永远最强的路线，只有更适合当前观众的路线。',
    truth: 'HLS 是清单加切片，HTTP-FLV 是单个长 HTTP 响应，WebRTC 是 ICE 选路后的 SRTP 实时媒体。传输模型决定了延迟、兼容、规模和运维成本。',
    output: '抵达浏览器的媒体字节或数据包',
    check: '网络面板先回答三个问题：请求成功吗、数据持续到达吗、到达速度跟得上播放吗。',
    image: 'protocol-route-hub', alt: '橙色媒体旅行者站在切片传送带、连续管道和实时光轨组成的路线枢纽'
  },
  {
    id: 'distribution', name: '边缘分发网', en: 'DELIVERY', icon: 'network', target: 'stage3-distribution',
    role: '小流不再独自跑完全程，CDN 边缘站和附近观众一起接力',
    story: '十万观众如果都回源站取同一份直播，源站很快会被连接和出口带宽压垮。CDN 先把内容送到各地边缘节点，观众就近领取；启用 P2P 时，调度器还会让部分观众交换已经拿到的切片，像邻座之间传递同一批资料。',
    truth: 'CDN 和 P2P 解决分发规模，不等同于播放协议。HLS 切片最适合传统缓存和 P2P 交换；HTTP-FLV 更像边缘代理长连接；大规模 WebRTC 常依赖 SFU 或实时边缘网络。P2P 通常补充 CDN，必须保留稳定兜底。',
    output: '离观众更近的媒体副本或邻居数据',
    check: '先看命中率、回源带宽、边缘状态和 P2P 调度成功率；某地区卡顿时，不要只检查播放器。',
    image: 'protocol-route-hub', alt: '媒体旅行者在分发枢纽选择边缘节点和观众协同路线'
  },
  {
    id: 'buffer', name: '缓冲水库', en: 'BUFFER', icon: 'buffer', target: 'stage3-flv',
    role: '网络送货忽快忽慢，播放器先建一座小水库',
    story: '数据顺畅时，小流把一部分媒体存进透明水库；网络突然打个喷嚏时，播放器还能从存量继续取水。水库太浅容易见底卡住，太深又会让画面离直播现场越来越远。',
    truth: '缓冲用延迟换稳定。真正的低延迟不是把缓冲设成零，而是控制目标水位，并在堆积时追赶直播边缘、见底前及时降级。',
    output: '一段可连续播放的媒体存量',
    check: '卡顿看缓冲是否见底；越播越慢看缓冲是否持续增长，以及播放速度是否追得上生产速度。',
    image: 'buffer-reservoir', alt: '橙色媒体旅行者站在装有视频块和音频波形的透明缓冲水库中'
  },
  {
    id: 'demux', name: '解封装工坊', en: 'DEMUX', icon: 'container', target: 'stage3-flv',
    role: '一个媒体货柜进门，视频、音频和时间戳分轨出门',
    story: '运输时音视频被装在 FLV、MPEG-TS、fMP4 或 RTP 结构里。到了播放器，拆箱师傅读取标签和时间戳，把橙色视频块送往视频轨，把青蓝音频块送往音频轨，再把两条轨道的时钟一起交给后面。',
    truth: '解封装不负责提高画质，它负责识别结构和拆轨。请求明明有数据却无法播放时，要继续核对封装、编码格式、浏览器能力和时间戳。',
    output: '压缩视频帧 + 压缩音频帧',
    check: '重点看 FLV/TS/fMP4 是否能被当前播放栈解析，轨道声明与时间戳是否连续。',
    image: 'demux-workshop', alt: '媒体货柜在解封装工坊被拆成橙色视频轨和青蓝音频轨'
  },
  {
    id: 'decode', name: '解码还原厂', en: 'DECODE', icon: 'encode', target: 'stage3-diagnostics',
    role: '被压紧的方块重新展开，变回像素画面和声音采样',
    story: '为了节省网络带宽，视频和音频一路都挤在压缩箱里。解码器像还原机器，把 H.264 等视频数据展开成一帧帧像素，把 AAC 等音频数据恢复成可以播放的采样。机器跟不上，画面就会掉帧或发热。',
    truth: '浏览器可能使用硬件解码，也可能退回软件解码。编码格式、Profile、分辨率和设备性能共同决定能不能及时还原。',
    output: '原始视频帧 + 音频采样',
    check: '请求与缓冲正常却仍黑屏，检查 codec 支持；高 CPU、掉帧和发热则检查解码能力。',
    image: 'decode-studio', alt: '橙色媒体旅行者观察压缩数据在解码机器中还原成像素画面和音频波形'
  },
  {
    id: 'render', name: '同步放映厅', en: 'RENDER', icon: 'playback', target: 'stage3-diagnostics',
    role: '最后不是一起冲上屏幕，而是听从时间戳指挥准时登场',
    story: '小流终于来到放映厅。视频帧和音频采样站在同一条时间轴旁，播放器像指挥家一样按 PTS 调度：谁早到就等一下，谁落后太多可能被追帧或丢帧，最终让观众尽量同时看见嘴型、听见声音。',
    truth: '渲染由媒体时钟驱动。音画同步、播放速度和直播延迟是持续控制的结果，不是收到数据后简单调用一次显示。',
    output: '观众看到与听到的直播',
    check: '音画不同步要沿时间戳、解码耗时和媒体时钟排查；最终体验由前面每一站共同决定。',
    image: 'sync-screening-room', alt: '橙色媒体旅行者在同步放映厅指挥视频帧和音频波形沿时间轴对齐'
  }
];

export const PLAYBACK_PROTOCOLS = [
  {
    id: 'hls', name: 'HLS', en: 'SEGMENTED DELIVERY', icon: 'container', accent: 'cyan',
    memory: '切成一盒盒便当，再给一张取餐清单。',
    transport: 'HTTP 清单 + 短切片请求',
    typicalLatency: '经典模式常为数秒到数十秒',
    strength: '兼容广、CDN 友好、容错和回看能力强',
    tradeoff: '切片与播放器缓冲会累积延迟；低延迟 HLS 需要额外设计',
    fit: '大规模观看、移动端兼容、回看与弱网稳定优先'
  },
  {
    id: 'flv', name: 'HTTP-FLV', en: 'CONTINUOUS STREAM', icon: 'subscribe', accent: 'orange',
    memory: '打开一根水管，水不断流进播放器。',
    transport: '单个长 HTTP 响应持续传 FLV Tag',
    typicalLatency: '工程中常见约 1～5 秒量级',
    strength: '链路直观、延迟较低、便于复用 HTTP/CDN',
    tradeoff: '浏览器通常需要 MSE + flv.js；原生移动端兼容性有限',
    fit: '桌面网页直播、运营监看、较低延迟但不强互动'
  },
  {
    id: 'webrtc', name: 'WebRTC', en: 'REAL-TIME MEDIA', icon: 'network', accent: 'green',
    memory: '先找最快直达路，走不通再请中继站转发。',
    transport: 'ICE 选路 + DTLS/SRTP 实时媒体',
    typicalLatency: '网络良好时可做到亚秒级',
    strength: '低延迟、弱网反馈快、天然适合实时互动',
    tradeoff: '信令、NAT 穿透、TURN 与大规模分发更复杂',
    fit: '连麦、拍卖、课堂互动、云游戏与强实时场景'
  }
];

export const HLS_MANIFEST_LINES = [
  { code: '#EXTM3U', label: '文件身份', detail: '告诉播放器：这是一份扩展 M3U 播放清单。' },
  { code: '#EXT-X-TARGETDURATION:4', label: '目标切片时长', detail: '表示清单中切片时长的上限约为 4 秒，播放器会据此安排刷新节奏。' },
  { code: '#EXT-X-MEDIA-SEQUENCE:120', label: '起始序号', detail: '当前窗口第一片的序号是 120。直播继续时，旧切片会移出窗口，新序号不断增加。' },
  { code: '#EXTINF:4.000,', label: '下一片的时长', detail: '紧随其后的媒体文件大约包含 4 秒内容。' },
  { code: 'segment-120.ts', label: '媒体切片', detail: '播放器根据这一行再发 HTTP 请求，真正取得音视频数据。' },
  { code: 'segment-121.ts', label: '后续切片', detail: '直播清单会不断追加新切片；播放器重复“刷新清单 → 下载新片”。' }
];

export const WEBRTC_STEPS = [
  { name: '信令交换', code: 'Offer / Answer', detail: '双方通过业务信令交换 SDP，说明支持的编解码、媒体方向和连接信息。信令只负责撮合，不承载最终媒体。' },
  { name: 'ICE 选路', code: 'Host / STUN / TURN', detail: '收集候选地址并连通性检查。能直连就直连，受严格 NAT 或防火墙阻挡时可能走 TURN 中继。' },
  { name: '安全握手', code: 'DTLS', detail: '在选定路径上完成安全握手，协商用于媒体加密的密钥。' },
  { name: '实时媒体', code: 'SRTP / RTCP', detail: '加密媒体通过 SRTP 传输，RTCP 反馈丢包、抖动和带宽，发送端可及时调整。' }
];

export const PROTOCOL_SCENARIOS = [
  { id: 'event', title: '万人演唱会', detail: '观众以观看为主，覆盖手机、电视和浏览器，允许十秒左右延迟。', answer: 'hls', why: 'HLS 对 CDN 和终端兼容最友好，适合大规模单向观看。' },
  { id: 'auction', title: '实时拍卖', detail: '出价结果必须尽快反馈，延迟过高会直接影响公平性。', answer: 'webrtc', why: '强互动需要亚秒级反馈，WebRTC 更符合实时目标。' },
  { id: 'ops', title: '桌面运营监看', detail: '主要在公司桌面浏览器观看，希望延迟较低，系统已有 flv.js。', answer: 'flv', why: 'HTTP-FLV 链路相对简单，桌面浏览器配合 MSE 可获得较低延迟。' },
  { id: 'education', title: '在线小班课', detail: '老师需要随时点名，学生要语音回答并共享摄像头。', answer: 'webrtc', why: '双向音视频和实时互动是 WebRTC 的核心场景。' },
  { id: 'sports', title: '体育赛事回看', detail: '要求大规模分发、清晰度切换，还要支持时移和回看。', answer: 'hls', why: '清单与切片模型天然适合多码率、CDN 缓存、时移和回看。' },
  { id: 'dashboard', title: '直播数据大屏', detail: '固定桌面环境，只需要持续看几路画面，目标延迟 2～4 秒。', answer: 'flv', why: '环境可控且不需要双向互动，HTTP-FLV 是实用选择。' }
];

export const PLAYBACK_INCIDENTS = [
  {
    id: 'hls404', title: 'HLS 一直黑屏', symptom: '播放器启动失败，网络面板第一条请求就返回 404。',
    log: 'GET /live/room-7/index.m3u8 404 Not Found',
    clue: '关键线索：连播放清单都没拿到，还没有进入下载切片和解码。',
    options: [
      { label: '检查播放路径、app/stream 和 HLS 输出是否启用', correct: true, why: '正确。先让 m3u8 存在并可访问，再讨论后续播放。' },
      { label: '先把播放器缓冲从 3 秒改成 10 秒', correct: false, why: '清单请求是 404，增加缓冲不会创造缺失的播放资源。' },
      { label: '先调整视频亮度', correct: false, why: '画面数据尚未到达，显示参数不是当前故障层。' }
    ]
  },
  {
    id: 'cors', title: 'HTTP-FLV 有数据却播不了', symptom: '直接访问地址有响应，但网页脚本无法读取响应内容。',
    log: "Blocked by CORS policy: No 'Access-Control-Allow-Origin' header",
    clue: '关键线索：浏览器明确阻止跨域脚本读取，服务端确实已经返回数据。',
    options: [
      { label: '配置正确的 CORS 响应头，并核对网页 Origin', correct: true, why: '正确。跨域许可应由媒体服务或网关明确返回。' },
      { label: '把 H.264 码率提高一倍', correct: false, why: '编码码率不会改变浏览器的跨域安全策略。' },
      { label: '重新生成 WebRTC Offer', correct: false, why: '当前使用的是 HTTP-FLV，不涉及 WebRTC Offer。' }
    ]
  },
  {
    id: 'buffer', title: '越播越延迟', symptom: '播放很流畅，但延迟从 2 秒缓慢涨到 20 秒。',
    log: 'buffered=24.8s  liveDelay=20.3s  playbackRate=1.0',
    clue: '关键线索：缓冲存量持续变大，播放器消费速度没有追上直播边缘。',
    options: [
      { label: '检查清理旧缓冲和追赶直播边缘的策略', correct: true, why: '正确。需要控制缓冲上限，必要时追帧或轻微加速。' },
      { label: '增加更多启动缓冲', correct: false, why: '已经越积越多，再增加缓冲只会让延迟更大。' },
      { label: '修改 RTMP 推流 token', correct: false, why: '播放已经持续成功，发布鉴权不是直接线索。' }
    ]
  },
  {
    id: 'ice', title: 'WebRTC 卡在 connecting', symptom: '信令成功交换，但很久没有进入 connected。',
    log: 'iceConnectionState=failed\nselectedCandidatePair=null',
    clue: '关键线索：SDP 已交换，但 ICE 没找到可用候选路径。',
    options: [
      { label: '检查 STUN/TURN、UDP 可达性和 NAT/防火墙', correct: true, why: '正确。ICE failed 应沿候选收集和连通性检查排查。' },
      { label: '把 HLS 切片从 4 秒改成 2 秒', correct: false, why: 'WebRTC ICE 建连与 HLS 切片参数无关。' },
      { label: '只增加浏览器播放缓冲', correct: false, why: '媒体路径尚未建立，播放器还没有数据可缓冲。' }
    ]
  }
];

export const STAGE3_QUIZ = [
  { question: '播放器拿到网络媒体后，为什么还需要缓冲？', options: ['抵抗数据到达间隔波动', '自动增加像素数量', '替代视频编码器'], answer: 'a' },
  { question: 'HLS 的核心传输模型是什么？', options: ['一个永不结束的 FLV 响应', '播放清单加一系列媒体切片', '只通过 UDP 发送 RTP'], answer: 'b' },
  { question: 'm3u8 清单中的 EXTINF 通常描述什么？', options: ['下一媒体切片的时长', '服务器 CPU 使用率', 'WebRTC 加密密钥'], answer: 'a' },
  { question: '缩短 HLS 切片时长通常会带来什么变化？', options: ['请求与清单刷新更频繁，但有机会降低等待', '完全不再需要 CDN', '编码格式自动变成 AV1'], answer: 'a' },
  { question: 'HTTP-FLV 为什么常被比作一根持续水管？', options: ['它持续通过一个长 HTTP 响应传送 FLV 数据', '它把直播切成许多独立 ZIP', '它只传音频不传视频'], answer: 'a' },
  { question: 'flv.js 收到 FLV Tag 后，通常怎样把媒体交给 MSE？', options: ['拆出音视频并转成 fMP4 片段，再追加到 SourceBuffer', '把原始 FLV Tag 不加处理地交给显卡', '先生成 WebRTC Offer'], answer: 'a' },
  { question: 'HTTP-FLV 播放延迟不断增加，首先值得看什么？', options: ['缓冲是否持续堆积', '显示器分辨率', '主播昵称'], answer: 'a' },
  { question: 'WebRTC 中 ICE 的主要职责是什么？', options: ['选择可连通的网络路径', '把视频切成 TS 文件', '生成 HLS 清单'], answer: 'a' },
  { question: 'WebRTC 什么时候可能需要 TURN？', options: ['直连被 NAT 或防火墙阻挡时', '每次 HLS 请求 404 时', '只要视频是 H.264'], answer: 'a' },
  { question: 'DTLS/SRTP 在 WebRTC 链路里主要解决什么？', options: ['媒体安全传输', '网页排版', 'CDN 文件缓存'], answer: 'a' },
  { question: '为什么万人直播通常需要 CDN 边缘节点？', options: ['让观众就近取流并分散源站连接与带宽压力', '让所有观众直接连接主播电脑', '把视频自动改成更高分辨率'], answer: 'a' },
  { question: '直播 P2P 与 CDN 更准确的关系是什么？', options: ['P2P 在合适环境中分担部分流量，CDN 继续负责稳定供给和兜底', '启用 P2P 后可以永久删除源站与 CDN', 'P2P 只负责修改视频编码格式'], answer: 'a' },
  { question: '播放器请求 m3u8 返回 404，第一步应做什么？', options: ['检查路径和 HLS 输出是否存在', '增加播放缓冲', '降低屏幕亮度'], answer: 'a' },
  { question: '浏览器报 CORS 错误，问题最可能在哪一层？', options: ['跨域响应策略', 'GOP 中 I 帧数量', '麦克风采样率'], answer: 'a' },
  { question: '“低延迟”和“不卡顿”为什么需要权衡？', options: ['缓冲越小越实时，但抵抗抖动的余量也越小', '协议名字越短延迟越低', '清晰度越高一定越不卡'], answer: 'a' }
];
