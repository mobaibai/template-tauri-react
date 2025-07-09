import React, { useState } from 'react'

import { Button, Card, Col, Row, Space, Tabs } from 'antd'

import type { AnimationStep } from './AnimationSequence'
import {
  AnimationContainer,
  AnimationOpacity,
  AnimationRotate,
  AnimationScale,
  AnimationSequence,
  AnimationSlide,
  AnimationSpring,
} from './index'
import { attentionAnimations, entranceAnimations, sequenceAnimations } from './presets'

/**
 * 动画组件使用示例
 * 展示各种动画效果的用法
 */
export const AnimationExamples: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const resetAnimations = () => {
    setShowDemo(false)
    setTimeout(() => setShowDemo(true), 100)
  }

  const tabItems = [
    {
      key: 'basic',
      label: '基础动画',
      children: <BasicAnimationsDemo showAnimations={showDemo} />,
    },
    {
      key: 'advanced',
      label: '高级动画',
      children: <AdvancedAnimationsDemo showAnimations={showDemo} />,
    },
    {
      key: 'combinations',
      label: '组合动画',
      children: <CombinationAnimationsDemo showAnimations={showDemo} />,
    },
    {
      key: 'sequences',
      label: '序列动画',
      children: <SequenceAnimationsDemo showAnimations={showDemo} />,
    },
    {
      key: 'attention',
      label: '注意力动画',
      children: <AttentionAnimationsDemo showAnimations={showDemo} />,
    },
    {
      key: 'presets',
      label: '预设动画',
      children: <PresetsAnimationsDemo showAnimations={showDemo} />,
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          React Spring 动画组件库
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          基于 @react-spring/web 构建的高性能动画组件，支持多种动画效果和组合方式
        </p>

        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={resetAnimations}
            className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showDemo ? '重新播放动画' : '开始演示'}
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        centered
        className="custom-tabs"
      />
    </div>
  )
}

// 基础动画演示
const BasicAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 透明度动画 */}
          <AnimationSlide direction="slideInUp" distance={50} delay={200}>
            <Card title="透明度动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <AnimationOpacity fromOpacity={0} toOpacity={1} duration={1000} mode="linear">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center shadow-md">
                      <h4 className="font-semibold text-lg">线性淡入</h4>
                      <p className="text-sm mt-2 opacity-90">duration: 1000ms</p>
                    </div>
                  </AnimationOpacity>
                </Col>
                <Col xs={24} md={12}>
                  <AnimationOpacity
                    fromOpacity={0}
                    toOpacity={1}
                    mode="spring"
                    tension={280}
                    friction={60}
                    delay={500}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center shadow-md">
                      <h4 className="font-semibold text-lg">弹簧淡入</h4>
                      <p className="text-sm mt-2 opacity-90">tension: 280, friction: 60</p>
                    </div>
                  </AnimationOpacity>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>

          {/* 弹簧动画 */}
          <AnimationSlide direction="slideInLeft" distance={50} delay={600}>
            <Card title="弹簧动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {(['top', 'bottom', 'left', 'right'] as const).map((direction, index) => (
                  <Col xs={12} md={6} key={direction}>
                    <AnimationSpring
                      direction={direction}
                      distance={50}
                      tension={300}
                      friction={10}
                      delay={800 + index * 200}
                    >
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold">从{direction}滑入</h4>
                        <p className="text-xs mt-1 opacity-90">distance: 50px</p>
                      </div>
                    </AnimationSpring>
                  </Col>
                ))}
              </Row>
            </Card>
          </AnimationSlide>

          {/* 滑动动画 */}
          <AnimationSlide direction="slideInRight" distance={50} delay={1400}>
            <Card title="滑动动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {(['slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown'] as const).map(
                  (direction, index) => (
                    <Col xs={12} md={6} key={direction}>
                      <AnimationSlide
                        direction={direction}
                        distance={60}
                        duration={800}
                        delay={1600 + index * 150}
                      >
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold text-sm">{direction}</h4>
                          <p className="text-xs mt-1 opacity-90">duration: 800ms</p>
                        </div>
                      </AnimationSlide>
                    </Col>
                  )
                )}
              </Row>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

