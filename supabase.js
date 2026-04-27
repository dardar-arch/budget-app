import { useState, useCallback, useEffect } from "react";
import { supabase } from './supabase.js';

const DEFAULT_CATEGORIES = [
  { id: 'housing', name: 'דיור', icon: '🏠', subcategories: [
    { id: 'rent', name: 'שכר דירה' }, { id: 'arnona', name: 'ארנונה' },
    { id: 'water', name: 'מים' }, { id: 'electric', name: 'חשמל' },
    { id: 'gas', name: 'גז' }, { id: 'vaad', name: 'ועד בית' },
    { id: 'ins_building', name: 'ביטוח מבנה' }, { id: 'cleaner', name: 'עוזרת בית' },
    { id: 'repairs', name: 'תיקונים' },
  ]},
  { id: 'telecom', name: 'תקשורת', icon: '📡', subcategories: [
    { id: 'tv', name: 'טלוויזיה' }, { id: 'netflix', name: 'Netflix' },
    { id: 'prime', name: 'Prime' }, { id: 'appletv', name: 'Apple TV' },
    { id: 'disney', name: 'Disney+' }, { id: 'mobile', name: 'טלפונים ניידים' },
    { id: 'newspapers', name: 'עיתונים' }, { id: 'landline', name: 'טלפון קווי' },
    { id: 'internet_infra', name: 'אינטרנט ביתי תשתית' }, { id: 'internet_isp', name: 'אינטרנט ביתי ספק' },
  ]},
  { id: 'transport', name: 'תחבורה', icon: '🚗', subcategories: [
    { id: 'car_maint', name: 'רכב תחזוקה' }, { id: 'car_ins_m', name: 'ביטוח חובה' },
    { id: 'car_ins_c', name: 'ביטוח מקיף' }, { id: 'fuel', name: 'דלק' },
    { id: 'car_buy', name: 'רכישת רכב' }, { id: 'car_wash', name: 'שטיפת רכב' },
    { id: 'public_trans', name: 'תחבורה ציבורית' },
  ]},
  { id: 'health', name: 'בריאות ויופי', icon: '💊', subcategories: [
    { id: 'hmo', name: 'קופת חולים' }, { id: 'meds', name: 'תרופות' },
    { id: 'med_equip', name: 'אביזרים רפואיים' }, { id: 'dietitian', name: 'דיאטנית' },
    { id: 'otc', name: 'תרופות ללא מרשם' }, { id: 'haircut', name: 'מספרה' },
    { id: 'toiletries', name: 'טואלטיקה' },
  ]},
  { id: 'hobbies', name: 'חוגים', icon: '🏋️', subcategories: [
    { id: 'gym', name: 'מכון כושר' }, { id: 'class', name: 'חוג' },
    { id: 'cbt', name: 'טיפול CBT' }, { id: 'mens_circle', name: 'מעגל גברים' },
  ]},
  { id: 'insurance', name: 'ביטוחים', icon: '🛡️', subcategories: [
    { id: 'ins_health', name: 'ביטוח בריאות' }, { id: 'ins_life', name: 'ביטוח חיים' },
    { id: 'ins_disability', name: 'ביטוח אובדן כושר' }, { id: 'ins_accident', name: 'ביטוח תאונות אישיות' },
    { id: 'ins_nursing', name: 'ביטוח סיעודי' }, { id: 'ins_ambulatory', name: 'ביטוח אמבולטורי' },
    { id: 'ins_critical', name: 'ביטוח מחלות קשות' },
  ]},
  { id: 'entertainment', name: 'בילויים', icon: '🎭', subcategories: [
    { id: 'wolt', name: 'Wolt' }, { id: 'food_order', name: 'הזמנת מזון' },
    { id: 'tickets', name: 'כרטיסים' }, { id: 'vacation_abroad', name: 'חופשות בחו"ל' },
    { id: 'vacation_il', name: 'חופשה בישראל' },
  ]},
  { id: 'food', name: 'מזון', icon: '🛒', subcategories: [
    { id: 'supermarket', name: 'קניות בסופר' }, { id: 'butcher', name: 'קצבייה' },
    { id: 'market', name: 'קניות בשוק' }, { id: 'alcohol', name: 'אלכוהול ושתייה' },
  ]},
  { id: 'personal', name: 'אישי', icon: '👤', subcategories: [
    { id: 'pocket', name: 'דמי כיס' }, { id: 'tutoring', name: 'שיעורים פרטיים' },
    { id: 'alimony', name: 'מזונות' }, { id: 'bday_gifts', name: 'מתנות ימי הולדת' },
    { id: 'event_gifts', name: 'מתנות לאירועים' }, { id: 'atm', name: 'משיכת מזומן' },
  ]},
  { id: 'clothing', name: 'ביגוד והנעלה', icon: '👗', subcategories: [
    { id: 'clothes', name: 'בגדים' }, { id: 'shoes', name: 'נעליים' },
    { id: 'jewelry', name: 'תכשיטים' },
  ]},
  { id: 'savings', name: 'חיסכון', icon: '💰', subcategories: [
    { id: 'bank_savings', name: 'חיסכון חודשי בבנק' }, { id: 'ins_savings', name: 'חיסכון חודשי ביטוח' },
  ]},
  { id: 'loans', name: 'הלוואות', icon: '🏦', subcategories: [
    { id: 'cc_loan', name: 'הלוואה בכרטיס אשראי' }, { id: 'bank_loan', name: 'הלוואה בנקאית' },
    { id: 'other_loan', name: 'הלוואה אחרת' },
  ]},
];

const PAYMENT_METHODS = [
  { id: 'standing_order_bank', name: 'הו"ק בנקאי', icon: '🔄' },
  { id: 'standing_order_cc', name: 'הו"ק באשראי', icon: '🔁' },
  { id: 'credit_card', name: 'כרטיס אשראי', icon: '💳' },
  { id: 'bank_transfer', name: 'העברה בנקאית', icon: '🏦' },
  { id: 'cash', name: 'מזומן', icon: '💵' },
  { id: 'bit', name: 'Bit / Paybox', icon: '📱' },
  { id: 'cheque', name: 'שיק', icon: '📝' },
];

const FREQUENCIES = [
  { id: 'monthly', name: 'חודשי', months: 1 },
  { id: 'bimonthly', name: 'דו-חודשי', months: 2 },
  { id: 'quarterly', name: 'רבעוני', months: 3 },
  { id: 'semiannual', name: 'חצי שנתי', months: 6 },
  { id: 'annual', name: 'שנתי', months: 12 },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }
const fmt = (n) => '₪' + Number(n || 0).toLocaleString('he-IL', { maximumFractionDigits: 0 });
const freqLabel = (id) => FREQUENCIES.find(f => f.id === id)?.name || 'חודשי';
const freqMonths = (id) => FREQUENCIES.find(f => f.id === id)?.months || 1;

const makeHousehold = (id, name, adminUsername, adminPassword, adminName) => ({
  id, name, createdAt: new Date().toISOString(),
  users: [{ id: uid(), username: adminUsername, password: adminPassword, name: adminName, role: 'admin' }],
  bankAccounts: [], creditCards: [], vehicles: [], properties: [], familyMembers: [],
  categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
  fixedExpenses: [], variableExpenses: [], income: [],
});

function initData() {
  return {
    superAdmin: { username: 'superadmin', password: 'Super@123' },
    households: [
      makeHousehold('oren', 'אורן', 'oren_admin', 'Oren@123', 'אורן'),
      makeHousehold('odelia', 'אודליה', 'odelia_admin', 'Odelia@123', 'אודליה'),
    ]
  };
}

function migrateHousehold(sh, fresh) {
  return {
    ...fresh,
    ...sh,
    bankAccounts: sh.bankAccounts || [],
    creditCards: sh.creditCards || [],
    vehicles: sh.vehicles || [],
    properties: sh.properties || [],
    familyMembers: sh.familyMembers || [],
    categories: sh.categories || JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    fixedExpenses: sh.fixedExpenses || [],
    variableExpenses: sh.variableExpenses || [],
    income: sh.income || [],
    users: sh.users || fresh.users,
  };
}

function migrateData(saved) {
  const fresh = initData();
  if (saved.superAdmin) fresh.superAdmin = saved.superAdmin;
  const mergedHHs = fresh.households.map(fh => {
    const sh = saved.households?.find(h => h.id === fh.id);
    return sh ? migrateHousehold(sh, fh) : fh;
  });
  const extraHHs = (saved.households || []).filter(sh => !fresh.households.find(fh => fh.id === sh.id))
    .map(sh => migrateHousehold(sh, makeHousehold(sh.id, sh.name, '', '', sh.name)));
  return { ...fresh, households: [...mergedHHs, ...extraHHs] };
}


// ── SUPABASE STORAGE LAYER ─────────────────────────────────────────────────
async function loadData() {
  try {
    const { data, error } = await supabase
      .from('app_data')
      .select('value')
      .eq('key', 'budget_data')
      .single();
    if (!error && data?.value) return migrateData(JSON.parse(data.value));
  } catch {}
  const d = initData();
  await saveData(d);
  return d;
}

