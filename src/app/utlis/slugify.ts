import { ProductModel } from "../modules/Product/product.model";


// Function to generate Arabic slugs
const generateArabicSlug = async (title :any) => {
  // Normalize Arabic characters
  const normalizedTitle = title
    .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, '') // Remove non-Arabic characters except numbers and spaces
    .replace(/\s+/g, '-') // Replace spaces with dash
    .toLowerCase(); // Convert to lowercase

  // Check if the slug already exists in the database
  let titleSlug = normalizedTitle;
  let existingProduct = await ProductModel.findOne({ titleSlug });
  let slugCounter = 1;

  while (existingProduct) {
    // Append counter to the slug and check again
    titleSlug = `${normalizedTitle}-${slugCounter}`;
    existingProduct = await ProductModel.findOne({ titleSlug });
    slugCounter++;
  }

  return titleSlug;
};

export default generateArabicSlug;
