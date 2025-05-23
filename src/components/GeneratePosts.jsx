import Image from "next/image";
import FileIcon from "../../public/file.svg";
import CalendarIcon from "../../public/calendar.svg";
import CheckIcon from "../../public/check.svg";
import * as XLSX from "xlsx";
import { useState } from "react";

export const GeneratePosts = ({
  onDataChange,
  items,
  onDateFromSet,
  onDateTillSet,
}) => {
  const [succeeded, setSucceded] = useState(false);
  const [fileName, setFileName] = useState(null);

  function openFile(file, name) {
    var fileF = file.arrayBuffer();
    fileF.then((e) => {
      const workbook = XLSX.read(e, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      onDataChange(jsonData.slice(1, jsonData.length - 1));
      setSucceded(true);
      setFileName(name);
    });
  }
  return (
    <div>
      <h1 className=" w-full lightText text-center text-2xl font-medium pb-4">
        Generate Posts
      </h1>

      <h1 className=" w-full grayText text-start text-lg font-medium py-2">
        Insert a file with the discounted product details{" "}
      </h1>
      <label
        htmlFor="file"
        className=" flex max-w-32 h-fit darkBG rounded-xl cursor-pointer lightText text-lg  "
      >
        <h1 className="darkBG p-2 text-xl px-6 pr-12 rounded-2xl w-fit lightText font-light">
          Insert
        </h1>
        <Image
          src={FileIcon}
          alt="file"
          className=" w-7 h-7 -ml-10 my-auto mx-auto"
        />
        {succeeded && (
          <div className=" mx-10 my-auto  flex w-fit h-fit">
            <h1 className=" grayText text-lg underline cursor-pointer font-light whitespace-nowrap">
              {fileName}
            </h1>
            <Image src={CheckIcon} alt="Check" className=" w-7 h-7 mx-3" />
          </div>
        )}
        <input
          type="file"
          id="file"
          hidden
          content="Insert"
          className=""
          onChange={(e) => {
            openFile(e.target.files[0], e.target.files[0].name);
          }}
        />
      </label>

      <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
        Set discount period From - Untill
      </h1>
      <div className=" w-full flex ">
        <label className=" relative max-w-32 h-fit darkBG rounded-xl cursor-pointer lightText text-lg  ">
          <input
            type="date"
            id="date"
            onChange={(e) => {
              onDateFromSet(e.target.value);
            }}
            className=" rounded-2xl darkBG p-3 lightText text-xl scheme-dark"
          />
          <Image
            src={CalendarIcon}
            alt="cal"
            className=" pointer-events-none w-6 h-6 absolute top-3 left-40 -ml-3  "
          />
        </label>
        <h1 className=" text-2xl my-auto ml-20 rounded-xl w-fit lightText font-light">
          until
        </h1>
        <label className=" mx-6 relative max-w-32 h-fit darkBG rounded-xl cursor-pointer lightText text-lg  ">
          <input
            type="date"
            id="date"
            onChange={(e) => {
              onDateTillSet(e.target.value);
            }}
            className=" rounded-2xl darkBG p-3 lightText text-xl scheme-dark"
          />
          <Image
            src={CalendarIcon}
            alt="cal"
            className=" pointer-events-none w-6 h-6 absolute top-3 left-40 -ml-3  "
          />
        </label>
      </div>

      <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
        Choose products category for current page Set discount period From -
        Untill
      </h1>
      <select className=" max-w-48 hover:bg-neutral-500 h-13 darkBG rounded-2xl cursor-pointer lightText text-lg p-2  ">
        <option className=" darkBG p-3 lightText text-xl scheme-dark">
          Categories
        </option>
        {items &&
          items.map((item, idx) => (
            <option
              key={idx}
              className=" darkBG p-3 lightText text-xl scheme-dark"
            >
              {item.category}
            </option>
          ))}
      </select>

      <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
        Add the desired products
      </h1>
      <div className=" max-w-[70%] h-fit flex flex-wrap gap-2">
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          Product 12
        </h1>
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          {" "}
          sdsd asd{" "}
        </h1>
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          Producta asdsw
        </h1>
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          Product
        </h1>
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          Pro21 sdasad
        </h1>
        <h1 className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3">
          Product 121sasd
        </h1>
      </div>
    </div>
  );
};
