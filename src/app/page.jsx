"use client";
import { useToPng } from "@hugocxl/react-to-image";
import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";
import { GeneratePosts } from "@/components/GeneratePosts";
import template from "../../public/waffir-template.png";
import itemImage from "../../public/مخلل-الزهرة-الحمراء.png";
import cancelIcon from "../../public/cancel.svg";
import arrowForward from "../../public/arrow_forward.svg";
import arrowBack from "../../public/arrow_back.svg";

const awaitNextPaint = () => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
};

function groupAndBalanceItems(items) {
  const categoryGroups = [];
  let currentCategory = null;
  let currentGroup = [];

  // STEP 1: Group items by category using marker in first item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.القسم) {
      // Start a new group
      if (currentGroup.length > 0) {
        categoryGroups.push({
          out: [],
          category: currentCategory,
          items: currentGroup,
        });
      }
      currentCategory = item.القسم;
      currentGroup = [item];
    } else {
      currentGroup.push(item);
    }
  }
  // Push the last group
  if (currentGroup.length > 0) {
    categoryGroups.push({
      out: [],
      category: currentCategory,
      items: currentGroup,
    });
  }

  const result = [];

  // STEP 2: Chunk each category group into max 6 items per sub-array
  for (const group of categoryGroups) {
    const chunks = [];
    const items = group.items;

    for (let i = 0; i < items.length; i += 6) {
      chunks.push({
        out: [],
        category: group.category,
        items: items.slice(i, i + 6),
      });
    }

    // STEP 3: Balance small chunks (less than 4 items)
    if (chunks.length > 1) {
      for (let i = 0; i < chunks.length - 1; i++) {
        const current = chunks[i];
        const next = chunks[i + 1];

        if (next.length < 4) {
          const needed = 3 - next.length;
          const transferable = Math.min(current.length - 3, needed);

          if (transferable > 0) {
            next.unshift(...current.splice(-transferable));
          }
        }
      }
    }

    result.push(...chunks);
  }

  return result;
}

