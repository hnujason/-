import * as THREE from 'three'

// ====================
// 1. 创建基础场景
// ====================
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(8, 6, 12)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.style.margin = '0'
document.body.appendChild(renderer.domElement)

// ====================
// 2. 添加坐标轴
// ====================
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// ====================
// 3. 添加简单光照
// ====================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight)

// ====================
// 4. 定义拉莫尔回旋参数
// ====================
// 这里只做一个简单演示，不追求严格单位体系
const radius = 2.0          // 回旋半径
const omega = 1.5           // 角频率
const vz = 0.8              // 沿 z 方向前进速度
const totalTime = 20        // 轨迹总时长
const segments = 1000       // 轨迹分段数

// ====================
// 5. 生成螺旋轨迹
// ====================
const points = []

for (let i = 0; i <= segments; i++) {
  const t = (i / segments) * totalTime

  const x = radius * Math.cos(omega * t)
  const y = radius * Math.sin(omega * t)
  const z = vz * t - 8   // 往前平移一点，让轨迹居中

  points.push(new THREE.Vector3(x, y, z))
}

const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(points)
const trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff })
const trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial)
scene.add(trajectoryLine)

// ====================
// 6. 创建粒子小球
// ====================
const particleGeometry = new THREE.SphereGeometry(0.18, 32, 32)
const particleMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5533,
  emissive: 0x331100
})
const particle = new THREE.Mesh(particleGeometry, particleMaterial)
scene.add(particle)

// ====================
// 7. 添加磁场方向指示（沿 z 轴）
// ====================
const arrowDirection = new THREE.Vector3(0, 0, 1)
const arrowOrigin = new THREE.Vector3(0, 0, -8)
const arrowLength = 4
const arrowColor = 0x00ff00

const magneticFieldArrow = new THREE.ArrowHelper(
  arrowDirection,
  arrowOrigin,
  arrowLength,
  arrowColor
)
scene.add(magneticFieldArrow)

// ====================
// 8. 动画：让粒子沿螺旋轨迹运动
// ====================
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()

  const x = radius * Math.cos(omega * t)
  const y = radius * Math.sin(omega * t)
  const z = vz * t - 8

  particle.position.set(x, y, z)

  renderer.render(scene, camera)
}

animate()

// ====================
// 9. 自适应窗口大小
// ====================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
