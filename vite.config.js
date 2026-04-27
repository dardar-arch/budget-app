# 💰 תקציב בית — הוראות התקנה

## שלב 1 — הכנת Supabase
1. היכנס ל-[supabase.com](https://supabase.com) → הפרויקט שלך
2. לחץ על **SQL Editor** בתפריט השמאלי
3. לחץ **New Query**
4. הדבק את תוכן הקובץ `supabase-setup.sql`
5. לחץ **Run** ✓

## שלב 2 — העלאה ל-GitHub
1. היכנס ל-[github.com](https://github.com) → **New Repository**
2. שם: `budget-app` (ציבורי או פרטי — לא משנה)
3. לחץ **Create repository**
4. העלה את כל הקבצים מתיקייה זו

## שלב 3 — פריסה ב-Vercel
1. היכנס ל-[vercel.com](https://vercel.com) → **New Project**
2. בחר את ה-Repository `budget-app`
3. לחץ **Deploy**
4. לאחר הפריסה → **Settings → Environment Variables** → הוסף:
   - `VITE_SUPABASE_URL` = הכתובת שלך
   - `VITE_SUPABASE_ANON_KEY` = המפתח שלך
5. לחץ **Redeploy**

## שלב 4 — שימוש
- מחשב: פתח את הכתובת שקיבלת מ-Vercel
- נייד: פתח אותה כתובת בדפדפן → Add to Home Screen
- כניסה ראשונה: `oren_admin` / `Oren@123`

## נתונים
- נשמרים אוטומטית ב-Supabase לאחר כל שינוי
- מסונכרנים בין כל המכשירים בזמן אמת
- ייצוא/ייבוא JSON זמין בסרגל הצדדי