// 高级动画演示
const AdvancedAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 缩放动画 */}
          <AnimationSlide direction="slideInUp" distance={50} delay={200}>
            <Card title="缩放动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {(['scaleIn', 'pulse', 'bounce'] as const).map((scaleType, index) => (
                  <Col xs={12} md={8} key={scaleType}>
                    <AnimationScale
                      type={scaleType}
                      fromScale={scaleType === 'scaleIn' ? 0 : 1}
                      toScale={scaleType === 'pulse' ? 1.1 : 1}
                      loop={scaleType !== 'scaleIn'}
                      delay={400 + index * 200}
                    >
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-lg">{scaleType}</h4>
                        <p className="text-xs mt-2 opacity-90">
                          {scaleType === 'scaleIn'
                            ? '缩放入场'
                            : scaleType === 'pulse'
                              ? '脉冲效果'
                              : '弹跳效果'}
                        </p>
                      </div>
                    </AnimationScale>
                  </Col>
                ))}
              </Row>
            </Card>
          </AnimationSlide>

          {/* 旋转动画 */}
          <AnimationSlide direction="slideInLeft" distance={50} delay={1000}>
            <Card title="旋转动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {(['rotateIn', 'spin', 'flip'] as const).map((rotateType, index) => (
                  <Col xs={12} md={8} key={rotateType}>
                    <AnimationRotate
                      type={rotateType}
                      fromRotate={rotateType === 'rotateIn' ? -180 : 0}
                      toRotate={rotateType === 'spin' ? 360 : 0}
                      loop={rotateType === 'spin'}
                      delay={1200 + index * 300}
                    >
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-lg">{rotateType}</h4>
                        <p className="text-xs mt-2 opacity-90">
                          {rotateType === 'rotateIn'
                            ? '旋转入场'
                            : rotateType === 'spin'
                              ? '持续旋转'
                              : '翻转效果'}
                        </p>
                      </div>
                    </AnimationRotate>
                  </Col>
                ))}
              </Row>
            </Card>
          </AnimationSlide>

          {/* 复杂动画组合 */}
          <AnimationSlide direction="slideInRight" distance={50} delay={2100}>
            <Card title="复杂动画效果" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0, toOpacity: 1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'scaleIn', fromScale: 0.3, toScale: 1 },
                      },
                      {
                        type: 'rotate',
                        config: {
                          type: 'rotateIn',
                          fromRotate: -360,
                          toRotate: 0,
                        },
                      },
                    ]}
                    mode="parallel"
                    delay={2300}
                  >
                    <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white p-6 rounded-xl text-center shadow-lg">
                      <h4 className="font-semibold text-lg">炫酷入场</h4>
                      <p className="text-sm mt-2 opacity-90">淡入+缩放+旋转</p>
                    </div>
                  </AnimationContainer>
                </Col>
                <Col xs={24} md={8}>
                  <AnimationSequence
                    steps={[
                      {
                        name: 'prepare',
                        to: { opacity: 0, scale: 0, rotateZ: -180 },
                        config: { duration: 0 },
                      },
                      {
                        name: 'fadeIn',
                        to: { opacity: 1 },
                        config: { tension: 280, friction: 60 },
                        delay: 100,
                      },
                      {
                        name: 'scaleUp',
                        to: { scale: 1.2 },
                        config: { tension: 300, friction: 10 },
                        delay: 200,
                      },
                      {
                        name: 'rotate',
                        to: { rotateZ: 0 },
                        config: { tension: 200, friction: 8 },
                        delay: 150,
                      },
                      {
                        name: 'settle',
                        to: { scale: 1 },
                        config: { tension: 250, friction: 12 },
                        delay: 100,
                      },
                    ]}
                    globalDelay={2600}
                  >
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white p-6 rounded-xl text-center shadow-lg">
                      <h4 className="font-semibold text-lg">序列动画</h4>
                      <p className="text-sm mt-2 opacity-90">多步骤组合</p>
                    </div>
                  </AnimationSequence>
                </Col>
                <Col xs={24} md={8}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'spring',
                        config: { direction: 'bottom', distance: 100 },
                      },
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0, toOpacity: 1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'bounce', fromScale: 0.5, toScale: 1 },
                      },
                    ]}
                    mode="sequence"
                    delay={3000}
                  >
                    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white p-6 rounded-xl text-center shadow-lg">
                      <h4 className="font-semibold text-lg">顺序动画</h4>
                      <p className="text-sm mt-2 opacity-90">逐步执行</p>
                    </div>
                  </AnimationContainer>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

