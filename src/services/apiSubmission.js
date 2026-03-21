import supabase from './supabase';

export async function getSubmissions() {
  let { data: submissions, error } = await supabase
    .from('submissions')
    .select('*');

  if (error) throw new Error(error.message);

  return submissions;
}

// Subscription to submissions

export function subscribeToMessages(callback) {
  return supabase
    .channel('submissions-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'submissions',
      },
      callback,
    )
    .subscribe();
}
