"use client";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
export const ProductDetails = ({
  image,
  title,
  metric,
  unit,
  barcode,
  category,
  setToggleEdit,
  toggleEdit,
  onImageChange,
  toggleAdd,
}) => {
  async function handleImageImport(e) {
    e.preventDefault();
    const file = e.target.files[0]; // e.g. from <input type="file" />
    const fileExt = file.name.split(".").pop();
    const fileName = `${barcode}.${fileExt}`;
    const filePath = `/products/${fileName}`;

    // Upload to bucket
    const { data, error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    onImageChange(publicData.publicUrl);
  }
  return (
    <div className="w-[424px] h-full mx-auto">
      {!image ? (
        !toggleAdd && !toggleEdit ? (
          <div className=" relative w-full h-[424px] bg-neutral-800 "></div>
        ) : (
          <div className=" relative w-full h-[424px] bg-neutral-800 ">
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="196px"
                viewBox="0 -960 960 960"
                width="196px"
                fill="#696969"
                className=" mx-auto"
              >
                <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
              </svg>
              <div className=" flex justify-center">
                <h1 className=" px-1 grayText font-medium text-xl inline-block cursor-default">
                  Insert image
                </h1>
                <div className=" inline-block">
                  <label className="text-[#116c39] font-medium text-xl cursor-pointer hover:underline">
                    here
                    <input
                      onChange={(e) => {
                        handleImageImport(e);
                      }}
                      hidden
                      type="file"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <img
          alt=""
          src={image}
          width={20}
          height={20}
          className=" w-[460px] h-[460px] object-cover content-center mx-auto"
        />
      )}
      {toggleEdit && (
        <div className="flex justify-center">
          <label className="text-[#116c39] font-medium text-lg cursor-pointer hover:underline">
            Change image
            <input
              onChange={(e) => {
                handleImageImport(e);
              }}
              hidden
              type="file"
            />
          </label>
        </div>
      )}
      <div className="flex justify-between w-full">
        <div className=" flex wrap-anywhere">
          <h1 className=" mt-3 grayText text-2xl font-bold text-nowrap">
            Title :
          </h1>
          <p className=" mx-1 mt-3 lightText text-2xl max-w-70">{title}</p>
        </div>

        <h1 className=" text-end mt-3 lightText text-2xl font-medium text-nowrap">
          {unit && metric ? `${metric} ${unit}` : "-- --"}
        </h1>
      </div>
      <div className=" flex">
        <h1 className=" mt-3 grayText text-2xl font-bold">Barcode :</h1>
        <h1 className=" mx-1 mt-3 lightText text-2xl font-medium">{barcode}</h1>
      </div>
      <div className="flex justify-between w-full">
        <div className=" flex">
          <h1 className=" mt-3 grayText text-2xl font-bold">Category :</h1>
          <p className=" mx-1 mt-3 lightText text-2xl">{category}</p>
        </div>
        <div
          className={toggleAdd ? "hidden" : ""}
          onClick={() => {
            setToggleEdit(!toggleEdit);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill={toggleEdit ? "#ffffff" : "#116c39"}
            className={` my-auto -mb-0.5 cursor-pointer ${
              !toggleEdit ? "hover:fill-white" : "hover:fill-red-900"
            }`}
          >
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
