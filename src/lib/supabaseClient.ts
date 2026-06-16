import { createClient } from '@supabase/supabase-js';

// Since this is a client-heavy app where users enter their own keys,
// we initialize Supabase dynamically from localStorage.
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') return null;

  const supabaseUrl = localStorage.getItem('supabaseUrl');
  const supabaseKey = localStorage.getItem('supabaseKey');

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  let validUrl = supabaseUrl.trim();
  if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
    validUrl = 'https://' + validUrl;
  }
  validUrl = validUrl.replace(/\/rest\/v1\/?$/, '');
  if (validUrl.endsWith('/')) validUrl = validUrl.slice(0, -1);

  return createClient(validUrl, supabaseKey.trim());
};
