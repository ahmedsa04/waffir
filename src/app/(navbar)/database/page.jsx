"use client";
import { useEffect, useRef, useState } from "react";
import { ProductDetails } from "@/components/productDetails";
import { supabase } from "@/lib/supabaseClient";

const page = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("--- ----");
  const [metric, setMetric] = useState("--");
  const [unit, setUnit] = useState("--");
  const [barcode, setBarcode] = useState("000000000000");
  const [category, setCategory] = useState("-------");
  const [toggleAdd, setToggleAdd] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(true);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [cid, setCID] = useState(1);
  const [pid, setPID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const dialogRef = useRef(null);
  const errorDialogRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const barcodeRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);

  function handleReset() {
    if (titleRef.current) {
      titleRef.current.value = null;
    }
    if (barcodeRef.current) {
      barcodeRef.current.value = null;
    }
    if (categoryRef.current) {
      categoryRef.current.value = null;
    }
    setTitle("--- ----");
    setBarcode("000000000000");
    setImage(null);
    setCategory("-------");
    setUnit("--");
    setMetric("--");
    setCID(1);
    setPID(null);
    setCategory(null);
    setToggleEdit(false);
    setToggleSearch(false);
    setToggleAdd(true);
  }

  useEffect(() => {
    // Reset the form when the component mounts
    if (toggleAdd) {
      handleReset();
    }
  }, [handleReset]);
  async function handleSearch() {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_product_by_identifier", {
      identifier: barcode ? barcode : title,
    });
    if (error) {
      setLoading(false);
      setDialogMessage(error.message);
      setShowErrorDialog(true);
    }
    if (data[0] === undefined) {
      setDialogMessage("Product not found");
      setShowErrorDialog(true);
      setLoading(false);
      return;
    }
    setLoading(false);
    setTitle(data[0].name);
    setBarcode(data[0].barcode);
    setImage(data[0].image);
    setCategory(data[0].category_name);
    setUnit(data[0].unit);
    setMetric(data[0].metric);
    setCID(data[0].category_id);
    setPID(data[0].id);
  }

  async function handleAdd() {
    setLoading(true);
    if (!barcode) {
      setLoading(false);
      setDialogMessage("Please enter a barcode.");
      setShowErrorDialog(true);
      return;
    }
    const { data, error } = await supabase.rpc("insert_product", {
      p_category_id: cid,
      p_name: title,
      p_barcode: barcode,
      p_image: image,
    });
    if (error) {
      setLoading(false);
      var message = error.message;
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        message = "Product with this barcode already exists.";
      }
      setDialogMessage(message);
      setShowErrorDialog(true);
    } else {
      setLoading(false);
      setDialogMessage("Product Added Successfully!");
      setShowDialog(true);
    }
  }
  async function handleEdit() {
    const { data, error } = await supabase.rpc("update_product_by_barcode", {
      p_id: pid,
      p_barcode: barcode,
      p_name: title,
      p_unit: null,
      p_metric: null,
      p_image: image,
      p_category_id: cid,
    });

    if (error) {
      setLoading(false);
      setDialogMessage(error.message);
      setShowErrorDialog(true);
    } else {
      setLoading(false);
      setToggleEdit(false);
      setToggleSearch(true);
      handleSearch();
      setLoading(true);
      setDialogMessage("Product Updated Successfully!");
      setShowDialog(true);
    }
  }
  async function get_all_categories() {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_all_categories");
    if (error) {
      setLoading(false);
      setDialogMessage(error.message);
      setShowErrorDialog(true);
    } else {
      setLoading(false);
      setCategories(data);
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    get_all_categories();
  }, []);

  useEffect(() => {
    if (showDialog) {
      dialogRef.current.showModal();
      setTimeout(() => {
        dialogRef.current.close();
        setShowDialog(false);
      }, 5000);
    }
    if (showErrorDialog) {
      errorDialogRef.current.showModal();
      setTimeout(() => {
        errorDialogRef.current.close();
        setShowErrorDialog(false);
      }, 5000);
    }
  }, [showDialog, showErrorDialog]);
  toggleAdd && console.log(barcode);
  return (
    <div className=" w-full h-screen bg-[#2E2E2E] p-24 relative">
      <dialog
        className=" absolute left-1/2 ease-in transform duration-1000 -translate-x-1/2 top-4  bg-transparent "
        ref={dialogRef}
      >
        {
          <div className=" popup !outline-none bg-[#1e1e1e] flex p-1 pr-4 rounded-full">
            <div className="  w-fit h-fit max-h-12 max-w-12 font-semibold rounded-full overflow-hidden">
              <div className="loader "></div>
            </div>
            <h1 className="popup_text lightText text-base mx-4 my-auto">
              {dialogMessage}
            </h1>
          </div>
        }
      </dialog>
      <dialog
        className=" absolute left-1/2 ease-in transform duration-1000 -translate-x-1/2 top-4  bg-transparent "
        ref={errorDialogRef}
      >
        {
          <div className=" popup !outline-none bg-[#270909] border-red-900 flex p-1 pr-4 rounded-full">
            <div className="  w-fit h-fit max-h-12 max-w-12 font-semibold rounded-full overflow-hidden">
              <div className="loader "></div>
            </div>
            <h1 className="popup_text lightText text-base mx-4 my-auto">
              {dialogMessage}
            </h1>
          </div>
        }
      </dialog>
      <div className=" w-full h-full bg-[#1e1e1e]">
        <div className=" flex justify-center">
          <h1
            onClick={() => {
              handleReset();
            }}
            className={`lightText cursor-pointer text-xl font-light rounded-2xl mx-2 p-2 mt-4 ${
              toggleAdd ? "border-b px-4 border-white" : ""
            }`}
          >
            Add
          </h1>
          <h1
            onClick={() => {
              setToggleSearch(true);
              setToggleAdd(false);
            }}
            className={`lightText cursor-pointer text-xl font-light rounded-2xl mx-2 p-2 mt-4  ${
              toggleSearch ? "border-b px-4 border-white" : ""
            }`}
          >
            Search
          </h1>
        </div>
        <div className=" flex p-16 relative">
          <div className=" w-1/2 h-full">
            <ProductDetails
              image={image}
              title={title}
              metric={metric}
              unit={unit}
              barcode={barcode}
              category={category}
              toggleEdit={toggleEdit}
              setToggleEdit={setToggleEdit}
              onImageChange={setImage}
              toggleAdd={toggleAdd}
            />
          </div>
          <div className=" w-1/2 h-full relative">
            <h1 className="lightText text-2xl text-center mx-auto">
              {toggleAdd
                ? "Add Product"
                : toggleEdit
                ? "Edit Product"
                : "Search Product"}
            </h1>
            <div className=" mt-16">
              {(toggleEdit || toggleAdd) && (
                <div className=" mx-auto w-[424px] h-full">
                  <label
                    className={` mb-1 block text-2xl
                      ${toggleEdit ? "text-[#116c39]" : "grayText"}
                    `}
                  >
                    Title
                  </label>

                  <input
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    ref={titleRef}
                    type="text"
                    className=" focus:outline-0 w-full rounded-2xl lightText darkBG p-2 lightText text-xl scheme-dark"
                  />
                </div>
              )}
              <div className=" mt-4 mx-auto w-[424px] h-full">
                <label
                  className={` mb-1 block text-2xl
                    ${toggleEdit ? "text-[#116c39]" : "grayText"}
                  `}
                >
                  Barcode
                </label>
                <input
                  onChange={(e) => {
                    setBarcode(e.target.value);
                  }}
                  ref={barcodeRef}
                  type="text"
                  className=" focus:outline-0 w-full rounded-2xl lightText darkBG p-2 lightText text-xl scheme-dark"
                />
              </div>
              {(toggleEdit || toggleAdd) && (
                <div className=" mt-4 mx-auto w-[424px] h-full">
                  <label
                    className={` mb-1 block text-2xl
                    ${toggleEdit ? "text-[#116c39]" : "grayText"}
                  `}
                  >
                    Category
                  </label>
                  <select
                    onChange={(e) => {
                      setCID(e.target.value);
                    }}
                    ref={categoryRef}
                    className="focus:outline-0  min-w-64 max-w-80 hover:bg-neutral-800 h-11 darkBG rounded-2xl cursor-pointer lightText text-lg p-2"
                  >
                    <option
                      disabled
                      defaultChecked
                      className=" darkBG p-2 lightText text-xl scheme-dark"
                    >
                      ---
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className=" darkBG p-3 lightText text-xl scheme-dark"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {loading ? (
                <div className=" max-h-12 min-w-32 max-w-32 cursor-pointer text-center rounded-2xl text-2xl mx-auto my-16 text-white hover:brightness-80  bg-[#ededed] overflow-hidden p-2 px-4">
                  <div className="loader "></div>
                </div>
              ) : toggleEdit ? (
                <h1
                  onClick={() => {
                    handleEdit();
                  }}
                  className=" min-w-32 max-w-32 cursor-pointer text-center rounded-2xl text-2xl mx-auto my-16 text-white hover:brightness-80  bg-[#116c39] p-2 px-4"
                >
                  Edit
                </h1>
              ) : toggleSearch ? (
                <h1
                  onClick={() => {
                    handleSearch();
                  }}
                  className="min-w-32 max-w-32 cursor-pointer text-center rounded-2xl text-2xl mx-auto my-16 text-white  hover:brightness-80 bg-[#116c39] p-2 px-4"
                >
                  Search
                </h1>
              ) : (
                <h1
                  onClick={() => {
                    handleAdd();
                  }}
                  className=" min-w-32 max-w-32 cursor-pointer text-center rounded-2xl text-2xl mx-auto my-16 text-white hover:brightness-80  bg-[#11436c] p-2 px-4"
                >
                  Add
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
