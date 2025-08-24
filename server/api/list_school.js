import { createClient } from '@supabase/supabase-js'
export default defineEventHandler(async(event) => {
    const config = useRuntimeConfig(event);
    const url = config.public.supabaseUrl
    const key = config.public.supabaseKey
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('profile2')
      .select('school_id, area, name, parent_volunteer, logo_url, address, website, type_sap, '+
      'type_boys-only, type_girls-only, type_gep, affiliations, logo_url2, moe_url, ' +
      'googlemap_url, review_num, review_rating_avg')
    return data
})