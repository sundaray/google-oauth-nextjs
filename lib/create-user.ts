import { supabase } from "@/lib/supabase";

export async function createUser(
  id: string,
  name: string,
  email: string,
  role: string,
  picture: string,
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id,
          name,
          email,
          role,
          picture,
        },
        {
          onConflict: "email",
          ignoreDuplicates: true,
        },
      )
      .select()
      .maybeSingle();

    if (error) {
      console.log("Create user error: ", error);
      throw error;
    }

    return { data };
  } catch (error) {
    console.log("Create user error: ", error);
    throw error;
  }
}
