export const ARCHITECTURE_STOPS = [
  {
    id: 'ingest', name: '接入网关', en: 'INGEST', icon: 'publish', target: 'stage5-overview',
    role: '先把主播安全、稳定地接进来',
    story: '主播携带 RTMP、SRT 或 WebRTC 上行来到接入网关。网关先做鉴权、限流、流名检查和就近接入，再把合格源流交给媒体核心。生产环境通常准备主备入口，避免一个地址失效就整场中断。',
    truth: '接入层解决连接、身份与入口可用性，不负责替代后面的转码和分发。双路推流必须来自真正独立的路径，两个域名指向同一故障点不算冗余。',
    output: '经过鉴权的稳定源流', check: '发布成功率、首帧时间、断流次数、入口地域与协议错误。'
  },
  {
    id: 'core', name: '媒体核心', en: 'MEDIA CORE', icon: 'server', target: 'stage5-overview',
    role: '源流进入系统的中央车间',
    story: '媒体核心接收源流、维护会话、复制媒体轨道，并把数据送往录制、转码、截图、审核和下行封装。这里像总装厂的传送中枢，任何持续队列都会把延迟一点点积累起来。',
    truth: '媒体核心的关键不是机器越多越好，而是会话状态、流路由和处理能力能否水平扩展，并在实例故障时恢复或切换。',
    output: '可被多个下游消费的媒体轨道', check: '在线流数、输入/输出 FPS、发送队列、处理耗时和实例负载。'
  },
  {
    id: 'transcode', name: '转码工厂', en: 'TRANSCODE', icon: 'encode', target: 'stage5-ladder',
    role: '把一条高质量源流生产成多档商品',
    story: '1080p 源流进入转码工厂后，被生产成 1080p、720p、480p、360p，甚至纯音频。高速网络拿高清档，弱网退到低码率档，播放器才能用 ABR 在清晰和流畅之间切换。',
    truth: '每个档位都要匹配分辨率、帧率、码率和编码能力。只把码率数字改小但保留不合理分辨率，可能得到又糊又费算力的档位。',
    output: '多档编码流与清晰度梯子', check: '转码成功率、编码 FPS、GPU/CPU、队列、关键帧对齐和输出质量。'
  },
  {
    id: 'package', name: '封装与源站', en: 'PACKAGE', icon: 'container', target: 'stage5-distribution',
    role: '把多档媒体整理成可分发的播放产品',
    story: '封装层把编码帧组织成 HLS/LL-HLS 切片、HTTP-FLV 长流或 WebRTC 实时媒体。源站与回源保护层保存或持续提供这些产品，让 CDN 节点不必直接冲击媒体核心。',
    truth: '封装决定播放器怎样取数据，源站决定分发网络从哪里补货。切片时长、GOP 和多档关键帧是否对齐，会直接影响切档与延迟。',
    output: '可缓存切片、连续流或实时媒体', check: '清单连续性、切片生成、首帧、回源响应和多档时间轴对齐。'
  },
  {
    id: 'delivery', name: '分发调度', en: 'DELIVERY', icon: 'network', target: 'stage5-distribution',
    role: '让内容靠近观众，并准备第二条路',
    story: '调度系统根据地域、运营商、节点健康和成本，把观众分给 CDN A、CDN B，或允许 P2P 协助。当一条路故障时，流量必须在容量允许的前提下切到其他路径。',
    truth: '多 CDN 不是把两个域名写进配置就完成了。还需要实时健康信号、切换策略、容量余量、DNS/客户端调度和切换后的播放验证。',
    output: '就近且可切换的下行路径', check: '边缘错误率、命中率、回源、地域 QoE、调度比例和切换成功率。'
  },
  {
    id: 'observe', name: '观测与闭环', en: 'CONTROL LOOP', icon: 'bitrate', target: 'stage5-resilience',
    role: '最后一站不是屏幕，而是持续证明系统正常',
    story: '控制室把发布、编码、源站、CDN、播放器体验和成本放到同一时间轴。告警触发后，系统或值班人员执行切换，再用相同指标证明恢复，最后把根因和预防项写进复盘。',
    truth: '服务端 200 不等于观众播放正常。最终必须用首开、卡顿、延迟、掉帧和错误率等 QoE 指标闭环，同时保留各层证据用于定位。',
    output: '可发现、可切换、可验证的运行系统', check: '告警是否及时、自动化是否可回滚、QoE 是否恢复、成本是否越界。'
  }
];