// 组合动画演示
const CombinationAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 并行组合动画 */}
          <AnimationSlide direction="slideInUp" distance={50} delay={200}>
            <Card title="并行组合动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0, toOpacity: 1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'scaleIn', fromScale: 0.5, toScale: 1 },
                      },
                      {
                        type: 'rotate',
                        config: {
                          type: 'rotateIn',
                          fromRotate: -90,
                          toRotate: 0,
                        },
                      },
                    ]}
                    mode="parallel"
                    delay={400}
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-6 rounded-lg text-center shadow-lg">
                      <h4 className="font-semibold text-lg">并行组合动画</h4>
                      <p className="text-sm mt-2 opacity-90">淡入 + 缩放 + 旋转</p>
                    </div>
                  </AnimationContainer>
                </Col>
                <Col xs={24} md={12}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'spring',
                        config: { direction: 'left', distance: 50 },
                      },
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0, toOpacity: 1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'bounce', fromScale: 0.3, toScale: 1 },
                      },
                    ]}
                    mode="parallel"
                    delay={800}
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg text-center shadow-lg">
                      <h4 className="font-semibold text-lg">复合并行动画</h4>
                      <p className="text-sm mt-2 opacity-90">滑入 + 淡入 + 弹跳</p>
                    </div>
                  </AnimationContainer>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>

          {/* 顺序组合动画 */}
          <AnimationSlide direction="slideInLeft" distance={50} delay={1200}>
            <Card title="顺序组合动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'spring',
                        config: { direction: 'top', distance: 30 },
                      },
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0, toOpacity: 1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'bounce', fromScale: 0.8, toScale: 1 },
                      },
                    ]}
                    mode="sequence"
                    delay={1400}
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-lg text-center shadow-lg">
                      <h4 className="font-semibold text-lg">顺序组合动画</h4>
                      <p className="text-sm mt-2 opacity-90">滑入 → 淡入 → 弹跳</p>
                    </div>
                  </AnimationContainer>
                </Col>
                <Col xs={24} md={12}>
                  <AnimationContainer
                    effects={[
                      {
                        type: 'rotate',
                        config: {
                          type: 'rotateIn',
                          fromRotate: 180,
                          toRotate: 0,
                        },
                      },
                      {
                        type: 'scale',
                        config: { type: 'scaleIn', fromScale: 0, toScale: 1.1 },
                      },
                      {
                        type: 'scale',
                        config: { type: 'scaleIn', fromScale: 1.1, toScale: 1 },
                      },
                      {
                        type: 'opacity',
                        config: { fromOpacity: 0.5, toOpacity: 1 },
                      },
                    ]}
                    mode="sequence"
                    delay={2000}
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg text-center shadow-lg">
                      <h4 className="font-semibold text-lg">多步顺序动画</h4>
                      <p className="text-sm mt-2 opacity-90">旋转 → 放大 → 缩小 → 显现</p>
                    </div>
                  </AnimationContainer>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

