# Enquiry form → Google Sheet + Email (setup, ~5 minutes)

Website ke form ki har enquiry ek Google Sheet mein save hogi aur aapke email par aayegi.
Yeh sirf ek baar karna hai.

## 1. Google Sheet banayein
1. [sheets.new](https://sheets.new) kholein (apne Google account se).
2. Sheet ka naam rakhein, jaise **Sangeet Manjari – Enquiries**.

## 2. Script daalein
1. Sheet mein menu: **Extensions → Apps Script**.
2. Wahan jo bhi code hai, sab hata dein.
3. Is repo ki file **`google-apps-script.gs`** ka poora code copy karke paste karein.
4. Upar line `const NOTIFY_EMAIL = "your-email@gmail.com";` mein apna email daalein.
5. **Save** (💾) dabayein.

## 3. Web app ke roop mein deploy karein
1. Upar right: **Deploy → New deployment**.
2. ⚙️ (Select type) → **Web app**.
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. **Deploy** → Google permission maangega → **Authorize access** → apna account chunein
   → "Google hasn't verified this app" aaye to **Advanced → Go to … (unsafe)** → **Allow**.
   (Yeh aapki apni script hai, isliye yeh message normal hai.)
5. Jo **Web app URL** mile (`https://script.google.com/macros/s/…/exec`), use copy karein.

## 4. Website se jodein
1. `sangeetmanjari.me/admin.html` kholein → **Contact & links**.
2. **Enquiry form link (Google Script)** mein woh URL paste karein.
3. **Publish to website** dabayein.

## 5. Test karein
Website par form bharein → Sheet mein nayi row aani chahiye aur email aana chahiye.

---

**Script mein badlav kiya?** Deploy → **Manage deployments** → ✏️ → Version: **New version** → Deploy.
(URL wahi rehta hai.)

**Email nahi aa raha?** Spam folder dekhein, aur `NOTIFY_EMAIL` sahi hai yeh check karein.
