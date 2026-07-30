export const TERMS = {
  ffmpegRe: {
    name: '-re', en: 'READ AT NATIVE RATE',
    definition: '让 FFmpeg 按输入文件本来的时间节奏读取，而不是用机器能达到的最快速度扫完整个文件。',
    analogy: '像给传送带装上限速器：一小时的节目就用一小时送出。',
    role: '用文件模拟直播输入时，它让推流速度贴近 1× 实时速度。摄像头本身已有实时节奏，通常不靠它限速。',
    confusion: '它不限制输出码率，也不会让网络更稳定；码率由编码参数控制。',
    scene: ['视频文件', '-re 限速', '1× 实时输入']
  },
  ffmpegInput: {
    name: '-i', en: 'INPUT',
    definition: '声明后面跟着一个输入源。输入可以是文件、摄像头、麦克风、桌面，也可以是另一条网络流。',
    analogy: '像工厂订单上的“原料入口”，先说从哪扇门收货。',
    role: 'FFmpeg 读取输入后识别其中的视频、音频和字幕轨道，再交给后续滤镜、编码与封装环节。',
    confusion: '它只指定输入，不代表选择了哪条轨道；多轨道时还可能需要 -map。',
    scene: ['文件 / 设备', '-i 输入口', '音视频轨道']
  },
  codecSelector: {
    name: '-c:v / -c:a', en: 'CODEC SELECTOR',
    definition: '-c:v 选择视频轨道使用的编码器，-c:a 选择音频轨道使用的编码器。',
    analogy: '像把视频货物送到视频车间，把声音货物送到音频车间。',
    role: '在本课程命令中，视频交给 libx264 生成 H.264，音频交给 aac 编码器生成 AAC。',
    confusion: '冒号后的 v/a 是轨道类型，不是码率单位；编码器也不等于封装格式。',
    scene: ['原始音视频', '-c:v / -c:a', 'H.264 + AAC']
  },
  libx264: {
    name: 'libx264', en: 'H.264 ENCODER',
    definition: 'FFmpeg 中常用的软件 H.264 编码器实现，使用 CPU 把原始视频压缩成 H.264 码流。',
    analogy: 'H.264 是产品规格，libx264 是按这个规格工作的具体机器。',
    role: '它决定编码速度、压缩效率和大量细节参数，是推流端最常见的视频加工工位之一。',
    confusion: 'libx264 不是 H.264 文件格式，也不是显卡硬件编码器；硬件编码器常有 NVENC、VideoToolbox 等名字。',
    scene: ['原始画面', 'libx264', 'H.264 码流']
  },
  bitrateOptions: {
    name: '-b:v / -b:a', en: 'BITRATE TARGET',
    definition: '分别给视频和音频设置每秒要使用的大致数据预算。2500k 表示约 2500 kbps。',
    analogy: '像给两个车间分别发运输预算：视频通常拿走大头，音频拿较小但稳定的一份。',
    role: '它直接影响清晰度、上行带宽和服务器/CDN 流量，需要与分辨率、帧率一起考虑。',
    confusion: '它不是文件大小的固定承诺，也不是网络限速器；编码模式不同，瞬时码率仍会波动。',
    scene: ['画质需求', '码率预算', '上行流量']
  },
  preset: {
    name: 'preset', en: 'ENCODING PRESET',
    definition: '一组编码速度与压缩效率的预设。越慢通常越省码率或画质更好，但消耗更多计算。',
    analogy: '像打包员的工作档位：赶时间就快速装箱，有余力就花更多时间压得更紧。',
    role: '直播必须先保证编码速度持续达到 1×；设备余量足够后，才值得尝试更慢的 preset。',
    confusion: 'slow 不等于播放变慢，fast 也不等于帧率更高；它描述的是编码器工作速度。',
    scene: ['CPU 时间', 'preset 取舍', '压缩效率']
  },
  muxDemux: {
    name: 'Mux / Demux', en: 'MUXING / DEMUXING',
    definition: 'Mux 把音频、视频、时间戳等轨道按规则装进一个封装；Demux 则从封装里把各轨道拆出来。',
    analogy: 'Mux 是装箱员，Demux 是到站后的拆箱员。货物内容没变，组织方式变了。',
    role: '推流侧把 H.264/AAC 复用进 FLV；播放侧再解复用，分别交给音视频解码器。',
    confusion: '封装与解封装一般不重新压缩画面；转码才会解码后再编码。',
    scene: ['视频 + 音频', 'Mux ⇄ Demux', 'FLV / fMP4']
  },
  tcp: {
    name: 'TCP', en: 'TRANSPORT CONTROL PROTOCOL',
    definition: '一种可靠、面向连接的传输协议，负责按顺序送达字节，并对丢失数据进行重传。',
    analogy: '像有签收和补寄机制的运输通道，但它不知道箱子里装的是直播还是普通文件。',
    role: '传统 RTMP 通常跑在 TCP 之上：TCP 先把字节通道接通，RTMP 再在通道里完成会话和媒体消息传输。',
    confusion: 'TCP 连接成功只说明网络通道通了，不代表 RTMP 鉴权或 publish 已通过。',
    scene: ['客户端', 'TCP 字节通道', '1935 端口']
  },
  rtmpHandshake: {
    name: 'RTMP Handshake', en: 'RTMP HANDSHAKE',
    definition: 'TCP 建连后，客户端和服务器交换版本、时间与随机数据，确认双方能开始 RTMP 会话。',
    analogy: '像进站前互相核验暗号；暗号对了，才进入业务柜台。',
    role: '它位于 TCP 与 connect 之间。握手失败时，应先查协议兼容、TLS/端口是否用错等问题。',
    confusion: '它不是业务鉴权，也没有创建直播流；这些发生在后面的命令阶段。',
    scene: ['TCP 已连接', 'C0/C1 ↔ S0/S1', 'RTMP 会话就绪']
  },
  rtmpConnect: {
    name: 'connect', en: 'RTMP CONNECT COMMAND',
    definition: '客户端向服务器声明要连接哪个 RTMP 应用，并携带 app、tcUrl 等会话信息。',
    analogy: '像到中央站总服务台报到：“我要去 live 这个业务区”。',
    role: '服务器在这里确认应用是否存在、虚拟主机如何匹配，以及会话是否被允许。',
    confusion: 'connect 成功仍没有发布具体流名；demo 这类 stream name 要到 publish 才出现。',
    scene: ['RTMP 会话', 'connect(app)', '应用上下文']
  },
  createStream: {
    name: 'createStream', en: 'CREATE LOGICAL STREAM',
    definition: '在已建立的 RTMP 连接中申请一个逻辑流通道，服务器返回 stream id。',
    analogy: '像在一条已通车的隧道里申请一条带编号的专用车道。',
    role: '后续 publish 或 play 命令会引用这个逻辑流；一条连接理论上可以承载不止一个逻辑流。',
    confusion: '这里的 stream 是协议内的逻辑通道，还不是 URL 中最终要发布的流名。',
    scene: ['RTMP 连接', 'createStream', 'stream id']
  },
  publish: {
    name: 'publish', en: 'START PUBLISHING',
    definition: '客户端声明要以某个流名开始发布媒体，服务器在此检查鉴权、占用和发布规则。',
    analogy: '像拿着最终货单进入发货月台；到这一步通过后，媒体才正式持续进站。',
    role: 'publish 成功后客户端才发送音频、视频和元数据消息，SRS 中也才出现对应在线流。',
    confusion: 'URL 能解析、TCP 能连、connect 成功，都不能替代 publish 成功。',
    scene: ['stream id + 流名', 'publish', '在线直播源']
  },
  vhost: {
    name: 'vhost', en: 'VIRTUAL HOST',
    definition: '在同一台流媒体服务器上，用域名或规则隔离多套直播配置与业务空间。',
    analogy: '像同一座车站里的不同站厅，共用建筑，但各自有检票和路线规则。',
    role: 'SRS 会先匹配 vhost，再在其中寻找 app/stream，并应用该空间的转码、录制、鉴权等配置。',
    confusion: 'vhost 不是一台真实机器，也不等于 URL 的 app；它比 app 更外层。',
    scene: ['请求域名', 'vhost 匹配', 'app / stream']
  },
  dvr: {
    name: 'DVR', en: 'DIGITAL VIDEO RECORDING',
    definition: '把正在传输的直播持续记录为文件或切片，供回看、审计或后续处理。',
    analogy: '像中央站旁的自动档案室，列车经过时同步留下一份可回放记录。',
    role: '服务器从已接入的直播源分出一路写入存储，录制失败通常不应阻塞主直播分发。',
    confusion: 'DVR 不是播放器缓冲，也不等于 CDN 缓存；它面向持久保存。',
    scene: ['在线流', 'DVR 录制', '文件 / 切片']
  },
  sendQueue: {
    name: 'Send Queue', en: 'SEND QUEUE',
    definition: '应用已经准备好、但操作系统或网络暂时还没发出去的数据等待区。',
    analogy: '像装货口前排队的箱子；持续越堆越高，说明出口速度赶不上入口。',
    role: '推流上行不足、接收端读得慢或网络拥塞时，队列会增长，并进一步放大延迟与内存占用。',
    confusion: '发送队列不等于播放器缓冲：一个在发送端等网络，一个在播放端等消费。',
    scene: ['编码产出', '发送队列 ↑', '网络出口']
  },
  queueOverflow: {
    name: 'Queue Overflow', en: 'QUEUE OVERFLOW',
    definition: '等待发送的数据超过队列容量或等待时间上限，系统不得不丢弃、断开或报错。',
    analogy: '像候车区被塞满后停止进人；它是长期供需失衡的结果，不是偶然多了一个包。',
    role: '看到 overflow 应比较生产速度与发送速度，检查上行带宽、阻塞时长和队列增长趋势。',
    confusion: '单纯把队列调大只会延后爆满，并可能把实时直播变成越来越延迟的直播。',
    scene: ['持续入队', '容量上限', '丢弃 / 断开']
  },
  m3u8: {
    name: 'M3U8 / Media Playlist', en: 'HLS MEDIA PLAYLIST',
    definition: '一个 UTF-8 文本清单，按顺序列出播放器接下来要获取的媒体切片及其播放信息。',
    analogy: '像不断更新的取餐单：单子告诉你去拿哪几盘菜，但它本身不是菜。',
    role: '直播播放器周期刷新 Media Playlist，发现新切片后再发起 HTTP 请求下载。',
    confusion: 'M3U8 不是视频文件；Master Playlist 还可能只列出多档码率的子清单。',
    scene: ['刷新清单', 'M3U8', '切片 URL 列表']
  },
  mediaSegment: {
    name: 'Media Segment', en: 'MEDIA SEGMENT',
    definition: 'HLS 把连续媒体按时间切成的小段，常见容器是 MPEG-TS 或 fMP4。',
    analogy: '像把一部长卷胶片剪成按编号排列的小卷，播放器一卷一卷取。',
    role: '切片长度影响请求频率、缓存复用、起播等待和延迟，是 HLS 设计的核心旋钮。',
    confusion: '一个切片通常包含多个音视频帧，不等于一帧，也不等于一个网络包。',
    scene: ['连续直播', '2s / 4s 切片', '播放器缓冲']
  },
  extinf: {
    name: '#EXTINF', en: 'SEGMENT DURATION TAG',
    definition: 'M3U8 中写在切片 URI 前的一行，声明后面那一个媒体切片的播放时长。',
    analogy: '像取餐单在每一盘菜旁标注“这盘能吃 4 秒”。',
    role: '播放器用它建立时间轴、估算缓冲并按顺序衔接切片。',
    confusion: '它描述媒体时长，不是文件下载耗时，也不保证网络能在这段时间内下载完成。',
    scene: ['#EXTINF:4.0', 'segment.ts', '播放 4 秒']
  },
  targetDuration: {
    name: 'Target Duration', en: 'EXT-X-TARGETDURATION',
    definition: '清单声明的切片时长上界，数值必须不小于清单中任一 EXTINF 时长向上取整后的结果。',
    analogy: '像路线表先声明“这一批包裹最长不会超过 4 秒”。',
    role: '播放器据此安排清单刷新和超时策略；服务端生成清单时必须维持这个约束。',
    confusion: '它不是所有切片必须完全相等的固定时长，也不是直播总延迟。',
    scene: ['最长切片', 'Target Duration', '刷新节奏']
  },
  mediaSequence: {
    name: 'Media Sequence', en: 'EXT-X-MEDIA-SEQUENCE',
    definition: '给当前清单中的第一个媒体切片指定序号，后续切片按顺序递增。',
    analogy: '像滚动发车牌上的起始车次；旧车次离开列表，新车次继续加号。',
    role: '播放器刷新清单时用序号识别哪些切片已播、哪些是新出现的，避免重复或跳错。',
    confusion: '它不是视频帧号，也不表示文件名必须与序号相同。',
    scene: ['Sequence 120', '121 → 122', '发现新切片']
  },
  fmp4: {
    name: 'fMP4', en: 'FRAGMENTED MP4',
    definition: '把 MP4 拆成初始化信息和一段段可独立追加的媒体 fragment，适合边到边播放。',
    analogy: '普通 MP4 像整本装订书，fMP4 像先发目录，再逐章送到。',
    role: 'HLS、DASH 和浏览器 MSE 常使用 fMP4，让播放器无需等完整文件下载完。',
    confusion: 'fMP4 是封装方式，不是 H.264/H.265 这样的编码格式，也不等于 FLV。',
    scene: ['init segment', 'moof + mdat', '连续追加播放']
  },
  llHls: {
    name: 'LL-HLS', en: 'LOW-LATENCY HLS',
    definition: '低延迟 HLS，通过更小的 partial segment、阻塞式清单刷新等机制更快暴露新媒体。',
    analogy: '普通 HLS 等一整盘菜做好再端，LL-HLS 允许一小份做好就先端上来。',
    role: '它保留 HTTP/CDN 生态，同时把延迟压低，但对播放器、源站和 CDN 能力有额外要求。',
    confusion: '它不是把切片时长无限调小，也通常达不到 WebRTC 那样的实时互动延迟。',
    scene: ['正在生成的切片', 'Partial Segment', '更早播放']
  },
  signaling: {
    name: 'Signaling', en: 'SIGNALING',
    definition: 'WebRTC 连接前交换会话描述、候选地址和控制消息的业务通道，标准不规定必须用哪种协议实现。',
    analogy: '像双方先通过电话商量见面方式；电话只负责约路，不负责搬运音视频。',
    role: '应用可用 WebSocket、HTTP 等传递 SDP 和 ICE candidate，帮助两端协商并找到媒体路径。',
    confusion: '信令服务不等于媒体服务器；音视频通常不会沿信令请求传输。',
    scene: ['端 A', '信令服务', '端 B']
  },
  sdp: {
    name: 'SDP', en: 'SESSION DESCRIPTION PROTOCOL',
    definition: '一份描述会话能力的文本：有哪些音视频轨道、支持哪些编码、网络参数和加密信息。',
    analogy: '像两端交换设备清单和共同语言表，先确认“我们能怎么说话”。',
    role: 'Offer/Answer 过程用 SDP 找到双方都支持的媒体能力，但它本身不传输媒体。',
    confusion: 'SDP 不是服务器地址清单，也不是最终选中的网络路线。',
    scene: ['Offer', 'SDP 能力交集', 'Answer']
  },
  ice: {
    name: 'ICE', en: 'INTERACTIVE CONNECTIVITY ESTABLISHMENT',
    definition: '收集多种候选地址、测试候选对连通性，并选出实际可用媒体路径的一套机制。',
    analogy: '像路线规划员同时试走直达、映射地址和中转路线，选一条真的能通的。',
    role: 'ICE 使用 host、STUN 反射和 TURN 中继候选，持续做连通性检查并选定 candidate pair。',
    confusion: 'ICE 不是加密协议，也不是某一台服务器；STUN/TURN 是它会借助的服务。',
    scene: ['候选地址集合', 'ICE 检查', '可用路径']
  },
  candidate: {
    name: 'Candidate', en: 'ICE CANDIDATE',
    definition: '一个可能用于收发媒体的网络端点信息，包含 IP、端口、传输方式和候选类型。',
    analogy: '像路线规划中的一个候选入口；列出来不代表最终一定走它。',
    role: '双方交换 candidate 后，ICE 组合成候选对并实际探测，最终选中一对传输媒体。',
    confusion: 'candidate 不是用户账号，也不是 SDP 中的编码能力。',
    scene: ['host / srflx / relay', '候选对测试', '选中一对']
  },
  stun: {
    name: 'STUN', en: 'SESSION TRAVERSAL UTILITIES FOR NAT',
    definition: '帮助终端发现自己经过 NAT 后在公网看到的 IP 和端口映射。',
    analogy: '像站到门外照镜子，看看外界眼中的自己住在哪个门牌。',
    role: 'ICE 借助 STUN 生成 server-reflexive candidate，尝试在不经过媒体中继的情况下直连。',
    confusion: 'STUN 通常不转发实际音视频；无法直连时才可能需要 TURN。',
    scene: ['内网地址', 'STUN 看映射', '公网映射地址']
  },
  turn: {
    name: 'TURN', en: 'TRAVERSAL USING RELAYS AROUND NAT',
    definition: '当双方无法直连时，为它们分配一个公网中继地址，并转发实际媒体数据。',
    analogy: '像两条路互相到不了时，把包裹统一送到中转站再转交。',
    role: 'TURN 是 WebRTC 连通率的兜底，但会承担媒体带宽、增加一跳延迟并带来成本。',
    confusion: 'TURN 不是信令服务，也不是 CDN 缓存；它按连接实时中继数据。',
    scene: ['媒体端 A', 'TURN 中继', '媒体端 B']
  },
  nat: {
    name: 'NAT', en: 'NETWORK ADDRESS TRANSLATION',
    definition: '路由器把多个内网地址映射到较少的公网地址与端口，让内网设备共享公网出口。',
    analogy: '像整栋楼共用一个外部总机，外人不能直接按内部门牌找到每个房间。',
    role: '它让 WebRTC 两端不能总是直接看到彼此的真实可达地址，因此需要 ICE、STUN 和 TURN。',
    confusion: 'NAT 不等于防火墙，但它的映射规则会与防火墙策略共同影响连通性。',
    scene: ['192.168.x.x', 'NAT 映射', '公网 IP:端口']
  },
  dtls: {
    name: 'DTLS', en: 'DATAGRAM TLS',
    definition: '适用于数据报传输的 TLS 安全协议。WebRTC 用它完成身份校验并协商媒体加密所需的密钥。',
    analogy: '像在已选好的路上先核验证件，再共同生成只有双方知道的锁钥。',
    role: 'ICE 找到路后进行 DTLS 握手，随后导出密钥给 SRTP 保护音视频。',
    confusion: 'DTLS 主要负责握手与密钥协商；持续的音视频通常由 SRTP 承载。',
    scene: ['ICE 路径', 'DTLS 握手', 'SRTP 密钥']
  },
  srtp: {
    name: 'SRTP', en: 'SECURE REAL-TIME TRANSPORT PROTOCOL',
    definition: '在 RTP 基础上为实时音视频提供加密、完整性保护和重放防护。',
    analogy: '像给每个实时媒体包套上带防伪封条的加密袋。',
    role: 'DTLS 握手成功后，WebRTC 的音视频帧通常以 SRTP 包在选定路径上传输。',
    confusion: 'SRTP 不是 SRT 协议，也不是用来协商连接的 SDP。',
    scene: ['RTP 媒体包', 'SRTP 加密', '安全传输']
  },
  rtpRtcp: {
    name: 'RTP / RTCP', en: 'MEDIA + CONTROL',
    definition: 'RTP 承载带序号和时间戳的实时媒体；RTCP 回报丢包、抖动、往返时间等传输质量。',
    analogy: 'RTP 是送货车，RTCP 是不断回传路况和签收情况的调度员。',
    role: '播放器按 RTP 序号与时间戳重组媒体，并依据 RTCP 反馈做码率、自适应和重传决策。',
    confusion: 'RTP 时间戳不是毫秒墙上时间；RTCP 也不承载主要音视频内容。',
    scene: ['RTP 媒体 →', '网络路径', '← RTCP 反馈']
  },
  sfu: {
    name: 'SFU', en: 'SELECTIVE FORWARDING UNIT',
    definition: '接收参会者的媒体流，再选择性转发给其他人，通常不把所有画面合成一条。',
    analogy: '像实时分拣中心：收到多路包裹，按每位观众需要转发合适的几路。',
    role: '多人互动中，终端只需向 SFU 上传一路，避免每个人和所有人全互连。',
    confusion: 'SFU 不等于 CDN，也不同于把多路视频解码后合成画面的 MCU。',
    scene: ['多路上行', 'SFU 选择转发', '多位观众']
  },
  pop: {
    name: 'POP', en: 'POINT OF PRESENCE',
    definition: 'CDN 在某个地域或运营商网络中的服务接入点，里面通常部署边缘缓存和转发节点。',
    analogy: '像全国配送网在各城市设的前置仓，观众优先去附近仓取货。',
    role: '调度系统把观众引到合适 POP，以缩短网络距离、分散连接并提高稳定性。',
    confusion: 'POP 是一个部署地点/接入点概念，不一定只对应一台服务器。',
    scene: ['源站', '附近 POP', '本地观众']
  },
  cacheHitMiss: {
    name: 'Cache Hit / Miss', en: 'CACHE RESULT',
    definition: '边缘已有所需内容可直接返回叫 Hit；没有内容、需要向上游获取叫 Miss。',
    analogy: '前置仓有货就当场发出；缺货才向总仓调货。',
    role: '对可缓存的 HLS 切片，命中率越高，源站通常越轻；Miss 会产生回源请求和额外等待。',
    confusion: 'HTTP-FLV 长连接和 WebRTC 实时包不能像静态切片那样简单依靠文件缓存命中。',
    scene: ['观众请求', '边缘 Hit?', '返回 / 回源']
  },
  originShield: {
    name: 'Origin Shield', en: 'ORIGIN SHIELD',
    definition: '位于大量边缘节点和源站之间的汇聚缓存/代理层，把重复回源合并，保护源站。',
    analogy: '像总仓前的区域集散中心，众多前置仓缺货时先来这里，不都挤进总仓。',
    role: '多 CDN 或大规模 HLS 分发中，它可降低源站连接数、请求峰值和重复取片。',
    confusion: '它不是绝对防故障的盾牌；保护层自身也需要冗余、容量和监控。',
    scene: ['许多边缘', 'Origin Shield', '少量回源']
  },
  demux: {
    name: 'Demux', en: 'DEMULTIPLEXING',
    definition: '播放器从 FLV、TS、MP4 等封装中读出音频轨、视频轨、时间戳和元数据。',
    analogy: '像拆开到站货柜，把视频箱和音频箱分别送到对应车间。',
    role: '数据已经到达但解封装失败时，解码器可能根本拿不到合法帧，表现为黑屏或报格式错误。',
    confusion: 'Demux 不负责把 H.264 解成像素；那是 decode。',
    scene: ['FLV / TS', 'Demux 拆轨', '视频 + 音频']
  },
  liveEdge: {
    name: 'Live Edge', en: 'LIVE EDGE',
    definition: '当前已经生成并可供播放器获取的最新媒体位置，也就是直播时间轴的最前沿。',
    analogy: '像正在铺设的铁轨最前端；播放器通常跟在后面留一点安全距离。',
    role: '播放器位置与 live edge 的差值构成播放侧直播延迟的一部分，追得太近更容易因抖动卡住。',
    confusion: '它不是主播此刻真实动作的绝对时间；上游编码、发布和分发已经先产生延迟。',
    scene: ['播放器位置', '安全距离', 'Live Edge']
  },
  rtt: {
    name: 'RTT', en: 'ROUND-TRIP TIME',
    definition: '一个探测或数据从本端到对端、再返回本端所花的往返时间。',
    analogy: '像喊一声到听见对方回话的总时间，而不是单程送达时间。',
    role: '高 RTT 会让握手、重传和反馈控制变慢，互动直播中的操作响应也会更迟。',
    confusion: 'RTT 不是端到端直播延迟；直播延迟还包含编码、缓冲、分发和播放等待。',
    scene: ['发送探测 →', '网络', '← 返回确认']
  },
  percentile: {
    name: 'p95 / 分位数', en: '95TH PERCENTILE',
    definition: '把样本从小到大排列，p95 是约 95% 样本不超过的值，用来观察较差的一段体验。',
    analogy: '不是问全班平均跑多快，而是看排到后 5% 门口时需要多久。',
    role: '首开、延迟、RTT 常看 p95/p99，避免平均数把少量但严重的慢用户掩盖。',
    confusion: 'p95 不是最大值，也不表示“95% 的用户都等了这么久”。',
    scene: ['100 次体验', '第 95 个位置', 'p95']
  },
  qoe: {
    name: 'QoE', en: 'QUALITY OF EXPERIENCE',
    definition: '从观众实际感受出发衡量播放体验，常综合首开、卡顿、清晰度、延迟、失败率等。',
    analogy: '像评价一次乘车，不只看发动机指标，还看是否等得久、是否颠簸、是否到达。',
    role: 'QoE 把服务端健康与真实用户体验连接起来，帮助判断优化是否真的让观众受益。',
    confusion: 'QoE 不是单个固定公式，也不等于网络 QoS；不同业务权重会不同。',
    scene: ['首开 + 卡顿', 'QoE', '观众体验']
  },
  throughput: {
    name: 'Throughput / Download Rate', en: 'EFFECTIVE DATA RATE',
    definition: '一段时间内实际成功传到播放器的数据量，反映当前网络真正交付媒体的速度。',
    analogy: '带宽像水管标称口径，吞吐量像此刻实际流出来的水量。',
    role: '下载速率长期低于播放码率时，缓冲必然下降；短时低谷能否扛住取决于缓冲余量。',
    confusion: '测速峰值或链路标称带宽不等于直播全过程的稳定吞吐量。',
    scene: ['网络实际送达', '吞吐量 vs 码率', '缓冲升 / 降']
  },
  packetLoss: {
    name: 'Packet Loss', en: 'PACKET LOSS',
    definition: '发送出的网络包有一部分没有按预期到达接收端，通常用丢失比例或连续丢包长度描述。',
    analogy: '像运输途中少了几箱；零星少一箱与连续丢一整车，影响完全不同。',
    role: '连续丢包更容易破坏关键媒体数据；TCP 会重传并增加等待，实时 UDP 链路则可能请求重传或容错。',
    confusion: '播放器掉帧不一定是网络丢包，也可能是设备解码太慢主动丢帧。',
    scene: ['包 1 2 × × 5', '缺口', '重传 / 丢帧']
  },
  nack: {
    name: 'NACK', en: 'NEGATIVE ACKNOWLEDGEMENT',
    definition: '接收端根据序号发现缺包后，明确告诉发送端“这些包没收到，请补发”。',
    analogy: '像签收时发现少了 23 号箱，立刻报出箱号要求补寄。',
    role: 'WebRTC 可通过 RTCP NACK 请求重传近期丢失的 RTP 包；是否来得及仍受 RTT 和实时性约束。',
    confusion: 'NACK 不是保证成功的无限重传；过时的视频包即使补到也可能已无播放价值。',
    scene: ['发现序号缺口', 'NACK 23', '快速补包']
  },
  hardwareFallback: {
    name: '硬件解码回退', en: 'HARDWARE DECODE FALLBACK',
    definition: '设备无法继续使用硬件解码路径时，播放器改用软件解码，或换到兼容性更高的配置。',
    analogy: '像自动扶梯停了，只能改走楼梯；还能到，但人会更累、速度可能更慢。',
    role: '回退后 CPU、耗电、发热和掉帧可能上升，应结合 codec、profile、分辨率与设备型号观察。',
    confusion: '回退不是网络卡顿；它发生在数据已到达后的终端处理环节。',
    scene: ['硬解不可用', '回退软件解码', 'CPU / 掉帧 ↑']
  },
  clockSource: {
    name: 'Clock Source', en: 'MEDIA CLOCK SOURCE',
    definition: '为采集或播放提供时间基准的时钟，例如音频设备时钟、系统单调时钟或外部同步时钟。',
    analogy: '像乐队选定同一位指挥；如果每个声部都看自己的表，久了就会走散。',
    role: '播放器通常选择主时钟，再依据 PTS 调度其他轨道；采集端时钟不一致会造成长期音画漂移。',
    confusion: '时钟源不是 PTS 本身；时钟提供“现在”，PTS 标记“这一帧应该在何时呈现”。',
    scene: ['主时钟', '按 PTS 调度', '音画同拍']
  },
  drift: {
    name: 'Drift', en: 'CLOCK DRIFT',
    definition: '两个时钟走速存在微小差异，导致音画偏差随时间持续增大，而不是固定错开。',
    analogy: '两只每天差一秒的手表，刚对齐时看不出问题，过很久就明显不同。',
    role: '持续漂移要追查采集时钟、时间基换算和丢帧补帧；只加固定延迟无法长期解决。',
    confusion: '固定 offset 可以一次补偿，drift 是斜率问题，需要持续校正。',
    scene: ['起点对齐', '时钟速率不同', '偏差越来越大']
  },
  resampling: {
    name: 'Resampling', en: 'AUDIO RESAMPLING',
    definition: '把音频重新映射到另一采样率，或极轻微改变采样节奏，以跟随主时钟。',
    analogy: '像在不突然停顿的前提下，偶尔把脚步略微放快或放慢，重新跟上队伍。',
    role: '播放器或媒体框架可用动态重采样吸收小幅时钟漂移，让音频长期保持与视频同步。',
    confusion: '它不是简单把整条音频固定延后，也不是重新编码就一定会做的事情。',
    scene: ['音频采样', '轻微重采样', '跟随主时钟']
  },
  playbackRate: {
    name: 'Playback Rate', en: 'PLAYBACK SPEED',
    definition: '播放器实际消费媒体时间轴的速度，1.0× 是正常速度，略高或略低可用于温和追赶或放慢。',
    analogy: '像与直播前沿保持距离时小幅调节步速，而不是突然跳到前面。',
    role: '部分低延迟播放器会短暂用 1.02× 追近 live edge，减少积累的播放延迟。',
    confusion: '播放倍速不是网络下载速度，也不应大幅、长期改变直播内容节奏。',
    scene: ['缓冲偏多', '1.02× 播放', '靠近 Live Edge']
  },
  rootCause: {
    name: 'Root Cause', en: 'ROOT CAUSE',
    definition: '能够解释故障为何发生、为何影响这些对象、为何在这个时间出现的最底层可验证原因。',
    analogy: '不只说“地上有水”，还要找到是水管破裂、阀门失灵还是有人打翻水桶。',
    role: '根因结论需要证据链：第一处异常、传播路径、复现实验或修复后的反向验证。',
    confusion: '最醒目的报警、最后一个报错或受影响最大的组件不一定是根因。',
    scene: ['症状', '证据链追溯', '根因']
  },
  mitigation: {
    name: '止血', en: 'MITIGATION',
    definition: '优先缩小影响、恢复服务的临时或快速动作，例如切流、降级、限流、回滚。',
    analogy: '急诊先止住出血，让病人稳定下来，再安排完整检查与治疗。',
    role: '直播事故中可先切备用 CDN、关闭问题档位或回滚配置，同时保留现场证据。',
    confusion: '服务恢复不等于根因消失；止血动作可能带来成本或体验折损。',
    scene: ['故障扩大', '止血动作', '影响收敛']
  },
  longTermFix: {
    name: '长期修复', en: 'PERMANENT FIX',
    definition: '针对已验证根因，降低同类故障再次发生或缩短发现、切换和恢复时间的系统性改动。',
    analogy: '止血后不仅缝合伤口，还要修掉会再次划伤人的设备。',
    role: '可能包括容量改造、自动切换、配置校验、监控补齐、压测和故障演练。',
    confusion: '写一条复盘结论或单纯调高阈值不算完成长期修复，必须能验证风险已降低。',
    scene: ['根因确认', '系统性改造', '演练验证']
  },
  dataPlane: {
    name: 'Data Plane', en: 'DATA PLANE',
    definition: '真正接收、处理和搬运音视频数据的路径，包括接入、转码、封装、分发和播放。',
    analogy: '像铁路上的列车与轨道，负责把乘客实际送到目的地。',
    role: '容量、延迟和媒体正确性主要在数据面发生，故障会直接表现为断流、卡顿或画面异常。',
    confusion: '数据面不决定所有策略；调度、鉴权和配置通常属于控制面。',
    scene: ['主播媒体', '数据面', '观众媒体']
  },
  controlPlane: {
    name: 'Control Plane', en: 'CONTROL PLANE',
    definition: '决定数据面如何工作和往哪里走的管理路径，例如鉴权、配置、调度、路由与切换。',
    analogy: '像铁路调度中心：不亲自运乘客，但决定哪趟车走哪条线。',
    role: '它把业务策略下发给接入、转码和分发节点，并在故障时重选路径。',
    confusion: '控制面短暂异常不一定立刻中断已有媒体，但会影响新建流、变更和故障切换。',
    scene: ['业务策略', '控制面', '路由 / 配置']
  },
  observabilityPlane: {
    name: 'Observability Plane', en: 'OBSERVABILITY PLANE',
    definition: '通过指标、日志、追踪、事件和 QoE，回答系统内部发生了什么以及用户是否受影响。',
    analogy: '像全线仪表、摄像头和行车记录，不开列车，但让人看见哪里开始异常。',
    role: '它横跨数据面和控制面，为告警、排障、容量和成本决策提供证据。',
    confusion: '有监控面板不等于可观测；数据必须能关联到链路、版本、区域和用户体验。',
    scene: ['指标 + 日志', '观测面', '定位 + 决策']
  },
  ingest: {
    name: 'Ingest', en: 'STREAM INGEST',
    definition: '直播系统接住主播上行的入口层，负责建连、鉴权、收流并把源流交给后续处理。',
    analogy: '像总装厂收货口，先验单、登记，再把原料送进生产线。',
    role: '入口需要关注建连成功率、首包时间、在线流数、上行质量和区域容量。',
    confusion: 'Ingest 不是观众播放入口，也不等于源站的全部职责。',
    scene: ['主播推流', 'Ingest 接入', '源流']
  },
  mediaCore: {
    name: 'Media Core', en: 'MEDIA PROCESSING CORE',
    definition: '集中完成转码、混流、截图、封装等媒体处理的核心服务集合。',
    analogy: '像工厂的加工车间，把一份原料变成多个可交付产品。',
    role: '它把源流生产为不同编码、画质和协议需要的输出，计算与队列容量是主要约束。',
    confusion: '媒体核心不等于 CDN；前者生产媒体产品，后者大规模送达。',
    scene: ['高质量源流', 'Media Core', '多档 / 多协议']
  },
  abr: {
    name: 'ABR', en: 'ADAPTIVE BITRATE',
    definition: '播放器根据实时网络和缓冲状况，在同一内容的多个码率档位之间切换。',
    analogy: '像上坡时换低挡保住速度，路况好再换高挡，而不是一直顶着最高挡。',
    role: 'ABR 的第一目标通常是避免卡顿，其次才是在安全带宽下尽量提高清晰度。',
    confusion: 'ABR 不是编码器自动把一条流变清晰；服务端必须先准备可切换的多个档位。',
    scene: ['多档清单', 'ABR 选择', '当前网络合适档']
  },
  rendition: {
    name: 'Rendition', en: 'MEDIA RENDITION',
    definition: '同一内容的一种可播放版本，例如 720p 视频档、纯音频档或另一语言音轨。',
    analogy: '像同一本书的精装版、便携版和有声版，内容相同但交付形态不同。',
    role: 'ABR 清单把多个 rendition 组织起来，播放器从中选择当前设备和网络能消费的版本。',
    confusion: 'rendition 不只指分辨率；编码、码率、帧率、音轨也可以不同。',
    scene: ['同一内容', '多个 Rendition', '按需选择']
  },
  encodingProfile: {
    name: 'Encoding Profile', en: 'ENCODING PROFILE',
    definition: '一套可复用的编码规格组合，通常包含 codec、分辨率、帧率、码率、GOP、preset 等。',
    analogy: '像工厂的标准生产配方，不必每次直播都重新猜一遍参数。',
    role: '转码系统按 profile 生成稳定档位，并按内容类型、设备兼容和成本维护版本。',
    confusion: '这里的 profile 是完整业务配方，不要与 H.264 标准里的 Baseline/Main/High profile 混为一谈。',
    scene: ['参数配方', 'Encoding Profile', '稳定档位']
  },
  origin: {
    name: 'Origin', en: 'ORIGIN SERVER',
    definition: '向分发网络提供原始直播输出或切片的上游源头，是 CDN 回源时最终取内容的位置。',
    analogy: '像总仓，负责稳定供货，但不应该亲自给全国每一位顾客送货。',
    role: '源站要扛住正常回源、热点 Miss 和 CDN 故障回切，并向保护层或 CDN 提供一致内容。',
    confusion: '源站不一定就是主播直接连接的 ingest 节点，生产架构中两层常会分开。',
    scene: ['媒体输出', 'Origin 源站', 'CDN 上游']
  },
  multiCdn: {
    name: 'Multi-CDN', en: 'MULTI-CDN',
    definition: '同时接入两家或更多 CDN，并按质量、地域、容量、成本或故障状态调度观众流量。',
    analogy: '像同时签约多家物流，某条线路拥堵时可把新订单切到另一家。',
    role: '它降低单供应商和单网络故障风险，但需要统一监控、调度、回源保护与切换验证。',
    confusion: '接入两家但没有实时探测和可执行切换，不等于真正具备 Multi-CDN 容灾。',
    scene: ['统一调度', 'CDN A / B', '观众']
  },
  failover: {
    name: 'Failover', en: 'FAILOVER',
    definition: '主路径不可用或质量达不到条件时，把流量或任务切换到健康备用路径。',
    analogy: '像主桥封闭后，交通按预案改走已确认有容量的备用桥。',
    role: '切换必须同时具备故障检测、备用容量、状态/内容一致性和切后验证。',
    confusion: 'Failover 不是随便重试；备用侧没容量时，切换可能把局部故障扩大。',
    scene: ['主路异常', 'Failover', '备用路承接']
  },
  egress: {
    name: 'Egress', en: 'OUTBOUND TRAFFIC',
    definition: '从某个系统边界向外发送的数据流量或带宽，例如 CDN 发给观众、源站发给 CDN。',
    analogy: '像仓库所有出货口每秒搬出去的货物总量。',
    role: '观众数 × 平均码率决定主要下行 egress；命中率则决定其中有多少会继续变成源站 egress。',
    confusion: 'Egress 是方向性概念；同一份数据对上游是出站，对下游可能是入站。',
    scene: ['系统边界', 'Egress →', '外部接收方']
  },
  peakFactor: {
    name: 'Peak Factor', en: 'PEAK FACTOR',
    definition: '为平均或计划负载乘上的峰值放大系数，用来覆盖开播瞬间、热点事件和统计波动。',
    analogy: '餐厅平均坐 60 人，但节假日按 100 人准备；多出的比例就是峰值余量依据。',
    role: '容量估算中用并发、码率与峰值系数得到更接近压力时刻的带宽，而不是只按平均值配置。',
    confusion: '峰值系数不是越大越安全；应由历史峰值、增长速度和故障回切场景验证。',
    scene: ['平均负载', '× 峰值系数', '计划峰值']
  },
  hitRate: {
    name: 'Hit Rate', en: 'CACHE HIT RATE',
    definition: '边缘直接满足的可缓存请求占全部相关请求的比例。',
    analogy: '100 次取货有 99 次前置仓直接发出，命中率就是 99%。',
    role: '同等观众流量下，命中率从 99% 降到 95%，回源比例会从 1% 增到 5%，是原来的五倍。',
    confusion: '请求命中率与字节命中率可能不同；小文件命中多不代表节省的数据量同样高。',
    scene: ['100 次请求', '99 次 Hit', '1 次回源']
  },
  headroom: {
    name: 'Headroom', en: 'CAPACITY HEADROOM',
    definition: '正常负载与系统安全容量上限之间预留的可用空间。',
    analogy: '像电梯限载 1000kg，日常只安排 700kg，为突发人数留下余量。',
    role: '备用 CDN、转码集群和源站都要留 headroom，才能接住流量突增或故障回切。',
    confusion: '机器 CPU 还没到 100% 不代表有有效余量；队列、网络、内存和下游限制也可能先到顶。',
    scene: ['正常负载', 'Headroom', '安全上限']
  },
  redundancy: {
    name: 'Redundancy', en: 'REDUNDANCY',
    definition: '为关键能力准备独立的备用实例、路径或区域，使单点失效时仍有可用替代。',
    analogy: '像飞机的备用系统，关键不只是多一套，而是主系统坏时它能独立接手。',
    role: '直播系统会对 ingest、转码、源站、调度和 CDN 做不同层级冗余，并持续验证备用侧健康。',
    confusion: '两台依赖同一电源、配置错误或上游的机器，可能仍是同一个故障域。',
    scene: ['主实例', '独立备用', '持续服务']
  },
  rollback: {
    name: 'Rollback', en: 'ROLLBACK',
    definition: '新版本或配置出现问题时，恢复到上一份已知可用状态。',
    analogy: '像走错路线后回到最近一个确认安全的路口，而不是继续边走边修。',
    role: '回滚需要可追溯版本、兼容的数据/协议和验证步骤，并应在发布前演练。',
    confusion: '回滚不是万能键；不可逆数据变更或外部依赖变化可能让旧版本也无法恢复。',
    scene: ['新版本异常', 'Rollback', '已知稳定版本']
  },
  mesh: {
    name: 'Mesh', en: 'FULL-MESH MEDIA TOPOLOGY',
    definition: '多人实时通信中，每个参与者都直接向其他所有人发送媒体的全互连拓扑。',
    analogy: '像每个人都分别给房间里其他人打电话，人数一多，连接数迅速膨胀。',
    role: '小规模通话可省去媒体服务器；人数增多时，上行带宽和连接数约按平方增长，通常改用 SFU。',
    confusion: 'Mesh 不是“更去中心化就一定更省成本”；成本会转移到终端与网络。',
    scene: ['每人多路上行', 'Mesh 全互连', '连接数 N²']
  }
};

