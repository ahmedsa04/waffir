import Image from "next/image";
import template from "../../public/waffir-template.png";
import itemImage from "../../public/مخلل-الزهرة-الحمراء.png";
import cancelIcon from "../../public/cancel.svg";
import arrowForward from "../../public/arrow_forward.svg";
import arrowBack from "../../public/arrow_back.svg";
import downloadAll from "../../public/download.svg";

export const Posts = ({
  items,
  setItems,
  dateFrom,
  dateTill,
  idx,
  setIdx,
  typeFace,
  focused,
  setFocused,
  focusedIdx,
  setFocusedIdx,
  cardRef,
  cancelRef,
  isExporting,
  downloadAllPng,
  setPocket,
  currentExportIndex,
  onClickOutside,
}) => {
  return (
    <div className=" relative w-1/2 h-full bg-gradient-to-t from-[#1E1E1E] to-[#2E2E2E]">
      <div className=" w-full h-full flex justify-center items-center">
        <div
          id="capture-area"
          className=" z-50 relative w-[600px] h-[750px]"
          style={{
            backgroundImage: `url(${template.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className=" text-end absolute p-4 right-0 top-4 bg-[#f9f9e7] rounded-l-full w-[300px]">
            <h1
              className={`${typeFace.className} align text-black text-xl font-semibold`}
            >
              عروض وفّر الأسبوعية
            </h1>
            <div className={` flex justify-end ${typeFace.className}`}>
              <h1 className=" font-semibold mt-0.5 text-black text-lg mx-1">
                {dateTill}
              </h1>
              <h1 className=" font-semibold  text-black text-lg ">إلى</h1>
              <h1 className=" font-semibold mt-0.5 text-black text-lg mx-1">
                {dateFrom}
              </h1>
              <h1 className=" font-semibold  text-black text-lg ">من</h1>
            </div>
          </div>
          <div className=" absolute top-32 left-1/2 transform -translate-x-1/2 px-4  py-2 bg-[#ffb120] rounded-full">
            <h1
              className={`${typeFace.className} text-2xl text-nowrap text-black font-semibold text-center align-middle`}
            >
              {items &&
                items[currentExportIndex > 0 ? currentExportIndex : idx]
                  .category}
            </h1>
          </div>
          <div className=" absolute bottom-0 h-[548px] w-full grid grid-cols-2 gap-2 p-2">
            {items &&
              items[!currentExportIndex ? idx : currentExportIndex].items.map(
                (item, index) => {
                  const groupItems =
                    items[!currentExportIndex ? idx : currentExportIndex].items;
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
                      <div className="flex justify-between pb-0 p-4">
                        <h1
                          className={`font-semibold ${
                            typeFace.className
                          } bg-[#ffb120] my-auto p-0.5 px-2 rounded-4xl text-black ${
                            count <= 2 || (count == 3 && index == 2)
                              ? "text-2xl"
                              : "text-sm"
                          }`}
                        >
                          {item.metric ? item.metric + " " : "{metric} "}
                          {item.unit ? item.unit : "{unit}"}
                        </h1>
                        <h1
                          className={`font-medium ${
                            typeFace.className
                          } text-black text-end  ${
                            count <= 2 || (count == 3 && index == 2)
                              ? "text-2xl"
                              : "text-lg"
                          }`}
                        >
                          {item.name}
                        </h1>
                      </div>
                      <div
                        className={` flex ${
                          count == 1 ? "justify-center" : ""
                        }`}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className={`w-36 ${
                            colSpan === 2
                              ? ` "w-52" ${
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
                                    : "-bottom-2 left-[6%]"
                                }`
                          } h-36 ${
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
                          className={`${typeFace.className} ${
                            count <= 2 || (count == 3 && index == 2) ? "" : ""
                          } p-2 w-fit h-fit absolute bottom-2 right-2`}
                        >
                          <hr className=" relative -rotate-12 mx-auto z-50 w-[70%] -mb-[15%] h-0.5 border border-red-500 rounded-full" />
                          <h1
                            className={`font-medium text-white  text-center ${
                              count <= 2 || (count == 3 && index == 2)
                                ? "text-2xl"
                                : "text-base"
                            } bg-[#116c39] rounded-ss-2xl`}
                          >
                            {item.currentPrice}
                          </h1>
                          <div className=" pl-4 flex justify-center rounded-ee-2xl bg-[#ffb120]">
                            <h1
                              className={`font-medium text-black  ${
                                count <= 2 || (count == 3 && index == 2)
                                  ? "text-2xl"
                                  : "text-base"
                              } rounded-ee-2xl bg-[#ffb120]`}
                            >
                              {item.suggestedPrice}
                            </h1>
                            <h1 className=" font-medium ml-2 text-black text-[10px] -rotate-90">
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
      <div className=" darkBG flex items-center justify-between absolute bottom-4 left-[43.2%] rounded-full p-2">
        <Image
          className=" hover:cursor-pointer w-6 h-6 mx-1"
          onClick={() => {
            idx == 0 ? setIdx(items.length - 1) : setIdx(idx - 1);
            onClickOutside(true);
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
            onClickOutside(true);
          }}
          src={arrowForward}
          alt="next"
        />
      </div>

      <div
        className=" hover:cursor-pointer fixed flex bottom-4 right-20 z-50 lightText text-xl rounded-xl p-1 px-3 bg-[#116c39] font-semibold"
        onClick={() => {
          downloadAllPng();
          setFocused(false);
        }}
        disabled={isExporting}
      >
        <h1>Download All</h1>
        <Image src={downloadAll} alt="" className=" w-6 h-6 mx-1 my-auto" />
      </div>
    </div>
  );
};
