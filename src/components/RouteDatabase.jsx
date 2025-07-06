import Link from "next/link";

export const RouteDatabase = ({ path }) => {
  return (
    <Link
      className={`group flex my-auto hover:cursor-pointer  p-1 px-3 rounded-xl border-[#116c39] ${
        path == "/database"
          ? "text-white bg-[#116c39] border-b-0"
          : "border-b text-[#116c39] bg-transparent hover:bg-[#116c39] hover:text-white"
      }`}
      href={"/database"}
      prefetch
    >
      <div>
        <h1 className={` font-mono text-xl `}>Database</h1>
      </div>
    </Link>
  );
};
