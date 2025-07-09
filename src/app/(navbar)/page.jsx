"use client";
import { useToPng } from "@hugocxl/react-to-image";
import { useEffect, useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratePosts } from "@/components/GeneratePosts";
import { typeFace } from "./layout";
import { Posts } from "@/components/Posts";

const page = () => {
  const [data, setData] = useState(null);
  const [items, setItems] = useState(null);
  const [idx, setIdx] = useState(0);
  const [currentExportIndex, setCurrentExportIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const zipRef = useRef(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTill, setDateTill] = useState("");
  const cancelRef = useRef(null);
  const cardRef = useRef(null);
  const editRef = useRef(null);
  const [clickOutside, setClickOutside] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState();
  const [pocket, setPocket] = useState([]);
  const dialogRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [fileData, setFileData] = useState([]);

  const [state, convert] = useToPng({
    selector: "#capture-area",
    quality: 1,
    pixelRatio: 1.8,
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
          saveAs(zipBlob, `${Date.now()}.zip`);
          setIsExporting(false);
          setCurrentExportIndex(0);
        });
      }
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Data received:", data);
      setItems(groupAndBalanceItems(data));
    } else {
      if (localStorage?.getItem("items")) {
        setItems(JSON.parse(localStorage.getItem("items")));
      }
    }
  }, [data]);

  function groupAndBalanceItems(data) {
    const items = data.data;
    const prices = data.prices;
    const categoryGroups = [];
    let currentCategory = null;
    let currentGroup = [];
    // STEP 1: Group items by category using marker in first item
    for (let i = 0; i < items.length; i++) {
      const item = Object.assign({}, items[i], prices[i]);

      if (currentCategory) {
        if (item.category_name == currentCategory) {
          currentGroup.push(item);
        }
        // Start a new group
        else if (currentGroup.length > 0) {
          categoryGroups.push({
            out: [],
            category: currentCategory,
            items: currentGroup,
          });
          currentCategory = item.category_name;
          currentGroup = [item];
        }
      } else {
        // Initialize the first category
        currentCategory = item.category_name;
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
        (cardRef.current &&
          !cardRef.current.contains(event.target) &&
          cancelRef.current &&
          !cancelRef.current.contains(event.target) &&
          editRef.current &&
          !editRef.current.contains(event.target)) ||
        isExporting ||
        clickOutside
      ) {
        setFocused(false); // Click outside: deactivate
        setFocusedIdx(null); // Reset focused index
        setClickOutside(false); // Reset click outside state
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const downloadAllPng = () => {
    zipRef.current = new JSZip();
    setIsExporting(true);
  };
  {
  }
  useEffect(() => {
    if (pocket.length > 0) {
      localStorage.setItem("pocket", JSON.stringify(pocket));
    }
  }, [pocket]);
  useEffect(() => {
    if (items) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items]);
  useEffect(() => {
    if (!items) {
      if (JSON.parse(localStorage?.getItem("items"))) {
        setItems(JSON.parse(localStorage.getItem("items")));
      }
    }
    if (pocket.length == 0) {
      if (JSON.parse(localStorage?.getItem("pocket"))) {
        setPocket(JSON.parse(localStorage.getItem("pocket")));
      }
    }
    if (dateFrom.length == 0) {
      setDateFrom(localStorage.getItem("dateFrom")) || "";
    }
    if (dateTill.length == 0) {
      setDateTill(localStorage.getItem("dateTill")) || "";
    }
  }, []);
  return (
    <div className=" relative w-full h-screen flex">
      <dialog
        className=" absolute left-1/2 ease-in z-50 transform duration-1000 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-transparent "
        open={isExporting}
      >
        <div className="flex justify-center items-center w-56 h-56 font-semibold bg-white border-2 border-[#116c39] rounded-full overflow-hidden relative">
          <div className="loader !w-72 "></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-700 font-semibold ${typeFace.className}`}
          >
            Downloading
          </div>
        </div>
      </dialog>
      <Posts
        items={items}
        setItems={setItems}
        idx={idx}
        setIdx={setIdx}
        focused={focused}
        setFocused={setFocused}
        focusedIdx={focusedIdx}
        setFocusedIdx={setFocusedIdx}
        cancelRef={cancelRef}
        cardRef={cardRef}
        editRef={editRef}
        dateFrom={dateFrom}
        dateTill={dateTill}
        typeFace={typeFace}
        setPocket={setPocket}
        pocket={pocket}
        currentExportIndex={currentExportIndex}
        setCurrentExportIndex={setCurrentExportIndex}
        isExporting={isExporting}
        setIsExporting={setIsExporting}
        downloadAllPng={downloadAllPng}
        onClickOutside={setClickOutside}
      />
      <GeneratePosts
        TypeFace={typeFace}
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
        dialogRef={dialogRef}
        onShowDialog={setShowDialog}
        showDialog={showDialog}
        fileData={fileData}
        setFileData={setFileData}
      />
    </div>
  );
};

export default page;
