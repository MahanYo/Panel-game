// ===== Supabase Configuration =====
const SUPABASE_URL = 'https://rhmtzibaqioubuncgcwg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CEzI_2SXgxC5xKjzA86zDw_TMSe-47u';

// ===== Supabase Client (نام متفاوت برای جلوگیری از تضاد) =====
let sb = null;
function initSupabase(){
  if(typeof window.supabase !== 'undefined' && !sb){
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return sb;
}

// ===== API Wrapper =====
const API = {
  async getProducts(){
    if(!sb) return [];
    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if(error){ console.error('getProducts:', error); return []; }
    return data || [];
  },

  async getProduct(id){
    if(!sb) return null;
    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if(error) return null;
    return data;
  },

  async createPurchase(purchase){
    if(!sb) return null;
    const { data, error } = await sb
      .from('purchases')
      .insert(purchase)
      .select()
      .single();
    if(error){ console.error('createPurchase:', error); return null; }
    return data;
  },

  async getMyPurchases(userId){
    if(!sb) return [];
    const { data, error } = await sb
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if(error) return [];
    return data || [];
  },

  async getNotifications(){
    if(!sb) return [];
    const { data, error } = await sb
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if(error) return [];
    return data || [];
  },

  async markNotificationRead(id, userId){
    if(!sb) return;
    const { data } = await sb.from('notifications').select('read_by').eq('id', id).single();
    if(!data) return;
    const list = data.read_by || [];
    if(!list.includes(userId)){
      list.push(userId);
      await sb.from('notifications').update({ read_by: list }).eq('id', id);
    }
  }
};

initSupabase();
