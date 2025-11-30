"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  HorizontaLDots,
} from "../icons/index";

import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <CalenderIcon />, name: "Logs Analyzer", path: "/logs" },
  { icon: <ListIcon />, name: "PR Handler", path: "/pr-analyzer" },
  { icon: <UserCircleIcon />, name: "Chat with Alethea", path: "/chat" },

];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("alethea_access");
      localStorage.removeItem("alethea_github");
      localStorage.removeItem("alethea_github_repo");
    window.location.href = "/signin";
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            href={nav.path}
            className={`flex flex-row items-center gap-3 py-2 px-3 rounded-md transition-all  dark:text-gray-300
              ${isActive(nav.path) ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"} 
              ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
          >
            {nav.icon}
            {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("alethea_access");
    setToken(t);
  }, []);
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen || isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="dark:hidden">
                <div className="flex flex-row items-center justify-center">
                  <Image
                    src="/images/logo/alethea-logo-icon.png"
                    alt="Logo"
                    width={75}
                    height={40}
                  />
                  <div className="ml-2 text-black font-bold text-2xl tracking-widest">
                    ALETHEA
                  </div>
                </div>
              </div>

              <div className="hidden dark:block">
                <div className="flex flex-row items-center justify-center">
                  <Image
                    src="/images/logo/alethea-logo-icon.png"
                    alt="Logo"
                    width={75}
                    height={40}
                  />
                  <div className="ml-2 text-white font-bold text-2xl tracking-widest">
                    ALETHEA
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Image
              src="/images/logo/alethea-logo-icon.png"
              alt="Logo"
              width={50}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-y-80">
            {/* Menu Section */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems)}
            </div>

            {/* Logout Section */}
            {token && (
            <div>
              <div className="w-full">
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="w-full"
              >
                <div className="flex flex-row items-center justify-between bg-gray-100 dark:bg-gray-700 hover:bg-red-300 dark:hover:bg-red-400 dark:hover:text-white w-full px-3 py-2 rounded-md hover:transition">
                  <div className="flex items-center gap-3">
                    <svg
                      className="text-black dark:text-gray-300  dark:hover:text-white"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                        fill="currentColor"
                      />
                    </svg>

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <div className="text-md font-normal dark:text-gray-300 ">Log out</div>
                    )}
                  </div>

                  {/* Keep right-side empty for compact mode; preserve original behavior */}
                  {isExpanded || isHovered || isMobileOpen ? <div /> : null}
                </div>
              </button>
            </div>

            </div>)  
            }
          </div>
        </nav>

        {/* Sidebar Widget */}
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
