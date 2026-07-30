export const PUSH_JOURNEY = [
  {
    id: 'studio', name: '主播桌前', en: 'DEPARTURE', icon: 'capture', target: 'stage2-overview',
    role: '你按下“开始直播”，媒体旅行者“小流”诞生了',
    story: '站在主播视角，第一件事不是背 FFmpeg 参数，而是确认摄像头、麦克风、画面构图和推流地址都已准备好。按钮按下后，镜头还在继续拍，数据却必须立刻开始旅行。',
    truth: '直播不是把完整文件上传完再播放，而是一边生产、一边加工、一边运输。整条链路的任何一站慢下来，都会影响后面的站点。',
    output: '持续产生的现场画面与声音',
    check: '本地预览先过关：画面、声音、设备权限和采集帧率都正常，再让小流出发。',
    image: 'studio-departure', alt: '媒体旅行者从主播的摄像机和麦克风旁出发'
  },
  {
    id: 'capture', name: '采集检查站', en: 'CAPTURE', icon: 'capture', target: 'stage2-overview',
    role: '摄像头交出一叠画面，麦克风交出一条声音波形',
    story: '小流先来到采集检查站。摄像头像连拍不停的摄影师，持续交出原始视频帧；麦克风像听觉记录员，把空气振动变成音频采样。两份原料都很新鲜，也都很占空间。',
    truth: '此时通常还是原始或近原始数据：视频体积巨大，PCM 音频也不适合直接跨网传输。采集异常必须在这里解决，不能指望服务器补救。',
    output: '原始视频帧 + PCM 音频',
    check: '黑屏查摄像头与权限；无声查设备、声道和采样；帧率乱跳先查采集能力。',
    image: 'capture-checkpoint', alt: '媒体旅行者检查摄像机产生的视频帧和麦克风产生的音频波形'
  },
  {
    id: 'address', name: '地址闸机', en: 'ROUTE PASS', icon: 'protocol', target: 'stage2-url',
    role: '出城前先领路线票：去哪个服务器、哪扇门、哪个房间',
    story: '主播从直播后台拿到推流地址和密钥，就像给小流一张路线票。rtmp:// 是交通规则，主机和端口是目的城市与入口，app 是业务楼层，stream 是具体房间，token 是临时通行证。',
    truth: '地址不仅决定“连哪儿”，也参与服务端路由与鉴权。TCP 连不上通常查主机和端口；publish 被拒绝则更像是 app、stream 或 token 不对。',
    output: '一张完整的 RTMP 推流地址',
    check: '不要在截图、日志和前端代码里泄露真实 stream key 或 token。',
    image: 'rtmp-ticket-gate', alt: '媒体旅行者拿着五段式路线票穿过多层地址闸机'
  },
  {
    id: 'factory', name: 'FFmpeg 工厂', en: 'PROCESS', icon: 'encode', target: 'stage2-ffmpeg',
    role: '原始画面和声音进入工厂，被加工成适合上网的尺寸',
    story: 'FFmpeg 像一座可以写加工单的工厂。-i 指定原料入口，scale 和 -r 调整画面规格，libx264 把视频压成 H.264，AAC 工位处理音频，码率则规定每秒能装多少信息。',
    truth: '压得太轻，上行带不动；压得太狠，画质受损。工厂还必须以实时速度工作，日志中的 speed 长期低于 1.0x 就代表生产线跟不上现场。',
    output: 'H.264 视频 + AAC 音频',
    check: '同时观察编码速度、CPU 压力、输出码率和稳定上行，不要只看命令是否能启动。',
    image: 'ffmpeg-factory-tour', alt: '媒体旅行者参观 FFmpeg 工厂中的视频和音频加工流水线'
  },
  {
    id: 'packing', name: 'FLV 装箱码头', en: 'MUX', icon: 'container', target: 'stage2-ffmpeg',
    role: '视频块和音频块按时间顺序装进同一条连续货柜',
    story: '编码后的 H.264 和 AAC 还像两种散货。封装工位按时间戳把它们交错装进 FLV Tag，让接收方知道每一块是什么、应该何时交给解码器。',
    truth: '封装不负责再次压缩，它负责组织。编码格式正确却音画错位、时间倒退或接收端无法拆开时，就要检查封装与 PTS/DTS。',
    output: '按时间排列的连续 FLV Tag',
    check: '看到 timestamp jumped backwards 一类日志时，应沿采集时钟和封装时间轴排查。',
    image: 'flv-packing-dock', alt: '视频块和音频块按时间交错装入透明连续货柜'
  },
  {
    id: 'tunnel', name: 'RTMP 隧道', en: 'PUBLISH', icon: 'publish', target: 'stage2-publish',
    role: '五道关卡依次放行，真正的持续推流才开始',
    story: '小流先打通 TCP 运输通道，再和服务器完成 RTMP 握手，随后 connect 进入应用、createStream 申请逻辑流，最后用 publish 报出流名。只有最后一关通过，音视频货柜才会持续上路。',
    truth: '“连接成功”不等于“发布成功”。走到哪一关，是定位故障最有价值的证据。',
    output: '一条持续上行的 RTMP 发布流',
    check: 'TCP 失败查网络；publish 才失败，查 app、stream、token、过期时间与重复发布。',
    image: 'rtmp-handshake-tunnel', alt: '媒体旅行者沿数据流依次穿过 RTMP 建连的五道关卡'
  },
  {
    id: 'hub', name: 'SRS 中央站', en: 'ARRIVAL', icon: 'server', target: 'stage2-srs',
    role: '主播只送来一路，中央站负责接住并复制到不同出口',
    story: '小流终于抵达 SRS。这里会校验发布身份、维护直播源，还能按配置录制、转协议或继续交给 CDN。主播电脑不需要给每位观众重复上传。',
    truth: 'SRS 是流媒体服务器，不是摄像头、编码器或播放器。它站在链路中间，让“一路上行、多人观看”成为可能。',
    output: '可被录制、转发和播放的直播源',
    check: '服务端重点看监听端口、vhost/app/stream、输入帧率、连接数、带宽与错误日志。',
    image: 'srs-central-station', alt: '一路橙色直播进入 SRS 中央站后分成多条蓝色路线'
  }
];

