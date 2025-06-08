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
    <div className="fixed left-0 top-0 h-screen w-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/sidebarbg.jpg)' }}>
      <div className="h-full w-full bg-black/40 backdrop-blur-lg">
        <Sidebar className="bg-transparent text-white">
          <SidebarHeader className="flex flex-col items-center justify-center py-4 border-b border-white/10">
            <h1 className="text-3xl font-bold">織憶光毯</h1>
            <p className="text-xs text-gray-300 mt-1">為長輩編織共鳴活動</p>
            <p className="text-xs text-gray-300">串聯溫馨記憶迴廊</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/")}
                  className="hover:bg-white/20 data-[active=true]:bg-white/30 w-full"
                >
                  <Link href="/" className="flex items-center gap-2 w-full">
                    <Home className="w-5 h-5" />
                    <span>主頁面</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/record")}
                  className="hover:bg-white/20 data-[active=true]:bg-white/30 w-full"
                >
                  <Link href="/record" className="flex items-center gap-2 w-full">
                    <ClipboardList className="w-5 h-5" />
                    <span>紀錄與評分</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/life-story")}
                  className="hover:bg-white/20 data-[active=true]:bg-white/30 w-full"
                >
                  <Link href="/life-story" className="flex items-center gap-2 w-full">
                    <BookOpen className="w-5 h-5" />
                    <span>生命故事書</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/elder-database")}
                  className="hover:bg-white/20 data-[active=true]:bg-white/30 w-full"
                >
                  <Link href="/elder-database" className="flex items-center gap-2 w-full">
                    <Database className="w-5 h-5" />
                    <span>長輩資料庫</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/activity-design")}
                  className="hover:bg-white/20 data-[active=true]:bg-white/30 w-full"
                >
                  <Link href="/activity-design" className="flex items-center gap-2 w-full">
                    <PenSquare className="w-5 h-5" />
                    <span>設計活動</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 text-center text-sm text-gray-300 border-t border-white/10">
            © 2025 織憶光毯
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      </div>
    </div>
  )
}
