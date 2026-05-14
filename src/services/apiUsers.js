import supabase from "./supabase";

export default async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded!");
  }

  return data;
}

// Get user based on a given user_id

export async function getUser(id) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("User could not be loaded!");
  }

  return data;
}

// Subscription to real-time changes
export function subscribeToUsers(callback) {
  return supabase
    .channel("my-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "users",
      },
      callback,
    )
    .subscribe();
}
