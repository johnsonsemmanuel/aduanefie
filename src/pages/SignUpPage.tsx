import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAuth } from '@/context/AuthContext'
import { GoogleButton, ArrowButton, Button } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

type Uniforms = {
  [key: string]: { value: number[] | number[][] | number; type: string }
}

interface ShaderProps {
  source: string
  uniforms: { [key: string]: { value: number[] | number[][] | number; type: string } }
}

function CanvasRevealEffect({
  animationSpeed = 10, opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]], containerClassName, dotSize, showGradient = true, reverse = false,
}: {
  animationSpeed?: number; opacities?: number[]; colors?: number[][]; containerClassName?: string; dotSize?: number; showGradient?: boolean; reverse?: boolean
}) {
  return (
    <div className={cn('h-full relative w-full', containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]} dotSize={dotSize ?? 3}
          opacities={opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]}
          shader={`${reverse ? 'u_reverse_active' : 'false'}_; animation_speed_factor_${animationSpeed.toFixed(1)}_;`}
          center={['x', 'y']}
        />
      </div>
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />}
    </div>
  )
}

interface DotMatrixProps {
  colors?: number[][]; opacities?: number[]; totalSize?: number; dotSize?: number; shader?: string; center?: ('x' | 'y')[]
}

function DotMatrix({ colors = [[0, 0, 0]], opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14], totalSize = 20, dotSize = 2, shader = '', center = ['x', 'y'] }: DotMatrixProps) {
  const uniforms = useMemo(() => {
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]
    if (colors.length === 2) colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
    else if (colors.length === 3) colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    return {
      u_colors: { value: colorsArray.map(c => [c[0] / 255, c[1] / 255, c[2] / 255]), type: 'uniform3fv' },
      u_opacities: { value: opacities, type: 'uniform1fv' },
      u_total_size: { value: totalSize, type: 'uniform1f' },
      u_dot_size: { value: dotSize, type: 'uniform1f' },
      u_reverse: { value: shader.includes('u_reverse_active') ? 1 : 0, type: 'uniform1i' },
    }
  }, [colors, opacities, totalSize, dotSize, shader])

  return (
    <Shader
      source={`precision mediump float; in vec2 fragCoord; uniform float u_time; uniform float u_opacities[10]; uniform vec3 u_colors[6]; uniform float u_total_size; uniform float u_dot_size; uniform vec2 u_resolution; uniform int u_reverse; out vec4 fragColor; float PHI = 1.61803398874989484820459; float random(vec2 xy) { return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x); } void main() { vec2 st = fragCoord.xy; ${center.includes('x') ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));' : ''} ${center.includes('y') ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));' : ''} float opacity = step(0.0, st.x); opacity *= step(0.0, st.y); vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size)); float frequency = 5.0; float show_offset = random(st2); float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency)); opacity *= u_opacities[int(rand * 10.0)]; opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size)); opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size)); vec3 color = u_colors[int(show_offset * 6.0)]; float animation_speed_factor = 0.5; vec2 center_grid = u_resolution / 2.0 / u_total_size; float dist_from_center = distance(center_grid, st2); float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15); float max_grid_dist = distance(center_grid, vec2(0.0, 0.0)); float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2); float current_timing_offset; if (u_reverse == 1) { current_timing_offset = timing_offset_outro; opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor); opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25); } else { current_timing_offset = timing_offset_intro; opacity *= step(current_timing_offset, u_time * animation_speed_factor); opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25); } fragColor = vec4(color, opacity); fragColor.rgb *= fragColor.a; }`}
      uniforms={uniforms}
    />
  )
}

