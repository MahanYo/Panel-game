// ===== Supabase Configuration =====
const SUPABASE_URL = 'https://rhmtzibaqioubuncgcwg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CEzI_2SXgxC5xKjzA86zDw_TMSe-47u';

// ===== Supabase Client =====
let supabase = null;
function initSupabase(){
  if(typeof window.supabase !== 'undefined' && !supabase){
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

// ===== API Wrapper =====
const API = {
  async getProducts(){
    if(!supabase) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if(error){ console.error('getProducts:', error); return []; }
    return data || [];
  },

  async getProduct(id){
    if(!supabase) return null;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if(error) return null;
    return data;
  },

  async createPurchase(purchase){
    if(!supabase) return null;
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchase)
      .select()
      .single();
    if(error){ console.error('createPurchase:', error); return null; }
    return data;
  },

  async getMyPurchases(userId){
    if(!supabase) return [];
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if(error) return [];
    return data || [];
  },

  async getNotifications(){
    if(!supabase) return [];
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if(error) return [];
    return data || [];
  },

  async markNotificationRead(id, userId){
    if(!supabase) return;
    const { data } = await supabase.from('notifications').select('read_by').eq('id', id).single();
    if(!data) return;
    const list = data.read_by || [];
    if(!list.includes(userId)){
      list.push(userId);
      await supabase.from('notifications').update({ read_by: list }).eq('id', id);
    }
  }
};

initSupabase();
