import { supabase } from "@/lib/supabase";

export async function createUser(
  id: string,
  name: string,
  email: string,
  picture: string,
  role: string,
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
      .single();

    if (error) {
      console.log("Create user error: ", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.log("Create user error: ", error);
    return { data: null, error };
  }
}