function ShaderMaterial({ source, uniforms }: { source: string; uniforms: Uniforms }) {
  const { size } = useThree()
  const ref = useRef<THREE.Mesh>(null)
  const timerRef = useRef(new THREE.Timer())
  useFrame(() => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.ShaderMaterial | undefined
    if (!mat || !mat.uniforms) return
    const t = mat.uniforms.u_time
    if (!t) return
    timerRef.current.update()
    t.value = timerRef.current.getElapsed()
  })
  const preparedUniforms = useMemo(() => {
    const u: Record<string, { value: unknown; type: string }> = {}
    for (const name in uniforms) {
      const un = uniforms[name]
      if (un.type === 'uniform1f') u[name] = { value: un.value, type: '1f' }
      else if (un.type === 'uniform1i') u[name] = { value: un.value, type: '1i' }
      else if (un.type === 'uniform3f') u[name] = { value: new THREE.Vector3().fromArray(un.value as number[]), type: '3f' }
      else if (un.type === 'uniform1fv') u[name] = { value: un.value, type: '1fv' }
      else if (un.type === 'uniform3fv') u[name] = { value: (un.value as number[][]).map(v => new THREE.Vector3().fromArray(v)), type: '3fv' }
      else if (un.type === 'uniform2f') u[name] = { value: new THREE.Vector2().fromArray(un.value as number[]), type: '2f' }
    }
    u['u_time'] = { value: 0, type: '1f' }
    u['u_resolution'] = { value: new THREE.Vector2(size.width * 2, size.height * 2), type: '2f' }
    return u
  }, [size.width, size.height, source])
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `precision mediump float; in vec2 coordinates; uniform vec2 u_resolution; out vec2 fragCoord; void main(){ float x = position.x; float y = position.y; gl_Position = vec4(x, y, 0.0, 1.0); fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution; fragCoord.y = u_resolution.y - fragCoord.y; }`,
    fragmentShader: source, uniforms: preparedUniforms, glslVersion: THREE.GLSL3, blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
  }), [size.width, size.height, source])
  return <mesh ref={ref}><planeGeometry args={[2, 2]} /><primitive object={material} attach="material" /></mesh>
}

function ShaderFallback() {
  return <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
}

function Shader({ source, uniforms }: ShaderProps) {
  const [webglSupported, setWebglSupported] = useState(true)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      if (!c.getContext('webgl') && !c.getContext('webgl2')) setWebglSupported(false)
    } catch { setWebglSupported(false) }
  }, [])
  if (!webglSupported) return <ShaderFallback />
  return (
    <ErrorBoundary fallback={<ShaderFallback />}>
      <Canvas
        className="absolute inset-0 h-full w-full"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e: Event) => e.preventDefault())
        }}
      >
        <ShaderMaterial source={source} uniforms={uniforms} />
      </Canvas>
    </ErrorBoundary>
  )
}

export function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'signup' | 'success'>('signup')
  const [initialCanvasVisible] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) return
    const user = login(email.trim())
    if (user) {
      setStep('success')
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
    } else {
      setError('Account created! Try signing in.')
      setStep('success')
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    }
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative">
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect animationSpeed={3} containerClassName="bg-black" colors={[[255, 255, 255], [255, 255, 255]]} dotSize={6} reverse={false} />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full mt-[150px] max-w-sm px-4">
              <AnimatePresence mode="wait">
                {step === 'signup' ? (
                  <motion.div
                    key="signup-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Join AgriOS</h1>
                      <p className="text-[1.3rem] text-white/70 font-light">Create your account</p>
                    </div>

                    <div className="space-y-4">
                      <GoogleButton onClick={() => {}} />

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={e => { setName(e.target.value); setError('') }}
                            className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center"
                            required
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError('') }}
                            className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center pr-12"
                            required
                          />
                          <ArrowButton type="submit" />
                        </div>
                      </form>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">{error}</motion.p>
                    )}

                    <p className="text-sm text-white/40">
                      Already have an account?{' '}
                      <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="!text-white hover:underline">Sign in</Button>
                    </p>

                    <p className="text-xs text-white/40 pt-4">
                      By signing up, you agree to the{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60">Terms of Service</a> and{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60">Privacy Policy</a>.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Welcome aboard!</h1>
                      <p className="text-[1.25rem] text-white/50 font-light">Your account is ready</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
