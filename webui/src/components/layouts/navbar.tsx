import {
  NavigationMenu,
  // NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.tsx";
import ToggleThemeButton from "@/components/theme/toggle-theme.tsx";

export const Navbar = () => {
  return (
    <div className="w-full flex flex-row justify-between p-3">
      <NavigationMenu viewport={false}>
        <NavigationMenuList></NavigationMenuList>
      </NavigationMenu>

      <div className="flex align-middle gap-2">
        <ToggleThemeButton />
      </div>
    </div>
  );
};
