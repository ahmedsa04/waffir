import Image from "next/image";
import Waffir from "../../public/waffir-original-regular.svg";
export const Navbar = () => {
  return (
    <div className=" bg-transparent fixed top-0 z-50 p-1 px-10 ">
      <Image alt="waffir" src={Waffir} className=" w-28 h-28" />
    </div>
  );
};
