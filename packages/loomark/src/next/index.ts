import { build } from '../build.js'
import type { BuildMode, BuildOptions } from '../types.js'
import { startWatcher } from '../watch.js'

/** A Next.js config object. */
export type NextConfig = Record<string, unknown>

/** Context Next.js passes to a config function. */
export type NextConfigContext<C extends object> = {
  defaultConfig?: C
}

/** A Next.js config function. */
export type NextConfigFactory<C extends object> = (
  phase: string,
  context: NextConfigContext<C>,
) => C | Promise<C>

const PHASE_DEVELOPMENT_SERVER = 'phase-development-server'
const PHASE_PRODUCTION_BUILD = 'phase-production-build'
const PHASE_PRODUCTION_SERVER = 'phase-production-server'

let started = false

/** Wraps a Next.js config to build content before Next.js starts and to rebuild it in development. */
export function withLoomark<C extends object>(
  nextConfig: C | NextConfigFactory<C>,
  options: BuildOptions = {},
): NextConfigFactory<C> {
  return async (phase: string, context: NextConfigContext<C>): Promise<C> => {
    await setup(phase, options)

    if (typeof nextConfig === 'function') {
      return nextConfig(phase, context)
    }

    return nextConfig
  }
}

async function setup(phase: string, options: BuildOptions): Promise<void> {
  if (started) return
  started = true

  if (phase === PHASE_PRODUCTION_SERVER) return

  const mode = options.mode ?? modeOf(phase)
  await build({ ...options, mode })

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    await startWatcher({ ...options, mode })
  }
}

function modeOf(phase: string): BuildMode | undefined {
  if (phase === PHASE_DEVELOPMENT_SERVER) return 'development'
  if (phase === PHASE_PRODUCTION_BUILD) return 'production'
  return undefined
}
