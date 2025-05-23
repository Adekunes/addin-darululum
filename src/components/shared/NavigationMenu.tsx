
import { useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavItem } from "@/types/navigation";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationMenuProps {
  items: NavItem[];
}

export const NavigationMenu = ({ items }: NavigationMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const isNavItemActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.href && !location.search;
    }
    
    if (item.href.includes('?tab=')) {
      const [path, search] = item.href.split('?');
      return location.pathname === path && location.search.includes(search);
    }
    
    return location.pathname === item.href;
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    // On mobile, dispatch event to close the sidebar after navigation
    if (isMobile) {
      const event = new CustomEvent('navigate-mobile');
      window.dispatchEvent(event);
    }
  };

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const isActive = isNavItemActive(item);
          
        return (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton 
              isActive={isActive}
              onClick={() => handleNavigation(item.href)}
              tooltip={!isMobile ? item.description : undefined}
              className={`transition-all duration-200 hover:bg-white/10 py-3 sm:py-3
                ${isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 min-w-5" />
              <span className="text-xs sm:text-sm font-medium truncate">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
