import { createClient } from '@supabase/supabase-js'
export default defineEventHandler(async(event) => {
    const id = getRouterParam(event, 'id')
    const config = useRuntimeConfig(event);
    const url = config.public.supabaseUrl
    const key = config.public.supabaseKey  
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('review2')
      .select('school_id, username, caption, rating, timestamp')
      .eq('school_id', id)
      .order("timestamp", { ascending: false });
    return data
})