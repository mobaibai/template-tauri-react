import React, { Suspense } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import { Loading } from '@/components/Loading'
import RouteTransition from '@/components/RouteTransition'

import { RouteItems, type RouteType } from './config'

const RouterViews = (routerItems: RouteType[]) => {
  if (routerItems && routerItems.length) {
    return routerItems.map(({ name = '', path, Skeleton, Element, children, redirect }) => {
      // 判断是否为 start-loading 路径，如果是则不使用动画
      const isStartLoading = path === '/start-loading'

      const elementContent = (
        <Suspense fallback={!Skeleton ? <Loading /> : <Skeleton />}>
          <Element title={name} />
        </Suspense>
      )

      const wrappedElement = isStartLoading ? (
        elementContent
      ) : (
        <RouteTransition>{elementContent}</RouteTransition>
      )

      return children && children.length ? (
        <Route path={path} key={path} element={wrappedElement}>
          {RouterViews(children)}
          {/* 只在明确指定了 redirect 的情况下才添加 Navigate */}
          {redirect && <Route index element={<Navigate to={redirect} replace />} />}
        </Route>
      ) : (
        <Route key={path} path={path} element={wrappedElement} />
      )
    })
  }
}

const RouterContainer = () => {
  return <Routes>{RouterViews(RouteItems)}</Routes>
}

export default React.memo(RouterContainer)
