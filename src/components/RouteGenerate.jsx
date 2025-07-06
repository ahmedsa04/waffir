import Link from "next/link";

export const RouteGenerate = ({ path }) => {
  return (
    <Link
      className={`group my-auto hover:cursor-pointer  p-1 px-3 rounded-xl border-[#116c39] ${
        path == "/"
          ? "text-white bg-[#116c39] border-b-0"
          : "border-b text-[#116c39] bg-transparent hover:bg-[#116c39] hover:text-white"
      }`}
      href={"/"}
      prefetch
    >
      <div className="flex">
        <h1 className={` font-mono text-xl `}>Generate</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={path == "/" ? "#ffffff" : "#116c39"}
          className={`${
            path != "/"
              ? "group-hover:fill-white"
              : "group-hover:fill-[#116c39]"
          } my-auto`}
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </div>
    </Link>
  );
};