async function saveData(d) {
  try {
    await supabase.from('app_data').upsert(
      { key: 'budget_data', value: JSON.stringify(d), updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
  } catch (err) { console.error('Save error:', err); }
}

function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `budget_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importDataFromFile(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.households || !Array.isArray(parsed.households)) throw new Error('קובץ לא תקין');
      const migrated = migrateData(parsed);
      await saveData(migrated);
      onSuccess(migrated);
    } catch (err) { onError('שגיאה בייבוא: ' + err.message); }
  };
  reader.readAsText(file);
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c14;--surf:#0f1520;--surf2:#151d2e;--surf3:#1c2640;
  --border:#1e2d4a;--border2:#263652;
  --accent:#3b82f6;--accent2:#6366f1;--accentg:linear-gradient(135deg,#3b82f6,#6366f1);
  --green:#10b981;--red:#ef4444;--yellow:#f59e0b;--purple:#8b5cf6;
  --text:#e2e8f0;--text2:#94a3b8;--text3:#475569;
  --r:12px;--shadow:0 8px 32px rgba(0,0,0,0.6);
}
body{font-family:'Heebo',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;direction:rtl;overflow-x:hidden}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:var(--surf)}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(59,130,246,0.12) 0%,transparent 70%)}
.auth-card{background:var(--surf);border:1px solid var(--border2);border-radius:24px;padding:48px 44px;width:440px;max-width:96vw;box-shadow:var(--shadow)}
.auth-logo{font-size:2rem;font-weight:900;background:var(--accentg);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.auth-tagline{color:var(--text2);font-size:0.88rem;margin-bottom:36px}
.hh-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px}
.hh-card{background:var(--surf2);border:2px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:all .2s;text-align:center}
.hh-card:hover{border-color:var(--border2);background:var(--surf3)}.hh-card.sel{border-color:var(--accent);background:rgba(59,130,246,.08)}
.hh-card-name{font-weight:700;font-size:1rem;margin-top:4px}.hh-card-icon{font-size:1.6rem}
.fl{display:flex;flex-direction:column;gap:4px;margin-bottom:16px}.fl label{font-size:.8rem;color:var(--text2);font-weight:600}
.inp{width:100%;padding:11px 14px;background:var(--surf2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:.93rem;font-family:'Heebo',sans-serif;outline:none;transition:border .2s;direction:rtl}
.inp:focus{border-color:var(--accent)}select.inp{cursor:pointer}select.inp option{background:var(--surf2)}
.btn{padding:11px 20px;border:none;border-radius:10px;font-family:'Heebo',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s}
.btn-primary{background:var(--accentg);color:#fff;width:100%;padding:13px;font-size:1rem;margin-top:4px}.btn-primary:hover{opacity:.88;transform:translateY(-1px)}
.btn-sm{padding:7px 14px;font-size:.82rem;font-weight:600}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}.btn-ghost:hover{background:var(--surf3);color:var(--text)}
.btn-danger{background:transparent;color:var(--red);border:1px solid var(--red)}.btn-danger:hover{background:rgba(239,68,68,.1)}
.err{color:var(--red);font-size:.83rem;margin-top:10px;text-align:center;min-height:20px}
.layout{display:flex;min-height:100vh}
.sidebar{width:252px;background:var(--surf);border-left:1px solid var(--border);position:fixed;top:0;right:0;height:100vh;display:flex;flex-direction:column;z-index:50;overflow-y:auto}
.sb-logo{padding:24px 20px 20px;border-bottom:1px solid var(--border)}.sb-logo-text{font-size:1.25rem;font-weight:900;background:var(--accentg);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-hh{font-size:.75rem;color:var(--text2);font-weight:400;margin-top:2px}
.sb-section{padding:16px 16px 6px;font-size:.68rem;color:var(--text3);font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;color:var(--text2);font-size:.88rem;font-weight:500;transition:all .15s;border-right:3px solid transparent}
.nav-item:hover{color:var(--text);background:rgba(255,255,255,.03)}.nav-item.act{color:var(--accent);background:rgba(59,130,246,.07);border-right-color:var(--accent)}
.nav-icon{font-size:1rem;width:20px;text-align:center;flex-shrink:0}
.sb-footer{margin-top:auto;padding:16px 20px;border-top:1px solid var(--border)}.sb-user{font-size:.8rem;color:var(--text2);margin-bottom:10px}.sb-user b{color:var(--text);display:block;font-size:.88rem}
.main{margin-right:252px;padding:28px 32px;min-height:100vh;width:calc(100% - 252px)}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.pt{font-size:1.6rem;font-weight:900;letter-spacing:-.5px}.ps{color:var(--text2);font-size:.88rem;margin-top:4px}
.card{background:var(--surf);border:1px solid var(--border);border-radius:var(--r);padding:22px}.card+.card{margin-top:16px}
.card-title{font-size:.95rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat{background:var(--surf2);border:1px solid var(--border);border-radius:10px;padding:18px}
.stat-l{font-size:.75rem;color:var(--text2);margin-bottom:6px;font-weight:600}.stat-v{font-size:1.55rem;font-weight:800}
.stat-v.g{color:var(--green)}.stat-v.r{color:var(--red)}.stat-v.b{color:var(--accent)}.stat-v.y{color:var(--yellow)}
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.85rem}
th{padding:9px 12px;text-align:right;color:var(--text2);font-weight:600;font-size:.75rem;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:11px 12px;border-bottom:1px solid rgba(30,45,74,.6);vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:rgba(255,255,255,.015)}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:.72rem;font-weight:700;white-space:nowrap}
.bso{background:rgba(59,130,246,.15);color:#60a5fa}.bsocc{background:rgba(99,102,241,.15);color:#a5b4fc}
.bcc{background:rgba(167,139,250,.15);color:#c4b5fd}.bbt{background:rgba(16,185,129,.15);color:#6ee7b7}
.bca{background:rgba(245,158,11,.15);color:#fcd34d}.bbi{background:rgba(239,68,68,.15);color:#fca5a5}
.bchq{background:rgba(139,92,246,.15);color:#c4b5fd}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px}
.modal{background:var(--surf);border:1px solid var(--border2);border-radius:20px;padding:28px;width:640px;max-width:100%;max-height:92vh;overflow-y:auto;box-shadow:var(--shadow)}
.modal-title{font-size:1.15rem;font-weight:800;margin-bottom:22px;display:flex;align-items:center;gap:8px}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.frow.f3{grid-template-columns:1fr 1fr 1fr}.frow.f4{grid-template-columns:1fr 1fr 1fr 1fr}
.fgroup{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}.fgroup label{font-size:.78rem;color:var(--text2);font-weight:600}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)}
.cat-block{margin-bottom:12px;border-radius:var(--r);overflow:hidden;border:1px solid var(--border)}
.cat-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:var(--surf2);cursor:pointer;transition:background .15s}
.cat-head:hover{background:var(--surf3)}.cat-head-l{display:flex;align-items:center;gap:10px;font-weight:700;font-size:.93rem}
.cat-chevron{color:var(--text2);transition:transform .2s;font-size:.8rem}.cat-chevron.open{transform:rotate(180deg)}
.cat-body{background:var(--surf)}
.sc-row{display:grid;align-items:center;padding:10px 16px;font-size:.83rem;border-top:1px solid var(--border);gap:8px}
.sc-row:hover{background:rgba(255,255,255,.015)}.sc-name{font-weight:600}.sc-company{color:var(--text2);font-size:.78rem}
.act-btns{display:flex;gap:4px}
.ic-btn{background:none;border:none;cursor:pointer;color:var(--text3);font-size:.88rem;padding:4px 7px;border-radius:6px;transition:all .15s;font-family:'Heebo',sans-serif}
.ic-btn:hover{color:var(--accent);background:rgba(59,130,246,.1)}.ic-btn.del:hover{color:var(--red);background:rgba(239,68,68,.1)}
.cf-list-day{background:var(--surf2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px}
.cf-ld-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.cf-ld-num{font-size:1.1rem;font-weight:800;color:var(--accent)}.cf-ld-total{font-size:.85rem;font-weight:700;color:var(--red)}
.cf-ld-item{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-top:1px solid var(--border);font-size:.83rem}
.cf-ld-item-l{display:flex;align-items:center;gap:8px}
#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--green);color:#fff;padding:11px 22px;border-radius:10px;font-weight:700;font-size:.88rem;opacity:0;transition:all .3s;z-index:9999;pointer-events:none}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}#toast.err{background:var(--red)}
.tabs{display:flex;gap:3px;background:var(--surf2);border-radius:10px;padding:3px;width:fit-content;margin-bottom:20px;flex-wrap:wrap}
.tab{padding:7px 18px;border-radius:8px;border:none;background:transparent;color:var(--text2);font-family:'Heebo',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}
.tab.act{background:var(--accent);color:#fff}
.user-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surf2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--accentg);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.95rem;color:#fff;margin-left:12px;flex-shrink:0}
.user-info{flex:1}.user-name{font-weight:700;font-size:.9rem}.user-role{font-size:.75rem;color:var(--text2)}
.role-badge{padding:2px 8px;border-radius:6px;font-size:.7rem;font-weight:700;background:rgba(59,130,246,.15);color:var(--accent)}
.role-badge.admin{background:rgba(245,158,11,.15);color:var(--yellow)}
.fin-card{background:var(--surf2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.fin-card-l{display:flex;align-items:center;gap:12px}
.fin-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:var(--surf3)}
.fin-name{font-weight:700;font-size:.9rem}.fin-detail{font-size:.75rem;color:var(--text2);margin-top:2px}
.vehicle-card{background:var(--surf2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.vehicle-plate{font-size:1.1rem;font-weight:800;letter-spacing:2px;color:var(--accent)}
.chip{display:inline-block;padding:2px 7px;border-radius:6px;font-size:.72rem;font-weight:700;background:rgba(59,130,246,.12);color:var(--accent)}
.chip-y{background:rgba(245,158,11,.12);color:var(--yellow)}
.chip-g{background:rgba(16,185,129,.12);color:var(--green)}
.chip-p{background:rgba(139,92,246,.12);color:var(--purple)}
.info-box{padding:10px 14px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.12);border-radius:8px;font-size:.8rem;color:var(--text2);margin-bottom:12px}
.warn-box{padding:10px 14px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);border-radius:8px;font-size:.8rem;color:var(--yellow);margin-bottom:12px}
.period-box{background:rgba(59,130,246,.04);border:1px solid rgba(59,130,246,.1);border-radius:10px;padding:14px;margin-bottom:12px}
.ins-box{background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12);border-radius:10px;padding:14px;margin-bottom:12px}
hr{border:none;border-top:1px solid var(--border);margin:16px 0}.mt{margin-top:12px}
.empty{text-align:center;padding:32px;color:var(--text3);font-size:.88rem}
.loading{text-align:center;padding:60px;color:var(--text2);font-size:1rem}
.no-period-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:6px;font-size:.68rem;font-weight:700;background:rgba(245,158,11,.15);color:var(--yellow)}
.mobile-nav{display:none;position:fixed;bottom:0;right:0;left:0;background:var(--surf);border-top:1px solid var(--border);z-index:100;padding:8px 0 env(safe-area-inset-bottom,8px)}.mobile-nav-items{display:flex;justify-content:space-around}.mobile-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 12px;cursor:pointer;color:var(--text3);font-size:.6rem;font-weight:600;border-radius:8px;min-width:48px}.mobile-nav-item span:first-child{font-size:1.3rem}.mobile-nav-item.act{color:var(--accent)}
@media(max-width:768px){.sidebar{display:none}.mobile-nav{display:block}.main{margin-right:0;padding:16px 12px 80px;width:100%}.g2,.g3,.g4{grid-template-columns:1fr}.frow,.frow.f3,.frow.f4{grid-template-columns:1fr}.modal{padding:20px 16px}}
`;

// ── COMPONENTS ─────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return <div id="toast" className={msg ? `show ${type || ''}` : ''}>{msg}</div>;
}

function Modal({ open, title, children, onClose, wide }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { width: 720 } : {}}>
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

// ── AUTH ───────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, data }) {
  const [hh, setHh] = useState(null);
  const [isSA, setIsSA] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const login = () => {
    setErr('');
    if (isSA) {
      if (username === data.superAdmin.username && password === data.superAdmin.password)
        onLogin({ role: 'superadmin', name: 'מנהל ראשי' }, null);
      else setErr('שם משתמש או סיסמה שגויים');
      return;
    }
    if (!hh) { setErr('יש לבחור משק בית'); return; }
    const household = data.households.find(h => h.id === hh);
    const user = household?.users.find(u => u.username === username && u.password === password);
    if (!user) { setErr('שם משתמש או סיסמה שגויים'); return; }
    onLogin(user, household.id);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">💰 תקציב בית</div>
        <div className="auth-tagline">מערכת ניהול תקציב חכמה למשק הבית</div>
        {!isSA && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '.78rem', color: 'var(--text2)', fontWeight: 600, marginBottom: 8 }}>בחר משק בית</div>
            <div className="hh-grid">
              {data.households.map(h => (
                <div key={h.id} className={`hh-card${hh === h.id ? ' sel' : ''}`} onClick={() => setHh(h.id)}>
                  <div className="hh-card-icon">🏠</div>
                  <div className="hh-card-name">{h.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="fl"><label>שם משתמש</label>
          <input className="inp" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <div className="fl"><label>סיסמה</label>
          <input className="inp" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <button className="btn btn-primary" onClick={login}>כניסה למערכת</button>
        <div className="err">{err}</div>
        <hr style={{ margin: '20px 0 14px' }} />
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '.8rem', color: 'var(--text2)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsSA(!isSA); setErr(''); }}>
            {isSA ? '← חזור לכניסה רגילה' : 'כניסת מנהל ראשי'}
          </span>
        </div>
        <div style={{ marginTop: 14, padding: 10, background: 'rgba(59,130,246,.06)', borderRadius: 8, fontSize: '.75rem', color: 'var(--text2)' }}>
          <b style={{ color: 'var(--text)' }}>כניסה ראשונה:</b><br />
          אורן: <code style={{ background: 'var(--surf2)', padding: '1px 5px', borderRadius: 4 }}>oren_admin</code> / <code style={{ background: 'var(--surf2)', padding: '1px 5px', borderRadius: 4 }}>Oren@123</code><br />
          אודליה: <code style={{ background: 'var(--surf2)', padding: '1px 5px', borderRadius: 4 }}>odelia_admin</code> / <code style={{ background: 'var(--surf2)', padding: '1px 5px', borderRadius: 4 }}>Odelia@123</code>
        </div>
      </div>
    </div>
  );
}

// ── SUPER ADMIN ────────────────────────────────────────────────────────────
function SuperAdminPage({ onLogout, data, onDataChange }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', adminUser: '', adminPass: '', adminName: '' });
  const [err, setErr] = useState('');
  const [toast, setToast] = useState({});
  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast({}), 2500); };

  const addHH = async () => {
    if (!form.name || !form.adminUser || !form.adminPass) { setErr('יש למלא את כל השדות'); return; }
    const id = form.name.toLowerCase().replace(/\s/g, '_') + '_' + uid();
    const d = { ...data, households: [...data.households, makeHousehold(id, form.name, form.adminUser, form.adminPass, form.adminName || form.name)] };
    await saveData(d); onDataChange(d); setShowAdd(false); setForm({ name: '', adminUser: '', adminPass: '', adminName: '' }); showToast('נוסף בהצלחה');
  };
  const deleteHH = async (id) => {
    if (!confirm('למחוק?')) return;
    const d = { ...data, households: data.households.filter(h => h.id !== id) };
    await saveData(d); onDataChange(d); showToast('נמחק', 'err');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 32 }}>
      <Toast msg={toast.msg} type={toast.type} />
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="ph">
          <div><div className="pt">⚙️ מנהל ראשי</div><div className="ps">ניהול משקי בית</div></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setShowAdd(true)}>+ הוסף משק בית</button>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>יציאה</button>
          </div>
        </div>
        {data.households.map(hh => (
          <div key={hh.id} className="fin-card">
            <div className="fin-card-l"><div className="fin-icon">🏠</div>
              <div><div className="fin-name">{hh.name}</div><div className="fin-detail">{hh.users?.length || 0} משתמשים</div></div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteHH(hh.id)}>מחק</button>
          </div>
        ))}
      </div>
      <Modal open={showAdd} title="➕ הוסף משק בית" onClose={() => setShowAdd(false)}>
        <div className="frow">
          <div className="fgroup"><label>שם משק הבית</label><input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="fgroup"><label>שם המנהל</label><input className="inp" value={form.adminName} onChange={e => setForm({ ...form, adminName: e.target.value })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>שם משתמש</label><input className="inp" value={form.adminUser} onChange={e => setForm({ ...form, adminUser: e.target.value })} /></div>
          <div className="fgroup"><label>סיסמה</label><input className="inp" value={form.adminPass} onChange={e => setForm({ ...form, adminPass: e.target.value })} /></div>
        </div>
        <div className="err">{err}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={addHH}>צור</button>
        </div>
      </Modal>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ hh }) {
  const now = new Date(); const month = now.getMonth(); const year = now.getFullYear();
  const fixedTotal = (hh.fixedExpenses || []).reduce((s, e) => s + getMonthlyAmount(e, getActivePeriod(e, year, month), year, month), 0);
  const varTotal = (hh.variableExpenses || []).filter(e => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; }).reduce((s, e) => s + Number(e.amount), 0);
  const incTotal = (hh.income || []).reduce((s, i) => s + Number(i.amount), 0);
  const balance = incTotal - fixedTotal - varTotal;
  const total = fixedTotal + varTotal || 1;

  const catTotals = hh.categories.map(cat => {
    const fs = (hh.fixedExpenses || []).filter(e => e.catId === cat.id).reduce((s, e) => s + getMonthlyAmount(e, getActivePeriod(e, year, month), year, month), 0);
    const vs = (hh.variableExpenses || []).filter(e => { const d = new Date(e.date); return e.catId === cat.id && d.getMonth() === month && d.getFullYear() === year; }).reduce((s, e) => s + Number(e.amount), 0);
    return { ...cat, total: fs + vs };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  // Property costs
  const propCosts = (hh.properties || []).map(prop => {
    const t = (hh.fixedExpenses || []).filter(e => e.propertyId === prop.id).reduce((s, e) => s + getMonthlyAmount(e, getActivePeriod(e, year, month), year, month), 0);
    return { ...prop, total: t };
  }).filter(p => p.total > 0);

  // Vehicle costs
  const vehCosts = (hh.vehicles || []).map(v => {
    const ft = (hh.fixedExpenses || []).filter(e => e.vehicleId === v.id).reduce((s, e) => s + getMonthlyAmount(e, getActivePeriod(e, year, month), year, month), 0);
    const vt = (hh.variableExpenses || []).filter(e => { const d = new Date(e.date); return e.vehicleId === v.id && d.getMonth() === month && d.getFullYear() === year; }).reduce((s, e) => s + Number(e.amount), 0);
    return { ...v, total: ft + vt };
  }).filter(v => v.total > 0);

  return (
    <div>
      <div className="ph"><div><div className="pt">שלום 👋</div><div className="ps">משק בית {hh.name} · {now.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</div></div></div>
      <div className="g4" style={{ marginBottom: 20 }}>
        <div className="stat"><div className="stat-l">הכנסות</div><div className="stat-v g">{fmt(incTotal)}</div></div>
        <div className="stat"><div className="stat-l">הוצאות קבועות</div><div className="stat-v b">{fmt(fixedTotal)}</div></div>
        <div className="stat"><div className="stat-l">הוצאות משתנות</div><div className="stat-v y">{fmt(varTotal)}</div></div>
        <div className="stat"><div className="stat-l">יתרה צפויה</div><div className={`stat-v ${balance >= 0 ? 'g' : 'r'}`}>{fmt(balance)}</div></div>
      </div>
      <div className="g2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">📊 הוצאות לפי קטגוריה</div>
          {catTotals.length === 0 && <div className="empty">אין נתונים עדיין</div>}
          {catTotals.slice(0, 8).map(cat => (
            <div key={cat.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.83rem', marginBottom: 4 }}><span>{cat.icon} {cat.name}</span><span style={{ fontWeight: 700 }}>{fmt(cat.total)}</span></div>
              <div style={{ height: 6, background: 'var(--surf2)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, (cat.total / total) * 100)}%`, background: 'var(--accentg)', borderRadius: 3 }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">💡 תשלומים קרובים</div>
          {(hh.fixedExpenses || []).filter(e => { const p = getActivePeriod(e, year, month); return p && getMonthlyAmount(e, p, year, month) > 0; }).slice(0, 8).map(e => {
            const p = getActivePeriod(e, year, month); const amt = getMonthlyAmount(e, p, year, month);
            return (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.83rem' }}>
                <div><div style={{ fontWeight: 600 }}>{e.name}</div><div style={{ color: 'var(--text2)', fontSize: '.75rem' }}>{e.companyName} · יום {e.dayOfMonth} · {freqLabel(e.frequency)}</div></div>
                <div style={{ textAlign: 'left' }}><div style={{ fontWeight: 700 }}>{fmt(amt)}</div>{pmBadge(e.paymentMethod)}</div>
              </div>
            );
          })}
          {(hh.fixedExpenses || []).length === 0 && <div className="empty">אין הוצאות קבועות</div>}
        </div>
      </div>
      {(propCosts.length > 0 || vehCosts.length > 0) && (
        <div className="g2">
          {propCosts.length > 0 && (
            <div className="card">
              <div className="card-title">🏠 עלות לפי נכס</div>
              {propCosts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.85rem' }}>
                  <span>{p.name} {p.country ? <span className="chip">{p.country}</span> : ''}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(p.total)}</span>
                </div>
              ))}
            </div>
          )}
          {vehCosts.length > 0 && (
            <div className="card">
              <div className="card-title">🚗 עלות לפי רכב</div>
              {vehCosts.map(v => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.85rem' }}>
                  <span className="vehicle-plate" style={{ fontSize: '.85rem' }}>{v.plate}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(v.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── INCOME ─────────────────────────────────────────────────────────────────
function IncomePage({ hh, onUpdate }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    if (!form.name) { alert('יש להזין שם מקור'); return; }
    if (!form.amount) { alert('יש להזין סכום'); return; }
    const income = [...(hh.income || [])];
    if (form.id) { const i = income.findIndex(x => x.id === form.id); if (i >= 0) income[i] = { ...form }; }
    else income.push({ ...form, id: uid() });
    onUpdate({ ...hh, income }); setModal(false); setForm({});
  };
  const del = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, income: hh.income.filter(i => i.id !== id) }); };
  const total = (hh.income || []).reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div>
      <div className="ph">
        <div><div className="pt">💵 הכנסות</div><div className="ps">מקורות הכנסה חודשיים</div></div>
        <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal(true); }}>+ הוסף</button>
      </div>
      <div className="g3" style={{ marginBottom: 16 }}>
        <div className="stat"><div className="stat-l">סה"כ הכנסות</div><div className="stat-v g">{fmt(total)}</div></div>
        <div className="stat"><div className="stat-l">מקורות</div><div className="stat-v b">{(hh.income || []).length}</div></div>
      </div>
      <div className="card">
        {(hh.income || []).length === 0 && <div className="empty">אין הכנסות מוגדרות</div>}
        {(hh.income || []).map(inc => (
          <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{inc.name}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text2)' }}>{inc.notes}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 800, color: 'var(--green)' }}>{fmt(inc.amount)}</span>
              <button className="ic-btn" onClick={() => { setForm({ ...inc }); setModal(true); }}>✏️</button>
              <button className="ic-btn del" onClick={() => del(inc.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modal} title={form.id ? '✏️ עריכת הכנסה' : '➕ הוסף הכנסה'} onClose={() => { setModal(false); setForm({}); }}>
        <div className="frow">
          <div className="fgroup"><label>שם המקור *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="משכורת" /></div>
          <div className="fgroup">
            <label>סכום חודשי ₪ *</label>
            <input className="inp" type="number" step="100" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
          </div>
        </div>
        <div className="fgroup"><label>הערות</label><input className="inp" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { setModal(false); setForm({}); }}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={save}>שמור</button>
        </div>
      </Modal>
    </div>
  );
}

// ── FIXED EXPENSES ─────────────────────────────────────────────────────────
function FixedExpensesPage({ hh, onUpdate }) {
  const [openCats, setOpenCats] = useState({});
  const [modal, setModal] = useState(null);
  const [periodModal, setPeriodModal] = useState(null);
  const [editPeriodModal, setEditPeriodModal] = useState(null); // {exp, period}
  const [form, setForm] = useState({});
  const [pform, setPform] = useState({});
  const now = new Date();

  const allSources = [
    ...(hh.bankAccounts || []).map(b => ({ id: b.id, label: `🏦 ${b.bankName} - ${b.accountName}` })),
    ...(hh.creditCards || []).map(c => ({ id: c.id, label: `💳 ${c.name} ****${c.last4}` })),
  ];

  const isInsurance = form.catId === 'insurance';
  const isTransport = form.catId === 'transport';
  const isHousing = form.catId === 'housing';
  const isInstallment = Number(form.installments) > 1;

  const openAdd = (catId, subcatId) => {
    setForm({ catId, subcatId: subcatId || '', name: '', companyName: '', dayOfMonth: 1, paymentMethod: 'standing_order_bank', paymentSourceId: '', frequency: 'monthly', installments: 1, notes: '', periods: [] });
    setModal('add');
  };
  const openEdit = (exp) => { setForm({ ...exp, periods: exp.periods || [] }); setModal('edit'); };
  const deleteExpense = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, fixedExpenses: hh.fixedExpenses.filter(e => e.id !== id) }); };

  const saveExpense = () => {
    if (!form.name) { alert('יש להזין שם להוצאה'); return; }
    if (!form.catId) { alert('יש לבחור קטגוריה'); return; }

    // Build periods from the inline period fields
    let periods = form.id ? (hh.fixedExpenses.find(e => e.id === form.id)?.periods || []) : [];

    // Add periods from the up-to-3 period inputs
    const newPeriods = (form.newPeriods || []).filter(p => p.startDate && p.amount);
    if (newPeriods.length === 0 && !form.id) {
      alert('יש להזין לפחות תקופה אחת עם תאריך התחלה וסכום');
      return;
    }
    newPeriods.forEach(p => {
      const installments = Number(form.installments) || 1;
      if (installments > 1) {
        for (let i = 0; i < installments; i++) {
          const d = new Date(p.startDate); d.setMonth(d.getMonth() + i);
          const startStr = d.toISOString().slice(0, 10);
          const endD = new Date(d); endD.setMonth(endD.getMonth() + 1); endD.setDate(0);
          periods = [...periods, { id: uid(), startDate: startStr, endDate: endD.toISOString().slice(0, 10), amount: Number(p.amount), note: `תשלום ${i + 1}/${installments}` }];
        }
      } else {
        periods = [...periods, { id: uid(), startDate: p.startDate, endDate: p.endDate || null, amount: Number(p.amount), note: p.note || '' }];
      }
    });

    const expData = {
      name: form.name, companyName: form.companyName, catId: form.catId, subcatId: form.subcatId,
      dayOfMonth: form.dayOfMonth, paymentMethod: form.paymentMethod, paymentSourceId: form.paymentSourceId,
      frequency: form.frequency, installments: Number(form.installments) || 1, notes: form.notes,
      vehicleId: form.vehicleId || null, propertyId: form.propertyId || null,
      forMember: form.forMember || null,
      // Insurance fields
      insuredMain: form.insuredMain || '', insuredOthers: form.insuredOthers || '',
      policyNumber: form.policyNumber || '',
    };
    const expenses = [...(hh.fixedExpenses || [])];
    if (form.id) {
      const idx = expenses.findIndex(e => e.id === form.id);
      if (idx >= 0) expenses[idx] = { ...expenses[idx], ...expData, periods };
    } else {
      expenses.push({ ...expData, id: uid(), active: true, periods, createdAt: new Date().toISOString() });
    }
    onUpdate({ ...hh, fixedExpenses: expenses }); setModal(null); setForm({});
  };

  const savePeriod = () => {
    if (!pform.startDate || !pform.amount) { alert('יש להזין תאריך התחלה וסכום'); return; }
    const expenses = JSON.parse(JSON.stringify(hh.fixedExpenses));
    const exp = expenses.find(e => e.id === pform.expenseId);
    if (exp) exp.periods = [...(exp.periods || []), { id: uid(), startDate: pform.startDate, endDate: pform.endDate || null, amount: Number(pform.amount), note: pform.note || '' }];
    onUpdate({ ...hh, fixedExpenses: expenses }); setPeriodModal(null); setPform({});
  };

  const saveEditPeriod = () => {
    if (!editPeriodModal) return;
    const expenses = JSON.parse(JSON.stringify(hh.fixedExpenses));
    const exp = expenses.find(e => e.id === editPeriodModal.expId);
    if (exp) {
      const pi = exp.periods.findIndex(p => p.id === editPeriodModal.period.id);
      if (pi >= 0) exp.periods[pi] = { ...editPeriodModal.period };
    }
    onUpdate({ ...hh, fixedExpenses: expenses }); setEditPeriodModal(null);
  };

  const deletePeriod = (expId, periodId) => {
    if (!confirm('למחוק תקופה זו?')) return;
    const expenses = JSON.parse(JSON.stringify(hh.fixedExpenses));
    const exp = expenses.find(e => e.id === expId);
    if (exp) exp.periods = exp.periods.filter(p => p.id !== periodId);
    onUpdate({ ...hh, fixedExpenses: expenses });
  };

  const getSource = (exp) => {
    if (['credit_card', 'standing_order_cc'].includes(exp.paymentMethod)) {
      const cc = (hh.creditCards || []).find(c => c.id === exp.paymentSourceId);
      return cc ? `${cc.name} ****${cc.last4}` : '';
    }
    if (['standing_order_bank', 'bank_transfer'].includes(exp.paymentMethod)) {
      const ba = (hh.bankAccounts || []).find(b => b.id === exp.paymentSourceId);
      return ba ? ba.bankName : '';
    }
    return '';
  };

  // Initialize newPeriods with 1 empty row when opening add modal
  const initNewPeriods = () => [{ startDate: '', endDate: '', amount: '', note: '' }];

  return (
    <div>
      <div className="ph"><div><div className="pt">📋 הוצאות קבועות</div><div className="ps">ניהול הוצאות עם תקופות, תדירויות ותשלומים</div></div></div>
      {hh.categories.map(cat => {
        const catExps = (hh.fixedExpenses || []).filter(e => e.catId === cat.id);
        const open = openCats[cat.id];
        return (
          <div className="cat-block" key={cat.id}>
            <div className="cat-head" onClick={() => setOpenCats(s => ({ ...s, [cat.id]: !s[cat.id] }))}>
              <div className="cat-head-l">{cat.icon} {cat.name} {catExps.length > 0 && <span className="chip">{catExps.length}</span>}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span onClick={e => { e.stopPropagation(); openAdd(cat.id, null); }} style={{ fontSize: '.8rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>+ הוסף</span>
                <span className={`cat-chevron${open ? ' open' : ''}`}>▼</span>
              </div>
            </div>
            {open && (
              <div className="cat-body">
                {cat.subcategories.map(sc => {
                  const scExps = (hh.fixedExpenses || []).filter(e => e.catId === cat.id && e.subcatId === sc.id);
                  return (
                    <div key={sc.id}>
                      <div style={{ padding: '6px 16px', background: 'rgba(30,45,74,.3)', fontSize: '.72rem', color: 'var(--text2)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
                        <span>{sc.name}</span>
                        <span onClick={() => openAdd(cat.id, sc.id)} style={{ color: 'var(--accent)', cursor: 'pointer' }}>+ הוסף</span>
                      </div>
                      {scExps.map(exp => {
                        const p = getActivePeriod(exp, now.getFullYear(), now.getMonth());
                        const amt = getMonthlyAmount(exp, p, now.getFullYear(), now.getMonth());
                        const vehicle = exp.vehicleId ? (hh.vehicles || []).find(v => v.id === exp.vehicleId) : null;
                        const property = exp.propertyId ? (hh.properties || []).find(pr => pr.id === exp.propertyId) : null;
                        const member = exp.forMember ? (hh.familyMembers || []).find(m => m.id === exp.forMember) : null;
                        return (
                          <div key={exp.id} className="sc-row" style={{ gridTemplateColumns: '1.8fr 1fr 0.8fr 0.9fr 0.6fr 0.6fr 100px' }}>
                            <div>
                              <div className="sc-name">{exp.name}
                                {exp.installments > 1 && <span className="chip-y" style={{ marginRight: 5, fontSize: '.65rem' }}>{exp.installments}ת</span>}
                                {!p && <span className="no-period-badge" style={{ marginRight: 5 }}>⚠️ אין תקופה</span>}
                              </div>
                              <div className="sc-company">
                                {exp.companyName}
                                {vehicle && <span className="chip" style={{ marginRight: 4 }}>🚗 {vehicle.plate}</span>}
                                {property && <span className="chip-g" style={{ marginRight: 4, display: 'inline-block', padding: '2px 7px', borderRadius: 6, fontSize: '.65rem', fontWeight: 700 }}>🏠 {property.name}</span>}
                                {member && <span className="chip-p" style={{ marginRight: 4, display: 'inline-block', padding: '2px 7px', borderRadius: 6, fontSize: '.65rem', fontWeight: 700 }}>👤 {member.name}</span>}
                              </div>
                            </div>
                            <div style={{ fontSize: '.75rem', color: 'var(--text2)' }}>{getSource(exp)}</div>
                            <div style={{ fontWeight: 700 }}>{amt > 0 ? fmt(amt) : <span style={{ color: 'var(--text3)' }}>—</span>}</div>
                            <div>{pmBadge(exp.paymentMethod)}</div>
                            <div style={{ fontSize: '.7rem', color: 'var(--text2)' }}>{freqLabel(exp.frequency)}</div>
                            <div style={{ fontSize: '.7rem', color: 'var(--text2)' }}>יום {exp.dayOfMonth}</div>
                            <div className="act-btns">
                              <button className="ic-btn" title="הוסף תקופה" onClick={() => { setPform({ expenseId: exp.id }); setPeriodModal(exp); }}>📅</button>
                              <button className="ic-btn" onClick={() => openEdit(exp)}>✏️</button>
                              <button className="ic-btn del" onClick={() => deleteExpense(exp.id)}>🗑️</button>
                            </div>
                          </div>
                        );
                      })}
                      {scExps.length === 0 && <div style={{ padding: '6px 16px', fontSize: '.72rem', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>אין רשומות</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ADD/EDIT MODAL */}
      <Modal open={!!modal} title={modal === 'add' ? '➕ הוצאה קבועה חדשה' : '✏️ עריכת הוצאה'} onClose={() => { setModal(null); setForm({}); }} wide>
        <div className="frow">
          <div className="fgroup"><label>שם ההוצאה *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="לדוגמה: שכר דירה" /></div>
          <div className="fgroup"><label>שם החברה / ספק</label><input className="inp" value={form.companyName || ''} onChange={e => setForm({ ...form, companyName: e.target.value })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>קטגוריה</label>
            <select className="inp" value={form.catId || ''} onChange={e => setForm({ ...form, catId: e.target.value, subcatId: '' })}>
              <option value="">בחר</option>{hh.categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select></div>
          <div className="fgroup"><label>תת קטגוריה</label>
            <select className="inp" value={form.subcatId || ''} onChange={e => setForm({ ...form, subcatId: e.target.value })}>
              <option value="">בחר</option>{(hh.categories.find(c => c.id === form.catId)?.subcategories || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></div>
        </div>

        {/* Vehicle linking - transport only */}
        {isTransport && (hh.vehicles || []).length > 0 && (
          <div className="fgroup"><label>🚗 רכב משויך</label>
            <select className="inp" value={form.vehicleId || ''} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">— כללי —</option>{(hh.vehicles || []).map(v => <option key={v.id} value={v.id}>{v.plate} {v.make} {v.model}</option>)}
            </select></div>
        )}

        {/* Property linking - housing only */}
        {isHousing && (hh.properties || []).length > 0 && (
          <div className="fgroup"><label>🏠 נכס משויך</label>
            <select className="inp" value={form.propertyId || ''} onChange={e => setForm({ ...form, propertyId: e.target.value })}>
              <option value="">— כללי —</option>{(hh.properties || []).map(p => <option key={p.id} value={p.id}>{p.name} {p.country ? `(${p.country})` : ''}</option>)}
            </select></div>
        )}

        {/* For member - always */}
        {(hh.familyMembers || []).length > 0 && (
          <div className="fgroup"><label>👤 עבור מי</label>
            <select className="inp" value={form.forMember || ''} onChange={e => setForm({ ...form, forMember: e.target.value })}>
              <option value="">— כללי —</option>{(hh.familyMembers || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select></div>
        )}

        {/* Insurance specific fields */}
        {isInsurance && (
          <div className="ins-box">
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--purple)', marginBottom: 10 }}>🛡️ פרטי ביטוח</div>
            <div className="frow">
              <div className="fgroup"><label>מבוטח ראשי</label><input className="inp" value={form.insuredMain || ''} onChange={e => setForm({ ...form, insuredMain: e.target.value })} placeholder="שם מלא" /></div>
              <div className="fgroup"><label>מבוטחים נוספים</label><input className="inp" value={form.insuredOthers || ''} onChange={e => setForm({ ...form, insuredOthers: e.target.value })} placeholder="דנה, יובל..." /></div>
            </div>
            <div className="fgroup"><label>מספר פוליסה</label><input className="inp" value={form.policyNumber || ''} onChange={e => setForm({ ...form, policyNumber: e.target.value })} placeholder="123456789" /></div>
          </div>
        )}

        <div className="frow f3">
          <div className="fgroup"><label>אמצעי תשלום</label>
            <select className="inp" value={form.paymentMethod || ''} onChange={e => setForm({ ...form, paymentMethod: e.target.value, paymentSourceId: '' })}>
              {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select></div>
          <div className="fgroup"><label>חשבון / כרטיס</label>
            <select className="inp" value={form.paymentSourceId || ''} onChange={e => setForm({ ...form, paymentSourceId: e.target.value })}>
              <option value="">בחר מקור</option>{allSources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select></div>
          <div className="fgroup"><label>יום חיוב</label>
            <input className="inp" type="number" min="1" max="31" value={form.dayOfMonth || 1} onChange={e => setForm({ ...form, dayOfMonth: Number(e.target.value) })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>תדירות תשלום</label>
            <select className="inp" value={form.frequency || 'monthly'} onChange={e => setForm({ ...form, frequency: e.target.value })}>
              {FREQUENCIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select></div>
          <div className="fgroup"><label>מספר תשלומים (1 = קבוע)</label>
            <input className="inp" type="number" min="1" value={form.installments || 1} onChange={e => setForm({ ...form, installments: Number(e.target.value) })} /></div>
        </div>

        {/* Periods section */}
        <div className="period-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--accent)' }}>
              📅 תקופות ומחירים {modal === 'edit' ? '— הוספת תקופה חדשה' : ''}
            </div>
            {modal === 'add' && (form.newPeriods || []).length < 3 && (
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '.72rem', padding: '4px 10px' }}
                onClick={() => setForm({ ...form, newPeriods: [...(form.newPeriods || initNewPeriods()), { startDate: '', endDate: '', amount: '', note: '' }] })}>
                + הוסף תקופה
              </button>
            )}
          </div>
          <div className="info-box">הגדר תאריך התחלה, סיום וסכום. ניתן לשנות בעתיד — ההיסטוריה נשמרת תמיד.</div>

          {(form.newPeriods || initNewPeriods()).map((np, idx) => (
            <div key={idx} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: idx < (form.newPeriods || []).length - 1 ? '1px dashed var(--border)' : 'none' }}>
              {(form.newPeriods || []).length > 1 && <div style={{ fontSize: '.72rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 700 }}>תקופה {idx + 1}</div>}
              <div className="frow f3" style={{ marginBottom: 4 }}>
                <div className="fgroup"><label>תאריך התחלה *</label><input className="inp" type="date" value={np.startDate} onChange={e => { const ps = [...(form.newPeriods || initNewPeriods())]; ps[idx] = { ...ps[idx], startDate: e.target.value }; setForm({ ...form, newPeriods: ps }); }} /></div>
                <div className="fgroup"><label>תאריך סיום (ריק = פתוח)</label><input className="inp" type="date" value={np.endDate} onChange={e => { const ps = [...(form.newPeriods || initNewPeriods())]; ps[idx] = { ...ps[idx], endDate: e.target.value }; setForm({ ...form, newPeriods: ps }); }} /></div>
                <div className="fgroup"><label>סכום ₪ *</label><input className="inp" type="number" value={np.amount} onChange={e => { const ps = [...(form.newPeriods || initNewPeriods())]; ps[idx] = { ...ps[idx], amount: e.target.value }; setForm({ ...form, newPeriods: ps }); }} placeholder="₪" /></div>
              </div>
              <div className="fgroup"><label>הערה לתקופה</label><input className="inp" value={np.note} onChange={e => { const ps = [...(form.newPeriods || initNewPeriods())]; ps[idx] = { ...ps[idx], note: e.target.value }; setForm({ ...form, newPeriods: ps }); }} placeholder="למשל: חוזה 2025-2026" /></div>
            </div>
          ))}

          {isInstallment && (form.newPeriods || [])[0]?.amount && (
            <div style={{ fontSize: '.78rem', color: 'var(--yellow)', marginTop: 4 }}>
              💡 {form.installments} תשלומים × {fmt((form.newPeriods || [])[0]?.amount)} = סה"כ {fmt(Number((form.newPeriods || [])[0]?.amount) * Number(form.installments))}
            </div>
          )}

          {/* Show existing periods in edit mode */}
          {modal === 'edit' && form.id && (() => {
            const existing = (hh.fixedExpenses || []).find(e => e.id === form.id)?.periods || [];
            if (!existing.length) return null;
            return (
              <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text2)', fontWeight: 700, marginBottom: 6 }}>תקופות קיימות:</div>
                {existing.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.78rem', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text2)' }}>{new Date(p.startDate).toLocaleDateString('he-IL')} → {p.endDate ? new Date(p.endDate).toLocaleDateString('he-IL') : 'פתוח'}{p.note ? ` · ${p.note}` : ''}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700 }}>{fmt(p.amount)}</span>
                      <button className="ic-btn" style={{ fontSize: '.75rem' }} onClick={() => setEditPeriodModal({ expId: form.id, period: { ...p } })}>✏️</button>
                      <button className="ic-btn del" style={{ fontSize: '.75rem' }} onClick={() => deletePeriod(form.id, p.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="fgroup"><label>הערות</label><input className="inp" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { setModal(null); setForm({}); }}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveExpense}>שמור</button>
        </div>
      </Modal>

      {/* ADD PERIOD MODAL */}
      <Modal open={!!periodModal} title={`📅 הוסף תקופה — ${periodModal?.name}`} onClose={() => { setPeriodModal(null); setPform({}); }}>
        <div className="info-box">💡 תקופה חדשה שומרת מחיר עדכני — לא משנה היסטוריה</div>
        <div className="frow">
          <div className="fgroup"><label>תאריך התחלה *</label><input className="inp" type="date" value={pform.startDate || ''} onChange={e => setPform({ ...pform, startDate: e.target.value })} /></div>
          <div className="fgroup"><label>תאריך סיום (ריק = פתוח)</label><input className="inp" type="date" value={pform.endDate || ''} onChange={e => setPform({ ...pform, endDate: e.target.value })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>סכום ₪ *</label><input className="inp" type="number" value={pform.amount || ''} onChange={e => setPform({ ...pform, amount: e.target.value })} /></div>
          <div className="fgroup"><label>הערה</label><input className="inp" value={pform.note || ''} onChange={e => setPform({ ...pform, note: e.target.value })} placeholder="עדכון מדד, חוזה חדש..." /></div>
        </div>
        {(periodModal?.periods || []).length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: '.78rem', color: 'var(--text2)', fontWeight: 700, marginBottom: 6 }}>תקופות קיימות:</div>
            {periodModal.periods.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.8rem', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{new Date(p.startDate).toLocaleDateString('he-IL')} → {p.endDate ? new Date(p.endDate).toLocaleDateString('he-IL') : 'פתוח'}{p.note ? ` · ${p.note}` : ''}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>{fmt(p.amount)}</span>
                  <button className="ic-btn" style={{ fontSize: '.75rem' }} onClick={() => { setEditPeriodModal({ expId: pform.expenseId, period: { ...p } }); }}>✏️</button>
                  <button className="ic-btn del" style={{ fontSize: '.75rem' }} onClick={() => deletePeriod(pform.expenseId, p.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { setPeriodModal(null); setPform({}); }}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={savePeriod}>הוסף תקופה</button>
        </div>
      </Modal>

      {/* EDIT PERIOD MODAL */}
      <Modal open={!!editPeriodModal} title="✏️ עריכת תקופה" onClose={() => setEditPeriodModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>תאריך התחלה *</label><input className="inp" type="date" value={editPeriodModal?.period?.startDate || ''} onChange={e => setEditPeriodModal({ ...editPeriodModal, period: { ...editPeriodModal.period, startDate: e.target.value } })} /></div>
          <div className="fgroup"><label>תאריך סיום</label><input className="inp" type="date" value={editPeriodModal?.period?.endDate || ''} onChange={e => setEditPeriodModal({ ...editPeriodModal, period: { ...editPeriodModal.period, endDate: e.target.value } })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>סכום ₪ *</label><input className="inp" type="number" value={editPeriodModal?.period?.amount || ''} onChange={e => setEditPeriodModal({ ...editPeriodModal, period: { ...editPeriodModal.period, amount: e.target.value } })} /></div>
          <div className="fgroup"><label>הערה</label><input className="inp" value={editPeriodModal?.period?.note || ''} onChange={e => setEditPeriodModal({ ...editPeriodModal, period: { ...editPeriodModal.period, note: e.target.value } })} /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setEditPeriodModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveEditPeriod}>שמור שינויים</button>
        </div>
      </Modal>
    </div>
  );
}

// ── VARIABLE EXPENSES ──────────────────────────────────────────────────────
function VariableExpensesPage({ hh, onUpdate }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  const filtered = (hh.variableExpenses || []).filter(e => { const d = new Date(e.date); return d.getMonth() === filter.month && d.getFullYear() === filter.year; }).sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  const isTransport = form.catId === 'transport';
  const isHealth = form.catId === 'health';

  const save = () => {
    if (!form.name) { alert('יש להזין שם/תיאור'); return; }
    if (!form.amount) { alert('יש להזין סכום'); return; }
    if (!form.date) { alert('יש להזין תאריך'); return; }
    if (!form.catId) { alert('יש לבחור קטגוריה'); return; }
    const expenses = [...(hh.variableExpenses || [])];
    if (form.id) { const i = expenses.findIndex(e => e.id === form.id); if (i >= 0) expenses[i] = { ...form }; }
    else expenses.push({ ...form, id: uid(), createdAt: new Date().toISOString() });
    onUpdate({ ...hh, variableExpenses: expenses }); setModal(false); setForm({});
  };
  const del = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, variableExpenses: hh.variableExpenses.filter(e => e.id !== id) }); };
  const allSrc = [...(hh.bankAccounts || []).map(b => ({ id: b.id, label: `🏦 ${b.bankName}` })), ...(hh.creditCards || []).map(c => ({ id: c.id, label: `💳 ${c.name} ****${c.last4}` }))];

  const catTotals = hh.categories.map(cat => {
    const t = filtered.filter(e => e.catId === cat.id).reduce((s, e) => s + Number(e.amount), 0);
    return { ...cat, total: t };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="ph">
        <div><div className="pt">🛒 הוצאות משתנות</div><div className="ps">רישום הוצאות לא קבועות</div></div>
        <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({ date: new Date().toISOString().slice(0, 10), paymentMethod: 'credit_card' }); setModal(true); }}>+ הוסף</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="inp" style={{ width: 'auto', minWidth: 130 }} value={filter.month} onChange={e => setFilter({ ...filter, month: Number(e.target.value) })}>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="inp" style={{ width: 'auto' }} value={filter.year} onChange={e => setFilter({ ...filter, year: Number(e.target.value) })}>
            {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div style={{ marginRight: 'auto', fontWeight: 800 }}>סה"כ: <span style={{ color: 'var(--red)' }}>{fmt(total)}</span> · {filtered.length} פעולות</div>
        </div>
      </div>
      {catTotals.length > 0 && (
        <div className="g3" style={{ marginBottom: 16 }}>
          {catTotals.slice(0, 3).map(cat => (
            <div key={cat.id} className="stat"><div className="stat-l">{cat.icon} {cat.name}</div><div className="stat-v r">{fmt(cat.total)}</div></div>
          ))}
        </div>
      )}
      <div className="card">
        {filtered.length === 0 && <div className="empty">אין הוצאות לחודש זה</div>}
        <div className="tbl-wrap"><table>
          <thead><tr><th>תאריך</th><th>שם</th><th>קטגוריה</th><th>עבור</th><th>סכום</th><th>תשלום</th><th>הערות</th><th></th></tr></thead>
          <tbody>
            {filtered.map(e => {
              const cat = hh.categories.find(c => c.id === e.catId); const sc = cat?.subcategories?.find(s => s.id === e.subcatId);
              const vehicle = e.vehicleId ? (hh.vehicles || []).find(v => v.id === e.vehicleId) : null;
              const member = e.forMember ? (hh.familyMembers || []).find(m => m.id === e.forMember) : null;
              return (
                <tr key={e.id}>
                  <td style={{ color: 'var(--text2)' }}>{new Date(e.date).toLocaleDateString('he-IL')}</td>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td style={{ fontSize: '.8rem' }}>{cat?.icon} {cat?.name}{sc ? ` · ${sc.name}` : ''}</td>
                  <td style={{ fontSize: '.78rem' }}>
                    {vehicle && <span className="chip">🚗 {vehicle.plate}</span>}
                    {member && <span className="chip-p" style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 6, fontSize: '.68rem', fontWeight: 700, background: 'rgba(139,92,246,.12)', color: 'var(--purple)' }}>👤 {member.name}</span>}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--red)' }}>{fmt(e.amount)}</td>
                  <td>{pmBadge(e.paymentMethod)}</td>
                  <td style={{ color: 'var(--text2)', fontSize: '.8rem' }}>{e.notes}</td>
                  <td><div className="act-btns">
                    <button className="ic-btn" onClick={() => { setForm({ ...e }); setModal(true); }}>✏️</button>
                    <button className="ic-btn del" onClick={() => del(e.id)}>🗑️</button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
      </div>

      <Modal open={modal} title={form.id ? '✏️ עריכת הוצאה משתנה' : '➕ הוצאה משתנה'} onClose={() => { setModal(false); setForm({}); }}>
        <div className="frow">
          <div className="fgroup"><label>שם / תיאור *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="קניות שישי" /></div>
          <div className="fgroup"><label>תאריך *</label><input className="inp" type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>קטגוריה *</label>
            <select className="inp" value={form.catId || ''} onChange={e => setForm({ ...form, catId: e.target.value, subcatId: '', vehicleId: '', forMember: '' })}>
              <option value="">בחר</option>{hh.categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select></div>
          <div className="fgroup"><label>תת קטגוריה</label>
            <select className="inp" value={form.subcatId || ''} onChange={e => setForm({ ...form, subcatId: e.target.value })}>
              <option value="">בחר</option>{(hh.categories.find(c => c.id === form.catId)?.subcategories || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></div>
        </div>
        {isTransport && (hh.vehicles || []).length > 0 && (
          <div className="fgroup"><label>🚗 רכב</label>
            <select className="inp" value={form.vehicleId || ''} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">— כללי —</option>{(hh.vehicles || []).map(v => <option key={v.id} value={v.id}>{v.plate} {v.make} {v.model}</option>)}
            </select></div>
        )}
        {(hh.familyMembers || []).length > 0 && (
          <div className="fgroup"><label>👤 עבור מי</label>
            <select className="inp" value={form.forMember || ''} onChange={e => setForm({ ...form, forMember: e.target.value })}>
              <option value="">— כללי —</option>{(hh.familyMembers || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select></div>
        )}
        <div className="frow f3">
          <div className="fgroup"><label>סכום ₪ *</label><input className="inp" type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="fgroup"><label>אמצעי תשלום</label>
            <select className="inp" value={form.paymentMethod || ''} onChange={e => setForm({ ...form, paymentMethod: e.target.value, paymentSourceId: '' })}>
              {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select></div>
          <div className="fgroup"><label>חשבון / כרטיס</label>
            <select className="inp" value={form.paymentSourceId || ''} onChange={e => setForm({ ...form, paymentSourceId: e.target.value })}>
              <option value="">בחר</option>{allSrc.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select></div>
        </div>
        <div className="fgroup"><label>הערות</label><input className="inp" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { setModal(false); setForm({}); }}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={save}>שמור</button>
        </div>
      </Modal>
    </div>
  );
}

// ── CASHFLOW ───────────────────────────────────────────────────────────────
function CashflowPage({ hh }) {
  const [viewMode, setViewMode] = useState('list');
  const [selMonth, setSelMonth] = useState(new Date().getMonth());
  const [selYear, setSelYear] = useState(new Date().getFullYear());
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

  const items = [];
  (hh.fixedExpenses || []).filter(e => e.active !== false).forEach(exp => {
    const period = getActivePeriod(exp, selYear, selMonth); if (!period) return;
    const amt = getMonthlyAmount(exp, period, selYear, selMonth); if (amt === 0) return;
    const cc = ['credit_card', 'standing_order_cc'].includes(exp.paymentMethod) ? (hh.creditCards || []).find(c => c.id === exp.paymentSourceId) : null;
    const ba = ['standing_order_bank', 'bank_transfer'].includes(exp.paymentMethod) ? (hh.bankAccounts || []).find(b => b.id === exp.paymentSourceId) : null;
    items.push({ day: cc ? (cc.billingDay || exp.dayOfMonth) : exp.dayOfMonth, name: exp.name, amount: amt, paymentMethod: exp.paymentMethod, company: exp.companyName, sourceLabel: cc ? `${cc.name} ****${cc.last4}` : ba ? ba.bankName : '', frequency: exp.frequency });
  });

  const byDay = {}; items.forEach(i => { if (!byDay[i.day]) byDay[i.day] = []; byDay[i.day].push(i); });
  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b);
  const totalMonth = items.reduce((s, i) => s + i.amount, 0);
  const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();

  return (
    <div>
      <div className="ph"><div><div className="pt">📆 תזרים תשלומים</div><div className="ps">תשלומים לפי ימי חיוב</div></div></div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="inp" style={{ width: 'auto', minWidth: 130 }} value={selMonth} onChange={e => setSelMonth(Number(e.target.value))}>
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select className="inp" style={{ width: 'auto' }} value={selYear} onChange={e => setSelYear(Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <button className={`tab${viewMode === 'list' ? ' act' : ''}`} onClick={() => setViewMode('list')}>רשימה</button>
          <button className={`tab${viewMode === 'calendar' ? ' act' : ''}`} onClick={() => setViewMode('calendar')}>לוח</button>
        </div>
        <div style={{ marginRight: 'auto', fontWeight: 800 }}>סה"כ חודשי: <span style={{ color: 'var(--red)' }}>{fmt(totalMonth)}</span></div>
      </div>
      {viewMode === 'list' && (
        <div>
          {days.length === 0 && <div className="card"><div className="empty">אין תשלומים — הוסף הוצאות קבועות עם תקופות</div></div>}
          {days.map(day => (
            <div className="cf-list-day" key={day}>
              <div className="cf-ld-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="cf-ld-num">יום {day}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text2)' }}>{new Date(selYear, selMonth, day).toLocaleDateString('he-IL', { weekday: 'long' })}</div>
                </div>
                <div className="cf-ld-total">{fmt(byDay[day].reduce((s, i) => s + i.amount, 0))}</div>
              </div>
              {byDay[day].map((item, i) => (
                <div className="cf-ld-item" key={i}>
                  <div className="cf-ld-item-l">{pmBadge(item.paymentMethod)}
                    <div><div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text2)' }}>{item.company}{item.sourceLabel ? ` · ${item.sourceLabel}` : ''} · {freqLabel(item.frequency)}</div></div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--red)' }}>{fmt(item.amount)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {viewMode === 'calendar' && (
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 8 }}>
            {['א','ב','ג','ד','ה','ו','ש'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--text3)', fontWeight: 700 }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const di = byDay[day] || []; const dt = di.reduce((s, i) => s + i.amount, 0);
              return (
                <div key={day} style={{ background: di.length ? 'rgba(239,68,68,.04)' : 'var(--surf2)', border: `1px solid ${di.length ? 'rgba(239,68,68,.25)' : 'var(--border)'}`, borderRadius: 8, padding: 7, minHeight: 68 }}>
                  <div style={{ fontSize: '.65rem', color: 'var(--text2)', fontWeight: 700, marginBottom: 3 }}>{day}</div>
                  {di.slice(0, 2).map((item, i) => <div key={i} style={{ fontSize: '.58rem', padding: '1px 3px', background: 'rgba(239,68,68,.1)', color: '#fca5a5', borderRadius: 3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name.slice(0, 7)}</div>)}
                  {di.length > 2 && <div style={{ fontSize: '.55rem', color: 'var(--text2)' }}>+{di.length - 2}</div>}
                  {dt > 0 && <div style={{ fontSize: '.65rem', color: 'var(--red)', fontWeight: 700, marginTop: 2 }}>{fmt(dt)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADMIN ──────────────────────────────────────────────────────────────────
function AdminPage({ hh, onUpdate, currentUser }) {
  const [tab, setTab] = useState('banks');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  // Banks
  const saveBank = () => {
    if (!form.bankName || !form.accountName) { alert('יש למלא שם בנק ושם חשבון'); return; }
    const banks = [...(hh.bankAccounts || [])];
    if (form.id) { const i = banks.findIndex(b => b.id === form.id); if (i >= 0) banks[i] = form; } else banks.push({ ...form, id: uid() });
    onUpdate({ ...hh, bankAccounts: banks }); setModal(null); showToast('נשמר');
  };
  const deleteBank = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, bankAccounts: hh.bankAccounts.filter(b => b.id !== id) }); };

  // Credit Cards
  const saveCC = () => {
    if (!form.name || !form.last4) { alert('יש למלא שם וספרות אחרונות'); return; }
    const cards = [...(hh.creditCards || [])];
    if (form.id) { const i = cards.findIndex(c => c.id === form.id); if (i >= 0) cards[i] = form; } else cards.push({ ...form, id: uid() });
    onUpdate({ ...hh, creditCards: cards }); setModal(null); showToast('נשמר');
  };
  const deleteCC = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, creditCards: hh.creditCards.filter(c => c.id !== id) }); };

  // Vehicles
  const saveVehicle = () => {
    if (!form.plate) { alert('יש להזין מספר רישוי'); return; }
    const vehicles = [...(hh.vehicles || [])];
    if (form.id) { const i = vehicles.findIndex(v => v.id === form.id); if (i >= 0) vehicles[i] = form; } else vehicles.push({ ...form, id: uid() });
    onUpdate({ ...hh, vehicles }); setModal(null); showToast('נשמר');
  };
  const deleteVehicle = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, vehicles: hh.vehicles.filter(v => v.id !== id) }); };

  // Properties
  const saveProperty = () => {
    if (!form.name) { alert('יש להזין שם נכס'); return; }
    const properties = [...(hh.properties || [])];
    if (form.id) { const i = properties.findIndex(p => p.id === form.id); if (i >= 0) properties[i] = form; } else properties.push({ ...form, id: uid() });
    onUpdate({ ...hh, properties }); setModal(null); showToast('נשמר');
  };
  const deleteProperty = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, properties: hh.properties.filter(p => p.id !== id) }); };

  // Family Members
  const saveMember = () => {
    if (!form.name) { alert('יש להזין שם'); return; }
    const members = [...(hh.familyMembers || [])];
    if (form.id) { const i = members.findIndex(m => m.id === form.id); if (i >= 0) members[i] = form; } else members.push({ ...form, id: uid() });
    onUpdate({ ...hh, familyMembers: members }); setModal(null); showToast('נשמר');
  };
  const deleteMember = (id) => { if (!confirm('למחוק?')) return; onUpdate({ ...hh, familyMembers: hh.familyMembers.filter(m => m.id !== id) }); };

  // Users
  const saveUser = () => {
    if (!form.name || !form.username || !form.password) { alert('יש למלא את כל השדות'); return; }
    const users = [...(hh.users || [])];
    if (form.id) { const i = users.findIndex(u => u.id === form.id); if (i >= 0) users[i] = form; } else users.push({ ...form, id: uid() });
    onUpdate({ ...hh, users }); setModal(null); showToast('נשמר');
  };
  const deleteUser = (id) => {
    if (id === currentUser.id) { alert('לא ניתן למחוק את המשתמש הנוכחי'); return; }
    if (!confirm('למחוק?')) return;
    onUpdate({ ...hh, users: hh.users.filter(u => u.id !== id) });
  };

  // Categories
  const saveCategory = () => {
    if (!form.name) { alert('יש להזין שם קטגוריה'); return; }
    const cats = JSON.parse(JSON.stringify(hh.categories));
    if (form._type === 'subcat') {
      const cat = cats.find(c => c.id === form.catId);
      if (cat) {
        if (form.id) { const i = cat.subcategories.findIndex(s => s.id === form.id); if (i >= 0) cat.subcategories[i] = { id: form.id, name: form.name }; }
        else cat.subcategories.push({ id: uid(), name: form.name });
      }
    } else {
      if (form.id) { const i = cats.findIndex(c => c.id === form.id); if (i >= 0) cats[i] = { ...cats[i], name: form.name, icon: form.icon || cats[i].icon }; }
      else cats.push({ id: uid(), name: form.name, icon: form.icon || '📌', subcategories: [] });
    }
    onUpdate({ ...hh, categories: cats }); setModal(null); showToast('נשמר');
  };
  const deleteCategory = (catId, subcatId) => {
    if (!confirm('למחוק?')) return;
    const cats = JSON.parse(JSON.stringify(hh.categories));
    if (subcatId) { const cat = cats.find(c => c.id === catId); if (cat) cat.subcategories = cat.subcategories.filter(s => s.id !== subcatId); }
    else { const i = cats.findIndex(c => c.id === catId); if (i >= 0) cats.splice(i, 1); }
    onUpdate({ ...hh, categories: cats }); showToast('נמחק');
  };

  const tabs = [
    { id: 'banks', label: '🏦 בנקים' }, { id: 'cards', label: '💳 כרטיסים' },
    { id: 'vehicles', label: '🚗 רכבים' }, { id: 'properties', label: '🏠 נכסים' },
    { id: 'family', label: '👨‍👩‍👧 משפחה' }, { id: 'categories', label: '🗂️ קטגוריות' },
    { id: 'users', label: '👤 משתמשים' },
  ];

  return (
    <div>
      <Toast msg={toast} />
      <div className="ph"><div><div className="pt">⚙️ ניהול</div><div className="ps">הגדרות משק הבית</div></div></div>
      <div className="tabs">
        {tabs.map(t => <button key={t.id} className={`tab${tab === t.id ? ' act' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {/* BANKS */}
      {tab === 'banks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('bank'); }}>+ הוסף חשבון</button>
          </div>
          {(hh.bankAccounts || []).length === 0 && <div className="empty">אין חשבונות בנק</div>}
          {(hh.bankAccounts || []).map(b => (
            <div key={b.id} className="fin-card">
              <div className="fin-card-l"><div className="fin-icon">🏦</div>
                <div><div className="fin-name">{b.bankName}</div><div className="fin-detail">{b.accountName} {b.accountNumber ? `· ${b.accountNumber}` : ''}</div></div>
              </div>
              <div className="act-btns">
                <button className="ic-btn" onClick={() => { setForm({ ...b }); setModal('bank'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteBank(b.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CARDS */}
      {tab === 'cards' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('cc'); }}>+ הוסף כרטיס</button>
          </div>
          {(hh.creditCards || []).length === 0 && <div className="empty">אין כרטיסי אשראי</div>}
          {(hh.creditCards || []).map(c => (
            <div key={c.id} className="fin-card">
              <div className="fin-card-l"><div className="fin-icon">💳</div>
                <div><div className="fin-name">{c.name}</div><div className="fin-detail">****{c.last4} {c.network ? `· ${c.network}` : ''} {c.billingDay ? `· יום חיוב ${c.billingDay}` : ''}</div></div>
              </div>
              <div className="act-btns">
                <button className="ic-btn" onClick={() => { setForm({ ...c }); setModal('cc'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteCC(c.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VEHICLES */}
      {tab === 'vehicles' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('vehicle'); }}>+ הוסף רכב</button>
          </div>
          {(hh.vehicles || []).length === 0 && <div className="empty">אין רכבים</div>}
          {(hh.vehicles || []).map(v => (
            <div key={v.id} className="vehicle-card">
              <div className="fin-card-l"><div className="fin-icon">🚗</div>
                <div><div className="vehicle-plate">{v.plate}</div><div className="fin-detail">{v.make} {v.model} {v.year ? `· ${v.year}` : ''}</div></div>
              </div>
              <div className="act-btns">
                <button className="ic-btn" onClick={() => { setForm({ ...v }); setModal('vehicle'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteVehicle(v.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROPERTIES */}
      {tab === 'properties' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('property'); }}>+ הוסף נכס</button>
          </div>
          {(hh.properties || []).length === 0 && <div className="empty">אין נכסים מוגדרים</div>}
          {(hh.properties || []).map(p => (
            <div key={p.id} className="fin-card">
              <div className="fin-card-l"><div className="fin-icon">🏠</div>
                <div>
                  <div className="fin-name">{p.name} {p.country && <span className="chip">{p.country}</span>}</div>
                  <div className="fin-detail">{p.address}</div>
                </div>
              </div>
              <div className="act-btns">
                <button className="ic-btn" onClick={() => { setForm({ ...p }); setModal('property'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteProperty(p.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAMILY MEMBERS */}
      {tab === 'family' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('member'); }}>+ הוסף בן משפחה</button>
          </div>
          {(hh.familyMembers || []).length === 0 && <div className="empty">אין בני משפחה מוגדרים</div>}
          {(hh.familyMembers || []).map(m => (
            <div key={m.id} className="user-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="avatar" style={{ background: 'var(--purple)' }}>{m.name[0]}</div>
                <div className="user-info"><div className="user-name">{m.name}</div><div className="user-role">{m.relation || ''}</div></div>
              </div>
              <div className="act-btns">
                <button className="ic-btn" onClick={() => { setForm({ ...m }); setModal('member'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteMember(m.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORIES */}
      {tab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({ _type: 'cat', icon: '📌' }); setModal('category'); }}>+ קטגוריה חדשה</button>
          </div>
          {hh.categories.map(cat => (
            <div className="cat-block" key={cat.id}>
              <div className="cat-head" style={{ cursor: 'default' }}>
                <div className="cat-head-l">{cat.icon} {cat.name}</div>
                <div className="act-btns">
                  <button className="ic-btn" style={{ fontSize: '.75rem' }} onClick={() => { setForm({ _type: 'subcat', catId: cat.id, name: '' }); setModal('category'); }}>+ תת-קטגוריה</button>
                  <button className="ic-btn" onClick={() => { setForm({ _type: 'cat', id: cat.id, name: cat.name, icon: cat.icon }); setModal('category'); }}>✏️</button>
                  <button className="ic-btn del" onClick={() => deleteCategory(cat.id, null)}>🗑️</button>
                </div>
              </div>
              <div className="cat-body">
                {cat.subcategories.map(sc => (
                  <div key={sc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 16px', borderTop: '1px solid var(--border)', fontSize: '.83rem' }}>
                    <span>{sc.name}</span>
                    <div className="act-btns">
                      <button className="ic-btn" onClick={() => { setForm({ _type: 'subcat', catId: cat.id, id: sc.id, name: sc.name }); setModal('category'); }}>✏️</button>
                      <button className="ic-btn del" onClick={() => deleteCategory(cat.id, sc.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => { setForm({}); setModal('user'); }}>+ הוסף משתמש</button>
          </div>
          {(hh.users || []).map(u => (
            <div key={u.id} className="user-row">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="avatar">{u.name[0]}</div>
                <div className="user-info"><div className="user-name">{u.name}</div><div className="user-role">{u.username}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`role-badge${u.role === 'admin' ? ' admin' : ''}`}>{u.role === 'admin' ? 'מנהל' : 'חבר'}</span>
                <button className="ic-btn" onClick={() => { setForm({ ...u }); setModal('user'); }}>✏️</button>
                <button className="ic-btn del" onClick={() => deleteUser(u.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <Modal open={modal === 'bank'} title={form.id ? '✏️ עריכת חשבון' : '🏦 הוסף חשבון בנק'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>שם הבנק *</label><input className="inp" value={form.bankName || ''} onChange={e => setForm({ ...form, bankName: e.target.value })} placeholder="לאומי, הפועלים..." /></div>
          <div className="fgroup"><label>שם החשבון *</label><input className="inp" value={form.accountName || ''} onChange={e => setForm({ ...form, accountName: e.target.value })} placeholder="חשבון משותף" /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>מספר חשבון</label><input className="inp" value={form.accountNumber || ''} onChange={e => setForm({ ...form, accountNumber: e.target.value })} /></div>
          <div className="fgroup"><label>סניף</label><input className="inp" value={form.branch || ''} onChange={e => setForm({ ...form, branch: e.target.value })} /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveBank}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'cc'} title={form.id ? '✏️ עריכת כרטיס' : '💳 הוסף כרטיס אשראי'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>שם הכרטיס *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ויזה כאל" /></div>
          <div className="fgroup"><label>4 ספרות אחרונות *</label><input className="inp" maxLength={4} value={form.last4 || ''} onChange={e => setForm({ ...form, last4: e.target.value })} placeholder="1234" /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>רשת</label><input className="inp" value={form.network || ''} onChange={e => setForm({ ...form, network: e.target.value })} placeholder="Visa, Mastercard..." /></div>
          <div className="fgroup"><label>יום חיוב</label><input className="inp" type="number" min="1" max="31" value={form.billingDay || ''} onChange={e => setForm({ ...form, billingDay: e.target.value })} /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveCC}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'vehicle'} title={form.id ? '✏️ עריכת רכב' : '🚗 הוסף רכב'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>מספר רישוי *</label><input className="inp" value={form.plate || ''} onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })} placeholder="12-345-67" /></div>
          <div className="fgroup"><label>יצרן</label><input className="inp" value={form.make || ''} onChange={e => setForm({ ...form, make: e.target.value })} placeholder="Toyota, Hyundai..." /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>דגם</label><input className="inp" value={form.model || ''} onChange={e => setForm({ ...form, model: e.target.value })} /></div>
          <div className="fgroup"><label>שנת ייצור</label><input className="inp" type="number" min="1990" max="2030" value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
        </div>
        <div className="fgroup"><label>הערות</label><input className="inp" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveVehicle}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'property'} title={form.id ? '✏️ עריכת נכס' : '🏠 הוסף נכס'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>שם הנכס *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="דירה בתל אביב" /></div>
          <div className="fgroup"><label>מדינה</label><input className="inp" value={form.country || ''} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="ישראל, איטליה..." /></div>
        </div>
        <div className="fgroup"><label>כתובת</label><input className="inp" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="רח' הרצל 1, תל אביב" /></div>
        <div className="fgroup"><label>הערות</label><input className="inp" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveProperty}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'member'} title={form.id ? '✏️ עריכת בן משפחה' : '👨‍👩‍👧 הוסף בן משפחה'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>שם *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="גילי" /></div>
          <div className="fgroup"><label>קשר משפחתי</label><input className="inp" value={form.relation || ''} onChange={e => setForm({ ...form, relation: e.target.value })} placeholder="בן, בת, בן/בת זוג..." /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveMember}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'category'} title={form._type === 'subcat' ? (form.id ? '✏️ עריכת תת-קטגוריה' : '➕ תת-קטגוריה חדשה') : (form.id ? '✏️ עריכת קטגוריה' : '➕ קטגוריה חדשה')} onClose={() => setModal(null)}>
        {form._type === 'cat' && (
          <div className="frow">
            <div className="fgroup"><label>שם הקטגוריה *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="fgroup"><label>אייקון (אמוג'י)</label><input className="inp" value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📌" /></div>
          </div>
        )}
        {form._type === 'subcat' && (
          <div className="fgroup"><label>שם תת-הקטגוריה *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveCategory}>שמור</button>
        </div>
      </Modal>

      <Modal open={modal === 'user'} title={form.id ? '✏️ עריכת משתמש' : '👤 הוסף משתמש'} onClose={() => setModal(null)}>
        <div className="frow">
          <div className="fgroup"><label>שם מלא *</label><input className="inp" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="fgroup"><label>שם משתמש *</label><input className="inp" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        </div>
        <div className="frow">
          <div className="fgroup"><label>סיסמה *</label><input className="inp" type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <div className="fgroup"><label>תפקיד</label>
            <select className="inp" value={form.role || 'member'} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="member">חבר</option><option value="admin">מנהל</option>
            </select></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>ביטול</button>
          <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={saveUser}>שמור</button>
        </div>
      </Modal>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null); // null = loading
  const [toast, setToast] = useState({});

  const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast({}), 2500); };

  // Load from Supabase on mount
  useEffect(() => {
    loadData().then(d => setData(d));
  }, []);

  const hh = householdId && data ? data.households.find(h => h.id === householdId) : null;

  const updateHH = useCallback(async (updated) => {
    const d = { ...data, households: data.households.map(h => h.id === updated.id ? updated : h) };
    await saveData(d); setData(d); showToast('נשמר ✓');
  }, [data]);

  const handleLogin = (user, hhId) => { setCurrentUser(user); setHouseholdId(hhId); setPage(user.role === 'superadmin' ? 'superadmin' : 'dashboard'); };
  const logout = () => { setCurrentUser(null); setHouseholdId(null); setPage('dashboard'); };

  if (!data) return <><style>{CSS}</style><div className="loading">⏳ טוען נתונים...</div></>;
  if (!currentUser) return <><style>{CSS}</style><AuthPage onLogin={handleLogin} data={data} /></>;
  if (currentUser.role === 'superadmin') return <><style>{CSS}</style><SuperAdminPage onLogout={logout} data={data} onDataChange={setData} /></>;

  const isAdmin = currentUser.role === 'admin';
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'דשבורד' },
    { id: 'income', icon: '💵', label: 'הכנסות' },
    { id: 'fixed', icon: '📋', label: 'הוצאות קבועות' },
    { id: 'variable', icon: '🛒', label: 'הוצאות משתנות' },
    { id: 'cashflow', icon: '📆', label: 'תזרים' },
    ...(isAdmin ? [{ id: 'admin', icon: '⚙️', label: 'ניהול' }] : []),
  ];

  return (
    <>
      <style>{CSS}</style>
      <Toast msg={toast.msg} type={toast.type} />
      <div className="layout">
        <div className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-text">💰 תקציב בית</div>
            <div className="sb-hh">משק בית {hh?.name}</div>
          </div>
          <div className="sb-section">תפריט</div>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item${page === n.id ? ' act' : ''}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </div>
          ))}
          <div className="sb-footer">
            <div className="sb-user"><b>{currentUser.name}</b>{isAdmin ? ' · מנהל' : ' · חבר'}</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: '.72rem', padding: '6px 8px' }} title="ייצא נתונים" onClick={() => exportData(data)}>⬇️ ייצוא</button>
              <label className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: '.72rem', padding: '6px 8px', cursor: 'pointer', textAlign: 'center' }} title="ייבא נתונים">
                ⬆️ ייבוא
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
                  const f = e.target.files[0]; if (!f) return;
                  importDataFromFile(f, (migrated) => { setData(migrated); showToast('נתונים יובאו בהצלחה ✓'); }, (err) => showToast(err, 'err'));
                  e.target.value = '';
                }} />
              </label>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={logout}>יציאה</button>
          </div>
        </div>
        <div className="main">
          {hh && (
            <>
              {page === 'dashboard' && <Dashboard hh={hh} />}
              {page === 'income' && <IncomePage hh={hh} onUpdate={updateHH} />}
              {page === 'fixed' && <FixedExpensesPage hh={hh} onUpdate={updateHH} />}
              {page === 'variable' && <VariableExpensesPage hh={hh} onUpdate={updateHH} />}
              {page === 'cashflow' && <CashflowPage hh={hh} />}
              {page === 'admin' && isAdmin && <AdminPage hh={hh} onUpdate={updateHH} currentUser={currentUser} />}
            </>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {navItems.map(n => (
            <div key={n.id} className={`mobile-nav-item${page === n.id ? ' act' : ''}`} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