// 序列动画演示
const SequenceAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  const customSequence: AnimationStep[] = [
    {
      name: 'prepare',
      to: { opacity: 0, scale: 0.5, y: -50 },
      config: { duration: 0 },
    },
    {
      name: 'fadeIn',
      to: { opacity: 1 },
      config: { tension: 280, friction: 60 },
      delay: 200,
    },
    {
      name: 'slideDown',
      to: { y: 0 },
      config: { tension: 300, friction: 10 },
      delay: 300,
    },
    {
      name: 'scaleUp',
      to: { scale: 1 },
      config: { tension: 200, friction: 8 },
      delay: 200,
    },
  ]

  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 基础序列动画 */}
          <AnimationSlide direction="slideInUp" distance={50} delay={200}>
            <Card title="序列动画示例" className="shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 预设序列 */}
                <AnimationSequence
                  steps={sequenceAnimations.bounceEntrance}
                  loop={false}
                  globalDelay={400}
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg text-center shadow-lg">
                    <h4 className="font-semibold text-lg">预设弹跳入场</h4>
                    <p className="text-sm mt-2 opacity-90">使用预设动画序列</p>
                  </div>
                </AnimationSequence>

                {/* 自定义序列 */}
                <AnimationSequence steps={customSequence} loop={false} globalDelay={800}>
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg text-center shadow-lg">
                    <h4 className="font-semibold text-lg">自定义序列</h4>
                    <p className="text-sm mt-2 opacity-90">淡入 → 滑下 → 缩放</p>
                  </div>
                </AnimationSequence>
              </div>
            </Card>
          </AnimationSlide>

          {/* 复杂序列动画 */}
          <AnimationSlide direction="slideInLeft" distance={50} delay={1200}>
            <Card title="复杂序列动画" className="shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(index => {
                  const complexSequence: AnimationStep[] = [
                    {
                      name: 'prepare',
                      to: { opacity: 0, scale: 0, rotateZ: -180 },
                      config: { duration: 0 },
                    },
                    {
                      name: 'fadeIn',
                      to: { opacity: 1 },
                      config: { tension: 280, friction: 60 },
                      delay: 100,
                    },
                    {
                      name: 'scaleUp',
                      to: { scale: 1.2 },
                      config: { tension: 300, friction: 10 },
                      delay: 200,
                    },
                    {
                      name: 'rotate',
                      to: { rotateZ: 0 },
                      config: { tension: 200, friction: 8 },
                      delay: 150,
                    },
                    {
                      name: 'settle',
                      to: { scale: 1 },
                      config: { tension: 250, friction: 12 },
                      delay: 100,
                    },
                  ]

                  return (
                    <AnimationSequence
                      key={index}
                      steps={complexSequence}
                      loop={false}
                      globalDelay={1400 + index * 300}
                    >
                      <div
                        className={`bg-gradient-to-br ${
                          index === 1
                            ? 'from-green-500 to-emerald-500'
                            : index === 2
                              ? 'from-blue-500 to-cyan-500'
                              : 'from-purple-500 to-pink-500'
                        } text-white p-6 rounded-lg text-center shadow-lg`}
                      >
                        <h4 className="font-semibold">序列 {index}</h4>
                        <p className="text-sm mt-2 opacity-90">多步骤动画</p>
                      </div>
                    </AnimationSequence>
                  )
                })}
              </div>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

// 注意力动画演示
const AttentionAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 基础注意力动画 */}
          <AnimationSlide direction="slideInDown" distance={50} delay={200}>
            <Card title="注意力动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <AnimationScale type="pulse" fromScale={1} toScale={1.3} loop={true} delay={400}>
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-semibold text-lg">脉冲动画</h4>
                      <p className="text-sm mt-2 opacity-90">心跳般的律动</p>
                    </div>
                  </AnimationScale>
                </Col>
                <Col xs={24} md={8}>
                  <AnimationSpring
                    direction="left"
                    distance={12}
                    tension={300}
                    friction={10}
                    delay={600}
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-semibold text-lg">摇摆动画</h4>
                      <p className="text-sm mt-2 opacity-90">左右摇摆提醒</p>
                    </div>
                  </AnimationSpring>
                </Col>
                <Col xs={24} md={8}>
                  <AnimationScale type="bounce" fromScale={1} toScale={1.2} loop={true} delay={800}>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-semibold text-lg">弹跳动画</h4>
                      <p className="text-sm mt-2 opacity-90">上下弹跳吸引</p>
                    </div>
                  </AnimationScale>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>

          {/* 高级注意力动画 */}
          <AnimationSlide direction="slideInRight" distance={50} delay={1000}>
            <Card title="高级注意力动画" className="shadow-lg">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <AnimationRotate
                    type="spin"
                    fromRotate={-15}
                    toRotate={15}
                    loop={true}
                    delay={1200}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-semibold text-lg">摆动动画</h4>
                      <p className="text-sm mt-2 opacity-90">复杂的摆动效果</p>
                      <div className="mt-4 text-xs opacity-75">强度: 15 | 时长: 1.5s</div>
                    </div>
                  </AnimationRotate>
                </Col>
                <Col xs={24} md={12}>
                  <AnimationOpacity
                    fromOpacity={0.3}
                    toOpacity={1}
                    mode="spring"
                    tension={200}
                    friction={10}
                    delay={1400}
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-semibold text-lg">闪烁动画</h4>
                      <p className="text-sm mt-2 opacity-90">透明度闪烁效果</p>
                      <div className="mt-4 text-xs opacity-75">强度: 0.3 | 时长: 2s</div>
                    </div>
                  </AnimationOpacity>
                </Col>
              </Row>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

