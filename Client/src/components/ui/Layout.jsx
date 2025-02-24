import {
    IconLogout2,
    IconMessage,
    IconSettings,
    IconUserBolt,
  } 
from "@tabler/icons-react";
import defaultImage from "../../assets/defaultUserImage.jpeg";
import {Link,Outlet } from "react-router-dom";
import {  useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import {useSelector} from "react-redux";
const links = [
    {
      label: "Chats",
      href: "/",
      icon: <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/update-profile",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconLogout2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { authUser } = useSelector((state) => state.auth);

  return (  
    <div className="h-screen w-screen overflow-auto">
      <div className="flex flex-1 h-screen">
        {/* Sidebar with Navigation */}
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <Logo />
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: `${authUser.fullName}`,
                  href: "#",
                  icon: (
                    <img
                      src={authUser.profileImage || defaultImage}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
    );
  }




export const Logo = () => {
    return (
      <Link to="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-6 w-6 flex-shrink-0">
          <img src="/Icon.svg" alt="Logo" className="w-5 h-5" />
        </div>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-xl text-black dark:text-white whitespace-pre">
          Converse
        </motion.span>
      </Link>
    );
  };
  
  export const LogoIcon = () => {
    return (
      <Link to="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      </Link>
    );
  };