import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAuth } from '@/context/AuthContext'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number
    type: string
  }
}

interface ShaderProps {
  source: string
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number
      type: string
    }
  }
}

function CanvasRevealEffect({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number
  opacities?: number[]
  colors?: number[][]
  containerClassName?: string
  dotSize?: number
  showGradient?: boolean
  reverse?: boolean
}) {
  return (
    <div className={cn('h-full relative w-full', containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]}
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={['x', 'y']}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  )
}

interface DotMatrixProps {
  colors?: number[][]
  opacities?: number[]
  totalSize?: number
  dotSize?: number
  shader?: string
  center?: ('x' | 'y')[]
}

function DotMatrix({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = '',
  center = ['x', 'y'],
}: DotMatrixProps) {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0], colors[0], colors[0], colors[0], colors[0], colors[0],
    ]
    if (colors.length === 2) {
      colorsArray = [
        colors[0], colors[0], colors[0], colors[1], colors[1], colors[1],
      ]
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0], colors[0], colors[1], colors[1], colors[2], colors[2],
      ]
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255, color[1] / 255, color[2] / 255,
        ]),
        type: 'uniform3fv',
      },
      u_opacities: {
        value: opacities,
        type: 'uniform1fv',
      },
      u_total_size: {
        value: totalSize,
        type: 'uniform1f',
      },
      u_dot_size: {
        value: dotSize,
        type: 'uniform1f',
      },
      u_reverse: {
        value: shader.includes('u_reverse_active') ? 1 : 0,
        type: 'uniform1i',
      },
    }
  }, [colors, opacities, totalSize, dotSize, shader])

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes('x')
                ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }
            ${
              center.includes('y')
                ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
    />
  )
}

function ShaderMaterial({
  source,
  uniforms,
}: {
  source: string
  hovered?: boolean
  uniforms: Uniforms
}) {
  const { size } = useThree()
  const ref = useRef<THREE.Mesh>(null)

  const timerRef = useRef(new THREE.Timer())

  useFrame(() => {
    if (!ref.current) return
    const mesh = ref.current
    const mat = mesh.material as THREE.ShaderMaterial | undefined
    if (!mat || !mat.uniforms) return
    const timeLocation = mat.uniforms.u_time
    if (!timeLocation) return
    timerRef.current.update()
    timeLocation.value = timerRef.current.getElapsed()
  })

  const getUniforms = () => {
    const preparedUniforms: Record<string, { value: unknown; type: string }> = {}

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName]
      if (!uniform || !uniform.type) continue

      const val = uniform.value
      if (val === undefined || val === null) continue

      switch (uniform.type) {
        case 'uniform1f':
          preparedUniforms[uniformName] = { value: val, type: '1f' }
          break
        case 'uniform1i':
          preparedUniforms[uniformName] = { value: val, type: '1i' }
          break
        case 'uniform3f':
          if (Array.isArray(val)) {
            preparedUniforms[uniformName] = {
              value: new THREE.Vector3().fromArray(val as number[]),
              type: '3f',
            }
          }
          break
        case 'uniform1fv':
          preparedUniforms[uniformName] = { value: val, type: '1fv' }
          break
        case 'uniform3fv':
          if (Array.isArray(val)) {
            preparedUniforms[uniformName] = {
              value: (val as number[][]).map((v: number[]) =>
                new THREE.Vector3().fromArray(v)
              ),
              type: '3fv',
            }
          }
          break
        case 'uniform2f':
          if (Array.isArray(val)) {
            preparedUniforms[uniformName] = {
              value: new THREE.Vector2().fromArray(val as number[]),
              type: '2f',
            }
          }
          break
      }
    }

    preparedUniforms['u_time'] = { value: 0, type: '1f' }
    const w = size?.width || 800
    const h = size?.height || 600
    preparedUniforms['u_resolution'] = {
      value: new THREE.Vector2(w * 2, h * 2),
      type: '2f',
    }
    return preparedUniforms
  }

  const material = useMemo(() => {
    const uniformsData = getUniforms()
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: [
        'precision mediump float;',
        'in vec2 coordinates;',
        'uniform vec2 u_resolution;',
        'out vec2 fragCoord;',
        'void main(){',
        '  float x = position.x;',
        '  float y = position.y;',
        '  gl_Position = vec4(x, y, 0.0, 1.0);',
        '  fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;',
        '  fragCoord.y = u_resolution.y - fragCoord.y;',
        '}',
      ].join('\n'),
      fragmentShader: source,
      uniforms: uniformsData,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    })
    return materialObject
  }, [size?.width, size?.height, source])

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