export const RTMP_PARTS = [
  { key: 'scheme', label: '协议', example: 'rtmp://', meaning: '约定双方使用 RTMP 规则交流。' },
  { key: 'host', label: '主机与端口', example: 'live.example.com:1935', meaning: '像城市和门牌，决定去找哪台服务、哪扇门。' },
  { key: 'app', label: '应用名', example: '/live', meaning: '像大楼里的业务楼层，用来区分直播应用。' },
  { key: 'stream', label: '流名', example: '/room-001', meaning: '这一路直播的唯一房间号，也是播放器找流的关键。' },
  { key: 'query', label: '鉴权参数', example: '?token=••••', meaning: '像临时通行证，服务器用它判断能不能发布。' }
];

export const PUBLISH_STEPS = [
  { name: 'TCP 连接', code: 'SYN → SYN/ACK → ACK', detail: '先打通可靠运输通道。若这里失败，优先查域名、端口、网络和防火墙。' },
  { name: 'RTMP 握手', code: 'C0/C1 → S0/S1/S2 → C2', detail: '双方交换版本和随机数据，确认“都会说 RTMP”。这时还没有开始发布直播。' },
  { name: 'connect', code: 'connect(app, tcUrl)', detail: '客户端说明要进入哪个 app、使用哪个地址和能力集合，服务器返回连接结果。' },
  { name: 'createStream', code: 'createStream() → streamId', detail: '在已经建立的连接中申请一条逻辑媒体流，服务器分配 streamId。' },
  { name: 'publish', code: 'publish(streamName, live)', detail: '正式声明要发布哪一路直播。服务端鉴权通过后，客户端才持续发送音视频数据。' }
];