// 预设动画演示
const PresetsAnimationsDemo: React.FC<{ showAnimations: boolean }> = ({ showAnimations }) => {
  return (
    <div className="space-y-6">
      {showAnimations && (
        <>
          {/* 入场动画预设 */}
          <AnimationSlide direction="slideInUp" distance={50} delay={200}>
            <Card title="入场动画预设" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {Object.entries(entranceAnimations)
                  .slice(0, 6)
                  .map(([name, config], index) => {
                    // 处理单个效果或效果数组，确保类型正确
                    const effects: import('./AnimationContainer').AnimationEffect[] = Array.isArray(
                      config
                    )
                      ? (config as import('./AnimationContainer').AnimationEffect[])
                      : [config as import('./AnimationContainer').AnimationEffect]
                    return (
                      <Col xs={12} md={8} key={name}>
                        <AnimationContainer
                          effects={effects}
                          mode="parallel"
                          delay={400 + index * 200}
                          autoStart={true}
                          globalDelay={0}
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-sm">{name}</h4>
                            <p className="text-xs mt-1 opacity-90">入场动画</p>
                          </div>
                        </AnimationContainer>
                      </Col>
                    )
                  })}
              </Row>
            </Card>
          </AnimationSlide>

          {/* 注意力动画预设 */}
          <AnimationSlide direction="slideInLeft" distance={50} delay={1600}>
            <Card title="注意力动画预设" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {Object.entries(attentionAnimations)
                  .slice(0, 4)
                  .map(([name, config], index) => {
                    // 处理单个效果或效果数组，确保类型正确
                    const effects: import('./AnimationContainer').AnimationEffect[] = Array.isArray(
                      config
                    )
                      ? (config as import('./AnimationContainer').AnimationEffect[])
                      : [config as import('./AnimationContainer').AnimationEffect]
                    return (
                      <Col xs={12} md={6} key={name}>
                        <AnimationContainer
                          effects={effects}
                          mode="parallel"
                          delay={1800 + index * 300}
                          autoStart={true}
                          globalDelay={0}
                        >
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                            <h4 className="font-semibold text-sm">{name}</h4>
                            <p className="text-xs mt-1 opacity-90">注意力动画</p>
                          </div>
                        </AnimationContainer>
                      </Col>
                    )
                  })}
              </Row>
            </Card>
          </AnimationSlide>

          {/* 序列动画预设 */}
          <AnimationSlide direction="slideInRight" distance={50} delay={3000}>
            <Card title="序列动画预设" className="shadow-lg">
              <Row gutter={[16, 16]}>
                {Object.entries(sequenceAnimations).map(([name, steps], index) => (
                  <Col xs={24} md={8} key={name}>
                    <AnimationSequence steps={steps} loop={false} globalDelay={3200 + index * 400}>
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-sm mt-2 opacity-90">序列动画预设</p>
                        <div className="text-xs mt-2 opacity-75">{steps.length} 个步骤</div>
                      </div>
                    </AnimationSequence>
                  </Col>
                ))}
              </Row>
            </Card>
          </AnimationSlide>
        </>
      )}
    </div>
  )
}

export default AnimationExamples
