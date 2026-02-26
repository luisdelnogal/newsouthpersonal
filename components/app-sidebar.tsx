'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  ArrowRightLeftIcon,
  CalendarCheckIcon,
  TagIcon,
  BellIcon,
  UsersIcon,
  LogOutIcon,
  DollarSignIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { signOut } from '@/app/auth/actions'

const navItems = [
  {
    label: 'Inicio',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Transacciones',
    href: '/dashboard/transacciones',
    icon: ArrowRightLeftIcon,
  },
  {
    label: 'Cierre Mensual',
    href: '/dashboard/cierre',
    icon: CalendarCheckIcon,
  },
]

const configItems = [
  {
    label: 'Categorias',
    href: '/dashboard/categorias',
    icon: TagIcon,
  },
  {
    label: 'Recordatorios',
    href: '/dashboard/recordatorios',
    icon: BellIcon,
  },
  {
    label: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: UsersIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <DollarSignIcon className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              CuentasClaras
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Control Financiero
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuracion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton
                type="submit"
                tooltip="Cerrar sesion"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                <LogOutIcon />
                <span>Cerrar sesion</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