export const SRS_CONFIG_LINES = [
  {
    code: 'listen 1935;', label: 'RTMP 入口',
    meaning: '让 SRS 在 1935 端口等待 RTMP 客户端。没有监听，就会在 TCP 阶段看到 Connection refused。',
    verify: '用系统端口工具或 SRS 启动日志确认 1935 确实处于监听状态。'
  },
  {
    code: 'max_connections 1000;', label: '连接上限',
    meaning: '限制 SRS 可同时维护的连接数量。它是保护边界，不等于这台机器一定能稳定承载 1000 路。',
    verify: '真实容量还要结合 CPU、内存、带宽、协议和每路码率压测。'
  },
  {
    code: 'daemon off;', label: '前台运行',
    meaning: '教学环境让 SRS 保持在前台，日志直接输出到终端，出错时更容易看见。',
    verify: '生产环境如何托管进程应交给服务管理方案，这里只讲本地学习配置。'
  },
  {
    code: 'vhost __defaultVhost__ { … }', label: '默认虚拟主机',
    meaning: 'vhost 是 SRS 的配置边界，可以按域名区分不同直播业务；没有显式匹配时会进入默认 vhost。',
    verify: '排查地址能连却找不到流时，把 vhost、app 和 stream 三层一起核对。'
  },
  {
    code: 'dvr { enabled off; }', label: '录制开关',
    meaning: 'DVR 决定是否把直播保存下来。关闭录制不影响基本接流与实时分发。',
    verify: '开启前先确认文件格式、落盘路径、磁盘容量与清理策略。'
  }
];

export const DIAGNOSTIC_CASES = [
  {
    id: 'refused', title: '一连接就失败', symptom: 'FFmpeg 反复提示无法连接，连 publish 都没走到。',
    log: 'tcp://live.example.com:1935: Connection refused',
    clue: '关键线索：Connection refused 属于连接层，还没有机会校验流名。',
    options: [
      { label: '先查服务是否监听 1935、地址和防火墙', correct: true, why: '正确。TCP 都没建立，先查主机、端口、监听与网络可达性。' },
      { label: '先把视频码率从 4 Mbps 调到 2 Mbps', correct: false, why: '码率会影响持续发送，但无法解释 TCP 连接被直接拒绝。' },
      { label: '先缩短播放器缓冲', correct: false, why: '播放器还没拿到流，与推流端连接失败无关。' }
    ]
  },
  {
    id: 'auth', title: '连上后被服务器拒绝', symptom: 'TCP 与握手成功，但发布流时收到权限错误。',
    log: 'onStatus code=NetStream.Publish.BadName\nreason=token invalid or stream already publishing',
    clue: '关键线索：失败发生在 publish 阶段，网络通道本身已经可用。',
    options: [
      { label: '检查流名、token、过期时间和重复推流', correct: true, why: '正确。BadName 或鉴权错误通常要从发布身份和流占用状态入手。' },
      { label: '更换摄像头分辨率', correct: false, why: '采集参数不会让服务器拒绝一个已经连通的发布请求。' },
      { label: '增加观众端缓存', correct: false, why: '问题发生在主播发布前，观众端还没有介入。' }
    ]
  },
  {
    id: 'bandwidth', title: '推一会儿开始掉帧', symptom: '能正常开播，但快速运动时队列增长，输出帧率逐渐下降。',
    log: 'frame=2480 fps=18 q=34.0 bitrate=6100kbits/s\n[tcp] send queue overflow, dropped frames=126',
    clue: '关键线索：编码输出约 6.1 Mbps，同时发送队列持续溢出。',
    options: [
      { label: '测主播上行，降低码率或解决网络拥塞', correct: true, why: '正确。生产速度长期大于发送速度，队列最终必然堆满并丢帧。' },
      { label: '把 streamKey 改长一些', correct: false, why: '流名影响定位和鉴权，不会改变持续发送能力。' },
      { label: '关闭 SRS 录制一定能解决', correct: false, why: '录制可能增加服务端压力，但当前直接证据指向推流端发送队列。' }
    ]
  },
  {
    id: 'timestamp', title: '服务器收到流但音画异常', symptom: '画面偶尔倒退、声音断续，服务端提示时间戳不连续。',
    log: 'warn: video dts 91200 < previous dts 93600\nwarn: timestamp jumped backwards',
    clue: '关键线索：DTS 向后跳。先确认采集时钟、转封装过程和时间戳生成。',
    options: [
      { label: '检查输入时钟与时间戳，必要时重新生成连续时间戳', correct: true, why: '正确。日志已明确指出时间轴倒退，应沿时间戳产生链路排查。' },
      { label: '只增加服务器磁盘容量', correct: false, why: '磁盘不足会影响录制，但无法直接修复倒退的 DTS。' },
      { label: '修改 RTMP 默认端口', correct: false, why: '流已经到达服务器，端口不是当前故障层。' }
    ]
  }
];

