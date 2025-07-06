import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { supabase } from "../lib/supabaseClient.js";

const EXCEL_PATH = "./data.xlsx";
const IMAGES_DIR = "./no";

async function uploadProductData() {
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log(`🟢 Starting import of ${rows.length} products...\n`);

  let success = 0;
  let skipped = 0;

  for (const [index, row] of rows.entries()) {
    const barcode = String(row.parcode || row.barcode).trim();
    const name = String(row["item name"] || row.name).trim();
    const category = String(row.category || row.Category).trim();

    if (!barcode || !name || !category) {
      console.warn(`⛔ Skipping [${index + 1}] Missing required fields.`);
      skipped++;
      continue;
    }

    const imagePath = path.join(IMAGES_DIR, `${barcode}.png`);
    if (!fs.existsSync(imagePath)) {
      console.warn(
        `❌ Skipping [${index + 1}] Image not found for barcode ${barcode}`
      );
      skipped++;
      continue;
    }

    const imageFile = fs.readFileSync(imagePath);
    const uploadPath = `products/${barcode}.png`;
    const mimeType = mime.lookup(imagePath) || "image/png";

    const { error: imageError } = await supabase.storage
      .from("media") // 🔁 replace with actual
      .upload(uploadPath, imageFile, {
        contentType: mimeType,
        upsert: true,
      });

    if (imageError) {
      console.error(
        `❌ [${index + 1}] Failed to upload image:`,
        imageError.message
      );
      skipped++;
      continue;
    }

    const { data: publicURLData } = supabase.storage
      .from("media")
      .getPublicUrl(uploadPath);

    const imageUrl = publicURLData.publicUrl;

    const { error: insertError } = await supabase.rpc("insert_product", {
      p_category_id: await getOrCreateCategoryId(category),
      p_name: name,
      p_barcode: barcode,
      p_image: imageUrl,
    });

    if (insertError) {
      console.error(`❌ [${index + 1}] Insert failed:`, insertError.message);
      skipped++;
    } else {
      console.log(`✅ [${index + 1}] Inserted: ${name} (${barcode})`);
      success++;
    }
  }

  console.log(`\n✅ Finished. Inserted: ${success}, Skipped: ${skipped}`);
}

// helper to get or create category
async function getOrCreateCategoryId(name) {
  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("name", name)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("categories")
    .insert({ name })
    .select()
    .single();

  if (error) throw new Error(`Category insert failed: ${error.message}`);

  return created.id;
}

// run it
uploadProductData().catch((err) => {
  console.error("\n⛔ Unexpected Error:", err);
  process.exit(1);
});
