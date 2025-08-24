import { createClient } from '@supabase/supabase-js'
export default defineEventHandler(async(event) => {
    const id = getRouterParam(event, 'id')
    const config = useRuntimeConfig(event);
    const url = config.public.supabaseUrl
    const key = config.public.supabaseKey  
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('ballot')
      .select('school_id, year, category, "1", "2A(1)", "2A(2)", "2B", "2C", "2C(S)", Total')
      .eq('school_id', id)
    return data
})