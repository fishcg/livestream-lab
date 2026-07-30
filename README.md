# LiveLab · 直播技术速通实验室

LiveLab 是一个面向直播技术初学者的交互式学习网站。课程围绕推流、处理、分发、播放和故障排查展开，用旅行故事、动态图解和可操作实验，把抽象的直播术语放进一条完整链路中理解。

## 线上体验

[进入 LiveLab · 直播技术速通实验室](https://livelab.acgay.cn)

建议使用桌面端浏览器访问，以获得完整的悬停放大、动态图解和交互实验体验。

## 课程内容

课程分为五个阶段，每个阶段遵循“先教、再练、后考”的结构，并通过 15 道题完成阶段验收。

| 阶段 | 主题 | 主要内容 |
| --- | --- | --- |
| 01 | 信号是怎么跑的 | 像素、分辨率、FPS、编码、封装、PTS/DTS、GOP、延迟与抖动 |
| 02 | 把画面推上去 | 从主播开播出发，经过 OBS、FFmpeg、RTMP 和 SRS 完成推流旅行 |
| 03 | 让观众看得到 | HLS、HTTP-FLV、WebRTC、播放器、CDN、P2P、缓冲与协议选择 |
| 04 | 卡了，从哪儿查 | 延迟、卡顿、网络抖动、丢包、解码过载、音画同步与指标诊断 |
| 05 | 搭一条真实链路 | 转码档位、分发架构、容量、容灾、可观测性和端到端链路搭建 |

## 主要特点

- 图文结合的术语解释，并为名词配套统一风格的记忆图片和动态图解。
- 以主播侧和观众侧的完整旅行为主线，串联直播链路上的角色与技术。
- 包含码率、GOP、协议选择、故障诊断、音画同步和真实链路搭建等互动实验。
- 每阶段提供 15 道验收题，答题结果和课程完成状态即时反馈。
- 学习进度保存在浏览器 `localStorage` 中，可随时继续或重置。
- 支持桌面端和移动端布局，并尊重系统的“减少动态效果”设置。

## 本地运行

项目不依赖前端打包工具，安装 Node.js 18 或更高版本后即可启动。

```bash
git clone https://github.com/fishcg/livestream-lab.git
cd livestream-lab
node server.mjs
```

打开 [http://127.0.0.1:4173](http://127.0.0.1:4173) 即可访问。

服务默认监听 `0.0.0.0:4173`，同一局域网中的设备也可以通过运行机器的局域网 IP 访问。

## Docker

```bash
docker build -t livestream-lab:local .
docker run --rm -p 4173:4173 livestream-lab:local
```

容器以非 root 用户运行，并配置了 HTTP 健康检查。

## 项目结构

```text
livestream-lab/
├── index.html                 # 页面结构与五阶段课程入口
├── server.mjs                 # 轻量静态文件服务器
├── src/
│   ├── css/app.css            # 全站样式、响应式布局和动画
│   └── js/
│       ├── app.js             # 应用初始化入口
│       ├── core/              # DOM、导航、进度、存储、图标等公共能力
│       ├── data/              # 课程、题目、术语和真实链路数据
│       └── stages/            # 按阶段拆分的教学与互动模块
├── Dockerfile                 # 容器镜像配置
├── k8s.yaml                   # K3s Service 与 Deployment
└── .woodpecker.yml            # 镜像构建及 K3s 更新流水线
```

新增课程内容时，教学数据放在 `src/js/data/`，交互逻辑按阶段放在 `src/js/stages/`；跨阶段复用的能力统一放在 `src/js/core/`，避免把业务逻辑堆积在页面入口中。

## 部署配置

仓库包含以下部署文件：

- `Dockerfile`：构建运行于 `4173` 端口的应用镜像。
- `k8s.yaml`：创建 K3s Deployment 和 NodePort Service。
- `.woodpecker.yml`：在 push 或 tag 事件中构建镜像、推送到内网 Registry，并更新 K3s Deployment。

生产环境的域名、反向代理、Registry、Kubeconfig 和凭据应由部署环境管理，不应提交到仓库。