export const TERM_SETS = {
  'stage2-ffmpeg': { title: '读懂 FFmpeg 加工单', intro: '不要背整条命令。点一个参数，看它在工厂里控制哪道工位。', terms: ['ffmpegRe', 'ffmpegInput', 'codecSelector', 'libx264', 'bitrateOptions', 'preset', 'muxDemux'] },
  'stage2-rtmp': { title: '连接成功，不等于推流成功', intro: '五道关卡属于不同层。点开它们，先把故障坐标分清。', terms: ['tcp', 'rtmpHandshake', 'rtmpConnect', 'createStream', 'publish'] },
  'stage2-srs': { title: '中央站里的服务器词汇', intro: '这些词决定流进入哪个空间、是否留档，以及出口堵塞时会发生什么。', terms: ['vhost', 'dvr', 'sendQueue', 'queueOverflow'] },
  'stage3-hls': { title: '把 HLS 清单逐词拆开', intro: '清单、切片和低延迟扩展各管一层，不能把它们都叫“视频文件”。', terms: ['m3u8', 'mediaSegment', 'extinf', 'targetDuration', 'mediaSequence', 'fmp4', 'llHls'] },
  'stage3-webrtc': { title: 'WebRTC 建连词典', intro: '先协商能力，再找路、验身份、送媒体。点击名词看它接过哪一棒。', terms: ['signaling', 'sdp', 'ice', 'candidate', 'stun', 'turn', 'nat', 'dtls', 'srtp', 'rtpRtcp', 'sfu'] },
  'stage3-delivery': { title: '分发网络里谁在搬货', intro: '源站、保护层、边缘和缓存结果是四个不同概念。', terms: ['pop', 'cacheHitMiss', 'originShield', 'sfu'] },
  'stage3-playback': { title: '播放器侧的三个故障坐标', intro: '数据到没到、能不能拆、离直播前沿多远，要分开判断。', terms: ['demux', 'fmp4', 'liveEdge'] },
  'stage4-latency': { title: '看懂延迟报告', intro: '一个延迟数字可能混合了网络、缓冲和统计口径，先拆开再判断。', terms: ['rtt', 'liveEdge', 'percentile', 'qoe'] },
  'stage4-network': { title: '卡顿现场的网络语言', intro: '到达速度、丢包、补包和终端回退留下的指标形状不同。', terms: ['throughput', 'packetLoss', 'nack', 'hardwareFallback'] },
  'stage4-metrics': { title: '指标名词不只看数值', intro: '先弄清指标测量的是哪一段，再把它放回同一时间线。', terms: ['qoe', 'percentile', 'sendQueue', 'egress'] },
  'stage4-sync': { title: '音画校准室里的四个词', intro: '你模拟的是播放器同步模块；它看主时钟和 PTS，再选择如何温和校正。', terms: ['clockSource', 'drift', 'resampling', 'playbackRate'] },
  'stage4-incident': { title: '恢复服务之后，还差哪一步', intro: '止血、根因和长期修复是三件连续但不同的工作。', terms: ['mitigation', 'rootCause', 'longTermFix'] },
  'stage5-blueprint': { title: '先分清三张平面，再看组件', intro: '谁搬媒体、谁下策略、谁提供证据，是架构图最先要回答的三件事。', terms: ['dataPlane', 'controlPlane', 'observabilityPlane', 'ingest', 'mediaCore'] },
  'stage5-abr': { title: '转码梯子里的产品词汇', intro: '服务端先生产多个版本，播放器才有条件自适应选择。', terms: ['abr', 'rendition', 'encodingProfile'] },
  'stage5-routing': { title: '多路分发怎样真的可切换', intro: '多一家 CDN 只是起点；源站保护、调度和备用容量必须成套。', terms: ['origin', 'originShield', 'multiCdn', 'failover'] },
  'stage5-capacity': { title: '容量估算器里的四个量', intro: '把方向、峰值、缓存效果和预留空间说清，计算结果才有意义。', terms: ['egress', 'peakFactor', 'hitRate', 'headroom'] },
  'stage5-resilience': { title: '高可用不是多放几台机器', intro: '冗余要独立，切换要验证，出问题还要能安全退回。', terms: ['redundancy', 'failover', 'rollback', 'qoe', 'mesh'] }
};
