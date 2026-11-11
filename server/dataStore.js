import { createClient } from '@supabase/supabase-js';

let client;

function getClient() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in server/.env');
  }

  client = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

function queryFor(name) {
  const supabase = getClient();
  if (name === 'projects') return supabase.from(name).select('*').order('number');
  if (name === 'messages') return supabase.from(name).select('*').order('receivedAt', { ascending: false });
  return supabase.from(name).select('*').order('createdAt');
}

export async function readCollection(name, fallback = []) {
  const { data, error } = await queryFor(name);
  if (error) throw error;
  if (data.length || !fallback.length) return data;

  const { error: seedError } = await getClient().from(name).insert(fallback);
  if (seedError) throw seedError;
  const { data: seeded, error: readError } = await queryFor(name);
  if (readError) throw readError;
  return seeded;
}

export async function createRecord(name, record) {
  const { data, error } = await getClient().from(name).insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function updateRecord(name, id, record) {
  const { data, error } = await getClient().from(name).update(record).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteRecord(name, id) {
  const { data, error } = await getClient().from(name).delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  return data;
}