export const STAGE2_QUIZ = [
  { question: 'FFmpeg 在典型推流链路中最常承担什么工作？', options: ['采集、编码、封装并发送', '只负责观众评论', '只负责服务器扩容'], answer: 'a' },
  { question: 'RTMP 地址里的 live 通常代表什么？', options: ['视频编码器型号', '应用名 app', '固定的播放器缓冲'], answer: 'b' },
  { question: 'rtmp://live.example.com:1935/live/room-7 中 room-7 是什么？', options: ['流名 stream', '协议版本', '视频帧率'], answer: 'a' },
  { question: 'RTMP 默认常用端口是哪个？', options: ['80', '443', '1935'], answer: 'c' },
  { question: 'FFmpeg 的 -re 在读取文件推实时流时有什么作用？', options: ['按媒体原始节奏读取', '自动提高分辨率', '生成鉴权 token'], answer: 'a' },
  { question: '命令中的 -c:v libx264 表示什么？', options: ['视频使用 H.264 编码器', '音频使用 AAC', '输出封装为 MP4'], answer: 'a' },
  { question: '-b:v 2500k 主要控制什么？', options: ['视频码率目标', '音频采样率', 'SRS 端口'], answer: 'a' },
  { question: 'RTMP 推流常用哪种封装输出？', options: ['FLV', 'ZIP', 'PNG'], answer: 'a' },
  { question: 'RTMP 建连时，哪一步最先发生？', options: ['publish', 'TCP 连接', 'createStream'], answer: 'b' },
  { question: 'createStream 的作用更接近哪项？', options: ['申请逻辑媒体流并取得 streamId', '开始视频采集', '让观众下载 HLS 切片'], answer: 'a' },
  { question: 'publish 阶段被拒绝，最应先检查什么？', options: ['流名与鉴权 token', '观众屏幕亮度', '麦克风音量'], answer: 'a' },
  { question: 'SRS 在链路中的核心角色是什么？', options: ['媒体接入与一对多分发服务器', '摄像头驱动', '浏览器视频标签'], answer: 'a' },
  { question: '为什么一路主播流能服务许多观众？', options: ['每个观众都直接连主播电脑', 'SRS/CDN 接入后复制和分发', 'H.264 会自动生成服务器'], answer: 'b' },
  { question: '日志显示 Connection refused，优先排查哪一层？', options: ['主机、端口、监听和网络', 'GOP 画质', '播放器字幕'], answer: 'a' },
  { question: '发送队列持续增长并丢帧，最可能的根因是什么？', options: ['输出码率超过稳定上行能力', 'streamKey 太短', '观众没有刷新页面'], answer: 'a' }
];