export const LADDER_PROFILES = [
  { id: '1080', name: '1080p', detail: '1920×1080 · 6 Mbps', bitrate: 6, cost: 6, audiences: ['fast'], default: true },
  { id: '720', name: '720p', detail: '1280×720 · 3 Mbps', bitrate: 3, cost: 3, audiences: ['fast', 'medium'], default: true },
  { id: '480', name: '480p', detail: '854×480 · 1.5 Mbps', bitrate: 1.5, cost: 1.5, audiences: ['medium', 'weak'], default: true },
  { id: '360', name: '360p', detail: '640×360 · 0.8 Mbps', bitrate: 0.8, cost: 0.8, audiences: ['weak'], default: false },
  { id: 'audio', name: '纯音频', detail: 'AAC · 0.1 Mbps', bitrate: 0.1, cost: 0.1, audiences: ['extreme'], default: false }
];

export const AUDIENCE_NETWORKS = [
  { id: 'fast', name: '高速网络', detail: '可稳定消费高清档' },
  { id: 'medium', name: '普通移动网络', detail: '需要 720p / 480p 退让空间' },
  { id: 'weak', name: '明显弱网', detail: '需要低码率画面避免持续卡顿' },
  { id: 'extreme', name: '极弱网保底', detail: '画面无法维持时仍可听声音' }
];

export const PROTECTIONS = [
  { id: 'dualIngest', name: '双路独立接入', detail: '主入口失败时仍有备用上行', default: true },
  { id: 'redundantTranscode', name: '转码冗余实例', detail: '单个转码工人过载或退出时可接替', default: false },
  { id: 'multiCdn', name: '多 CDN 调度', detail: '区域节点故障时可迁移到另一分发网络', default: true },
  { id: 'cdnFallback', name: 'P2P 的 CDN 兜底', detail: '邻居不足或上传受限时继续从 CDN 取流', default: true },
  { id: 'playerFallback', name: '播放器协议回退', detail: '主播放协议不可用时切换备用协议', default: false }
];

export const FAILURE_CASES = [
  { id: 'ingest', name: '主接入点掉线', required: 'dualIngest', story: '主播正在推流，主入口所在机房突然不可达。', success: '备用入口仍收到源流，调度把会话切到健康路径。', fail: '没有独立备用上行，整场直播从源头中断。' },
  { id: 'transcode', name: '转码实例过载', required: 'redundantTranscode', story: '编码 FPS 从 30 降到 16，队列持续增长。', success: '冗余实例接管档位，队列回落，播放器继续获得连续输出。', fail: '没有转码冗余，多档输出一起变慢并向观众传播卡顿。' },
  { id: 'cdn', name: '区域 CDN 故障', required: 'multiCdn', story: '某运营商区域的边缘节点错误率突然升高。', success: '调度降低故障 CDN 权重，并把新请求迁移到健康 CDN。', fail: '所有流量绑在单一 CDN，该区域没有可用替代路径。' },
  { id: 'p2p', name: 'P2P 邻居骤减', required: 'cdnFallback', story: '终端上传受限，P2P 分享率从 50% 快速降到 5%。', success: '播放器从 CDN 补足缺口，成本上升但播放保持连续。', fail: '没有 CDN 兜底，邻居减少直接造成数据缺口和卡顿。' },
  { id: 'protocol', name: '主播放协议失败', required: 'playerFallback', story: '浏览器升级后，HTTP-FLV 播放链出现兼容问题。', success: '播放器按策略回退到 HLS，牺牲部分延迟但恢复播放。', fail: '没有备用协议，媒体仍在服务端却无法被当前终端消费。' }
];

