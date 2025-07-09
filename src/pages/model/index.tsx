import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import { memo, useEffect, useRef } from 'react'

import { Environment, OrbitControls, PerspectiveCamera, Stage, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'

import DracoPath from '@/assets/draco'
import HdrWhite from '@/assets/hdr/potsdamer_platz_1k.hdr'
import RobotGlb from '@/assets/models/robot.glb'
import { useTitle } from '@/hooks/useTitle'

// 配置 Draco 解码器使用本地路径
const configureDracoLoader = () => {
  const dracoLoader = new DRACOLoader()
  // 使用本地 draco 解码器，避免从 CDN 加载
  dracoLoader.setDecoderPath(DracoPath)
  dracoLoader.preload()
  return dracoLoader
}

const SceneContent = memo(() => {
  const robotRef = useRef<any>(null)

  useEffect(() => {
    // 初始化 Draco 解码器配置
    configureDracoLoader()
  }, [])

  useFrame(() => {
    if (robotRef.current) {
      robotRef.current.rotation.y += 0.001
    }
  })

  return (
    <Stage environment={null} intensity={1}>
      {/* 加载本地HDR，动态控制并解决cdn加载报错问题 */}
      <Environment files={HdrWhite} />

      {/* 透视相机 */}
      <PerspectiveCamera makeDefault position={[1, 0, 0]} />

      {/* 控制：限制远近缩放度 */}
      <OrbitControls minDistance={1} maxDistance={10} />

      <group>
        {/* 自动旋转 */}
        <mesh ref={robotRef}>
          <RobotModel />
        </mesh>
      </group>
    </Stage>
  )
})

type Props = {
  title?: string
}
export const ModelPage: React.FC<Props> = props => {
  if (props.title) {
    useTitle(props.title)
  }

  return (
    <div className="model-container w-full h-[calc(100vh-46px)] relative">
      <Canvas frameloop="always" shadows className="w-full h-full">
        <SceneContent />
      </Canvas>
      {/* 移动端提示 */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/50 text-white p-2 sm:p-3 rounded text-xs sm:text-sm backdrop-blur-sm">
        <p className="hidden sm:block">拖拽旋转 • 滚轮缩放</p>
        <p className="sm:hidden">触摸旋转 • 双指缩放</p>
      </div>
    </div>
  )
}

useGLTF.preload(RobotGlb)
const RobotModel = (props: any) => {
  const { nodes, materials } = useGLTF(RobotGlb) as any

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['tripo_node_3790c885-dbc6-460a-9d3e-164d49b632ff'].geometry}
        material={materials['tripo_material_3790c885-dbc6-460a-9d3e-164d49b632ff']}
      />
    </group>
  )
}

export default ModelPage
