import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import NavGroup from "./NavGroup";
import getLoginStatusAsBusiness from "services/getLoginStatusAsBusiness";
import dashboard from "../../../../menu-items/dashboard";
import pages from "../../../../menu-items/pages";
import other from "../../../../menu-items/other";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const [menuItems, setMenuItems] = useState(null);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        await getLoginStatusAsBusiness();
        setMenuItems([dashboard, pages, other]);
      } catch (error) {
        console.error("Error fetching login status:", error);
        // Return default menu items in case of an error
        setMenuItems([dashboard, pages]);
      }
    }
    fetchMenuItems();
  }, []);

  if (!menuItems) return null;

  const navItems = menuItems.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