const page = () => {
  const [data, setData] = useState(null);
  const [items, setItems] = useState(null);
  const [idx, setIdx] = useState(0);
  const [currentExportIndex, setCurrentExportIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const zipRef = useRef(null);
  const [state, convert] = useToPng({
    selector: "#capture-area",
    quality: 1,
    pixelRatio: 2,
    onSuccess: (data) => {
      // Add the image to the ZIP folder
      zipRef.current.file(
        `product-${currentExportIndex + 1}.png`,
        data.split(",")[1],
        {
          base64: true,
        }
      );

      const nextIndex = currentExportIndex + 1;
      if (nextIndex < items.length) {
        setCurrentExportIndex(nextIndex);
      } else {
        // All images have been processed
        zipRef.current.generateAsync({ type: "blob" }).then((zipBlob) => {
          saveAs(zipBlob, "products.zip");
          setIsExporting(false);
          setCurrentExportIndex(0);
        });
      }
    },
  });

  useEffect(() => {
    if (isExporting) {
      // Wait for the DOM to update before converting
      const timeout = setTimeout(() => {
        convert();
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timeout);
    }
  }, [currentExportIndex, isExporting]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        cancelRef.current &&
        !cancelRef.current.contains(event.target) &&
        editRef.current &&
        !editRef.current.contains(event.target)
      ) {
        setFocused(false); // Click outside: deactivate
        setFocusedIdx(null); // Reset focused index
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTill, setDateTill] = useState("");
  const cancelRef = useRef(null);
  const cardRef = useRef(null);
  const editRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [pocket, setPocket] = useState([]);
  const [succeeded, setSucceded] = useState(false);
  const [fileName, setFileName] = useState(null);
  const downloadAllPng = () => {
    zipRef.current = new JSZip();
    setIsExporting(true);
  };
  useEffect(() => {
    if (data) {
      data.forEach((item) => {
        item["اسم المادة "] = item["اسم المادة "].slice(0, 20);
      });
      const ITEMS = groupAndBalanceItems(data);
      ITEMS.push({
        category: "sdsd",
        items: ITEMS[3].items.filter((item, idx) => idx <= 2),
      });
      ITEMS.push({
        category: "AWFSA",
        items: ITEMS[7].items.filter((item, idx) => idx <= 1),
      });
      ITEMS.push({
        category: "AWFSA",
        items: ITEMS[8].items.filter((item, idx) => idx == 0),
      });
      setItems(ITEMS);
    }
  }, [data]);
  items && console.log(items);
  return (
    <div className=" w-full h-screen flex">
      <div className=" relative w-1/2 h-full bg-gradient-to-t from-[#1E1E1E] to-[#2E2E2E]">
        <div className=" w-full h-full flex justify-center items-center">
          <div
            id="capture-area"
            className=" relative w-[600px] h-[750px]"
            style={{
              backgroundImage: `url(${template.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className=" flex absolute top-[66px] right-2">
              <h1 className=" font-bold text-black text-base mx-0.5">
                {dateTill}
              </h1>
              <h1 className=" font-bold text-black text-lg mx-0.5">إلى</h1>
              <h1 className=" font-bold text-black text-base mx-0.5">
                {dateFrom}
              </h1>
              <h1 className=" font-bold text-black text-lg mx-0.5">من</h1>
            </div>
            <div className=" absolute left-[34%] top-32 w-48 py-1 bg-[#ffb120] rounded-full">
              <h1 className=" text-3xl text-black font-bold text-center align-middle">
                {items && items[currentExportIndex].category}
              </h1>
            </div>
            <div className=" absolute bottom-0 h-[548px] w-full grid grid-cols-2 gap-2 p-2">
              {items &&
                items[!currentExportIndex ? idx : currentExportIndex].items.map(
                  (item, index) => {
                    const groupItems =
                      items[!currentExportIndex ? idx : currentExportIndex]
                        .items;
                    const count = groupItems.length;

                    let colSpan;
                    if (count === 1) {
                      colSpan = 2;
                    } else if (count === 2) {
                      colSpan = 2;
                    } else if (count === 3) {
                      colSpan = index === 2 ? 2 : 1;
                    } else if (count === 4) {
                      colSpan = 1;
                    } else if (count === 5) {
                      colSpan = index === 4 ? 2 : 1;
                    } else {
                      colSpan = 1;
                    }

                    return (
                      <div
                        ref={cardRef}
                        onClick={() => {
                          setFocused(true);
                          setFocusedIdx(index);
                        }}
                        key={index}
                        className={`
              col-span-0 ${colSpan === 2 ? "col-span-2" : "col-span-1"}
               hover:cursor-pointer relative rounded-3xl w-full h-full bg-[#f9f9e7] text-black ${
                 focused && focusedIdx == index
                   ? "outline-[#537dc6] outline-3"
                   : ""
               }
            `}
                      >
                        {focused && focusedIdx == index && (
                          <div
                            ref={cancelRef}
                            onClick={() => {
                              // Step 1: Extract itemToDelete BEFORE doing any setState
                              const itemToDelete =
                                items?.[idx]?.items?.[focusedIdx];

                              if (!itemToDelete) {
                                console.warn("Item to delete is undefined", {
                                  idx,
                                  focusedIdx,
                                  items,
                                });
                                return;
                              }

                              // Step 2: Update pocket state
                              setPocket((prevPocket) => [
                                ...prevPocket,
                                itemToDelete,
                              ]);

                              // Step 3: Update items without mutating nested state
                              setItems((prevItems) => {
                                const updated = [...prevItems];
                                updated[idx] = {
                                  ...updated[idx],
                                  items: updated[idx].items.filter(
                                    (_, i) => i !== focusedIdx
                                  ),
                                };
                                return updated;
                              });

                              // Step 4: Reset focused state
                              setFocusedIdx(null);
                              setFocused(false);
                            }}
                            className="absolute -top-2 -right-2 w-fit h-fit p-[1px] bg-[#f9f9e7] rounded-full"
                          >
                            <Image
                              src={cancelIcon}
                              alt="cancel"
                              className=" w-6 h-6 hover:cursor-pointer"
                              onClick={() => {}}
                            />
                          </div>
                        )}
                        {/* card content stays the same */}
                        <div className="flex justify-between p-4">
                          <h1
                            className={`font-semibold bg-[#ffb120] p-1 rounded-4xl px-2 text-black ${
                              count <= 2 || (count == 3 && index == 2)
                                ? "text-2xl"
                                : "text-sm"
                            }`}
                          >
                            1 KG
                          </h1>
                          <h1
                            className={`font-extrabold text-black  ${
                              count <= 2 || (count == 3 && index == 2)
                                ? "text-3xl"
                                : "text-lg"
                            }`}
                          >
                            {item["اسم المادة "]}
                          </h1>
                        </div>
                        <div
                          className={` flex ${
                            count == 1 ? "justify-center" : ""
                          }`}
                        >
                          <div
                            style={{
                              backgroundImage: `url(${itemImage.src})`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                            className={`w-40 ${
                              colSpan === 2
                                ? ` "w-56" ${
                                    count == 3
                                      ? "w-72 -bottom-8 left-[20%]"
                                      : count == 5
                                      ? "w-56 -bottom-8 left-[30%]"
                                      : count == 2
                                      ? "w-72 -bottom-8 left-[15%]"
                                      : count == 1
                                      ? "w-72 top-[30%] left-[26%]"
                                      : ""
                                  }`
                                : `${
                                    colSpan === 1 && count <= 4
                                      ? "w-56 bottom-0 left[30%]"
                                      : "-bottom-6 left-[6%]"
                                  }`
                            } h-40 ${
                              colSpan === 2
                                ? `h-56 ${
                                    count == 3
                                      ? "h-72"
                                      : count == 5
                                      ? "h-56"
                                      : count == 2
                                      ? "h-72"
                                      : count == 1
                                      ? "w-72"
                                      : ""
                                  }`
                                : `${colSpan === 1 && count <= 4 ? "h-56" : ""}`
                            } absolute `}
                          ></div>
                          <div
                            className={`bg-transparent w-${
                              colSpan === 2 ? "32" : "28"
                            } h-${colSpan === 2 ? "28" : "28"}`}
                          ></div>
                          <div
                            className={` ${
                              count <= 2 || (count == 3 && index == 2) ? "" : ""
                            } p-2 w-fit h-fit absolute bottom-2 right-2`}
                          >
                            <hr className=" relative -rotate-12 mx-auto z-50 w-[70%] -mb-[15%] h-0.5 bg-red-600 rounded-full" />
                            <h1
                              className={`font-semibold text-white  text-center ${
                                count <= 2 || (count == 3 && index == 2)
                                  ? "text-2xl"
                                  : "text-base"
                              } bg-[#116c39] rounded-ss-2xl`}
                            >
                              {item["سعر البيع  الحالي "]}
                            </h1>
                            <div className=" pl-4 flex justify-center rounded-ee-2xl bg-[#ffb120]">
                              <h1
                                className={`font-semibold text-black  ${
                                  count <= 2 || (count == 3 && index == 2)
                                    ? "text-2xl"
                                    : "text-base"
                                } rounded-ee-2xl bg-[#ffb120]`}
                              >
                                {item["سعر البيع المقترح"]}
                              </h1>
                              <h1 className=" font-semibold ml-1 text-black text-[10px] -rotate-90">
                                IQD
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
        <div className=" darkBG flex items-center justify-between absolute bottom-4 right-[50%] rounded-full p-2">
          <Image
            className=" hover:cursor-pointer w-6 h-6 mx-1"
            onClick={() => {
              idx == 0 ? setIdx(items.length) : setIdx(idx - 1);
            }}
            src={arrowBack}
            alt="next"
          />
          <h1 className=" text-lg lightText ">
            {idx + 1} / {items ? items.length : 1}
          </h1>
          <Image
            className=" hover:cursor-pointer w-6 h-6 mx-1 "
            onClick={() => {
              idx == items.length - 1 ? setIdx(0) : setIdx(idx + 1);
            }}
            src={arrowForward}
            alt="next"
          />
        </div>

        <h1
          className=" absolute bottom-4 right-[10%] lightText text-2xl rounded-3xl p-1 font-bold darkBG"
          onClick={() => {
            downloadAllPng();
          }}
          disabled={isExporting}
        >
          Download All
        </h1>
      </div>
      <GeneratePosts
        onDateFromSet={setDateFrom}
        onDateTillSet={setDateTill}
        onDataChange={setData}
        items={items}
        pocket={pocket}
        setPocket={setPocket}
        setItems={setItems}
        index={idx}
        focusedIndex={focusedIdx}
        editRef={editRef}
      />
    </div>
  );
};

export default page;
