import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  // console.log("apiAthsignup", data);

  return data;
}

// login
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  console.log(data); // trả về 1 object bao gồm 1 sesion và 1 user có thể sử dụng getSession, getUser để lấy chúng ra như làm ở dưới

  return data;
}
//login
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  // console.log("getUser", data);
  if (error) throw new Error(error.message);
  return data?.user;
}

//logout
export async function logout() {
  const { error } = await supabase.auth.signOut(); // xóa token
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  //1. Update password ORf ullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } }; // data: {fullName, avatar: "", },
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;
  //2. Upload the avatar image
  console.log("avatar", data);
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage.from("avatars").upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  //3. Update avatar in the user
  const { data: updateUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });
  if (error2) throw new Error(error2.message);
  return updateUser;
}
