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
  { question: '媒体仍在正常传输，但调度系统无法识别故障边缘并切流。哪两个面分别正常和异常？', options: ['观测面正常、数据面异常', '数据面正常、控制面异常', '控制面正常、编码面异常'], answer: 'b' },
  { question: '接入网关 CPU 正常，但鉴权服务超时导致新主播无法开播，已在线主播不受影响。最准确的判断是什么？', options: ['控制/鉴权依赖影响新建发布连接，存量媒体数据面暂时正常', '所有观众的解码器同时损坏', 'CDN 缓存命中率必然降为零'], answer: 'a' },
  { question: '源流为 1080p 6 Mbps，只增加一个 720p 2.5 Mbps 档位。除了转码计算，还会新增什么长期成本？', options: ['只有一次性的页面开发成本', '所有观众都必须同时下载两档', '封装/存储对象、分发流量组合和监控维度'], answer: 'c' },
  { question: 'ABR 播放器发现吞吐连续下降且缓冲水位接近危险线，合理动作是什么？', options: ['先降到可持续档位，缓冲恢复后再谨慎升档', '继续锁定最高码率直到卡住', '立即清空缓冲并关闭网络请求'], answer: 'a' },
  { question: '有 50,000 名观众、平均码率 3 Mbps、峰值系数 1.3。忽略开销，峰值下行约多少？', options: ['150 Gbps', '195 Gbps', '65 Gbps'], answer: 'b' },
  { question: '峰值观众下行 200 Gbps，CDN 命中率从 99% 降到 95%。估算回源从多少增至多少？', options: ['2 Gbps 增至 10 Gbps', '20 Gbps 增至 100 Gbps', '198 Gbps 增至 190 Gbps'], answer: 'a' },
  { question: '为什么在源站前增加回源保护层，而不是让所有 CDN 节点直接打到媒体核心？', options: ['保护层可以替主播完成摄像头采集', '它能把所有视频自动变成 WebRTC', '聚合和隔离回源请求，避免缓存失效时冲击核心'], answer: 'c' },
  { question: '购买 CDN A 和 CDN B 后仍不能算真正多 CDN 容灾，最可能缺少什么？', options: ['更多不同颜色的域名', '独立故障域、健康探测、容量余量、调度与切换演练', '让两家 CDN 共用同一个唯一出口'], answer: 'b' },
  { question: 'CDN A 承担 70% 流量后发生区域故障，CDN B 只有 20% 额外余量。直接全切会有什么风险？', options: ['备用侧被压垮，把局部故障扩大为全局故障', '清晰度会自动提高', '源站将不再产生媒体数据'], answer: 'a' },
  { question: 'P2P 分担率达到 60%，为什么仍需要保留足额 CDN 兜底？', options: ['P2P 只能传字幕，不能传媒体', 'CDN 只用于修改编码 Profile', 'NAT、上传能力、在线邻居和运营商策略会让分担率随人群变化'], answer: 'c' },
  { question: '主、备推流地址虽然不同，却经过同一交换机和同一运营商出口。这种冗余的问题是什么？', options: ['地址不同已经足够，不存在问题', '共享故障点仍可能让两路同时中断', '会导致视频必然重复编码两次'], answer: 'b' },
  { question: '区域 CDN 5xx 上升，健康 CDN 仍有容量。合理的调度顺序是什么？', options: ['降低异常路径权重 → 逐步迁移 → 观察 QoE 与容量 → 再决定是否全切', '立即删除源流并等待缓存自行恢复', '只修改播放器音量后宣布恢复'], answer: 'a' },
  { question: '服务端请求 200 率为 99.99%，但用户仍投诉“点开要等 8 秒”。还缺哪类证据？', options: ['服务器机箱颜色和域名长度', '播放器首开时间、缓冲、解码与端到端 QoE', '主播昵称和直播封面点击率'], answer: 'b' },
  { question: '切换 CDN 后 5xx 已下降，但播放卡顿率仍高。为什么不能立即宣布恢复？', options: ['发布与观众体验尚未共同回到基线，可能仍有缓存、网络或播放器余波', '5xx 下降后任何体验指标都无意义', '只有主播端 CPU 能证明观众恢复'], answer: 'a' },
  { question: '为十万人单向赛事选择架构时，业务允许 8 秒延迟、要求广兼容和回看。哪种原则最合理？', options: ['无论需求都采用组件最多的 WebRTC 全链路', '优先用 HLS/多码率/CDN，并为回源和 CDN 故障设计必要冗余', '只让所有观众直接连接主播电脑'], answer: 'b' }
];
