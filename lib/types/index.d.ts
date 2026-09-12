/**
 * dsh-chime-alerts 宿主端类型声明（对应 lib/index.js）。
 *
 * 宿主半职责（与动态插件 lib/host.js 同一份逻辑）：
 * - 监听 agent/status（完成/打断/子任务）、session/event（授权）、
 *   goal/changed（目标受阻）、tools/execute（提问/计划评审）、
 *   tools/result（插件授权）、jobs.onJobDone（后台任务完成/失败）；
 * - 记录事件缓冲供客户端拉取（动态桥走 harness，静态安装走
 *   /dsh-chime-alerts/events），并按需触发系统蜂鸣（Windows wscript+WMP、
 *   Linux canberra-gtk-play/paplay、macOS afplay，经 subprocess 服务）。
 *
 * 静态安装是完整双端：宿主半 + lib/client.web.js（浏览器合成音、设置页、
 * 工作区静音）。
 */
import type { Context } from '@deepseek-ai/cordis'

/** loader 条目 / fiber 名。 */
export const name: 'dsh-chime-alerts'

/** Cordis 服务依赖：apply 内使用 ctx.timeout()。 */
export const inject: readonly ['timer']

/**
 * 静态宿主插件入口。Cordis loader 只识别顶层命名导出 `inject` / `apply`
 * （默认导出不会被读取，那会导致 inject 失效并报
 * "cannot get property 'timer' without inject"）。
 * @param ctx - Cordis 插件上下文。
 */
export function apply(ctx: Context): void
