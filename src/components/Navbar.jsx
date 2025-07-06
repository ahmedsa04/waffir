"use client";
import Image from "next/image";
import Waffir from "../../public/waffir-original-regular.svg";
import { RouteGenerate } from "./RouteGenerate";
import { RouteDatabase } from "./RouteDatabase";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className=" w-full flex justify-between bg-transparent fixed -top-4 z-10 p-1 px-20 ">
      <Image alt="waffir" src={Waffir} className=" w-28 h-28" />
      <div className=" flex gap-6">
        <RouteDatabase path={pathname} />
        <RouteGenerate path={pathname} />
      </div>
    </div>
  );
};
