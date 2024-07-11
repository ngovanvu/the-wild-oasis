import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return cabins;
}
//createEditCabin(newCabin, id) sử dụng cả newCabin và ID thì để phân biệt là đang tạo hay đang edit
export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  console.log(hasImagePath);

  //Ví dụ, nếu newCabin.image.name là "photo/file.jpg", và Math.random() trả về 0.123456789, kết quả sau khi thực thi sẽ là "0.123456789-photofile.jpg" được in ra console.
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  //fztavaqtmhlozmwsqctc.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // const { data: cabins, error } = await supabase
  // .from("cabins")
  // .insert([{ ...newCabin, image: imagePath }])
  // .select() // edit
  // .single(); // edit
  // console.log("day roi", newCabin);

  //1. Create cabin
  let query = supabase.from("cabins");
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }
  //2. edit
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }
  const { data: cabins, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be create");
  }
  //2. Upload image
  if (hasImagePath) return cabins;

  const { error: storageError } = await supabase.storage.from("cabin-images").upload(imageName, newCabin.image); // newCabin.image chứa dữ liệu cũ được tải lên trước đó

  //3. Delete the cabin IF there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", cabins.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded and the cabin was not created");
  }

  return cabins;
}

export async function deleteCabin(id) {
  // lấy ở api documents của supabase
  const { data: cabins, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return cabins;
}
