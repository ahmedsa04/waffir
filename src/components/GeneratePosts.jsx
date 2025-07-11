import Image from "next/image";
import FileIcon from "../../public/file.svg";
import CalendarIcon from "../../public/calendar.svg";
import CheckIcon from "../../public/check.svg";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { file } from "jszip";

export const GeneratePosts = ({
  onDataChange,
  items,
  onDateFromSet,
  onDateTillSet,
  pocket,
  setPocket,
  setItems,
  index,
  focusedIndex,
  editRef,
  TypeFace,
  dialogRef,
  onShowDialog,
  showDialog,
  setFileData,
  fileData,
}) => {
  const [succeeded, setSucceded] = useState(false);
  const [barcodes, setbarcodes] = useState(false);
  const [prices, setPrices] = useState([]);
  const [fileName, setFileName] = useState(null);

  const unit = ["G", "KG", "L", "ML", "PK"];
  function format(date) {
    var d = date.split("-");
    var str = "";
    for (let i = 0; i < d.length; i++) {
      if (d[i][0] === "0") {
        d[i] = d[i].substring(1);
      }
      str += `${d[i]}/`;
    }
    return str;
  }
  async function sendData() {
    console.log(items[index].items[focusedIndex]);
    const { data, error } = await supabase.rpc("update_product_by_barcode", {
      p_id: items[index].items[focusedIndex].id,
      p_barcode: null,
      p_name: items[index].items[focusedIndex].name,
      p_unit: items[index].items[focusedIndex].unit,
      p_metric: items[index].items[focusedIndex].metric,
      p_image: null,
      p_category_id: null,
    });
    if (error) {
      console.error("❌ Error updating product:", error.message);
    } else {
      console.log(data);
    }
  }

  function openFile(file, name) {
    var fileF = file.arrayBuffer();
    fileF.then((e) => {
      const workbook = XLSX.read(e, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const formattedData = jsonData;
      console.log(formattedData);
      if (!formattedData[0]["الباركود "]) {
        onShowDialog(true);
        return;
      }
      setPrices(
        formattedData.map((item) => {
          return {
            currentPrice: item["سعر البيع  الحالي "],
            suggestedPrice: item["سعر البيع المقترح"],
          };
        })
      );
      setbarcodes(formattedData.map((item) => item["الباركود "]));
      setFileData(formattedData);
      setSucceded(true);
      setFileName(name);
      localStorage.setItem("fileName", name);
    });
  }
  useEffect(() => {
    if (!barcodes || barcodes.length === 0) return;

    const fetchProducts = async () => {
      console.log("Fetching products for barcodes:", barcodes);
      console.log(fileData.map((row) => row["اسم المادة "]));
      console.log(fileData.map((row) => row["القسم"] || "uncategorized"));
      const { data, error } = await supabase.rpc(
        "get_or_create_products_by_barcodes",
        {
          input_barcodes: barcodes,
          input_names: fileData.map((row) => row["اسم المادة "] || "unnamed"),
          input_categories: fileData.map(
            (row) => row["القسم"] || "uncategorized"
          ),
        }
      );

      if (error) {
        console.error("❌ Error fetching products:", error.message);
      } else {
        console.log("Fetched products:", data);
        onDataChange({ data: data, prices: prices });
        // Do something with `data`
      }
    };

    fetchProducts();
  }, [barcodes]);

  useEffect(() => {
    if (showDialog) {
      dialogRef.current.showModal();
      setTimeout(() => {
        dialogRef.current.close();
        onShowDialog(false);
      }, 5000);
    }
  }, [showDialog]);

  useEffect(() => {
    //update file name to local storage file name if it exists
    const storedFileName = localStorage.getItem("fileName");
    if (storedFileName) {
      setFileName(storedFileName);
      setSucceded(true);
    }
  }, []);
  useEffect(() => {
    if (focusedIndex != null) {
      sendData();
    }
  }, [items]);
  return (
    <div className=" relative w-1/2 h-full bg-[#1E1E1E] py-24 p-24">
      <dialog
        className=" absolute left-1/2 ease-in transform duration-1000 -translate-x-1/2 top-4  bg-transparent "
        ref={dialogRef}
      >
        {
          <div className=" popup !outline-none bg-[#270909] border-red-900 flex p-1 pr-4 rounded-full">
            <div className="  w-fit h-fit max-h-12 max-w-12 font-semibold rounded-full overflow-hidden">
              <div className="loader "></div>
            </div>
            <h1 className="popup_text lightText text-base mx-4 my-auto">
              file is improperly formatted or empty
            </h1>
          </div>
        }
      </dialog>
      <h1
        className={` ${TypeFace.className} w-full lightText text-center text-2xl font-medium pb-4`}
      >
        Generate Posts
      </h1>

      <h1 className=" w-full grayText text-start text-lg font-medium py-2">
        Insert a file with the discounted product details{" "}
      </h1>
      <div className="flex">
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
        {succeeded && (
          <div className=" flex items-center">
            <div className=" mx-10 my-auto  flex w-fit h-fit">
              <h1 className=" grayText text-lg underline cursor-pointer font-light whitespace-nowrap">
                {fileName}
              </h1>
              <Image src={CheckIcon} alt="Check" className=" w-7 h-7 ml-3" />
            </div>
            <h1
              onClick={(e) => {
                localStorage.clear();
                location.reload();
              }}
              className=" darkBG  px-3 lightText hover:!text-red-900 text-base cursor-pointer rounded-lg font-medium whitespace-nowrap"
            >
              remove
            </h1>
          </div>
        )}
      </div>
      <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
        Set discount period From - Untill
      </h1>
      <div className=" w-full flex ">
        <label className=" relative max-w-32 h-fit darkBG rounded-xl cursor-pointer lightText text-lg  ">
          <input
            type="date"
            id="date"
            onChange={(e) => {
              onDateFromSet(format(e.target.value));
              localStorage.setItem(
                "dateFrom",
                JSON.stringify(format(e.target.value))
              );
            }}
            className="focus:outline-0 rounded-2xl darkBG p-3 lightText text-xl scheme-dark"
          />
          <Image
            src={CalendarIcon}
            alt="cal"
            className=" hover:cursor-pointer pointer-events-none w-6 h-6 absolute top-3 left-40 -ml-3  "
          />
        </label>
        <h1 className=" text-2xl my-auto ml-20 rounded-xl w-fit lightText font-light">
          until
        </h1>
        <label className=" mx-6 relative max-w-32 h-fit darkBG rounded-xl cursor-pointer lightText text-lg   ">
          <input
            type="date"
            id="date"
            onChange={(e) => {
              onDateTillSet(format(e.target.value));
              localStorage.setItem(
                "dateTill",
                JSON.stringify(format(e.target.value))
              );
            }}
            className="focus:outline-0 rounded-2xl darkBG p-3 lightText text-xl scheme-dark"
          />
          <Image
            src={CalendarIcon}
            alt="cal"
            className="  pointer-events-none w-6 h-6 absolute top-3 left-40 -ml-3  "
          />
        </label>
      </div>

      <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
        Add the desired products
      </h1>
      <div className=" max-w-[70%] h-fit flex flex-wrap gap-2">
        {pocket.length > 0 ? (
          pocket.map((item, idx) => (
            <h1
              key={idx}
              onClick={() => {
                setItems((prevItems) => {
                  return prevItems.map((group, i) => {
                    if (i === index) {
                      return {
                        ...group,
                        items: [...group.items, item], // immutable update
                      };
                    }
                    return group;
                  });
                });
                setPocket((prevPocket) => {
                  const updated = [...prevPocket];
                  updated.splice(idx, 1);
                  return updated;
                });
              }}
              className=" cursor-pointer w-fit lightText darkBG rounded-xl text-lg font-medium p-2 px-3"
            >
              {item.name}
            </h1>
          ))
        ) : (
          <h1 className=" font-medium rounded-2xl opacity-50 text-lg grayText darkBG p-1 px-2  cursor-default">
            No Items
          </h1>
        )}
      </div>
      <div hidden={items == null} ref={editRef}>
        <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-6">
          Edit selected product details
        </h1>
        <div className=" flex">
          <input
            type="text"
            id="text"
            placeholder="Title"
            value={
              focusedIndex != null && items[index]?.items?.[focusedIndex]
                ? items[index].items[focusedIndex].name
                : ""
            }
            onChange={(e) => {
              if (focusedIndex == null) return;
              setItems((prevItems) => {
                const updated = [...prevItems];
                updated[index].items[focusedIndex] = {
                  ...updated[index].items[focusedIndex],
                  name: e.target.value,
                };
                return updated;
              });
            }}
            className=" rounded-2xl grayText darkBG p-3 lightText text-xl scheme-dark"
          />
          <h1
            className={`${
              focusedIndex != null && items[index]?.items?.[focusedIndex]
                ? "text-xl my-auto ml-4 rounded-xl darkBG p-3 px-6 w-fit grayText font-medium"
                : ""
            }`}
          >
            {focusedIndex != null &&
              items[index]?.items?.[focusedIndex] &&
              items[index].items[focusedIndex].barcode}
          </h1>
        </div>
        <div className="w-fit h-fit flex">
          <div>
            <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-4">
              Original Price
            </h1>
            <input
              type="number"
              id="number1"
              value={
                focusedIndex != null && items[index]?.items?.[focusedIndex]
                  ? items[index].items[focusedIndex].currentPrice
                  : 0
              }
              onChange={(e) => {
                if (focusedIndex == null) return;

                setItems((prevItems) => {
                  const updated = [...prevItems];
                  updated[index].items[focusedIndex] = {
                    ...updated[index].items[focusedIndex],
                    currentPrice: e.target.value,
                  };
                  return updated;
                });
              }}
              className=" max-w-24 rounded-2xl grayText darkBG p-3 lightText text-xl scheme-dark"
            />
          </div>
          <div className=" mx-10">
            <h1 className=" w-full grayText text-start text-lg font-medium pb-2 pt-4">
              Discounted Price
            </h1>
            <input
              type="number"
              id="number2"
              value={
                focusedIndex != null && items[index]?.items?.[focusedIndex]
                  ? items[index].items[focusedIndex].suggestedPrice
                  : 0
              }
              onChange={(e) => {
                if (focusedIndex == null) return;

                setItems((prevItems) => {
                  const updated = [...prevItems];
                  updated[index].items[focusedIndex] = {
                    ...updated[index].items[focusedIndex],
                    suggestedPrice: e.target.value,
                  };
                  return updated;
                });
              }}
              className=" max-w-24 rounded-2xl grayText darkBG p-3 lightText text-xl scheme-dark"
            />
          </div>
        </div>
        <div className="w-fit h-fit flex">
          <div>
            <h1 className=" text-center w-full grayText  text-lg font-medium pb-2 pt-2">
              Unit
            </h1>
            <select
              value={
                (focusedIndex != null &&
                  items[index]?.items?.[focusedIndex] &&
                  items[index].items[focusedIndex].unit) ||
                "---"
              }
              onChange={(e) => {
                if (focusedIndex == null) return;

                setItems((prevItems) => {
                  const updated = [...prevItems];
                  updated[index].items[focusedIndex] = {
                    ...updated[index].items[focusedIndex],
                    unit: e.target.value,
                  };
                  return updated;
                });
              }}
              className=" max-w-28 hover:bg-neutral-500 h-11 darkBG rounded-2xl cursor-pointer lightText text-lg p-2"
            >
              <option
                disabled
                className=" darkBG p-3 lightText text-xl scheme-dark"
              >
                ---
              </option>
              {unit.map((U, idx) => (
                <option
                  onInput={() => {}}
                  className=" darkBG p-3 lightText text-xl scheme-dark"
                  key={idx}
                  value={U}
                >
                  {U}
                </option>
              ))}
            </select>
          </div>
          <div className=" mx-16">
            <h1 className=" text-center w-full grayText  text-lg font-medium pb-2 pt-2">
              Metric
            </h1>
            <input
              type="number"
              id="number3"
              value={
                focusedIndex != null && items[index]?.items?.[focusedIndex]
                  ? items[index].items[focusedIndex].metric
                  : 0
              }
              onChange={(e) => {
                if (focusedIndex == null) return;

                setItems((prevItems) => {
                  const updated = [...prevItems];
                  updated[index].items[focusedIndex] = {
                    ...updated[index].items[focusedIndex],
                    metric: e.target.value,
                  };
                  return updated;
                });
              }}
              className=" max-w-24 rounded-2xl grayText darkBG p-2 lightText text-xl scheme-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
