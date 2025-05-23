"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, ClipboardList, Database, Home, PenSquare } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sidebar className=" bg-[#000000] text-white">
      <SidebarHeader className="flex flex-col items-center justify-center py-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold">織憶光毯</h1>
        <p className="text-xs text-gray-400 mt-1">為長輩編織共鳴活動</p>
        <p className="text-xs text-gray-400">串聯溫馨記憶迴廊</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              className="hover:bg-[#c2e8f8] data-[active=true]:bg-[#75dfd3]"
            >
              <Link href="/">
                <Home />
                <span>主頁面</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/record")}
              className="hover:bg-[#c2e8f8] data-[active=true]:bg-[#75dfd3]"
            >
              <Link href="/record">
                <ClipboardList />
                <span>紀錄與評分</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/life-story")}
              className="hover:bg-[#c2e8f8] data-[active=true]:bg-[#75dfd3]"
            >
              <Link href="/life-story">
                <BookOpen />
                <span>生命故事書</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/elder-database")}
              className="hover:bg-[#c2e8f8] data-[active=true]:bg-[#75dfd3]"
            >
              <Link href="/elder-database">
                <Database />
                <span>長輩資料庫</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/activity-design")}
              className="hover:bg-[#c2e8f8] data-[active=true]:bg-[#75dfd3]"
            >
              <Link href="/activity-design">
                <PenSquare />
                <span>設計活動</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-sm text-gray-400 border-t border-blue-500">
        © 2025 織憶光毯
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