function ShaderFallback() {
  return (
    <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
  )
}

function Shader({ source, uniforms }: ShaderProps) {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) return <ShaderFallback />

  return (
    <ErrorBoundary fallback={<ShaderFallback />}>
      <Canvas
        className="absolute inset-0 h-full w-full"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e: Event) => {
            e.preventDefault()
          })
        }}
      >
        <ShaderMaterial source={source} uniforms={uniforms} />
      </Canvas>
    </ErrorBoundary>
  )
}

const demoAccounts = [
  { email: 'kofi@aduanefie.com', password: 'password123', label: 'Farmer' },
  { email: 'yaa@aduanefie.com', password: 'password123', label: 'Buyer' },
  { email: 'kwame@aduanefie.com', password: 'password123', label: 'Supplier' },
  { email: 'abena@aduanefie.com', password: 'password123', label: 'Logistics' },
  { email: 'admin@aduanefie.com', password: 'password123', label: 'Admin' },
]

export function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'email' | 'password' | 'success'>('email')
  const passwordRef = useRef<HTMLInputElement>(null)
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true)
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return
    setStep('password')
  }

  useEffect(() => {
    if (step === 'password') {
      setTimeout(() => passwordRef.current?.focus(), 500)
    }
  }, [step])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password.trim()) return
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      setReverseCanvasVisible(true)
      setTimeout(() => setInitialCanvasVisible(false), 50)
      setTimeout(() => {
        setStep('success')
        setSubmitting(false)
        setTimeout(() => {
          const redirect = searchParams.get('redirect') || '/dashboard'
          navigate(redirect, { replace: true })
        }, 2000)
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
      setSubmitting(false)
    }
  }

  const handleBackClick = () => {
    setStep('email')
    setPassword('')
    setReverseCanvasVisible(false)
    setInitialCanvasVisible(true)
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative">
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
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
                {step === 'email' ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Welcome to AgriOS</h1>
                      <p className="text-[1.3rem] text-white/70 font-light">Sign in to continue</p>
                    </div>

                    <div className="space-y-4">
                      <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign in with Google</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <form onSubmit={handleEmailSubmit}>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="info@gmail.com"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError('') }}
                            disabled={submitting}
                            className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center disabled:opacity-50"
                            required
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden disabled:opacity-50"
                          >
                            {submitting ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <span className="relative w-full h-full block overflow-hidden">
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">→</span>
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">→</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}

                    <div className="pt-4">
                      <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-2">Demo Accounts</p>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {demoAccounts.map((d) => (
                          <button
                            key={d.email}
                            onClick={() => { setEmail(d.email); setPassword(d.password); setError(''); setStep('password') }}
                            disabled={submitting}
                            className={`px-2.5 py-1 rounded-full border text-[10px] transition-colors disabled:opacity-50 ${
                              email === d.email
                                ? 'border-white/40 bg-white/10 text-white font-medium'
                                : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/40 pt-4">
                      By signing up, you agree to the{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">MSA</a>,{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Product Terms</a>,{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Policies</a>,{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</a>, and{' '}
                      <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</a>.
                    </p>
                  </motion.div>
                ) : step === 'password' ? (
                  <motion.div
                    key="password-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Enter your password</h1>
                      <p className="text-[1.25rem] text-white/50 font-light">{email}</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          ref={passwordRef}
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={e => { setPassword(e.target.value); setError('') }}
                          disabled={submitting}
                          className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center disabled:opacity-50"
                          required
                        />
                        <button
                          type="submit"
                          disabled={submitting || !password.trim()}
                          className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden disabled:opacity-50"
                        >
                          {submitting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <span className="relative w-full h-full block overflow-hidden">
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">→</span>
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">→</span>
                            </span>
                          )}
                        </button>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-400 text-sm"
                        >
                          {error}
                        </motion.p>
                      )}
                    </form>

                    <div className="flex w-full gap-3">
                      <motion.button
                        type="button"
                        onClick={handleBackClick}
                        className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Back
                      </motion.button>
                    </div>

                    <div className="pt-16">
                      <p className="text-xs text-white/40">
                        By signing up, you agree to the{' '}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">MSA</a>,{' '}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Product Terms</a>,{' '}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Policies</a>,{' '}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</a>, and{' '}
                        <a href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</a>.
                      </p>
                    </div>
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
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">You're in!</h1>
                      <p className="text-[1.25rem] text-white/50 font-light">Welcome to AgriOS</p>
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
