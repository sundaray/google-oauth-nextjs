import { createClient } from "@/supabase/server";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export async function createUser(
  name: string,
  email: string,
  picture: string,
  role: string,
) {
  const supabase = await createClient();

  try {
    // Step 1: Check if a user exists with the given id
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (findError) {
      // User not found, create a new user

      const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name,
            email,
            role,
            picture,
          },
        ])
        .select()
        .single();

      return { data, error: null };
    }
  } catch (error) {
    console.log("createUser error: ", error);
    return { data: null, error };
  }
}