export const CAPSTONE_SCENARIOS = [
  {
    id: 'concert', title: '十万人线上演唱会', detail: '单向观看为主，终端复杂，要求多档清晰度和区域容灾。',
    options: [
      { label: '双路接入 + ABR 转码 + HLS + 多 CDN + 可选 P2P', correct: true, why: '规模、兼容、清晰度切换和区域容灾都得到覆盖。' },
      { label: '主播电脑直接给十万人发送 WebRTC', correct: false, why: '单个主播端无法承担这种连接和出口规模。' },
      { label: '只保留一档 1080p 并关闭所有监控', correct: false, why: '弱网没有退路，故障也无法及时发现。' }
    ]
  },
  {
    id: 'auction', title: '跨区域实时拍卖', detail: '出价和画面必须亚秒反馈，公平性对延迟非常敏感。',
    options: [
      { label: '区域 WebRTC SFU + TURN 兜底 + 实时 QoE 监控', correct: true, why: '实时媒体边缘和中继兜底符合强互动约束。' },
      { label: '经典 6 秒切片 HLS，起播等待 5 片', correct: false, why: '累计延迟无法满足实时出价。' },
      { label: '离线 MP4 下载完成后再开始', correct: false, why: '这不是实时直播方案。' }
    ]
  },
  {
    id: 'sports', title: '体育赛事直播与回看', detail: '需要大规模观看、多码率、时移回看和热点区域扩容。',
    options: [
      { label: 'ABR HLS + 录制存储 + 回源保护 + 多 CDN', correct: true, why: '切片清单同时适合多档、缓存、时移和回看。' },
      { label: '所有观众加入同一个全互连 P2P 房间', correct: false, why: '全互连无法扩展到大规模观看。' },
      { label: '只部署一台无磁盘源站', correct: false, why: '容量、容灾和回看都没有保障。' }
    ]
  },
  {
    id: 'class', title: '五十人互动课堂', detail: '师生双向音视频，老师还需要录制课程供课后回看。',
    options: [
      { label: 'WebRTC SFU + TURN + 服务端录制/转封装', correct: true, why: '实时互动和课后回看被拆成合适的两条链路。' },
      { label: '只用单向 HLS，学生无法上行', correct: false, why: '无法满足双向课堂互动。' },
      { label: '五十人完全 Mesh 互连', correct: false, why: '每个终端的连接数和上行会迅速失控。' }
    ]
  },
  {
    id: 'ops', title: '企业桌面运营监看', detail: '固定浏览器环境，观看规模小，希望 2～4 秒延迟且运维简单。',
    options: [
      { label: 'HTTP-FLV + 受控桌面播放栈 + 单 CDN/边缘代理 + QoE 告警', correct: true, why: '环境受控、规模较小，选择与需求匹配且不过度复杂。' },
      { label: '全球多 CDN + 80% P2P + 五级转码全部开启', correct: false, why: '远超业务规模，复杂度和成本没有必要。' },
      { label: '不设缓冲、不做监控，只追求最低延迟', correct: false, why: '稳定性和故障发现能力都不可接受。' }
    ]
  }
];

export const STAGE5_QUIZ = [
  { question: '生产级直播架构为什么要同时考虑数据面、控制面和观测面？', options: ['既要搬运媒体，也要调度路径并证明系统健康', '为了让页面颜色更多', '它们都是同一个数据库字段'], answer: 'a' },
  { question: '接入网关最主要解决什么？', options: ['连接、鉴权、限流与入口可用性', '替观众解码画面', '生成浏览器 CSS'], answer: 'a' },
  { question: '为什么需要多档转码梯子？', options: ['让不同网络和终端选择能稳定消费的档位', '让所有观众永久锁定最高码率', '替代 CDN 调度'], answer: 'a' },
  { question: '增加一个转码档位会带来什么代价？', options: ['增加计算、封装对象和监控维度', '一定减少所有成本', '自动修复网络丢包'], answer: 'a' },
  { question: 'ABR 播放器的核心目标是什么？', options: ['根据网络变化在清晰度与连续播放之间切换', '永远选择文件名最长的档位', '关闭缓冲区'], answer: 'a' },
  { question: '回源保护层的主要价值是什么？', options: ['隔离 CDN 回源压力，保护媒体核心或原始源站', '增加屏幕亮度', '代替主播采集'], answer: 'a' },
  { question: '多 CDN 真正生效还需要什么？', options: ['健康信号、调度策略、容量余量与切换验证', '只购买两个域名', '让两个 CDN 指向同一故障节点'], answer: 'a' },
  { question: 'P2P 在生产直播中通常扮演什么角色？', options: ['协助分担部分流量，CDN 继续供给和兜底', '永久取代源站和 CDN', '只负责视频美颜'], answer: 'a' },
  { question: '估算峰值分发带宽至少要知道哪些量？', options: ['并发人数、平均码率与峰值系数', '主播昵称和封面颜色', 'HTML 文件行数'], answer: 'a' },
  { question: 'CDN 命中率下降最直接会增加什么？', options: ['回源流量与源站压力', '观众屏幕尺寸', '音频采样位数'], answer: 'a' },
  { question: '为什么双路推流必须来自独立路径？', options: ['共享同一故障点的两条地址可能同时失效', '独立路径会自动提高分辨率', '为了减少所有日志'], answer: 'a' },
  { question: '区域 CDN 节点错误率升高时，合理动作是什么？', options: ['降低该路径权重并把流量切到健康且有余量的 CDN', '立即删除所有源流', '只调高播放器音量'], answer: 'a' },
  { question: '服务端请求都返回 200，为什么仍要看播放器 QoE？', options: ['服务端成功不代表观众没有首开慢、卡顿或高延迟', 'QoE 只用于选择字体', '200 代表视频质量一定最高'], answer: 'a' },
  { question: '故障切换后，怎样证明真正恢复？', options: ['用发布、处理、分发和观众体验指标共同验证', '只看切换按钮变成绿色', '不再记录任何数据'], answer: 'a' },
  { question: '架构选型最合理的原则是什么？', options: ['先找业务硬约束，再选择能覆盖失败路径的必要复杂度', '永远选择组件最多的方案', '所有直播都使用完全相同的架构'], answer: 'a' }
];
