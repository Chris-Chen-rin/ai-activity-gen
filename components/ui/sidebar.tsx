"use client"

import type React from "react"
import clsx from "clsx"

export function Sidebar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={clsx(
        "flex flex-col fixed left-0 top-0 h-screen z-50 w-48 bg-black border-r border-gray-200", // 預設樣式
        className, // 外部可覆蓋
      )}
    >
      {children}
    </div>
  )
}

// 子元件：Header
export function SidebarHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={clsx("p-4", className)}>{children}</div>
}

// 子元件：內容區
export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={clsx("flex-1 overflow-y-auto", className)}>{children}</div>
}

// 子元件：底部
export function SidebarFooter({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={clsx("p-4", className)}>{children}</div>
}

// 子元件：導覽列（選單容器）
export function SidebarMenu({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <nav className={clsx("space-y-1", className)}>{children}</nav>
}

// 子元件：單一選項
export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={clsx("", className)}>{children}</div>
}

// 子元件：按鈕
export function SidebarMenuButton({
  className,
  isActive,
  asChild,
  children,
}: {
  className?: string
  isActive?: boolean
  asChild?: boolean
  children: React.ReactNode
}) {
  const baseClass = "flex items-center px-4 py-2 text-sm font-medium rounded transition-colors"

  const activeClass = "bg-black/35 text-white"
  const inactiveClass = "text-gray-300 hover:bg-[#c2e8f8]"

  const finalClass = clsx(baseClass, isActive ? activeClass : inactiveClass, className)

  if (asChild) {
    return <div className={finalClass}>{children}</div>
  }

  return <button className={finalClass}>{children}</button>
}

// 可擴充用
export function SidebarRail() {
  return null // 保留擴充空間
}

import { createContext, useContext, useState } from "react"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>{children}</SidebarContext.Provider>
}

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
