

const K='class_web_v1';let D={students:[],classes:[],reports:[],notes:{},settings:{},events:[],grades:[],finals:[],terms:[],archivedStudents:[],studentHistory:[]},V='t',Q='',P=7,PR=null,CI=-1,SV=null,FS=null,FC='',FT='',CORRUPT=false;
try{const x=JSON.parse(localStorage.getItem(K)||'null');if(x&&Array.isArray(x.students))D=Object.assign(D,x)}catch(e){CORRUPT=true;try{const raw=localStorage.getItem(K);if(raw)localStorage.setItem(K+'_corrupt_'+Date.now(),raw)}catch(_){}}
const A=()=>D.students,C=()=>D.classes,R=()=>D.reports,$=s=>document.querySelector(s);
D.archivedStudents=Array.isArray(D.archivedStudents)?D.archivedStudents:[];D.studentHistory=Array.isArray(D.studentHistory)?D.studentHistory:[];D.finals=Array.isArray(D.finals)?D.finals:[];D.terms=Array.isArray(D.terms)?D.terms:[];
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ---- undo / redo: snapshots of all app data (people + finance), kept in memory for this session ----
let UNDO=[],REDO=[],LAST=null,LT=0;
const snap=()=>{try{return JSON.stringify([D,FN])}catch(e){return null}};
function undoUI(){const u=$('#ud'),r=$('#rd');if(u){u.disabled=!UNDO.length;u.title='برگشت (Ctrl+Z)'+(UNDO.length?' — '+UNDO.length+' مرحله':'')}if(r){r.disabled=!REDO.length;r.title='جلوتر (Ctrl+Y)'+(REDO.length?' — '+REDO.length+' مرحله':'')}}
const track=()=>{if(LAST===null)return;const c=snap();if(c===null||c===LAST)return;const n=Date.now();if(n-LT>400){UNDO.push(LAST);if(UNDO.length>40)UNDO.shift()}LT=n;LAST=c;REDO=[];undoUI()};
function applySnap(t){const a=JSON.parse(t);D=Object.assign({students:[],classes:[],reports:[],notes:{},settings:{},events:[],grades:[]},a[0]);FN=Fin.fix(a[1]);try{localStorage.setItem(K,JSON.stringify(D));localStorage.setItem(KF,JSON.stringify(FN))}catch(e){toast('ذخیره‌سازی مرورگر در دسترس نیست')}LAST=t;LT=0;document.querySelectorAll('.ov').forEach(x=>x.remove());if(CI>=C().length)CI=-1;if(CPV>=C().length)CPV=-1;if(SV!=null&&!A()[SV])SV=null;FS=null;if(V=='f')V='r';KD=null;KS=null;MSV=null;GA=GA&&A().some(s=>s.code==GA)?GA:null;draw();undoUI()}
function undo(){if(!UNDO.length){toast('چیزی برای برگشت نیست');return}const t=UNDO.pop();REDO.push(LAST);applySnap(t);toast('↶ برگشت انجام شد')}
function redo(){if(!REDO.length){toast('چیزی برای جلوتر رفتن نیست');return}const t=REDO.pop();UNDO.push(LAST);applySnap(t);toast('↷ جلوتر رفتن انجام شد')}
addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey)return;const k=e.key.toLowerCase();if(!['z','y'].includes(k))return;const el=document.activeElement;if(el&&/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el&&el.isContentEditable)return;e.preventDefault();if(k=='y'||e.shiftKey)redo();else undo()});
const save=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){toast('ذخیره‌سازی مرورگر در دسترس نیست')}track()};
// ---- backup reminder: when was the last manual backup taken? (device-local, never inside a backup) ----
const LEK='class_last_export';
const lastExport=()=>{try{return +(localStorage.getItem(LEK)||0)}catch(e){return 0}};
const markExport=()=>{try{localStorage.setItem(LEK,String(Date.now()))}catch(e){}try{bkChip()}catch(e){}};
const bkDays=()=>{const t=lastExport();return t?Math.max(0,Math.floor((Date.now()-t)/864e5)):-1};
function backupWarn(){let s='';if(CORRUPT)s+='<div class="w">⚠️ بخشی از داده‌ها خوانده نشد و در حافظهٔ مرورگر دست‌نخورده ماند. از «نسخه‌های خودکار» یا آخرین پشتیبان بازیابی کنید.</div>';const d=bkDays();if(A().length||C().length||R().length){if(d<0)s+='<div class="w">⚠️ هنوز از داده‌ها پشتیبان نگرفته‌اید؛ از «تنظیمات» یک فایل پشتیبان بگیرید.</div>';else if(d>=7)s+=`<div class="w">⚠️ آخرین پشتیبان ${d} روز پیش بوده است؛ یک نسخهٔ تازه بگیرید.</div>`}return s}
function toast(s){const t=$('#ts');t.textContent=s;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',3500)}
const norm=s=>String(s??'').replace(/\u0627\u0653/g,'\u0622').replace(/[يى]/g,'ی').replace(/[أإٱ]/g,'ا').replace(/[ةۀ]/g,'ه').replace(/ك/g,'ک').replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776).replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632).replace(/[\u200c\u00a0]/g,' ').replace(/[\u200d\u200e\u200f\u0640\u0670\ufeff\u064b-\u0655]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const dg=s=>String(s??'').replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776).replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632).trim();
// ---- dates ----
function toJ(gy,gm,gd){const g=[0,31,59,90,120,151,181,212,243,273,304,334],y2=gm>2?gy+1:gy;let d=355666+365*gy+((y2+3)/4|0)-((y2+99)/100|0)+((y2+399)/400|0)+gd+g[gm-1],jy=-1595+33*(d/12053|0),jm,jd;d%=12053;jy+=4*(d/1461|0);d%=1461;if(d>365){jy+=(d-1)/365|0;d=(d-1)%365}if(d<186){jm=1+(d/31|0);jd=1+d%31}else{jm=7+((d-186)/30|0);jd=1+(d-186)%30}return[jy,jm,jd]}
function toG(jy,jm,jd){jy+=1595;let d=-355668+365*jy+((jy/33|0)*8)+(((jy%33)+3)/4|0)+jd+(jm<7?(jm-1)*31:(jm-7)*30+186),gy=400*(d/146097|0);d%=146097;if(d>36524){gy+=100*(--d/36524|0);d%=36524;if(d>=365)d++}gy+=4*(d/1461|0);d%=1461;if(d>365){gy+=(d-1)/365|0;d=(d-1)%365}let gd=d+1,gm=0;const s=[0,31,(gy%4==0&&gy%100!=0)||gy%400==0?29:28,31,30,31,30,31,31,30,31,30,31];for(;gm<13&&gd>s[gm];gm++)gd-=s[gm];return[gy,gm,gd]}
const ep=(y,m,d)=>Date.UTC(y,m-1,d)/864e5,today=()=>{const n=new Date();return ep(n.getFullYear(),n.getMonth()+1,n.getDate())};
const p2=n=>String(n).padStart(2,'0'),todayJ=()=>{const n=new Date(),j=toJ(n.getFullYear(),n.getMonth()+1,n.getDate());return j[0]+'/'+p2(j[1])+'/'+p2(j[2])};
const MD=/(^|[^\d\/.\-])(\d{1,2})[\/\-.](\d{1,2})(?![\d\/\-.])/;
function inferMd(m,d){if(m<1||m>12||d<1||d>31)return null;const n=new Date(),y=toJ(n.getFullYear(),n.getMonth()+1,n.getDate())[0],g=toG(y,m,d);return[ep(g[0],g[1],g[2])>today()+60?y-1:y,m,d]}
function pdMd(s){const k=MD.exec(norm(s));if(!k)return null;const j=inferMd(+k[2],+k[3]);if(!j)return null;const g=toG(...j);return ep(...g)}
function pd(s){const m=/(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/.exec(norm(s));if(!m)return pdMd(s);let[y,mo,d]=[+m[1],+m[2],+m[3]];if(mo<1||mo>12||d<1||d>31)return null;if(y>=1200&&y<=1700)[y,mo,d]=toG(y,mo,d);else if(y<1800||y>2300)return null;return ep(y,mo,d)}
function findDate(t){let n=0;for(const l of t.split(/\r?\n/)){if(!l.trim())continue;const m=/(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/.exec(norm(l));if(m&&pd(m[0])!=null)return m[1]+'/'+p2(m[2])+'/'+p2(m[3]);const k=MD.exec(norm(l));if(k){const j=inferMd(+k[2],+k[3]);if(j)return j[0]+'/'+p2(j[1])+'/'+p2(j[2])}if(++n>=6)break}return null}
// ---- data rules ----
function fix(){const k=new Set(A().map(s=>s.code)),u=new Set();C().forEach(c=>{c.students=(c.students||[]).filter(x=>k.has(x)&&!u.has(x)&&u.add(x))})}
fix();
const nc=(p,l)=>{let c;do c=p+Date.now()+Math.floor(Math.random()*1e4);while(l.some(x=>x.code==c));return c};
const clsOf=code=>C().findIndex(c=>c.students.includes(code));
// ---- UI helpers ----
function modal(t,b,ok,lab='ذخیره'){const m=document.createElement('div');m.className='ov';m.innerHTML=`<div class="mb"><h3>${t}</h3><div class="mc">${b}</div><div class="bt">${ok?`<button class="p" id="mo">${lab}</button>`:''}<button id="mx">${ok?'لغو':'بستن'}</button></div></div>`;document.body.appendChild(m);const cl=()=>m.remove();m.querySelector('#mx').onclick=cl;if(ok)m.querySelector('#mo').onclick=()=>{if(ok(m)!==false)cl()};return m}
const ask=(msg,fn,lab='تأیید')=>modal('تأیید',E(msg),()=>{fn()},lab);
const f=(n,l,v,ta)=>`<label>${l}${ta?`<textarea name="${n}" rows="${ta}">${E(v)}</textarea>`:`<input name="${n}" value="${E(v)}">`}</label>`;
const g=m=>Object.fromEntries([...m.querySelectorAll('[name]')].map(e=>[e.name,e.value.trim()]));
const HELP=[
['🧭 جابه‌جایی در برنامه',`<ul>
<li><b>نوار پایین صفحه</b> پنج بخش اصلی را دارد: امروز، کلاس‌ها، گزارش، تقویم و «بیشتر».</li>
<li><b>بیشتر</b> بقیهٔ بخش‌ها را باز می‌کند: زبان‌آموزان، گزارش‌های دوره‌ای، حضور و غیاب، کارنامه و نمره‌ها، جستجو، مالی (حالت مدیر)، تنظیمات و راهنما.</li>
<li>نام بخش فعلی زیر عنوان «کلاس» در نوار بالا نوشته می‌شود.</li>
<li><b>نشان پشتیبان</b> بالای صفحه وضعیت آخرین پشتیبان را با رنگ نشان می‌دهد: سبز یعنی تازه است، زرد یعنی ۳ تا ۶ روز گذشته و قرمز یعنی ۷ روز یا بیشتر (یا هنوز پشتیبان نگرفته‌اید). روی آن بزنید و «ذخیره در Files» را انتخاب کنید تا فایل پشتیبان با منوی اشتراک‌گذاری iPhone در Files یا iCloud Drive ذخیره شود.</li>
<li><b>پروفایل زبان‌آموز:</b> روی نام او در «زبان‌آموزان» یا صفحهٔ یک کلاس بزنید. حضور، نمره‌ها، آخرین گزارش‌های کلاس، سابقهٔ ترم‌ها و شماره‌های تماس در یک صفحه است.</li></ul>`],
['🚀 شروع سریع (ترتیب پیشنهادی کار)',`<ol>
<li>در «👨‍🎓 زبان‌آموزان» با <b>➕ افزودن</b> یا <b>📥 ورود Excel</b> زبان‌آموزان را وارد کنید.</li>
<li>در «🏫 کلاس‌ها» با <b>➕ افزودن کلاس</b> کلاس بسازید: نام، سطح، روزها و ساعت، ترم فعلی و تاریخ شروع و پایان هر چهار ترم.</li>
<li>داخل صفحهٔ کلاس <b>➕ افزودن زبان‌آموز</b> را بزنید و اعضای کلاس را مشخص کنید.</li>
<li>بعد از هر جلسه در «📝 گزارش روزانه» گزارش بسازید (با فرم یا با چسباندن متن).</li>
<li>حضور و غیاب، نمره‌های روزانه، گزارش‌های دوره‌ای و کارنامه <b>خودکار</b> از همین گزارش‌ها ساخته می‌شوند.</li>
<li>حداقل هفته‌ای یک بار از «⚙️ تنظیمات» پشتیبان بگیرید.</li></ol>`],
['📲 نصب روی iPhone و کار بدون اینترنت',`<ul>
<li>برنامه را در Safari باز کنید، دکمهٔ اشتراک‌گذاری (Share) را بزنید و <b>Add to Home Screen</b> را انتخاب کنید.</li>
<li>بعد از نصب، برنامه بدون اینترنت هم کار می‌کند.</li>
<li>داده‌ها <b>فقط روی همین دستگاه</b> ذخیره می‌شوند. Safari و برنامهٔ نصب‌شده روی صفحهٔ اصلی حافظهٔ جدا دارند؛ داده‌ای که در Safari وارد کرده‌اید در برنامهٔ نصب‌شده دیده نمی‌شود، مگر با پشتیبان‌گیری و بازیابی.</li>
<li>حذف برنامه یا پاک‌کردن اطلاعات وب‌سایت‌ها، داده‌ها را از بین می‌برد؛ پس پشتیبان بگیرید.</li>
<li>برای به‌روزرسانی، برنامه را کاملاً ببندید و دوباره باز کنید.</li></ul>`],
['☀️ امروز',`<ul>
<li>جلسه‌های امروز با ساعت و وضعیت نمایش داده می‌شوند؛ «⏳ بدون گزارش» یعنی هنوز گزارش آن جلسه ثبت نشده است. با لمس آن ردیف، فرم گزارش همان کلاس و تاریخ امروز باز می‌شود. با لمس ردیفی که «✅ گزارش ثبت شده» دارد، خود گزارش باز می‌شود و می‌توانید آن را ویرایش، ارسال یا حذف کنید.</li>
<li>بالای صفحه سه کارت خلاصه هست: <b>جلسهٔ امروز</b>، <b>گزارش جاافتاده</b> و <b>هشدار غیبت</b>. با لمس هر کارت به بخش مربوط پایین‌تر می‌روید. کارت‌های زرد یعنی کاری باقی مانده است.</li><li>دکمهٔ بزرگ <b>📝 ثبت گزارش امروز</b> فرم گزارش را باز می‌کند و دکمهٔ <b>📆 تقویم امروز</b> تقویم همان روز را.</li>
<li>«گزارش‌های جاافتاده — ۷ روز گذشته» نشان می‌دهد برای کدام جلسه‌ها گزارش ننوشته‌اید. با لمس هر مورد، فرم گزارش همان کلاس و همان تاریخ باز می‌شود.</li>
<li>«⚠️ غیبت زیاد» زبان‌آموزانی را نشان می‌دهد که به آستانهٔ هشدار غیبت رسیده‌اند (آستانه در «📋 حضور» قابل تغییر است).</li>
<li>اگر برنامهٔ درسی کلاس را ثبت کرده باشید، کلاس‌های عقب‌تر از برنامه هم اینجا هشدار می‌گیرند.</li></ul>`],
['👨‍🎓 زبان‌آموزان',`<ul>
<li><b>➕ افزودن</b>: ثبت نام، نام خانوادگی، موبایل، کد ملی، تاریخ تولد، توضیحات. با ✏️ ویرایش و با 🗑️ حذف می‌کنید.</li>
<li><b>📥 ورود Excel</b> / <b>📤 خروجی Excel</b>: ستون‌ها به این ترتیب‌اند: کد، نام، نام خانوادگی، موبایل، کد ملی، تاریخ تولد، توضیحات، موبایل والدین. ردیف اول عنوان است.</li>
<li>دکمهٔ 💬 یک «پیام به والدین» آماده می‌کند (مثلاً دربارهٔ غیبت). با <b>📲 واتساپ</b>، <b>💬 پیامک</b> یا <b>📨 اشتراک‌گذاری / کپی</b> فرستاده می‌شود. متن‌های آماده را در تنظیمات، بخش «💬 پیام‌های آماده»، می‌توانید تغییر دهید.</li>
<li>اگر چند زبان‌آموز <b>نام کوچک مشترک</b> دارند، در گزارش‌های روزانه نام و نام خانوادگی کامل را بنویسید تا اشتباه شمرده نشوند.</li></ul>`],
['🏫 کلاس‌ها و ترم‌ها',`<p><b>ساخت کلاس:</b> نام، سطح، معلم، ظرفیت، تعداد جلسات، روزهای هفته با ساعت شروع و پایان، و «ترم فعلی کلاس» (۱ تا ۴).</p>
<p><b>چهار ترم:</b> هر کلاس در سال چهار ترم دارد و برای هر ترم تاریخ شروع و پایان جدا وارد می‌شود. کلاس در طول سال ثابت می‌ماند و فقط ترمش ارتقا پیدا می‌کند. تاریخ‌های «ترم فعلی» مبنای حضور و غیاب و نمرهٔ کلاس است؛ تقویم جلسات هر چهار ترم را بر اساس تاریخ همان ترم می‌چیند.</p>
<p><b>📦 پایان دوره / ترم جدید</b> (برای کل کلاس):</p><ul>
<li>نتیجهٔ ترم (نمرهٔ کل دوره و حضور هر زبان‌آموز) در «📚 دوره‌های قبلی» ذخیره می‌شود.</li>
<li>می‌پرسد زبان‌آموزان <b>به کدام ترم منتقل شوند</b> (ترم ۱ تا ۴، پیش‌فرض ترم بعدی). تاریخ‌های ترم انتخاب‌شده از تنظیم کلاس پر می‌شود و قابل ویرایش است.</li>
<li>نمرهٔ دستیِ کل دوره پاک می‌شود، ولی گزارش‌های روزانه و «نمره‌های پایان دوره» دست‌نخورده می‌مانند.</li>
<li>نمره و حضور ترم جدید فقط از گزارش‌های بعد از تاریخ شروع جدید حساب می‌شود.</li></ul>
<p><b>↗ ارتقا</b> (برای یک زبان‌آموز): «انتقال به ترم» را انتخاب کنید. او در همان کلاس می‌ماند، نتیجهٔ ترم فعلی‌اش در «دوره‌های قبلی» ثبت می‌شود و نمره و حضورش از فردا از صفر حساب می‌شود. کنار نامش در فهرست کلاس شمارهٔ ترمش نوشته می‌شود.</p>
<p><b>📖 برنامهٔ درسی و پیشرفت:</b> درس‌های کلاس را ثبت کنید تا پیشرفت کلاس و عقب‌ماندن از برنامه دیده شود.</p>
<p>در صفحهٔ کلاس برای هر زبان‌آموز 🎓 گواهی، 📄 کارنامه، ↗ ارتقا و «حذف از کلاس» هست.</p>`],
['📝 گزارش روزانه',`<p>چهار راه برای ثبت گزارش دارید:</p><ul>
<li><b>📝 ساخت گزارش با فرم</b>: کلاس، تاریخ (با کشوهای روز، ماه و سال)، درس امروز، غایب‌ها، تأخیرها و وضعیت هر زبان‌آموز.</li>
<li><b>📋 ورود از متن (چسباندن)</b>: متن گزارشی که قبلاً نوشته‌اید (مثلاً از واتساپ) را بچسبانید تا برنامه آن را بخواند.</li>
<li><b>📥 ورود فایل TXT</b> و <b>✍️ نوشتن متنی</b>.</li></ul>
<p>ساده‌ترین راه «ساخت گزارش با فرم» است، چون متن استاندارد را خودش می‌سازد. اگر متن خودتان را می‌چسبانید، شکل آن این‌طور باشد:</p>
<div class="card m" style="direction:rtl;white-space:pre-wrap">08/18
کلاس : C

درس امروز
صفحهٔ ۶۰

غایب : نام و نام خانوادگی ، نام و نام خانوادگی
تأخیر : نام ، نام</div>
<ul><li>غایب‌ها و تأخیرها با «،» جدا می‌شوند.</li>
<li><b>تاریخ هر گزارش</b> مبنای حضور و غیاب و گزارش‌های دوره‌ای است؛ تاریخ را درست بنویسید.</li>
<li>نام‌ها باید با نام ثبت‌شدهٔ زبان‌آموز یکی باشد تا غیبت به او نسبت داده شود.</li></ul>`],
['📊 گزارش‌های دوره‌ای',`<ul>
<li>بازهٔ <b>هفتگی</b> (۷ روز اخیر)، <b>ماهانه</b> (۳۰ روز اخیر) یا <b>📆 از تاریخ تا تاریخ</b> را انتخاب کنید.</li>
<li>گزارش را برای <b>کل کلاس</b> یا یک زبان‌آموز بگیرید.</li>
<li>خروجی: <b>📨 ارسال / کپی</b>، <b>📤 ذخیره فایل (TXT)</b>، <b>🖼 ارسال به‌صورت تصویر</b> و <b>📚 فایل همه زبان‌آموزان</b>.</li>
<li>اگر کلاسی در بازهٔ انتخاب‌شده هیچ گزارشی نداشته باشد (مثلاً چون جلسه‌اش لغو شده)، در فهرست نمی‌آید. بازهٔ ماهانه یا «از تاریخ تا تاریخ» را امتحان کنید.</li></ul>`],
['📆 تقویم',`<ul>
<li>جلسات همهٔ کلاس‌ها بر اساس روزها و ساعت و تاریخ هر ترم نمایش داده می‌شود. کنار نام هر کلاس شمارهٔ ترم است؛ مثلاً «C ت2» یعنی کلاس C در ترم ۲.</li>
<li>با «همه کلاس‌ها» یا انتخاب یک کلاس، نما را فیلتر کنید. با «قبلی» و «بعدی» بین ماه‌ها بروید و با «امروز» به ماه جاری برگردید.</li>
<li>روی یک روز بزنید تا جزئیات باز شود: ساعت، ترم، شمارهٔ جلسه و ✏️ نوشتن برنامهٔ درسی همان جلسه. معلم هم می‌تواند برنامهٔ درسی را بنویسد.</li>
<li><b>📚 جلسات کلاس‌ها</b>: فهرست جلسات هر کلاس، جدا برای هر چهار ترم، با شمارهٔ جلسه که در هر ترم از ۱ شروع می‌شود.</li>
<li>خروجی روز یا ماه: <b>📤 TXT</b>، <b>📨 ارسال / کپی</b> و <b>🖼 تصویر</b>.</li>
<li><b>در حالت مدیر</b> می‌توانید با <b>➕ رویداد</b>، رویداد، آزمون، تعطیلی و لغو جلسه ثبت کنید. جلسهٔ لغوشده در تقویم خط‌خورده است.</li></ul>`],
['📋 حضور و غیاب',`<ul>
<li>حضور از روی «غایب» و «تأخیر» گزارش‌های روزانه محاسبه می‌شود و فقط جلسه‌هایی که گزارش دارند شمرده می‌شوند.</li>
<li>بازهٔ محاسبه، بازهٔ ترم فعلی کلاس است. غیبت‌های ترم‌های قبلی در «دوره‌های قبلی» آرشیو شده‌اند.</li>
<li>با فیلتر کلاس، کلاس را مشخص کنید و با «هشدار از این تعداد غیبت به بالا» آستانهٔ هشدار را تنظیم کنید.</li>
<li><b>📊 مقایسهٔ کلاس‌ها</b> میانگین حضور کلاس‌ها را کنار هم می‌گذارد.</li>
<li>خروجی: <b>📤 TXT</b>، <b>📨 ارسال / کپی</b>، <b>🖼 تصویر</b>.</li></ul>`],
['🎓 کارنامه و گواهی',`<ul>
<li><b>نمرهٔ کل دوره</b> (۰ تا ۱۰۰) به‌طور خودکار از وضعیت‌هایی که در گزارش‌های روزانه برای هر زبان‌آموز نوشته‌اید ساخته می‌شود. با «📊 نمرهٔ کل دوره» می‌توانید آن را دستی هم ثبت کنید.</li>
<li><b>📝 ثبت نمره (پایان دوره)</b>: کلاس را انتخاب کنید، روی نام زبان‌آموز بزنید و نمرهٔ هر مهارت را وارد کنید.</li>
<li><b>📄 کارنامه</b> (متن قابل ارسال یا چاپ/PDF) ترتیبش این است: کلاس و ترم، <b>حضور</b> (تعداد جلسات برگزارشده، غیبت، تأخیر)، <b>نمرهٔ بخش‌ها</b> (بخش‌های با نمرهٔ ۱۰۰ نمایش داده نمی‌شوند)، <b>نمرهٔ کل دوره</b>، سپس <b>آزمون پایان دوره</b> زیر هم، و در پایان نکات و توضیح معلم.</li>
<li><b>📅 کارنامهٔ ماهانه:</b> در پنجرهٔ کارنامه، بالای صفحه «کارنامهٔ ماهانه» را بزنید (یا در پروفایل زبان‌آموز «📅 ماهانه»). ماه و سال را انتخاب کنید. در هر ماه ۸ جلسه فرض می‌شود و هر ایراد ۱/۸ از ۱۰۰ نمره (۱۲٫۵) از نمرهٔ همان بخش کم می‌کند؛ در کارنامهٔ دوره‌ای این مقدار ۱/۲۴ است. هر غیبت هم به‌صورت بخش «غیبت» با همان ۱۲٫۵ نمره کسر می‌شود و اگر نخواهید، تیک آن را بردارید. نمرهٔ ماه میانگین نمرهٔ بخش‌هاست. آزمون پایان دوره در کارنامهٔ ماهانه نیست. اگر در آن ماه گزارشی ثبت نشده باشد، نمره نمایش داده نمی‌شود.</li>
<li><b>🎓 گواهی</b> هم از صفحهٔ کلاس برای هر زبان‌آموز ساخته می‌شود.</li>
</ul>`],
['🔎 جستجو',`<p>حداقل دو حرف بنویسید؛ در زبان‌آموزان، کلاس‌ها، گزارش‌ها و رویدادها جستجو می‌شود.</p>`],
['💰 مالی (فقط حالت مدیر)',`<ul>
<li>این بخش فقط وقتی «حالت مدیر» روشن باشد دیده می‌شود.</li>
<li>بخش‌ها: <b>💳 ثبت پرداخت</b>، <b>👥 حساب زبان‌آموزان</b>، <b>⏳ بدهکاران</b>، <b>🏷 شهریه کلاس‌ها</b>، <b>👩‍🏫 حقوق معلم‌ها</b>، <b>🧾 درآمد و هزینه‌ها</b>، <b>📈 گزارش ماهانه</b>. مبالغ به تومان است.</li>
<li><b>مهم:</b> اطلاعات مالی در پشتیبان معمولی نیست. از «💾 پشتیبان مالی» جداگانه پشتیبان بگیرید.</li></ul>`],
['⚙️ تنظیمات',`<ul>
<li><b>🧑‍🏫 نقش این دستگاه</b>: اگر نام یک معلم را انتخاب کنید و حالت مدیر خاموش باشد، فقط کلاس‌های همان معلم دیده می‌شود. این فقط محدودیت نمایش است. معلم هر کلاس را در فرم کلاس مشخص کنید.</li>
<li><b>👩‍🏫 معلم‌ها و توضیحات آماده</b> و <b>💬 پیام‌های آماده</b>: متن‌هایی که زیاد استفاده می‌کنید.</li>
<li><b>نمایش ارقام فارسی:</b> با روشن‌کردن این گزینه همهٔ ارقام روی صفحه فارسی (۱۲۳) نمایش داده می‌شوند. پیام‌ها و فایل‌هایی که ارسال می‌کنید تغییری نمی‌کنند.</li>
<li><b>👔 حالت مدیر</b>: با رمز ۴ رقمی اختیاری. خاموش‌کردنش رمز نمی‌خواهد. این فقط یک قفل ساده است و امنیت واقعی نیست.</li></ul>`],
['💾 پشتیبان‌گیری و بازیابی',`<ul>
<li><b>دانلود فایل پشتیبان</b> را بزنید و فایل را در Files یا iCloud نگه دارید. <b>کپی متن پشتیبان</b> هم هست.</li>
<li>نشان رنگی بالای صفحه همیشه وضعیت آخرین پشتیبان را نشان می‌دهد و با لمس آن می‌توانید مستقیم «ذخیره در Files» را بزنید.</li>
<li>برنامه روزی یک بار و قبل از هر بازیابی خودش یک نسخه می‌سازد و ۷ نسخهٔ آخر را نگه می‌دارد («🕘 نسخه‌های خودکار»). این نسخه‌ها روی همین دستگاه‌اند و جای فایل بیرونی را نمی‌گیرند.</li>
<li><b>♻️ بازیابی / ادغام از فایل</b>: «ادغام» موارد پشتیبان را بدون حذف داده‌های فعلی اضافه می‌کند. «جایگزینی» همهٔ داده‌های فعلی را با پشتیبان عوض می‌کند. روی دستگاه خالی «ادغام» ایمن است.</li>
<li>پشتیبان‌ها بین Android و iPhone قابل تبادل‌اند. پشتیبان مالی جداست.</li>
<li>اگر ۷ روز پشتیبان نگیرید، برنامه یادآوری می‌دهد.</li></ul>`],
['🛠 مشکلات رایج',`<ul>
<li><b>کلاسی در تقویم، حضور یا دوره‌ای دیده نمی‌شود:</b> فیلتر کلاس همان صفحه را روی «همه کلاس‌ها» بگذارید؛ فیلتر هنگام عوض‌کردن تب ریست نمی‌شود. در گزارش هفتگی، کلاسی که ۷ روز اخیر گزارش نداشته باشد نمی‌آید.</li>
<li><b>غیبت یا تأخیر کسی شمرده نشده:</b> نامش در گزارش باید دقیقاً با نام ثبت‌شده یکی باشد و زبان‌آموز باید عضو همان کلاس باشد. تاریخ گزارش هم باید داخل بازهٔ ترم فعلی باشد.</li>
<li><b>دو زبان‌آموز نام کوچک یکسان دارند:</b> در گزارش نام کامل بنویسید.</li>
<li><b>تقویم جلسه‌ای را نشان نمی‌دهد:</b> تاریخ ترم‌ها را در فرم کلاس بررسی کنید. اگر هیچ تاریخی نباشد، برنامه فقط روزهای هفته را بدون محدودیت می‌چیند.</li>
<li><b>داده‌ها ناپدید شدند:</b> از «🕘 نسخه‌های خودکار» یا آخرین فایل پشتیبان بازیابی کنید.</li></ul>`]
];
function vHelp(){return `<h3>❓ راهنمای برنامه</h3><div class="m">بخش‌ها را باز کنید یا موضوع را در کادر زیر جستجو کنید.</div><input id="hs" type="search" placeholder="جستجو در راهنما…" oninput="helpFind(this.value)"><div id="hp" class="hp">${HELP.map(([t,b],i)=>`<details class="grp"${i==0?' open':''}><summary>${t}</summary><div class="card">${b}</div></details>`).join('')}</div><div class="card m">نسخهٔ برنامه 1.30 — داده‌ها فقط روی همین دستگاه ذخیره می‌شوند.</div>`}
function helpFind(q){q=(q||'').trim();document.querySelectorAll('#hp details').forEach(d=>{const ok=!q||d.textContent.includes(q);d.style.display=ok?'':'none';if(q)d.open=ok})}


// ===== navigation: bottom tab bar + "more" sheet =====
let SP=null,PV='s';
const NAVI={t:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',c:'<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V10l7-5.5L19 10v11M9.5 21v-6h5v6"/></svg>',r:'<svg viewBox="0 0 24 24"><path d="M14 3H7.5A2 2 0 0 0 5.5 5v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h4.5M9 13h6M9 17h4"/></svg>',k:'<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',more:'<svg viewBox="0 0 24 24"><circle class="f" cx="5.5" cy="12" r="1.7"/><circle class="f" cx="12" cy="12" r="1.7"/><circle class="f" cx="18.5" cy="12" r="1.7"/></svg>'};
const TABS=[['t','امروز'],['c','کلاس‌ها'],['r','گزارش'],['k','تقویم'],['more','بیشتر']];
const PGN={t:'امروز',s:'زبان‌آموزان',c:'کلاس‌ها',r:'گزارش روزانه',p:'گزارش‌های دوره‌ای',k:'تقویم',h:'حضور و غیاب',a:'کارنامه و نمره‌ها',q:'جستجو',m:'مالی',g:'تنظیمات','?':'راهنما',f:'گزارش جدید',sp:'پروفایل زبان‌آموز'};
function goTab(k){document.querySelectorAll('.ov').forEach(x=>x.remove());V=k;CI=-1;CPV=-1;SV=null;SP=null;FS=null;KD=null;KS=null;MS='h';MSV=null;draw()}
function moreSheet(){const it=[['s','👨‍🎓','زبان‌آموزان'],['p','📊','دوره‌ای'],['h','📋','حضور و غیاب'],['a','🎓','کارنامه و نمره‌ها'],['q','🔎','جستجو'],...(MGR?[['m','💰','مالی']]:[]),['g','⚙️','تنظیمات'],['?','❓','راهنما']];
 modal('بیشتر',`<div class="mg">${it.map(([k,i,l])=>`<button class="mi${V==k?' on':''}" onclick="goTab('${k}')"><span>${i}</span>${l}</button>`).join('')}</div>`)}
// ===== backup status chip (top bar) =====
const epochOf=ms=>{const n=new Date(ms);return Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/864e5)};
function bkRel(){if(!(A().length||C().length||R().length))return{k:'n',tx:'بدون داده'};if(!lastExport())return{k:'r',tx:'بدون پشتیبان'};const d=bkDays();return{k:d>=7?'r':d>=3?'y':'g',tx:d==0?'پشتیبان: امروز':d==1?'پشتیبان: دیروز':'پشتیبان: '+d+' روز پیش'}}
function bkChip(){const e=document.getElementById('bkc');if(!e)return;const b=bkRel();e.className='bkc '+b.k;e.innerHTML='<i></i>'+b.tx}
function bkSheet(){const t=lastExport(),b=bkRel(),d=bkDays();
 modal('پشتیبان‌گیری',`<div class="card"><span class="bd ${b.k}"></span> ${t?'آخرین پشتیبان: <b>'+E(Cal.fmt(epochOf(t)))+'</b> ('+(d==0?'امروز':d==1?'دیروز':d+' روز پیش')+')':'هنوز پشتیبان نگرفته‌اید'}</div><div class="m">داده‌ها فقط روی همین گوشی ذخیره می‌شوند. با «ذخیره در Files» فایل پشتیبان را در Files یا iCloud Drive نگه دارید تا با پاک‌شدن برنامه از بین نرود.</div><div class="tb"><button onclick="bkCopy()">کپی متن پشتیبان</button><button onclick="goTab('g')">تنظیمات و بازیابی</button></div>`,()=>{bk()},'ذخیره در Files')}
// ===== today: dashboard on top =====
function vDash(){const t=today(),d=Cal.day(C().filter(canC),EVS(),t,'',false),it=d.items.filter(i=>i.kind!='event'&&i.kind!='cancelled'),nr=it.filter(i=>!hasRep(i.cls,t)).length,miss=missRows(7).length,H=heads();let al=0;C().filter(canC).forEach(c=>c.students.forEach(code=>{const x=attStat(code,H);if(x&&x.alert)al++}));
 const go=id=>`document.getElementById('${id}').scrollIntoView({behavior:'smooth',block:'start'})`;
 return`<div class="card hero"><div class="hs">${it.length?it.length+' جلسه امروز'+(nr?' • '+nr+' بدون گزارش':' • همه گزارش دارند'):'امروز جلسه‌ای نیست'}${d.holiday?'<small>🔴 تعطیل: '+E(d.holiday)+'</small>':''}</div><button onclick="fNew()">📝 ثبت گزارش امروز</button></div><div class="dash"><button class="st${nr?' hot':''}" onclick="${go('tdc')}"><b>${it.length}</b><span>جلسهٔ امروز</span></button><button class="st${miss?' hot':''}" onclick="${go('tdm')}"><b>${miss}</b><span>گزارش جاافتاده</span></button><button class="st${al?' hot':''}" onclick="${go('tda')}"><b>${al}</b><span>هشدار غیبت</span></button></div>`}
// ===== student profile page =====
function spOpen(code){PV=(V=='sp'?PV:V);SP=code;V='sp';draw()}
function spBack(){V=PV&&PV!='sp'?PV:'s';SP=null;draw()}
function vSP(){const s=A().find(x=>x.code==SP);if(!s){V='s';return vS()}
 const si=A().indexOf(s),ci=clsOf(s.code),c=ci>=0?C()[ci]:null,H=heads(),d=rcData(s.code),at=d&&d.at,key=keyOf(si),ph=x=>dg(x).replace(/[^\d+]/g,''),pn=ph(s.parent||''),sn=ph(s.mobile||'');
 const ini=([...(s.first||'')][0]||'')+'\u200c'+([...(s.last||'')][0]||'');
 let h=`<div class="tb"><button onclick="spBack()">← بازگشت</button><button onclick="sF(${si})">✏️ ویرایش</button></div>`;
 h+=`<div class="card sp"><div class="av">${E(ini)}</div><div><h2 class="spn">${E(s.first)} ${E(s.last)}</h2><div class="m">${c?E(c.name)+' • ترم '+stTm(s,c)+(c.level?' • '+E(c.level):''):'عضو هیچ کلاسی نیست'}</div><div class="m">${E(s.code)}</div></div></div>`;
 h+=`<div class="card"><b>📞 تماس</b><div class="kv"><span>والدین</span><span>${E(s.parent||'ثبت نشده')}</span></div><div class="kv"><span>موبایل زبان‌آموز</span><span>${E(s.mobile||'ثبت نشده')}</span></div>${s.notes?`<div class="kv"><span>توضیحات</span><span>${E(s.notes)}</span></div>`:''}<div class="tb">${pn?`<button class="p" onclick="location.href='tel:${pn}'">📞 تماس با والدین</button>`:''}${sn?`<button onclick="location.href='tel:${sn}'">📞 تماس با خودش</button>`:''}<button onclick="msgPick('${E(s.code)}')">💬 پیام</button>${at&&at.ab?`<button onclick="parentSend('${E(s.code)}',absMsg('${E(s.code)}',todayJ()))">📲 پیام غیبت</button>`:''}</div></div>`;
 h+=`<h3>حضور و غیاب</h3>`+(at?`<div class="stats"><div class="st"><b>${at.t}</b><span>جلسهٔ برگزارشده</span></div><div class="st${at.ab?' hot':''}"><b>${at.ab}</b><span>غیبت</span></div><div class="st"><b>${at.lt}</b><span>تأخیر</span></div></div>${at.pct==null?'':`<div class="m">درصد حضور: ${fm1(at.pct)}٪</div>`}${at.ad&&at.ad.length?`<div class="m">تاریخ غیبت‌ها: ${E(at.ad.join('، '))}</div>`:''}<div class="tb"><button onclick="attDlg('${E(s.code)}')">جزئیات حضور</button></div>`:'<div class="card m">برای نمایش حضور، زبان‌آموز باید عضو یک کلاس باشد.</div>');
 const cats=d&&d.t&&d.t.st?d.t.st.cats:[];
 h+=`<h3>نمره‌ها</h3><div class="card"><div class="kv"><span>نمرهٔ کل دوره</span><b>${d?totLine(d.t):'—'}</b></div>${cats.length?cats.map(k=>`<div class="kv"><span>${E(k.t)}</span><span>${fm1(k.score)}${k.n?' <span class="m">('+k.n+' بار)</span>':''}</span></div>`).join(''):''}${d&&d.sk&&d.sk.length?`<div class="m" style="margin-top:8px"><b>آزمون پایان دوره</b></div>`+d.sk.map(x=>`<div class="kv"><span>${E(x.n)}</span><b>${E(String(x.v))}</b></div>`).join(''):'<div class="m">آزمون پایان دوره‌ای ثبت نشده است.</div>'}<div class="tb"><button class="p" onclick="gradeDlg('${E(s.code)}')">➕ ثبت نمره</button><button onclick="rcDlg('${E(s.code)}')">📄 کارنامه</button><button onclick="rcmDlg('${E(s.code)}')">📅 ماهانه</button>${c?`<button onclick="cert('${E(s.code)}','${E(c.name).replace(/'/g,"\\'")}')">🎓 گواهی</button>`:''}</div></div>`;
 const rs=c?R().filter(r=>canR(r)&&norm(r.class||'')==norm(c.name)).sort((a,b)=>(pd(b.date)??0)-(pd(a.date)??0)).slice(0,8):[];
 h+=`<h3>آخرین گزارش‌های کلاس</h3>`+(rs.length?rs.map(r=>{const q=key?hit(r.text,key,H):{a:0,l:0,body:''},bd=(q.body||'').trim().slice(0,160);return`<div class="card"><div class="r"><b>${E(r.date)}</b>${q.a?'<span class="chip d">غایب</span>':q.l?'<span class="chip w">تأخیر</span>':'<span class="chip">حاضر</span>'}</div>${bd?`<div class="m">${E(bd)}</div>`:''}</div>`}).join(''):'<div class="card m">گزارشی برای کلاس این زبان‌آموز ثبت نشده است.</div>');
 const th=TRM().map(x=>({x,z:(x.students||[]).find(z=>z.code==s.code)})).filter(q=>q.z).sort((a,b)=>b.x.ts-a.x.ts);
 h+=`<h3>سابقهٔ ترم‌ها</h3><div class="card">${c?`<div class="kv"><span><b>ترم ${stTm(s,c)}</b> <span class="chip">فعلی</span></span><span class="m">${E(c.start||'—')} تا ${E(c.end||'—')}</span></div>`:''}${th.length?th.map(({x,z})=>`<div class="kv"><span>${x.term?'ترم '+x.term+' — ':''}${E(x.start||'—')} تا ${E(x.end||x.closed)}${x.partial?' <span class="m">(ارتقای فردی)</span>':''}</span><span>${z.total==null?'—':fm1(z.total)}${z.att?' <span class="m">• غیبت '+z.att.ab+' از '+z.att.t+'</span>':''}</span></div>`).join(''):'<div class="m">هنوز ترمی برای این زبان‌آموز آرشیو نشده است.</div>'}</div>`;
 return h}
// ===== Persian digits (display only; data and shared texts keep Latin digits) =====
const FAD='۰۱۲۳۴۵۶۷۸۹',toFa=s=>String(s).replace(/[0-9]/g,d=>FAD[d]);
const faSkip=/^(TEXTAREA|SCRIPT|STYLE)$/;let FAOB=null;
function faNode(n){if(n.nodeType==3){const p=n.parentNode;if(p&&faSkip.test(p.nodeName))return;if(/[0-9]/.test(n.nodeValue))n.nodeValue=toFa(n.nodeValue)}else if(n.nodeType==1){if(faSkip.test(n.nodeName))return;const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),a=[];let x;while(x=w.nextNode())a.push(x);a.forEach(faNode)}}
const faOpt={childList:true,subtree:true,characterData:true};
function faApply(){const on=!!SS().fa;if(on&&!FAOB){FAOB=new MutationObserver(ms=>{FAOB.disconnect();try{ms.forEach(m=>{if(m.type=='characterData')faNode(m.target);else m.addedNodes.forEach(faNode)})}catch(e){}FAOB.observe(document.body,faOpt)});faNode(document.body);FAOB.observe(document.body,faOpt)}else if(!on&&FAOB){FAOB.disconnect();FAOB=null;document.querySelectorAll('.ov').forEach(x=>x.remove());draw()}}
function faToggle(){SS().fa=!SS().fa;save();faApply();if(SS().fa)draw()}
try{if(typeof CanvasRenderingContext2D!='undefined'){const P=CanvasRenderingContext2D.prototype,f0=P.fillText,m0=P.measureText;P.fillText=function(t,...a){return f0.call(this,SS().fa?toFa(t):t,...a)};P.measureText=function(t){return m0.call(this,SS().fa?toFa(t):t)}}}catch(e){}
function draw(){_vis=null;const cur=V=='f'?'r':V=='sp'?(PV&&PV!='sp'?PV:'s'):V,act=TABS.some(x=>x[0]==cur)?cur:'more';
 $('#nv').innerHTML=TABS.map(([k,l])=>`<button class="${act==k?'on':''}" onclick="${k=='more'?'moreSheet()':`goTab('${k}')`}" aria-label="${l}">${NAVI[k]}<span>${l}</span></button>`).join('');
 $('#pg').textContent=(V=='f'&&FS&&FS.idx>=0)?'ویرایش گزارش':PGN[V]||'Moradi English Class';
 $('#mn').innerHTML=(V=='f'?'':backupWarn())+({t:()=>vDash()+vT()+vT2()+vT3(),s:vS,c:vC,r:vR,p:vP,g:vG,f:vF,k:vK,a:vA,m:vM,h:vH,q:vQ,'?':vHelp,sp:vSP})[V]();
 if(V=='f'&&FS)memOf(FS.cls).forEach((c,i)=>fRef(i));bkChip();scrollTo(0,0)}
const pickBtn=(cap,acc,fn)=>`<label class="f"><span class="p" style="display:inline-block;border-radius:10px;padding:9px 14px;background:var(--a);color:#fff">${cap}</span><input type="file" accept="${acc}" hidden onchange="${fn}(this.files[0]);this.value=''"></label>`;
// ===== teacher role, attendance, terms, parent messages, global search =====
const ME_K='class_web_me';let ME='';try{ME=localStorage.getItem(ME_K)||''}catch(e){}
const setMe=n=>{ME=n||'';try{localStorage.setItem(ME_K,ME)}catch(e){}};
const restricted=()=>!!ME&&!MGR;
const canC=c=>!restricted()||norm(c.teacher||'')==norm(ME);
let _vis=null;const visSet=()=>{const o=new Set();C().filter(canC).forEach(c=>c.students.forEach(x=>o.add(x)));return o};
const canA=s=>{if(!restricted())return true;if(!_vis)_vis=visSet();return _vis.has(s.code)};
const canR=r=>!restricted()||C().some(c=>canC(c)&&norm(c.name)==norm(r.class||''))||norm(r.teacher||'')==norm(ME);
// ---- attendance (from the daily reports: «غایب» / «تأخیر» lines) ----
const absLimit=()=>Math.max(1,Math.round(+SS().absLimit)||3);
function attStat(code,H){const si=A().findIndex(x=>x.code==code),ci=clsOf(code);if(si<0||ci<0)return null;const c=C()[ci],a=effA(code,c),z=Cal.parse(os(c,'end')),key=keyOf(si);if(!key)return null;H=H||heads();
 let t=0,ab=0,lt=0;const ad=[],ld=[],nc2=norm(c.name);
 R().forEach(r=>{if(norm(r.class||'')!=nc2)return;const[d,k]=dayOf(r);if(k==2){if(a!=null||z!=null)return}else{if(a!=null&&d<a)return;if(z!=null&&d>z)return}t++;const h=hit(r.text,key,H);if(h.a){ab++;ad.push(r.date)}else if(h.l){lt++;ld.push(r.date)}});
 return{t,ab,lt,ad,ld,cls:c.name,pct:t?Math.round((t-ab)/t*1000)/10:null,alert:ab>=absLimit()}}
let HC='';
function attRows(cf){const H=heads(),rows=[];C().filter(canC).sort(cmpC).forEach(c=>{if(cf&&c.name!=cf)return;c.students.map(code=>A().find(x=>x.code==code)).filter(Boolean).sort(cmpS).forEach(s=>{const x=attStat(s.code,H);if(x)rows.push({s,x})})});
 return rows}
function attReportText(){const rows=attRows(HC);let t='گزارش حضور و غیاب'+(HC?' — کلاس '+HC:'')+'\n\n';
 rows.forEach(({s,x})=>{t+='• '+s.first+' '+s.last+(HC?'':' ('+x.cls+')')+' — حضور '+(x.pct==null?'—':fm1(x.pct)+'٪')+' • غایب '+x.ab+' • تأخیر '+x.lt+' (از '+x.t+' جلسهٔ دارای گزارش)'+(x.alert?' ⚠️':'')+'\n'});return t}
function vH0(){const cs=C().filter(canC).sort(cmpC),rows=attRows(HC),lim=absLimit();
 return`<label>کلاس<select onchange="HC=this.value;draw()"><option value="">همهٔ کلاس‌ها</option>${cs.map(c=>`<option ${c.name==HC?'selected':''} value="${E(c.name)}">${E(c.name)}</option>`).join('')}</select></label><label>هشدار از این تعداد غیبت به بالا<input type="number" min="1" value="${lim}" onchange="SS().absLimit=Math.max(1,Math.round(+this.value)||3);save();draw()"></label><div class="m">حضور و غیاب از روی گزارش‌های روزانهٔ هر کلاس (در بازهٔ دورهٔ فعلی کلاس) حساب می‌شود: جلسه‌ای که نام زبان‌آموز در «غایب» آمده غیبت است. درصد حضور = (جلسه‌های دارای گزارش − غیبت) ÷ جلسه‌های دارای گزارش.</div><div class="tb">${xbtn('ha',attReportText,'attendance'+(HC?'-'+HC.replace(/\s+/g,'_'):''))}</div>`+
 (rows.length?rows.map(({s,x})=>`<div class="card r" style="cursor:pointer" onclick="attDlg('${E(s.code)}')"><div>${x.alert?'⚠️ ':''}${E(s.first)} ${E(s.last)}<div class="m">${E(x.cls)} • غایب ${x.ab} • تأخیر ${x.lt} • از ${x.t} جلسه</div></div><b>${x.pct==null?'—':fm1(x.pct)+'٪'}</b></div>`).join(''):'<div class="m">زبان‌آموزی در کلاس‌ها نیست.</div>')}
function attDlg(code){const s=A().find(x=>x.code==code),x=attStat(code);if(!s||!x)return;
 const m=modal('حضور و غیاب — '+E(s.first)+' '+E(s.last),`<div class="card"><div class="r"><span>کلاس</span><b>${E(x.cls)}</b></div><div class="r"><span>جلسه‌های دارای گزارش</span><b>${x.t}</b></div><div class="r"><span>درصد حضور</span><b>${x.pct==null?'—':fm1(x.pct)+'٪'}</b></div><div class="r"><span>غیبت</span><b>${x.ab}</b></div><div class="r"><span>تأخیر</span><b>${x.lt}</b></div></div>`+(x.ad.length?`<div class="m">تاریخ غیبت‌ها: ${E(x.ad.join('، '))}</div>`:'')+(x.ld.length?`<div class="m">تاریخ تأخیرها: ${E(x.ld.join('، '))}</div>`:''));
 m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="am">💬 پیام به والدین</button>');m.querySelector('#am').onclick=()=>{m.remove();parentSend(code,absMsg(code,x.ad.length?x.ad[x.ad.length-1]:todayJ()))}}
// ---- parent messages (WhatsApp / SMS / share) ----
const phoneIntl=m=>{let d=dg(m).replace(/[^\d+]/g,'').replace(/^\+/,'');if(!d)return'';if(d.startsWith('00'))d=d.slice(2);if(d.startsWith('98'))return d;if(d.startsWith('0'))return'98'+d.slice(1);if(d.length==10&&d[0]=='9')return'98'+d;return d};
const waUrl=(m,t)=>'https://wa.me/'+phoneIntl(m)+'?text='+encodeURIComponent(t),smsUrl=(m,t)=>'sms:+'+phoneIntl(m)+'?&body='+encodeURIComponent(t);
const ABS_T='سلام {نام} عزیز،\nدر جلسهٔ {تاریخ} کلاس {کلاس} غیبت ثبت شده است. لطفاً در صورت امکان هماهنگ فرمایید.\nبا تشکر';
function absMsg(code,date){const s=Fin.stOf(code),ci=clsOf(code);return s?ABS_T.replace(/\{نام\}/g,Fin.name(s)).replace(/\{کلاس\}/g,ci>=0?C()[ci].name:'—').replace(/\{تاریخ\}/g,date||todayJ()):''}
function parentSend(code,text){const s=A().find(x=>x.code==code);if(!s)return;const num=s.parent||s.mobile||'',ok=!!phoneIntl(num);
 const m=modal('پیام به والدین — '+E(s.first)+' '+E(s.last),`<div class="m">${ok?'شماره: '+E(num)+(s.parent?' (والدین)':' (موبایل خود زبان‌آموز؛ موبایل والدین ثبت نشده)'):'⚠️ شماره‌ای ثبت نشده است؛ از «اشتراک‌گذاری / کپی» استفاده کنید.'}</div><label>متن پیام (قابل ویرایش)<textarea name="t" rows="8">${E(text)}</textarea></label>`);
 m.querySelector('.bt').insertAdjacentHTML('afterbegin',(ok?'<button class="p" id="pw">📲 واتساپ</button><button id="ps2">💬 پیامک</button>':'')+'<button id="pc">📨 اشتراک‌گذاری / کپی</button>');
 const tx=()=>m.querySelector('[name=t]').value;
 if(ok){m.querySelector('#pw').onclick=()=>{window.open(waUrl(num,tx()),'_blank')};m.querySelector('#ps2').onclick=()=>{location.href=smsUrl(num,tx())}}
 m.querySelector('#pc').onclick=()=>shareRaw2(tx())}
// ---- terms (دوره): archive the results, start a new term, promote students ----
const sessOf=c=>c&&+c.sess>0?Math.round(+c.sess):SESS;
// ---- ترم‌ها: هر کلاس در سال ۴ ترم دارد؛ کلاس ثابت می‌ماند و فقط ترمش ارتقا پیدا می‌کند ----
const TERMS=[1,2,3,4];
const tmOf=c=>{const n=Math.round(+(c&&c.term));return n>=1&&n<=4?n:1};
const tmDates=(c,n)=>{const t=c&&c.terms&&c.terms[n];if(t&&typeof t=='object')return{start:t.start||'',end:t.end||''};return n==tmOf(c)?{start:(c&&c.start)||'',end:(c&&c.end)||''}:{start:'',end:''}};
const stTm=(s,c)=>{const n=Math.round(+(s&&s.tm));return n>=1&&n<=4?n:tmOf(c)};
function setTermDates(c,n,st,en){if(!c.terms||typeof c.terms!='object')c.terms={};if(!c.terms[tmOf(c)]&&tmOf(c)!=n){const d=tmDates(c,tmOf(c));c.terms[tmOf(c)]={start:d.start,end:d.end}}c.terms[n]={start:st||'',end:en||''}}
// تاریخ شروع مؤثر برای یک زبان‌آموز: اگر به‌صورت فردی به ترم دیگری ارتقا یافته، از آن تاریخ به بعد حساب می‌شود
const effA=(code,c)=>{const a=Cal.parse(os(c,'start')),s=A().find(x=>x.code==code),f=s&&s.tfrom?Cal.parse(s.tfrom):null;return f!=null&&(a==null||f>a)?f:a};
const clrTm=code=>{const s=A().find(x=>x.code==code);if(s){delete s.tm;delete s.tfrom}};
function dSet(m,n,val){const e=val&&String(val).trim()?Cal.parse(val):null,j=e!=null?Cal.jal(e):[0,0,0];const sy=m.querySelector(`[name=${n}_y]`);if(j[0]&&![...sy.options].some(o=>+o.value==j[0])){const o=document.createElement('option');o.value=j[0];o.textContent=j[0];sy.appendChild(o)}m.querySelector(`[name=${n}_d]`).value=j[2];m.querySelector(`[name=${n}_m]`).value=j[1];sy.value=j[0]}
const TRM=()=>Array.isArray(D.terms)?D.terms:(D.terms=[]);
function archiveTerm(c,codes,partial,tn){if(c&&!partial&&(!c.end||Cal.parse(c.end)==null)){toast('برای آرشیو دوره، ابتدا تاریخ پایان ترم را در تنظیمات کلاس تعیین کنید');return false;}if(c&&c.end&&!partial&&Cal.parse(today())<Cal.parse(c.end)){toast('تا تاریخ پایان ترم ('+c.end+') امکان آرشیو وجود ندارد');return false;}const H=heads();const st=codes.map(code=>{const s=A().find(x=>x.code==code);if(!s)return null;const t=totalOf(code),a=attStat(code,H);return{code,name:s.first+' '+s.last,total:t.final,manual:t.manual!=null,cats:(t.st?t.st.cats:[]).filter(k=>k.n).map(k=>({t:k.t,n:k.n,score:Math.round(k.score*10)/10})),att:a?{t:a.t,ab:a.ab,lt:a.lt}:null}}).filter(Boolean);
 const before={classState:{term:c.term,start:c.start,end:c.end,sess:c.sess,done:JSON.parse(JSON.stringify(c.done||{})),terms:JSON.parse(JSON.stringify(c.terms||{}))},studentState:codes.map(code=>{const s=A().find(x=>x.code==code);return s?{code,tm:s.tm,tfrom:s.tfrom}:null}).filter(Boolean)};TRM().push({id:'T'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),cls:c.name,term:tn||tmOf(c),level:c.level||'',start:c.start||'',end:c.end||'',sess:sessOf(c),closed:todayJ(),partial:!!partial,students:st,plan:(()=>{const p=planStat(c);return{done:p.done,total:p.total}})(),before,ts:Date.now()});return true}
function termEnd(i){const c=C()[i];if(!c)return;const cur=tmOf(c),nx=cur%4+1,nd=tmDates(c,nx);
 const m=modal('پایان ترم / شروع ترم جدید — '+E(c.name),`<div class="m">کلاس ثابت می‌ماند و فقط ترم آن ارتقا پیدا می‌کند. نتیجهٔ ترم ${cur} (نمرهٔ کل دوره، حضور و غیاب هر زبان‌آموز) در «دوره‌های قبلی» آرشیو می‌شود و نمرهٔ نهایی دستیِ کل دوره پاک می‌شود. گزارش‌های روزانه و «نمره‌های پایان دوره» دست‌نخورده می‌مانند. نمره و حضور ترم جدید فقط از گزارش‌های بعد از تاریخ شروع زیر حساب می‌شود.</div>`+sl('nt','زبان‌آموزان بعد از پایان ترم به کدام ترم منتقل شوند؟',TERMS.map(n=>[String(n),'ترم '+n+(n==cur?' (ترم فعلی)':'')]),String(nx))+`<div class="m">تاریخ‌های ترم انتخاب‌شده از تنظیم کلاس پر می‌شود و قابل تغییر است.</div><label>تاریخ شروع ترم جدید${dSel('ns',nd.start||Cal.fmt(today()))}</label><label>تاریخ پایان ترم جدید (اختیاری)${dSel('ne',nd.end)}</label>`+f('sess','تعداد جلسات ترم جدید',String(sessOf(c))),m=>{
  const v=g(m),nt=+v.nt,ns=dVal(m,'ns'),ne=dVal(m,'ne');
  if(!(nt>=1&&nt<=4))return toast('ترم را انتخاب کنید'),false;
  if(ns===null||ne===null)return toast('تاریخ را کامل (روز، ماه، سال) انتخاب کنید'),false;
  if(!ns)return toast('تاریخ شروع ترم جدید لازم است'),false;
  if(ns&&ne&&Cal.parse(ne)<Cal.parse(ns))return toast('تاریخ پایان قبل از تاریخ شروع است'),false;
  const sess=Math.round(+dg(v.sess));if(v.sess!==''&&!(sess>=1&&sess<=200))return toast('تعداد جلسات باید بین ۱ تا ۲۰۰ باشد'),false;
  archiveTerm(c,c.students.slice(),false,cur);c.done={};D.finals=FINS().filter(x=>!c.students.includes(os(x,'code')));
  c.students.forEach(clrTm);
  setTermDates(c,nt,ns,ne||'');c.term=nt;c.start=ns;c.end=ne||'';if(v.sess!=='')c.sess=sess;c.ts=Date.now();Cal.touch();save();draw();toast('ترم '+cur+' آرشیو شد — کلاس و زبان‌آموزان به ترم '+nt+' رفتند')},'آرشیو و شروع');
 m.querySelector('[name=nt]').onchange=function(){const d=tmDates(c,+this.value);dSet(m,'ns',d.start||Cal.fmt(today()));dSet(m,'ne',d.end)}}
function promo(i,code){const c=C()[i],s=A().find(x=>x.code==code);if(!c||!s)return;const cur=stTm(s,c);
 modal('ارتقای '+E(s.first)+' '+E(s.last),sl('to','انتقال به ترم',TERMS.map(n=>[String(n),'ترم '+n+(n==cur?' (ترم فعلی)':'')]),String(cur%4+1))+'<div class="m">نتیجهٔ ترم فعلی این زبان‌آموز (نمره و غیبت) در «دوره‌های قبلی» ثبت می‌شود و نمره و حضور او از فردا برای ترم جدید حساب می‌شود. او در همین کلاس می‌ماند.</div>',m=>{const to=+g(m).to;if(!(to>=1&&to<=4))return false;if(to==cur)return toast('ترم مقصد با ترم فعلی یکی است'),false;archiveTerm(c,[code],true,cur);D.finals=FINS().filter(x=>os(x,'code')!=code);if(to==tmOf(c))delete s.tm;else s.tm=to;s.tfrom=Cal.fmt(today()+1);c.ts=Date.now();save();draw();toast('به ترم '+to+' منتقل شد')},'انتقال')}
function restoreTermArchive(id){const x=TRM().find(z=>z.id==id);if(!x)return toast('آرشیو پیدا نشد');const c=C().find(z=>norm(z.name)==norm(x.cls));if(!c)return toast('کلاس مرتبط پیدا نشد');if(!x.partial&&(!x.before||!x.before.classState))return toast('اطلاعات بازگردانی این آرشیو کامل نیست؛ برای جلوگیری از آسیب به داده‌ها بازگردانی انجام نشد');if(x.before&&x.before.studentState&&x.before.studentState.some(q=>!A().some(st=>String(st.code)==String(q.code))))return toast('برخی زبان‌آموزان آرشیو در فهرست فعال یافت نشدند؛ بازگردانی متوقف شد');ask('آرشیو '+(x.term?'ترم '+x.term+' کلاس '+x.cls:'')+' به وضعیت قبل از آرشیو بازگردانده شود؟\nاین عملیات آرشیو را از فهرست دوره‌های قبلی حذف می‌کند و وضعیت کلاس و زبان‌آموزان را تغییر می‌دهد.',()=>{if(!TRM().some(z=>z.id==id))return toast('آرشیو قبلاً بازگردانی شده است');if(x.before&&x.before.classState&&!x.partial)Object.assign(c,x.before.classState);if(x.before&&x.before.studentState)x.before.studentState.forEach(q=>{const st=A().find(z=>String(z.code)==String(q.code));if(st){if(q.tm===undefined)delete st.tm;else st.tm=q.tm;if(q.tfrom===undefined)delete st.tfrom;else st.tfrom=q.tfrom}});TRM().splice(TRM().indexOf(x),1);save();draw();toast('آرشیو به حالت فعال بازگردانده شد')},'بازگردانی');}
function termsText(cn){const L=TRM().filter(x=>norm(x.cls)==norm(cn)).sort((a,b)=>b.ts-a.ts);let t='دوره‌های قبلی — کلاس '+cn+'\n';
 L.forEach(x=>{t+='\n'+(x.term?'ترم '+x.term+' — ':'')+(x.start||'—')+' تا '+(x.end||x.closed)+(x.partial?' (ارتقای فردی)':'')+' — '+x.sess+' جلسه\n';x.students.slice().sort((p,q)=>natCmp(p.name||'',q.name||'')).forEach(s=>{t+='• '+s.name+' — نمرهٔ کل: '+(s.total==null?'—':fm1(s.total))+(s.att?' • غیبت '+s.att.ab+' از '+s.att.t:'')+'\n'})});return t}
function termsDlg(i){const c=C()[i];if(!c)return;const L=TRM().filter(x=>norm(x.cls)==norm(c.name)).sort((a,b)=>b.ts-a.ts);
 modal('دوره‌های قبلی — '+E(c.name),(L.length?L.map(x=>`<div class="card"><b>${x.term?'ترم '+x.term+' — ':''}${E(x.start||'—')} تا ${E(x.end||x.closed)}</b>${x.partial?' <span class="m">(ارتقای فردی)</span>':''}<div class="m">${x.students.length} نفر • ${x.sess} جلسه${x.plan&&x.plan.total?' • برنامهٔ درسی: '+x.plan.done+' از '+x.plan.total:''}</div>`+x.students.slice().sort((p,q)=>natCmp(p.name||'',q.name||'')).map(s=>`<div class="r"><span>${E(s.name)}</span><span>${s.total==null?'—':fm1(s.total)}${s.att?' • غیبت '+s.att.ab+' از '+s.att.t:''}</span></div>`).join('')+`<div class="tb"><button class="d" onclick="restoreTermArchive('${E(x.id)}')">↩️ بازگردانی دوره به حالت فعال</button></div>`+'</div>').join('')+`<div class="tb">${xbtn('tm',()=>termsText(c.name),'previous-terms-'+c.name.replace(/\s+/g,'_'))}</div>`:'<div class="m">هنوز دورهٔ آرشیوشده‌ای نیست.</div>'))}
// ---- global search ----
let GQ='';
function vQ(){return`<input id="gq" placeholder="🔎 جستجو در زبان‌آموزان، کلاس‌ها، گزارش‌ها و رویدادها" value="${E(GQ)}" oninput="GQ=this.value;qFill()"><div id="gqr">${qRes()}</div>`}
function qFill(){const e=document.getElementById('gqr');if(e)e.innerHTML=qRes()}
const qS=code=>{const s=A().find(x=>x.code==code);if(!s)return;V='s';Q=s.first+' '+s.last;draw()},qC=i=>{V='c';CI=i;draw()},qEv=d=>{const e=Cal.parse(d);if(e==null)return;V='k';draw();KU.open(e)};
function qRes(){const q=norm(GQ);if(q.length<2)return'<div class="m">حداقل دو حرف بنویسید.</div>';let h='';const MAX=15;
 const st=A().filter(s=>canA(s)&&norm(s.first+' '+s.last+' '+s.code+' '+(s.mobile||'')+' '+(s.parent||'')+' '+(s.notes||'')).includes(q));
 const cl=C().map((c,i)=>[c,i]).filter(([c])=>canC(c)&&norm(c.name+' '+(c.level||'')+' '+(c.teacher||'')+' '+(c.notes||'')).includes(q));
 const rp=R().map((r,i)=>[r,i]).filter(([r])=>canR(r)&&norm((r.date||'')+' '+(r.class||'')+' '+(r.teacher||'')+' '+r.text).includes(q)).sort((a,b)=>(dayOf(b[0])[0]??-1e12)-(dayOf(a[0])[0]??-1e12));
 const ev=EVS().filter(e=>e&&os(e,'type')!='deleted'&&norm(os(e,'title')+' '+os(e,'note')+' '+os(e,'cls')).includes(q));
 if(st.length)h+=`<b>👨‍🎓 زبان‌آموزان (${st.length})</b>`+st.slice(0,MAX).map(s=>{const c=clsOf(s.code);return`<div class="card r" style="cursor:pointer" onclick="qS('${E(s.code)}')"><div>${E(s.first)} ${E(s.last)}<div class="m">${E(s.code)}${c>=0?' • '+E(C()[c].name):''}</div></div><span>‹</span></div>`}).join('');
 if(cl.length)h+=`<b>🏫 کلاس‌ها (${cl.length})</b>`+cl.slice(0,MAX).map(([c,i])=>`<div class="card r" style="cursor:pointer" onclick="qC(${i})"><div>${E(c.name)}<div class="m">${c.students.length} نفر${c.teacher?' • '+E(c.teacher):''}</div></div><span>‹</span></div>`).join('');
 if(rp.length)h+=`<b>📝 گزارش‌ها (${rp.length})</b>`+rp.slice(0,MAX).map(([r,i])=>`<div class="card r" style="cursor:pointer" onclick="rV(${i})"><div>${E(r.date)}${r.class?' — '+E(r.class):''}<div class="m">${E(prevT(r.text))}</div></div><span>‹</span></div>`).join('');
 if(ev.length)h+=`<b>📆 رویدادها (${ev.length})</b>`+ev.slice(0,MAX).map(e=>`<div class="card r" style="cursor:pointer" onclick="qEv('${E(os(e,'date'))}')"><div>${E(os(e,'title')||Cal.typeLabel(os(e,'type')))}<div class="m">${E(os(e,'date'))}${os(e,'cls')?' • '+E(os(e,'cls')):''}</div></div><span>‹</span></div>`).join('');
 return h||'<div class="m">چیزی پیدا نشد.</div>'}
// ---- today screen extras: attendance alerts, absentees to message, top debtors ----
function vT2(){let s='';const t=today(),H=heads();
 const al=[];C().filter(canC).forEach(c=>c.students.forEach(code=>{const x=attStat(code,H);if(x&&x.alert)al.push({code,x})}));al.sort((a,b)=>{const x=A().find(s=>s.code==a.code),y=A().find(s=>s.code==b.code);return x&&y?cmpS(x,y):0});
 s+=`<div class="card" id="tda"><b>⚠️ غیبت زیاد (از ${absLimit()} بار به بالا)</b>`+(al.length?al.slice(0,10).map(({code,x})=>{const z=A().find(q=>q.code==code);return`<div class="r" style="cursor:pointer" onclick="attDlg('${E(code)}')"><span>${E(z.first)} ${E(z.last)} <span class="m">${E(x.cls)}</span></span><b>${x.ab} غیبت</b></div>`}).join('')+(al.length>10?`<div class="m">و ${al.length-10} نفر دیگر…</div>`:'')+'<div class="tb"><button onclick="V=\'h\';draw()">📋 حضور و غیاب</button></div>':'<div class="m">کسی به حد هشدار نرسیده است. 👌</div>')+'</div>';
 const ab=[];R().forEach(r=>{if(pd(r.date)!==t||!canR(r))return;const c=C().find(k=>norm(k.name)==norm(r.class||''));if(!c)return;c.students.forEach(code=>{const si=A().findIndex(x=>x.code==code),key=si>=0?keyOf(si):'';if(key&&hit(r.text,key,H).a&&!ab.some(z=>z.code==code))ab.push({code,cls:c.name})})});
 if(ab.length)s+=`<div class="card"><b>📲 غایب‌های امروز — پیام به والدین</b>`+ab.map(z=>{const x=A().find(q=>q.code==z.code);return`<div class="r"><span>${E(x.first)} ${E(x.last)} <span class="m">${E(z.cls)}</span></span><button onclick="parentSend('${E(z.code)}',absMsg('${E(z.code)}',todayJ()))">💬</button></div>`}).join('')+'</div>';
 if(MGR){const db=Fin.debtors(FN,'').slice(0,5);if(db.length)s+=`<div class="card"><b>💰 یادآوری شهریه — بیشترین بدهی‌ها</b>`+db.map(a=>{const code=os(a.student,'code');return`<div class="r"><span>${E(Fin.name(a.student))} <span class="m">${Fin.toman(a.balance)}</span></span><button onclick="msgSend('${E(code)}',0)">💬</button></div>`}).join('')+'</div>'}
 return s}
// ===== curriculum progress, parent term card, class comparison =====
let CPV=-1,HM='a',RCC='';
const planOf=c=>Array.isArray(c.plan)?c.plan.map(x=>String(x).trim()).filter(Boolean):[];
const doneOf=c=>OBJ(c.done)?c.done:(c.done={});
function planStat(c){const pl=planOf(c),dn=doneOf(c),k=pl.filter(x=>own(dn,x)).length,sess=sessOf(c),st=Cal.parse(os(c,'start')),t=today(),en=Cal.parse(os(c,'end')),upto=en!=null&&en<t?en:t,held=st==null?0:Cal.number(c,EVS(),upto),exp=pl.length?Math.min(pl.length,Math.round(held/sess*pl.length)):0;
 return{total:pl.length,done:k,pct:pl.length?Math.round(k/pl.length*100):null,held,expected:exp,diff:k-exp,sess,hasStart:st!=null}}
const progressMsg=s=>!s.total?'':!s.hasStart?'برای مقایسه با برنامه، تاریخ شروع کلاس را در فرم کلاس ثبت کنید.':`تا امروز ${s.held} جلسه از ${s.sess} جلسهٔ دوره برگزار شده؛ طبق برنامه باید حدود ${s.expected} درس تدریس شده باشد. `+(s.diff<0?`⚠️ ${-s.diff} درس عقب‌تر از برنامه`:s.diff>0?`${s.diff} درس جلوتر از برنامه`:'✅ طبق برنامه');
function planText(c){const pl=planOf(c),dn=doneOf(c),st=planStat(c);let t='برنامهٔ درسی و پیشرفت — کلاس '+c.name+'\n';t+='تدریس‌شده: '+st.done+' از '+st.total+(st.pct!=null?' ('+st.pct+'٪)':'')+'\n';const pm=progressMsg(st);if(pm)t+=pm+'\n';t+='\n';pl.forEach(u=>{t+=(own(dn,u)?'✅ ':'⬜ ')+u+(own(dn,u)?' ('+dn[u]+')':'')+'\n'});return t}
function cpPage(i){const c=C()[i],pl=planOf(c),dn=doneOf(c),s=planStat(c);
 return`<div class="tb"><button onclick="CPV=-1;draw()">← بازگشت</button><button class="p" onclick="cpEdit(${i})">✏️ ویرایش فهرست درس‌ها</button></div><h3>📖 ${E(c.name)}</h3>`+(pl.length?`<div class="card"><b>${s.done} از ${s.total} درس تدریس شده (${s.pct}٪)</b><div style="background:var(--l);border-radius:8px;height:12px;overflow:hidden;margin:6px 0"><div style="height:100%;width:${s.pct}%;background:var(--a)"></div></div><div class="m">${E(progressMsg(s))}</div></div><div class="tb">${xbtn('cp',()=>planText(C()[i]),'curriculum-'+c.name.replace(/\s+/g,'_'))}</div><div class="m">درس‌ها هنگام ثبت گزارش روزانه (بخش «درس‌های برنامه») خودکار علامت می‌خورند؛ اینجا هم می‌توانید دستی تیک بزنید.</div>`+pl.map((u,k)=>`<label class="f card r" style="display:flex;color:var(--t)"><span><input type="checkbox" style="width:auto" ${own(dn,u)?'checked':''} onchange="cpTog(${i},${k})"> ${E(u)}</span><span class="m">${own(dn,u)?E(dn[u]):''}</span></label>`).join(''):'<div class="m">هنوز فهرست درسی تعریف نشده است. «ویرایش فهرست درس‌ها» را بزنید و هر درس را در یک خط بنویسید (مثلاً Unit 1 … Unit 12).</div>')}
function cpTog(i,k){const c=C()[i],u=planOf(c)[k];if(u==null)return;const dn=doneOf(c);if(own(dn,u))delete dn[u];else dn[u]=todayJ();c.ts=Date.now();save();draw()}
function cpEdit(i){const c=C()[i];modal('فهرست درس‌های '+E(c.name),`<div class="m">هر درس در یک خط (مثلاً Unit 1، Unit 2، …). با حذف یا تغییر نام یک درس، علامت «تدریس شد» همان درس هم پاک می‌شود.</div><textarea name="t" rows="12">${E(planOf(c).join('\n'))}</textarea>`,m=>{const L=uniq(m.querySelector('[name=t]').value.split(/\r?\n/));const dn=doneOf(c);Object.keys(dn).forEach(k=>{if(!L.includes(k))delete dn[k]});c.plan=L;c.ts=Date.now();save();draw();toast('ذخیره شد')})}
function markUnits(cn,units,date){const c=C().find(x=>norm(x.name)==norm(cn||''));if(!c||!units||!units.length)return;const pl=planOf(c),dn=doneOf(c);let ch=0;units.forEach(u=>{if(pl.includes(u)&&!own(dn,u)){dn[u]=date;ch++}});if(ch)c.ts=Date.now()}
function unitBoxes(o){const c=C().find(x=>x.name==o.cls),pl=c?planOf(c):[];if(!pl.length)return'';const dn=doneOf(c),sel=(o.F&&o.F.units)||[];
 return`<div id="fuw" data-c="${E(o.cls)}"><b>درس‌های برنامه (تدریس شده در این جلسه)</b>${pl.map((u,k)=>`<label class="f" style="display:block;color:var(--t);margin:2px 0"><input type="checkbox" id="fu${k}" style="width:auto" ${sel.includes(u)?'checked':''}> ${E(u)}${own(dn,u)&&!sel.includes(u)?' <span class="m">✅ '+E(dn[u])+'</span>':''}</label>`).join('')}</div>`}
function unitsFromForm(){const w=document.getElementById('fuw');if(!w)return[];const c=C().find(x=>x.name==w.dataset.c),pl=c?planOf(c):[];return pl.filter((u,k)=>{const e=document.getElementById('fu'+k);return e&&e.checked})}
// ---- parent term card ----
function rcData(code){const s=A().find(x=>x.code==code);if(!s)return null;const ci=clsOf(code),c=ci>=0?C()[ci]:null,t=totalOf(code),at=attStat(code),a0=c?effA(code,c):null,z0=c?Cal.parse(os(c,'end')):null;
 const gl=gradeOf(code).filter(g=>{const d=pd(g.date);return d==null||((a0==null||d>=a0)&&(z0==null||d<=z0))}),sk=SKILLS.map(([k,n])=>({n,v:gAvg(gl,k)})).filter(x=>x.v!=null);
 const weak=(t.st?t.st.cats.filter(k=>k.n).sort((x,y)=>y.n-x.n).slice(0,3):[]);
 return{s,c,t,at,sk,weak,ps:c&&planOf(c).length?planStat(c):null,note:(D.notes['studentNoteRC_'+code]||'').trim(),weakText:(D.notes['rcWeak_'+code]||'').trim(),praise:(D.notes['rcPraise_'+code]||'').trim()}}
function rcText(code){const d=rcData(code);if(!d)return'';const{s,c,t,at,sk,weak,ps,note,weakText,praise}=d;let r='کارنامهٔ ترمی — '+s.first+' '+s.last+'\n';
 if(c)r+='کلاس: '+c.name+(c.level?' ('+c.level+')':'')+' • ترم '+stTm(s,c)+(c.start||c.end?' • دوره: '+(c.start||'—')+' تا '+(c.end||'—'):'')+'\n';r+='\n';
 if(at)r+='حضور: '+at.t+' جلسه برگزار شده • غیبت '+at.ab+' • تأخیر '+at.lt+'\n';
 if(ps)r+='پیشرفت برنامهٔ درسی کلاس: '+ps.done+' از '+ps.total+' درس ('+ps.pct+'٪)\n';
 const secs=t.st?t.st.cats.filter(k=>Math.round(k.score*10)/10<100):[];
 if(secs.length){r+='\nنمرهٔ بخش‌ها:\n';secs.forEach(k=>{r+='• '+k.t+' : '+fm1(k.score)+(k.n?' ('+k.n+' بار ثبت شد)':'')+'\n'})}
 r+='\nنمرهٔ کل دوره: '+totLine(t)+'\n';
 if(sk.length){r+='\nآزمون پایان دوره:\n';sk.forEach(x=>{r+='• '+x.n+' : '+x.v+'\n'})}
 if(weakText)r+='\nنکات برای پیشرفت بیشتر:\n'+weakText+'\n';else if(weak.length){r+='\nنکات برای پیشرفت بیشتر:\n';weak.forEach(k=>{r+='• '+k.t+' ('+k.n+' بار) — مرور و تمرین بیشتر در منزل توصیه می‌شود.\n'})}if(t.final!=null&&Math.round(t.final*10)/10>=100&&praise)r+='\nپیام تشویقی:\n'+praise+'\n';
 if(note)r+='\nتوضیح معلم: '+note+'\n';return r}
const weakDefault=weak=>weak&&weak.length?weak.map(k=>'• '+k.t+' ('+k.n+' بار) — مرور و تمرین بیشتر در منزل توصیه می‌شود.').join('\n'):'برای پیشرفت بیشتر، تمرین منظم و مرور مطالب توصیه می‌شود.';
function rcReady(code,type){const key=type=='praise'?'rcPraiseTemplates':'rcWeakTemplates',label=type=='praise'?'متن‌های تشویقی آماده':'توضیحات آماده برای پیشرفت';const arr=Array.isArray(SS()[key])?SS()[key]:(type=='praise'?['آفرین! عملکرد فوق‌العاده‌ای داشتی و به تلاش و پشتکار تو افتخار می‌کنیم.','تبریک بابت کسب نمره کامل؛ به همین مسیر درخشان ادامه بده!']:['برای پیشرفت بیشتر، تمرین منظم و مرور مطالب توصیه می‌شود.','با تمرین بیشتر و استمرار، می‌توانی به نتایج عالی‌تری دست پیدا کنی.']);modal(label,`<div class="m">هر متن در یک خط. برای افزودن به کادر کارنامه، یک متن را انتخاب کنید.</div><select id="rct" style="width:100%">${arr.map((x,i)=>`<option value="${i}">${E(x)}</option>`).join('')}</select><textarea id="rcnew" rows="6">${E(arr.join('\n'))}</textarea>`,m=>{const texts=uniq(m.querySelector('#rcnew').value.split(/\r?\n/));SS()[key]=texts;save();const pick=m.querySelector('#rct').value;const chosen=arr[Number(pick)];if(chosen){D.notes[(type=='praise'?'rcPraise_':'rcWeak_')+code]=chosen;save();rcDlg(code)}else toast('متن‌های آماده ذخیره شدند')},'ذخیره متن‌ها');}
function rcPv(){const e=document.getElementById('rcpv');if(e)e.textContent=rcText(RCC)}
function rcDlg(code){const d=rcData(code);if(!d)return;RCC=code;
 const m=modal('کارنامهٔ ترمی — '+E(d.s.first)+' '+E(d.s.last),`<div class="tb"><button class="p">کارنامهٔ دوره</button><button onclick="rcSw('${E(code)}','m')">📅 کارنامهٔ ماهانه</button></div><label>نکات برای پیشرفت بیشتر (قابل ویرایش)<textarea rows="4" oninput="D.notes['rcWeak_${E(code)}']=this.value;save();rcPv()">${E(d.weakText||weakDefault(d.weak))}</textarea><div class="tb"><button type="button" onclick="rcReady('${E(code)}','weak')">📝 توضیحات آماده</button></div></label>${d.t.final!=null&&Math.round(d.t.final*10)/10>=100?`<label>پیام تشویقی (ویژه نمره ۱۰۰)<textarea rows="3" oninput="D.notes['rcPraise_${E(code)}']=this.value;save();rcPv()">${E(d.praise)}</textarea><div class="tb"><button type="button" onclick="rcReady('${E(code)}','praise')">🌟 توضیحات تشویقی آماده</button></div></label>`:''}<label>توضیح معلم برای والدین (اختیاری)<textarea rows="3" oninput="D.notes['studentNoteRC_${E(code)}']=this.value;save();rcPv()">${E(d.note)}</textarea></label><pre id="rcpv" style="white-space:pre-wrap">${E(rcText(code))}</pre><div class="tb">${xbtn('rc',()=>rcText(RCC),'term-card-'+code)}</div>`);
 m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="p" id="rcp">🖨 چاپ / PDF</button><button id="rcm">💬 ارسال به والدین</button>');
 m.querySelector('#rcp').onclick=()=>rcPrint(code);m.querySelector('#rcm').onclick=()=>parentSend(code,rcText(code))}
function rcPrint(code){const d=rcData(code);if(!d)return;const{s,c,t,at,sk,weak,ps,note}=d;const old=document.getElementById('cert');if(old)old.remove();
 const rows=(t.st?t.st.cats:[]).filter(k=>Math.round(k.score*10)/10<100).map(k=>`<tr><td style="text-align:right">${E(k.t)}</td><td>${k.n||'—'}</td><td>${fm1(k.score)}</td></tr>`).join('');
 const el=document.createElement('div');el.id='cert';
 el.innerHTML=`<div class="rc"><img class="lg" src="logo.jpg" alt=""><div class="rh"><img class="rl" src="logo.jpg" alt=""><div class="rt"><h1>کارنامهٔ ترمی</h1><div class="sub">Moradi English Class</div></div><div class="rd">تاریخ صدور<b>${todayJ()}</b></div></div><div class="nm">${E(s.first)} ${E(s.last)}</div><div class="chips">${c?'<span>کلاس '+E(c.name)+'</span>'+(c.level?'<span>سطح '+E(c.level)+'</span>':'')+'<span>ترم '+stTm(s,c)+'</span>'+(c.start||c.end?'<span>دوره: '+E(c.start||'—')+' تا '+E(c.end||'—')+'</span>':''):''}</div>
 ${at?`<div class="sec">حضور</div><div class="grid"><div><b>جلسات برگزار شده</b><span>${at.t}</span></div><div><b>غیبت</b><span>${at.ab}</span></div><div><b>تأخیر</b><span>${at.lt}</span></div>${ps?`<div><b>پیشرفت برنامه</b><span>${ps.pct}٪</span></div>`:''}</div>`:''}
 ${rows?`<div class="sec">نمرهٔ بخش‌ها</div><table><tr><th style="text-align:right">بخش</th><th>دفعات ثبت</th><th>نمره</th></tr>${rows}</table>`:''}
 <div class="sec">نمرهٔ کل دوره</div><div class="grid"><div class="big"><span>${t.final==null?'—':fm1(t.final)}</span></div></div>
 ${sk.length?`<div class="sec">آزمون پایان دوره</div><table>${sk.map(x=>`<tr><td style="text-align:right">${E(x.n)}</td><td>${x.v}</td></tr>`).join('')}</table>`:''}
 ${d.weakText||weak.length?`<div class="tx"><b>نکات برای پیشرفت بیشتر:</b>\n${E(d.weakText||weakDefault(weak))}</div>`:''}${t.final!=null&&Math.round(t.final*10)/10>=100&&d.praise?`<div class="tx"><b>پیام تشویقی:</b>\n${E(d.praise)}</div>`:''}
 ${note?`<div class="tx"><b>توضیح معلم:</b> ${E(note)}</div>`:''}
 <div class="foot"><div class="sg">امضای مدیر آموزشگاه</div><div class="sg">مهر آموزشگاه</div></div></div>`;
 document.body.appendChild(el);const st=document.createElement('style');st.id='rcpage';st.textContent='@media print{@page{size:A4 portrait;margin:0}}';document.head.appendChild(st);
 const done=()=>{try{el.remove();st.remove()}catch(e){}window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);setTimeout(done,60000);
 try{window.print()}catch(e){toast('چاپ در این مرورگر در دسترس نیست')}}
// ===== کارنامهٔ ماهانه: هر ماه ۸ جلسه؛ هر ایراد (و هر غیبت) ۱/۸ از ۱۰۰ نمره کم می‌کند =====
const MSESS=8;let RM=null;
const rmNow=()=>{const j=Cal.jal(today());return{y:j[0],m:j[1]}};
const rmRange=(y,m)=>{const p2=n=>String(n).padStart(2,'0'),s=Cal.parse(y+'/'+p2(m)+'/01'),n=m==12?Cal.parse((y+1)+'/01/01'):Cal.parse(y+'/'+p2(m+1)+'/01');return{s,e:n-1}};
const rmName=(y,m)=>MONTHS[m-1]+' '+y;
function attStatR(code,H,a,z){const si=A().findIndex(x=>x.code==code),ci=clsOf(code);if(si<0||ci<0)return null;const c=C()[ci],key=keyOf(si);if(!key)return null;H=H||heads();let t=0,ab=0,lt=0;const ad=[],ld=[],nc2=norm(c.name);
 R().forEach(r=>{if(norm(r.class||'')!=nc2)return;const[d,k]=dayOf(r);if(k==2)return;if(d<a||d>z)return;t++;const h=hit(r.text,key,H);if(h.a){ab++;ad.push(r.date)}else if(h.l){lt++;ld.push(r.date)}});
 return{t,ab,lt,ad,ld,cls:c.name}}
function monthData(code,y,m){const si=A().findIndex(x=>x.code==code);if(si<0)return null;const s=A()[si],ci=clsOf(code),c=ci>=0?C()[ci]:null,rg=rmRange(y,m),a0=c?effA(code,c):null,a=a0!=null&&a0>rg.s?a0:rg.s,z=rg.e,H=heads(),opts=OPT(),ix=[];
 R().forEach((r,i)=>{const[d,k]=dayOf(r);if(k==2)return;if(d<a||d>z)return;ix.push(i)});
 const x=stu(si,{ix,fb:0,un:0},H),n=opts.map(()=>0);
 x.items.forEach(it=>{const L=String(it.t||'').split(/\r?\n/).map(norm);opts.forEach((tt,j)=>{if(L.includes(norm(tt)))n[j]++})});
 const at=attStatR(code,H,a,z),useAb=SS().mabs!==false,cats=opts.map((tt,j)=>({t:tt,n:n[j],score:Math.max(0,100-n[j]*100/MSESS)}));
 if(useAb&&at)cats.push({t:'غیبت',n:at.ab,score:Math.max(0,100-at.ab*100/MSESS),abs:1});
 const has=at?at.t>0:x.items.length>0,total=has&&cats.length?Math.round(cats.reduce((u,v)=>u+v.score,0)/cats.length*10)/10:null;
 return{s,c,y,m,rg,at,cats,total,has,useAb,weak:cats.filter(k=>k.n&&!k.abs).sort((p,q)=>q.n-p.n).slice(0,3),note:(D.notes['studentNoteRM_'+code]||'').trim()}}
function rcmText(code,y,m){const d=monthData(code,y,m);if(!d)return'';const{s,c,at,cats,total,has,weak,note}=d;let r='کارنامهٔ ماهانه — '+s.first+' '+s.last+'\n';
 r+='ماه: '+rmName(y,m)+(c?' • کلاس: '+c.name+(c.level?' ('+c.level+')':'')+' • ترم '+stTm(s,c):'')+'\n\n';
 if(!has){r+='در این ماه گزارشی برای این زبان‌آموز ثبت نشده است.\n';return r}
 if(at)r+='حضور: '+at.t+' جلسه برگزار شده • غیبت '+at.ab+' • تأخیر '+at.lt+'\n';
 const secs=cats.filter(k=>Math.round(k.score*10)/10<100);
 if(secs.length){r+='\nنمرهٔ بخش‌ها:\n';secs.forEach(k=>{r+='• '+k.t+' : '+fm1(k.score)+(k.n?' ('+k.n+(k.abs?' بار':' بار ثبت شد')+')':'')+'\n'})}
 r+='\nنمرهٔ این ماه: '+(total==null?'—':fm1(total))+'\n';
 if(weakText)r+='\nنکات برای پیشرفت بیشتر:\n'+weakText+'\n';else if(weak.length){r+='\nنکات برای پیشرفت بیشتر:\n';weak.forEach(k=>{r+='• '+k.t+' ('+k.n+' بار) — مرور و تمرین بیشتر در منزل توصیه می‌شود.\n'})}if(t.final!=null&&Math.round(t.final*10)/10>=100&&praise)r+='\nپیام تشویقی:\n'+praise+'\n';
 if(note)r+='\nتوضیح معلم: '+note+'\n';return r}
function rcmPrint(code,y,m){const d=monthData(code,y,m);if(!d)return;const{s,c,at,cats,total,has,weak,note}=d;const old=document.getElementById('cert');if(old)old.remove();
 const rows=cats.filter(k=>Math.round(k.score*10)/10<100).map(k=>`<tr><td style="text-align:right">${E(k.t)}</td><td>${k.n||'—'}</td><td>${fm1(k.score)}</td></tr>`).join('');
 const el=document.createElement('div');el.id='cert';
 el.innerHTML=`<div class="rc"><img class="lg" src="logo.jpg" alt=""><div class="rh"><img class="rl" src="logo.jpg" alt=""><div class="rt"><h1>کارنامهٔ ماهانه</h1><div class="sub">Moradi English Class</div></div><div class="rd">تاریخ صدور<b>${todayJ()}</b></div></div><div class="nm">${E(s.first)} ${E(s.last)}</div><div class="chips"><span>${E(rmName(y,m))}</span>${c?'<span>کلاس '+E(c.name)+'</span>'+(c.level?'<span>سطح '+E(c.level)+'</span>':'')+'<span>ترم '+stTm(s,c)+'</span>':''}</div>
 ${has?`${at?`<div class="sec">حضور</div><div class="grid"><div><b>جلسات برگزار شده</b><span>${at.t}</span></div><div><b>غیبت</b><span>${at.ab}</span></div><div><b>تأخیر</b><span>${at.lt}</span></div></div>`:''}
 ${rows?`<div class="sec">نمرهٔ بخش‌ها</div><table><tr><th style="text-align:right">بخش</th><th>دفعات</th><th>نمره</th></tr>${rows}</table>`:''}
 <div class="sec">نمرهٔ این ماه</div><div class="grid"><div class="big"><span>${total==null?'—':fm1(total)}</span></div></div>
 ${d.weakText||weak.length?`<div class="tx"><b>نکات برای پیشرفت بیشتر:</b>\n${E(d.weakText||weakDefault(weak))}</div>`:''}${t.final!=null&&Math.round(t.final*10)/10>=100&&d.praise?`<div class="tx"><b>پیام تشویقی:</b>\n${E(d.praise)}</div>`:''}`:`<div class="tx">در این ماه گزارشی برای این زبان‌آموز ثبت نشده است.</div>`}
 ${note?`<div class="tx"><b>توضیح معلم:</b> ${E(note)}</div>`:''}
 <div class="foot"><div class="sg">امضای مدیر آموزشگاه</div><div class="sg">مهر آموزشگاه</div></div></div>`;
 document.body.appendChild(el);const st=document.createElement('style');st.id='rcpage';st.textContent='@media print{@page{size:A4 portrait;margin:0}}';document.head.appendChild(st);
 const done=()=>{try{el.remove();st.remove()}catch(e){}window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);setTimeout(done,60000);
 try{window.print()}catch(e){toast('چاپ در این مرورگر در دسترس نیست')}}
function rcmPv(){const e=document.getElementById('rcpv');if(e&&RM)e.textContent=rcmText(RCC,RM.y,RM.m)}
function rcSw(code,mode){document.querySelectorAll('.ov').forEach(x=>x.remove());mode=='m'?rcmDlg(code):rcDlg(code)}
function rcmDlg(code){const s=A().find(x=>x.code==code);if(!s)return;RCC=code;if(!RM)RM=rmNow();const cy=rmNow().y,ys=[cy-1,cy,cy+1];if(!ys.includes(RM.y))ys.push(RM.y);ys.sort();
 const note=(D.notes['studentNoteRM_'+code]||'').trim();
 const m=modal('کارنامهٔ ماهانه — '+E(s.first)+' '+E(s.last),`<div class="tb"><button onclick="rcSw('${E(code)}','t')">کارنامهٔ دوره</button><button class="p">📅 کارنامهٔ ماهانه</button></div><div class="r" style="gap:8px;align-items:flex-end"><label style="flex:1">ماه<select id="rmm">${MONTHS.map((n,i)=>`<option value="${i+1}"${i+1==RM.m?' selected':''}>${n}</option>`).join('')}</select></label><label style="flex:1">سال<select id="rmy">${ys.map(y=>`<option value="${y}"${y==RM.y?' selected':''}>${y}</option>`).join('')}</select></label></div><div class="m">در هر ماه ۸ جلسه برگزار می‌شود و هر ایراد ۱/۸ از ۱۰۰ نمره (۱۲٫۵) از نمرهٔ همان بخش کم می‌کند. نمرهٔ ماه میانگین نمرهٔ بخش‌هاست.</div><label class="f" style="margin:8px 0"><input type="checkbox" id="rmab"${SS().mabs!==false?' checked':''}> هر غیبت هم ۱/۸ از ۱۰۰ نمره کم کند (به‌صورت بخش «غیبت»)</label><label>توضیح معلم برای والدین (اختیاری)<textarea rows="3" oninput="D.notes['studentNoteRM_${E(code)}']=this.value;save();rcmPv()">${E(note)}</textarea></label><pre id="rcpv" style="white-space:pre-wrap">${E(rcmText(code,RM.y,RM.m))}</pre><div class="tb">${xbtn('rcm',()=>rcmText(RCC,RM.y,RM.m),'monthly-card-'+code)}</div>`);
 m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="p" id="rcp">🖨 چاپ / PDF</button><button id="rcm">💬 ارسال به والدین</button>');
 m.querySelector('#rmm').onchange=e=>{RM.m=+e.target.value;rcmPv()};m.querySelector('#rmy').onchange=e=>{RM.y=+e.target.value;rcmPv()};
 m.querySelector('#rmab').onchange=e=>{SS().mabs=!!e.target.checked;save();rcmPv()};
 m.querySelector('#rcp').onclick=()=>rcmPrint(code,RM.y,RM.m);m.querySelector('#rcm').onclick=()=>parentSend(code,rcmText(code,RM.y,RM.m))}
// ---- class comparison ----
function cmpRows(){const H=heads(),av=a=>a.length?Math.round(a.reduce((p,q)=>p+q,0)/a.length*10)/10:null;
 return C().filter(canC).map(c=>{const mem=c.students.filter(code=>A().some(x=>x.code==code)),at=[],sc=[],gk=[];
  mem.forEach(code=>{const x=attStat(code,H);if(x&&x.pct!=null)at.push(x.pct);const t=totalOf(code);if(t.auto!=null)sc.push(t.auto);const l=gradeOf(code),v=SKILLS.map(([k])=>gAvg(l,k)).filter(z=>z!=null);if(v.length)gk.push(v.reduce((p,q)=>p+q,0)/v.length)});
  const ps=planStat(c);return{c,n:mem.length,att:av(at),score:av(sc),skills:av(gk),plan:ps.pct,diff:ps.total?ps.diff:null}}).sort((a,b)=>natCmp(a.c.name,b.c.name))}
function cmpText(){let t='مقایسهٔ کلاس‌ها\n\n';cmpRows().forEach(x=>{t+='• '+x.c.name+' — '+x.n+' نفر • میانگین حضور: '+(x.att==null?'—':fm1(x.att)+'٪')+' • میانگین نمرهٔ کل دوره: '+(x.score==null?'—':fm1(x.score))+(x.skills!=null?' • میانگین نمره‌های پایان دوره: '+fm1(x.skills):'')+(x.plan!=null?' • پیشرفت برنامه: '+x.plan+'٪':'')+'\n'});return t}
function vCmp(){if(restricted())return'<div class="m">مقایسهٔ کلاس‌ها فقط برای مدیر (یا دستگاه بدون نقش معلم) نمایش داده می‌شود.</div>';const rows=cmpRows();if(!rows.length)return'<div class="m">کلاسی ثبت نشده است.</div>';
 const withScore=rows.filter(x=>x.score!=null),low=withScore.length>1?withScore[withScore.length-1].c.name:null;
 return`<div class="m">میانگین‌ها بر اساس نمرهٔ کل دوره (از گزارش‌های روزانه)، درصد حضور، نمره‌های پایان دوره و پیشرفت برنامهٔ درسی هر کلاس است. ${low?'کلاس با کمترین نمره با 🔻 مشخص شده است.':''}</div><div class="tb">${xbtn('hc',cmpText,'class-comparison')}</div>`+rows.map(x=>`<div class="card"><div class="r"><b>${x.c.name==low?'🔻 ':''}${E(x.c.name)}</b><span class="m">${x.n} نفر</span></div><div class="r"><span>میانگین نمرهٔ کل دوره</span><b>${x.score==null?'—':fm1(x.score)}</b></div><div class="r"><span>میانگین حضور</span><b>${x.att==null?'—':fm1(x.att)+'٪'}</b></div>${x.skills!=null?`<div class="r"><span>میانگین نمره‌های پایان دوره</span><b>${fm1(x.skills)}</b></div>`:''}${x.plan!=null?`<div class="r"><span>پیشرفت برنامهٔ درسی</span><b>${x.plan}٪${x.diff<0?' ⚠️':''}</b></div>`:''}</div>`).join('')}
function vH(){return`<div class="tb"><button class="${HM=='a'?'p':''}" onclick="HM='a';draw()">📋 حضور و غیاب</button><button class="${HM=='c'?'p':''}" onclick="HM='c';draw()">📊 مقایسهٔ کلاس‌ها</button></div>`+(HM=='c'?vCmp():vH0())}
function vT3(){const lag=C().filter(canC).map(c=>({c,s:planStat(c)})).filter(x=>x.s.total&&x.s.hasStart&&x.s.diff<0);if(!lag.length)return'';
 return`<div class="card"><b>📖 عقب‌تر از برنامهٔ درسی</b>`+lag.map(x=>`<div class="r" style="cursor:pointer" onclick="V='c';CPV=${C().indexOf(x.c)};draw()"><span>${E(x.c.name)}</span><b>${-x.s.diff} درس عقب</b></div>`).join('')+'</div>'}
// ---- today: the manager's morning screen ----
const hasRep=(cls,e)=>R().some(r=>norm(r.class||'')==norm(cls)&&pd(r.date)==e);
const repIdx=(cls,e)=>{let k=-1;R().forEach((r,i)=>{if(norm(r.class||'')==norm(cls)&&pd(r.date)==e)k=i});return k};
/** Held sessions of the last `days` days (today excluded) that have no report for that class and date. */
function missRows(days){const t=today(),from=t-days,out=[];C().filter(canC).forEach(c=>{if(Cal.parse(os(c,'start'))==null)return;const en=Cal.parse(os(c,'end'));const to=(en!=null&&en<t)?en:t-1;if(to<from)return;Cal.sessions(c,EVS(),from,to).forEach(x=>{const e=x[0];if(!hasRep(c.name,e))out.push({cls:c.name,e,n:x[1],d:Cal.fmt(e)})})});return out.sort((a,b)=>b.e-a.e)}
function vT(){const t=today(),j=Cal.jal(t),d=Cal.day(C().filter(canC),EVS(),t,'',false),it=d.items.filter(i=>i.kind!='event');
 let s=`<div class="card" id="tdc"><b>☀️ امروز — ${DAYS[Cal.wd(t)]} ${j[2]} ${MONTHS[j[1]-1]} ${j[0]}</b>`;
 if(d.holiday)s+=`<div style="color:var(--danger)">🔴 تعطیل: ${E(d.holiday)}</div>`;
 s+=(it.length?it.map(i=>`<div class="r" style="cursor:pointer" onclick="${i.kind=='cancelled'?`V='k';KU.open(${t})`:hasRep(i.cls,t)?`rV(${repIdx(i.cls,t)})`:`fNewFor('${E(i.cls).replace(/'/g,"\\'")}',${t})`}"><span>${i.time?E(i.time)+' — ':''}${E(i.cls)}</span><b style="font-size:13px">${i.kind=='cancelled'?'برگزار نمی‌شود':hasRep(i.cls,t)?'✅ گزارش ثبت شده ›':'⏳ بدون گزارش ›'}</b></div>`).join(''):'<div class="m">امروز جلسه‌ای نیست.</div>');
 if(it.some(i=>i.kind!='cancelled'))s+='<div class="m">با لمس جلسهٔ «بدون گزارش»، فرم گزارش همان کلاس و تاریخ امروز باز می‌شود؛ با لمس جلسهٔ «گزارش ثبت شده»، خود گزارش نمایش داده می‌شود.</div>';
 s+=`<div class="tb"><button onclick="V='k';KU.open(${t})">📆 تقویم امروز</button></div></div>`;
 const miss=missRows(7);
 s+=`<div class="card" id="tdm"><b>📝 گزارش‌های جاافتاده — ۷ روز گذشته</b>`+(miss.length?'<div class="m">با لمس هر مورد، فرم گزارش همان کلاس و همان تاریخ باز می‌شود.</div>'+miss.map(m=>`<div class="r" style="cursor:pointer" onclick="fNewFor('${E(m.cls).replace(/'/g,"\\'")}',${m.e})"><span>${E(m.d)} — ${E(m.cls)}</span><span class="m">📝 ثبت ‹</span></div>`).join(''):'<div class="m">همهٔ جلسه‌های این بازه گزارش دارند. 👌</div>')+'</div>';
 if(MGR){const due=Fin.dueLines(FN,t),db=Fin.debtors(FN,''),tot=db.reduce((a,x)=>a+x.balance,0);
  s+=`<div class="card"><b>💰 مالی امروز</b>`+(due.length?due.map(x=>`<div>${E(x)}</div>`).join(''):'<div class="m">قسط سررسیدی برای امروز نیست.</div>')+`<div style="margin-top:6px">مجموع بدهی: <b>${Fin.toman(tot)}</b> — ${db.length} نفر</div><div class="tb"><button onclick="V='m';MS='d';draw()">بدهکاران</button><button onclick="V='m';MS='h';draw()">مالی</button></div></div>`}
 return s}
// ---- students ----
function vS(){const q=norm(Q),L=A().map((s,i)=>[s,i]).filter(([s])=>canA(s)&&norm(s.first+' '+s.last+' '+s.code+' '+s.mobile+' '+(s.parent||'')).includes(q)).sort((x,y)=>cmpS(x[0],y[0]));
return`<div class="tb"><button class="p" onclick="sF(-1)">➕ افزودن</button>${pickBtn('📥 ورود Excel','.xlsx','xl.bind(0,\'s\')')}<button onclick="xlExport('s')">📤 خروجی Excel</button><button onclick="showArchivedStudents()">🗃️ آرشیو</button><button onclick="showStudentHistory()">📚 سوابق</button></div><input placeholder="🔎 جستجو (نام، کد، موبایل)" value="${E(Q)}" oninput="Q=this.value;sS()"><div class="m">ستون‌های Excel: کد | نام | نام خانوادگی | موبایل | کد ملی | تاریخ تولد | توضیحات | موبایل والدین (ردیف اول عنوان)</div><div id="sl">${sL(L)}</div>`}
const sL=L=>`<div class="m">تعداد: ${L.length}</div>`+L.map(([s,i])=>{const c=clsOf(s.code);return`<div class="card r"><div style="cursor:pointer;flex:1" onclick="spOpen('${E(s.code)}')">${E(s.first)} ${E(s.last)}<div class="m">${E(s.code)}${c>=0?' • '+E(C()[c].name):''}</div></div><div><button onclick="msgPick('${E(s.code)}')">💬</button> <button onclick="sF(${i})">✏️</button> <button class="d" onclick="sD(${i})">🗑️</button></div></div>`}).join('');
function sS(){const q=norm(Q);$('#sl').innerHTML=sL(A().map((s,i)=>[s,i]).filter(([s])=>canA(s)&&norm(s.first+' '+s.last+' '+s.code+' '+s.mobile+' '+(s.parent||'')).includes(q)))}
function sF(i){const o=i>=0?A()[i]:{};modal(i>=0?'ویرایش زبان‌آموز':'افزودن زبان‌آموز',f('first','نام',o.first)+f('last','نام خانوادگی',o.last)+f('mobile','موبایل',o.mobile)+f('parent','موبایل والدین (برای پیام واتساپ/پیامک)',o.parent)+f('national','کد ملی',o.national)+f('birth','تاریخ تولد',o.birth)+f('notes','توضیحات',o.notes,3),m=>{const v=g(m);if(!v.first||!v.last)return toast('نام و نام خانوادگی الزامی است'),false;const go=()=>{if(i>=0)Object.assign(A()[i],v);else A().push({code:nc('S',A()),...v});save();draw()};if(i<0&&A().some(x=>norm(x.first)==norm(v.first)&&norm(x.last)==norm(v.last)))ask('زبان‌آموزی با همین نام کامل ثبت شده؛ باز هم ثبت شود؟',go,'ثبت');else go()})}
function studentSnapshot(s){return JSON.parse(JSON.stringify(s||{}))}
function addStudentHistory(code,action,cls,details){const st=A().find(x=>String(x.code)==String(code))||D.archivedStudents.find(x=>String(x.code)==String(code));D.studentHistory.push({id:'H'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),code:String(code),name:st?[st.first,st.last].filter(Boolean).join(' '):'',action,class:cls||'',date:todayJ(),ts:Date.now(),details:details||''})}
function archiveStudent(s,reason){if(!s||!s.code)return;const old=D.archivedStudents.find(x=>String(x.code)==String(s.code));const rec={...studentSnapshot(s),archivedAt:Date.now(),archivedDate:todayJ(),archiveReason:reason||'حذف از فهرست فعال'};if(old)Object.assign(old,rec);else D.archivedStudents.push(rec)}
function showArchivedStudents(){const list=D.archivedStudents.slice().sort((a,b)=>(b.archivedAt||0)-(a.archivedAt||0));const html=(list.length?list.map(s=>`<div class="card r"><div><b>${E([s.first,s.last].filter(Boolean).join(' ')||'نام ثبت‌نشده')}</b><div class="m">${E(s.code||'')} • ${E(s.archivedDate||'')} • ${E(s.archiveReason||'')}</div></div>${s.unresolved?'':'<button onclick="restoreArchivedStudent(\''+E(String(s.code||'').replace(/'/g,''))+'\')">بازگردانی</button>'}</div>`).join(''):'<div class="m">زبان‌آموز آرشیوشده‌ای وجود ندارد.</div>')+'<div class="tb"><button onclick="showStudentHistory()">📚 مشاهدهٔ سوابق عضویت</button></div>';modal('آرشیو زبان‌آموزان',html)}
function showStudentHistory(){const list=D.studentHistory.slice().sort((a,b)=>(b.ts||0)-(a.ts||0));const html=list.length?list.map(h=>`<div class="card"><b>${E(h.name||h.code||'زبان‌آموز')}</b><div>${E(h.action||'')} ${h.class?'— کلاس '+E(h.class):''}</div><div class="m">${E(h.date||'')} • ${E(h.details||'')}</div></div>`).join(''):'<div class="m">هنوز سابقهٔ عضویتی ثبت نشده است.</div>';modal('سوابق عضویت زبان‌آموزان',html)}
function restoreArchivedStudent(code){const s=D.archivedStudents.find(x=>String(x.code)==String(code));if(!s)return toast('رکورد آرشیو پیدا نشد');if(s.unresolved)return toast('مشخصات این شناسه در پشتیبان موجود نیست و امکان بازگردانی آن به‌عنوان زبان‌آموز فعال وجود ندارد');if(A().some(x=>String(x.code)==String(code)))return toast('این زبان‌آموز در فهرست فعال وجود دارد');const cp=studentSnapshot(s);delete cp.archivedAt;delete cp.archivedDate;delete cp.archiveReason;A().push(cp);D.archivedStudents=D.archivedStudents.filter(x=>String(x.code)!=String(code));addStudentHistory(code,'بازگردانی از آرشیو','','بازگشت به فهرست فعال');save();showArchivedStudents();toast('زبان‌آموز بازگردانی شد')}
const sD=i=>ask('زبان‌آموز از فهرست فعال حذف و به آرشیو منتقل شود؟ سوابق گزارش‌ها حفظ می‌شود.',()=>{const st=A()[i];if(!st)return;const c=st.code;archiveStudent(st,'حذف از فهرست فعال');C().forEach(k=>k.students=k.students.filter(x=>x!=c));addStudentHistory(c,'آرشیو','','حذف از فهرست فعال؛ سوابق آموزشی نگهداری شد');A().splice(i,1);save();draw()},'انتقال به آرشیو');
// ---- classes ----
function vC(){if(CPV>=0&&C()[CPV])return cpPage(CPV);if(CI>=0&&C()[CI])return cD(CI);return`<div class="tb"><button class="p" onclick="cF(-1)">➕ افزودن کلاس</button>${pickBtn('📥 ورود Excel','.xlsx','xl.bind(0,\'c\')')}<button onclick="xlExport('c')">📤 خروجی Excel</button></div><div class="m">ستون‌های Excel: کد | نام کلاس | سطح | شروع | پایان | روزها | ساعت | توضیحات</div>`+(restricted()?`<div class="m">فقط کلاس‌های «${E(ME)}» نمایش داده می‌شود (نقش این دستگاه در تنظیمات).</div>`:'')+C().map((c,i)=>[c,i]).sort((x,y)=>cmpC(x[0],y[0])).map(([c,i])=>canC(c)?`<div class="card r" onclick="CI=${i};draw()" style="cursor:pointer"><div>${E(c.name)}<div class="m">${E(c.code)} • ترم ${tmOf(c)} • ${c.students.length} نفر${c.teacher?' • '+E(c.teacher):''}</div></div><span>‹</span></div>`:'').join('')}
function cD(i){const c=C()[i],L=[['level','سطح'],['teacher','معلم'],['sess','تعداد جلسات دوره'],['notes','توضیحات']].filter(([k])=>c[k]).map(([k,l])=>`${l}: ${E(c[k])}`).concat(Cal.sched(c)||c.days||c.time?['روزها و ساعت: '+E(Cal.scheduleText(c))]:[]).join('<br>');
return`<div class="tb"><button onclick="CI=-1;draw()">← بازگشت</button><button class="p" onclick="cM(${i})">➕ افزودن زبان‌آموز</button><button onclick="cF(${i})">✏️</button><button class="d" onclick="cX(${i})">🗑️</button></div><div class="tb"><button class="p" onclick="termEnd(${i})">📦 پایان دوره / ترم جدید</button><button onclick="termsDlg(${i})">📚 دوره‌های قبلی</button><button onclick="CPV=${i};draw()">📖 برنامهٔ درسی و پیشرفت</button></div><h3>${E(c.name)} <span class="m">• ترم ${tmOf(c)}</span></h3><div class="m">${L}</div><div class="m">${TERMS.map(n=>{const d=tmDates(c,n);return d.start||d.end?'ترم '+n+(n==tmOf(c)?' (فعلی)':'')+': '+E(d.start||'—')+' تا '+E(d.end||'—'):''}).filter(Boolean).join('<br>')}</div><div class="m">اعضا: ${c.students.length}${c.cap?' از '+c.cap:''}</div>`+c.students.map(code=>A().find(s=>s.code==code)).filter(Boolean).sort(cmpS).map(s=>`<div class="card r"><span style="cursor:pointer;text-decoration:underline dotted" onclick="spOpen('${E(s.code)}')">${E(s.first)} ${E(s.last)}${stTm(s,c)!=tmOf(c)?' <span class="m">(ترم '+stTm(s,c)+')</span>':''}</span><button onclick="cert('${E(s.code).replace(/'/g,'')}','${E(c.name).replace(/'/g,"\\'")}')">🎓 گواهی</button> <button onclick="rcDlg('${E(s.code).replace(/'/g,'')}')">📄 کارنامه</button> <button onclick="promo(${i},'${E(s.code).replace(/'/g,'')}')">↗ ارتقا</button> <button onclick="cR(${i},'${E(s.code).replace(/'/g,'')}')">حذف از کلاس</button></div>`).join('')}
// ---- skill report card (خواندن / نوشتن / شنیدن / صحبت) ----
const SKILLS=[['r','خواندن'],['w','نوشتن'],['l','شنیدن'],['s','صحبت']];
let GA=null,GC='',GM='e';
// whole-course score: computed from every saved grade (average of the skill averages) unless a final score was typed by hand
const FINS=()=>Array.isArray(D.finals)?D.finals:(D.finals=[]);
const finOf=code=>FINS().find(x=>os(x,'code')==code);
const gradeOf=code=>GRD().filter(g=>g.code==code).sort((a,b)=>(pd(b.date)??0)-(pd(a.date)??0));
const gAvg=(l,k)=>{const v=l.map(x=>+x[k]).filter(n=>!isNaN(n)&&n>=0);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null};
// ---- whole-course score from the daily reports ----
// The course counts as 24 sessions. Every ready-made status (the up to 8 «توضیحات آماده») is one part of the report card, starting at 100.
// Each report in which a student got that status takes 100/24 off that part. The course score is the average of the parts.
const SESS=24,fm1=v=>String(Math.round(v*10)/10);
function courseStat(code){const si=A().findIndex(x=>x.code==code);if(si<0)return null;const ci=clsOf(code),c=ci>=0?C()[ci]:null,opts=OPT();
 const a=c?effA(code,c):null,z=c?Cal.parse(os(c,'end')):null,rng=a!=null||z!=null,ix=[];
 R().forEach((r,i)=>{const[d,k]=dayOf(r);if(k==2){if(!rng)ix.push(i);return}if(a!=null&&d<a)return;if(z!=null&&d>z)return;ix.push(i)});
 const x=stu(si,{ix,fb:0,un:0},heads()),n=opts.map(()=>0);
 x.items.forEach(it=>{const L=String(it.t||'').split(/\r?\n/).map(norm);opts.forEach((t,j)=>{if(L.includes(norm(t)))n[j]++})});
 const SZ=sessOf(c),cats=opts.map((t,j)=>({t,n:n[j],score:Math.max(0,100-n[j]*100/SZ)})),auto=cats.length?Math.round(cats.reduce((u,v)=>u+v.score,0)/cats.length*10)/10:null;
 return{cats,auto,marked:cats.reduce((u,v)=>u+v.n,0),reports:x.items.length,ranged:rng}}
const totalOf=code=>{const f=finOf(code),m=f&&+f.total>=0?+f.total:null,st=courseStat(code),a=st?st.auto:null;return{manual:m,auto:a,final:m!=null?m:a,note:f?os(f,'note'):'',st}};
const totLine=t=>t.final==null?'—':fm1(t.final)+(t.manual!=null?' (ثبت دستی)':' (از گزارش‌های روزانه)');
const gTabs=()=>`<div class="tb"><button class="${GM=='e'?'p':''}" onclick="GM='e';draw()">📝 ثبت نمره (پایان دوره)</button><button class="${GM=='t'?'p':''}" onclick="GM='t';draw()">📊 نمرهٔ کل دوره</button></div>`;
function vA(){if(!GA&&GM=='t')return gTabs()+vAT();if(GA){const s=A().find(x=>x.code==GA);if(!s){GA=null;return vA()}
  const l=gradeOf(GA),ci=clsOf(GA),cn=ci>=0?C()[ci].name:'';
  const avg=SKILLS.map(([k,t])=>{const a=gAvg(l,k);return a==null?'':`${t} ${a}`}).filter(Boolean).join(' • ');
  return`<div class="tb"><button onclick="GA=null;draw()">← بازگشت</button><button class="p" onclick="gradeDlg('${E(s.code)}')">➕ ثبت نمره</button></div><div class="tb">${xbtn('gc',gradeText,'report-card-'+GA)}</div><h3>${E(s.first)} ${E(s.last)}</h3>${cn?`<div class="m">کلاس: ${E(cn)}</div>`:''}`+
   `<div class="card r"><span>نمرهٔ کل دوره: <b>${totLine(totalOf(GA))}</b></span><button onclick="totalDlg('${E(s.code)}')">📊 جزئیات</button></div>`+(l.length?`<div class="card"><b>میانگین</b><div class="m">${avg||'—'}</div></div>`+l.map(g=>`<div class="card"><div class="r"><b>${E(g.date)}</b><span class="m">${SKILLS.map(([k,t])=>g[k]!=null&&+g[k]>=0?t+' '+g[k]:'').filter(Boolean).join(' • ')||'—'}</span></div>${g.note?`<div class="m">${E(g.note)}</div>`:''}<div class="tb"><button onclick="gradeDlg('${E(s.code)}','${E(os(g,'id'))}')">✏️ ویرایش</button><button class="d" onclick="gradeDel('${E(os(g,'id'))}')">🗑️ حذف</button></div></div>`).join(''):'<div class="m">هنوز نمره‌ای ثبت نشده است.</div>')}
 const cs=C().filter(canC).sort(cmpC);
 let h=`<label>کلاس<select onchange="GC=this.value;draw()"><option value="">— انتخاب کلاس —</option>${cs.map(c=>`<option ${c.name==GC?'selected':''} value="${E(c.name)}">${E(c.name)}</option>`).join('')}</select></label>`;
 const c=cs.find(x=>x.name==GC);
 const mem=c?c.students.map(code=>A().find(s=>s.code==code)).filter(Boolean).sort(cmpS):A().filter(canA).sort(cmpS);
 if(!mem.length)return h+'<div class="m">هنوز زبان‌آموزی ثبت نشده است.</div>';
 return gTabs()+h+'<div class="m">میانگین نمره‌های هر زبان‌آموز (۰ تا ۱۰۰) — برای ثبت نمره روی نام بزنید.</div>'+
  mem.map(s=>{const l=gradeOf(s.code);return`<div class="card r" style="cursor:pointer" onclick="GA='${E(s.code)}';draw()"><div>${E(s.first)} ${E(s.last)}<div class="m">${SKILLS.map(([k,t])=>{const a=gAvg(l,k);return a==null?'':t+' '+a}).filter(Boolean).join(' • ')||'بدون نمره'}</div></div><span>‹</span></div>`}).join('')}
function gradeDlg(code,id){const s=A().find(x=>x.code==code);if(!s)return;const g0=id?GRD().find(x=>os(x,'id')==id):null;
 modal((id?'ویرایش نمره — ':'ثبت نمره — ')+E(s.first)+' '+E(s.last),f('date','تاریخ (مثلاً 1405/08/17)',g0?g0.date:todayJ())+SKILLS.map(([k,t])=>f(k,t,g0&&g0[k]!=null&&+g0[k]>=0?String(g0[k]):'')).join('')+f('note','توضیح (اختیاری)',g0?g0.note:'',2),m=>{
  const v=g(m);if(pd(v.date)==null)return toast('تاریخ معتبر نیست (مثلاً 1405/08/17)'),false;
  const o={};for(const [k] of SKILLS){const raw=String(v[k]||'').trim();if(raw===''){o[k]=-1;continue}const n=Math.round(+dg(raw));if(isNaN(n)||n<0||n>100)return toast('نمره‌ها باید بین ۰ تا ۱۰۰ باشند'),false;o[k]=n}
  if(SKILLS.every(([k])=>o[k]<0)&&!String(v.note||'').trim())return toast('حداقل یک نمره یا توضیح وارد کنید'),false;
  const rec=id?GRD().find(x=>os(x,'id')==id):{id:uid(),code};
  Object.assign(rec,o,{code,date:String(v.date).trim(),note:String(v.note||'').trim(),ts:Date.now()});
  if(!id)GRD().push(rec);
  save();draw();toast('ذخیره شد')})}
function vAT(){const cs=C().filter(canC).sort(cmpC);
 let h=`<label>کلاس<select onchange="GC=this.value;draw()"><option value="">— همهٔ زبان‌آموزان —</option>${cs.map(c=>`<option ${c.name==GC?'selected':''} value="${E(c.name)}">${E(c.name)}</option>`).join('')}</select></label>`;
 const c=cs.find(x=>x.name==GC),mem=c?c.students.map(code=>A().find(s=>s.code==code)).filter(Boolean).sort(cmpS):A().filter(canA).sort(cmpS);
 if(!mem.length)return h+'<div class="m">هنوز زبان‌آموزی ثبت نشده است.</div>';
 return h+`<div class="m">نمره از گزارش‌های روزانه محاسبه می‌شود: کل دوره (پیش‌فرض ${SESS} جلسه؛ برای هر کلاس قابل تغییر) در نظر گرفته می‌شود و هر بار که برای زبان‌آموز یکی از وضعیت‌های آماده (بخش‌های کارنامه) ثبت شده، به‌اندازهٔ یک جلسه (صد تقسیم بر تعداد جلسات دوره) از نمرهٔ همان بخش کم می‌شود. نمرهٔ کل = میانگین بخش‌ها. برای جزئیات یا ثبت نمرهٔ نهایی دستی روی نام بزنید.</div><div class="tb">${xbtn('gt',totalsText,'course-totals'+(GC?'-'+GC.replace(/\s+/g,'_'):''))}</div>`+
  mem.map(s=>{const t=totalOf(s.code),q=t.st;return`<div class="card r" style="cursor:pointer" onclick="totalDlg('${E(s.code)}')"><div>${E(s.first)} ${E(s.last)}<div class="m">${q?q.marked+' وضعیت در '+q.reports+' گزارش':''}</div></div><b>${t.final==null?'—':fm1(t.final)}</b></div>`}).join('')}
function totalDlg(code){const s=A().find(x=>x.code==code);if(!s)return;const t=totalOf(code),q=t.st;
 const rows=q&&q.cats.length?q.cats.map(c=>`<div class="r"><span>${E(c.t)}${c.n?' <span class="m">× '+c.n+'</span>':''}</span><b>${fm1(c.score)}</b></div>`).join(''):'<div class="m">وضعیت آماده‌ای تعریف نشده است (تنظیمات ← توضیحات آماده).</div>';
 modal('نمرهٔ کل دوره — '+E(s.first)+' '+E(s.last),`<div class="m">هر بخش از ۱۰۰ شروع می‌شود و برای هر بار ثبت وضعیت ${fm1(100/sessOf(C()[clsOf(code)]))} نمره کم می‌شود (${sessOf(C()[clsOf(code)])} جلسه در دوره).${q&&q.ranged?' فقط گزارش‌های بین تاریخ شروع و پایان کلاس حساب شده‌اند.':''}</div><div class="card">${rows}<div class="r"><span><b>میانگین کل (از گزارش‌ها)</b></span><b>${t.auto==null?'—':fm1(t.auto)}</b></div></div>`+f('total','نمرهٔ نهایی دستی (۰ تا ۱۰۰؛ خالی = همان نمرهٔ محاسبه‌شده)',t.manual==null?'':String(t.manual))+f('note','توضیح (اختیاری)',t.note,2),m=>{
  const v=g(m),raw=String(v.total||'').trim();let n=-1;if(raw!==''){n=Math.round(+dg(raw));if(isNaN(n)||n<0||n>100)return toast('نمره باید بین ۰ تا ۱۰۰ باشد'),false}
  const note=String(v.note||'').trim(),old=finOf(code);
  if(n<0&&!note){if(old)D.finals=FINS().filter(x=>x!==old)}else{const rec=old||{id:'F_'+code,code};Object.assign(rec,{total:n,note,ts:Date.now()});if(!old)FINS().push(rec)}
  save();draw();toast('ذخیره شد')});
 const bt=document.querySelector('.ov:last-of-type .bt');if(bt){XT['gs']=[()=>totalStuText(code),'course-card-'+code];bt.insertAdjacentHTML('afterbegin',`<button onclick="rcDlg('${E(code)}')">📄 کارنامهٔ والدین</button><button onclick="xo('s','gs')">📨 ارسال</button><button onclick="xo('i','gs')">🖼 تصویر</button>`)}}
function totalStuText(code){const s=A().find(x=>x.code==code),t=totalOf(code),q=t.st,ci=clsOf(code);if(!s)return'';
 let r='کارنامهٔ کل دوره — '+s.first+' '+s.last+'\n'+(ci>=0?'کلاس: '+C()[ci].name+'\n':'')+'\n';
 if(q)q.cats.forEach(c=>{r+=c.t+' : '+fm1(c.score)+(c.n?'  ('+c.n+' بار)':'')+'\n'});
 r+='\nنمرهٔ کل دوره: '+totLine(t)+'\n';if(t.note)r+='\nتوضیحات: '+t.note+'\n';return r}
function totalsText(){const c=C().find(x=>x.name==GC),mem=c?c.students.map(code=>A().find(s=>s.code==code)).filter(Boolean).sort(cmpS):A().filter(canA).sort(cmpS);
 let t='کارنامهٔ کل دوره'+(c?' — کلاس '+c.name:'')+'\n\n';
 mem.forEach(s=>{const x=totalOf(s.code),q=x.st,lost=q?q.cats.filter(k=>k.n).map(k=>k.t+' '+fm1(k.score)).join(' • '):'';t+='• '+s.first+' '+s.last+' — نمرهٔ کل دوره: '+(x.final==null?'—':fm1(x.final))+(x.manual!=null?' (ثبت دستی)':'')+(lost?'\n  '+lost:'')+(x.note?'\n  '+x.note:'')+'\n'});return t}
const xTotals=()=>shareRaw(totalsText());
const gradeDel=id=>ask('این نمره حذف شود؟',()=>{D.grades=GRD().filter(x=>os(x,'id')!=id);save();draw()},'حذف');
function gradeText(){const s=A().find(x=>x.code==GA);if(!s)return'';const l=gradeOf(GA),ci=clsOf(GA);
 let t='کارنامهٔ مهارتی — '+s.first+' '+s.last+'\n'+(ci>=0?'کلاس: '+C()[ci].name+'\n':'')+'\n';
 t+='تاریخ | '+SKILLS.map(([,x])=>x).join(' | ')+'\n';
 l.slice().reverse().forEach(g=>{t+=g.date+' | '+SKILLS.map(([k])=>g[k]!=null&&+g[k]>=0?g[k]:'—').join(' | ')+'\n';if(g.note)t+='  ('+g.note+')\n'});
 t+='\nمیانگین: '+(SKILLS.map(([k,x])=>{const a=gAvg(l,k);return a==null?'':x+' '+a}).filter(Boolean).join(' • ')||'—')+'\nنمرهٔ کل دوره: '+totLine(totalOf(GA))+'\n';return t}
function xGrade(){if(!GA)return;const t=gradeText();if(t)shareRaw(t)}
function dSel(n,val){const cy=Cal.jal(today())[0];let y0=0,m0=0,d0=0;const e=val&&String(val).trim()?Cal.parse(val):null;if(e!=null){const j=Cal.jal(e);y0=j[0];m0=j[1];d0=j[2]}const ys=[];for(let y=cy-2;y<=cy+3;y++)ys.push(y);if(y0&&!ys.includes(y0)){ys.push(y0);ys.sort((a,b)=>a-b)}
const op=(v,t,c)=>`<option value="${v}"${c==v?' selected':''}>${t}</option>`;
return`<div class="dsel" style="display:flex;gap:6px"><select name="${n}_d">${op(0,'روز',d0)}${Array.from({length:31},(_,k)=>op(k+1,k+1,d0)).join('')}</select><select name="${n}_m">${op(0,'ماه',m0)}${MONTHS.map((t,k)=>op(k+1,t,m0)).join('')}</select><select name="${n}_y">${op(0,'سال',y0)}${ys.map(y=>op(y,y,y0)).join('')}</select></div>`}
// '' = nothing chosen, null = incomplete / impossible date, else yyyy/MM/dd
function dVal(m,n){const d=+m.querySelector(`[name=${n}_d]`).value,mo=+m.querySelector(`[name=${n}_m]`).value,y=+m.querySelector(`[name=${n}_y]`).value;if(!d&&!mo&&!y)return'';if(!d||!mo||!y)return null;if(d>Cal.monthLen(y,mo))return null;return Cal.fmtJ(y,mo,d)}
// a new meeting day starts with the hours of the previous chosen day
function schOn(el,i){if(!el.checked)return;const m=el.closest('.ov'),s=m.querySelector('[name=s'+i+']'),e=m.querySelector('[name=e'+i+']');if(s.value||e.value)return;for(let k=0;k<7;k++){if(k==i)continue;const o=m.querySelector('[name=on'+k+']');if(o.checked){const s2=m.querySelector('[name=s'+k+']').value,e2=m.querySelector('[name=e'+k+']').value;if(s2||e2){s.value=s2;e.value=e2;break}}}}
function cF(i){const o=i>=0?C()[i]:{},sc=Cal.sched(o)||Cal.legacySched(o);
const rows=DAYS.map((dn,k)=>{const d=OBJ(own(sc,String(k)));return`<div class="r" style="margin:4px 0"><label class="f" style="flex:1 0 90px"><input type="checkbox" name="on${k}" ${d?'checked':''} onchange="schOn(this,${k})" style="width:auto"> ${dn}</label><label style="flex:1 0 110px;margin:0">شروع<input type="time" name="s${k}" value="${d&&sc[k].s||''}"></label><label style="flex:1 0 110px;margin:0">پایان<input type="time" name="e${k}" value="${d&&sc[k].e||''}"></label></div>`}).join('');
modal(i>=0?'ویرایش کلاس':'افزودن کلاس',f('name','نام کلاس',o.name)+f('level','سطح/دوره',o.level)+f('cap','ظرفیت کلاس (اختیاری، ۰ = بدون محدودیت)',o.cap||'')+f('sess','تعداد جلسات دوره (خالی = ۲۴)',o.sess||'')+sl('teacher','معلم کلاس (برای نقش معلم)',[['','— مشخص نشده —'],...[...new Set([...TCH(),...(o.teacher?[o.teacher]:[])])].map(x=>[x,x])],o.teacher||'')+`${sl('term','ترم فعلی کلاس',TERMS.map(n=>[String(n),'ترم '+n]),String(tmOf(o)))}<div class="m">هر کلاس در سال چهار ترم دارد. برای هر ترم تاریخ شروع و پایان را جدا بنویسید؛ تاریخ‌های «ترم فعلی» مبنای حضور، نمره و تقویم است.</div>${TERMS.map(n=>{const d=tmDates(o,n);return`<div class="card"><b>ترم ${n}</b><label>شروع (روز / ماه / سال)${dSel('t'+n+'s',d.start)}</label><label>پایان (روز / ماه / سال)${dSel('t'+n+'e',d.end)}</label></div>`}).join('')}<div class="m" style="margin-top:8px">روزهای تشکیل کلاس و ساعت شروع و پایان هر روز</div>${rows}`+f('notes','توضیحات',o.notes,3),m=>{const v=g(m);if(!v.name)return toast('نام کلاس الزامی است'),false;
const terms={};for(const n of TERMS){const s1=dVal(m,'t'+n+'s'),e1=dVal(m,'t'+n+'e');if(s1===null||e1===null)return toast('تاریخ ترم '+n+' را کامل و درست انتخاب کنید (روز، ماه و سال) یا هر سه را خالی بگذارید'),false;if(s1&&e1&&Cal.parse(e1)<Cal.parse(s1))return toast('در ترم '+n+' تاریخ پایان قبل از تاریخ شروع است'),false;terms[n]={start:s1,end:e1}}const curT=Math.min(4,Math.max(1,Math.round(+v.term)||1)),sv=terms[curT].start,ev=terms[curT].end;
const sched={},dn=[];let common=null,same=true;for(let k=0;k<7;k++){if(!m.querySelector('[name=on'+k+']').checked)continue;const s1=m.querySelector('[name=s'+k+']').value,e1=m.querySelector('[name=e'+k+']').value;sched[k]={s:s1,e:e1};dn.push(DAYS[k]);const sp=Cal.span(s1,e1);if(common===null)common=sp;else if(common!==sp)same=false}
const r={name:v.name,level:v.level,cap:Math.max(0,parseInt(dg(v.cap),10)||0),sess:Math.max(0,parseInt(dg(v.sess),10)||0),teacher:v.teacher||'',notes:m.querySelector('[name=notes]').value.trim(),term:curT,terms,start:sv,end:ev,sched,days:dn.join(' و '),time:same&&common!==null?common:'',ts:Date.now()};
if(i>=0){Object.assign(C()[i],r);Cal.touch()}else{C().push({code:nc('C',C()),...r,students:[]});CI=C().length-1}save();draw()})}
const cX=i=>ask('کلاس حذف شود؟ زبان‌آموزان حذف نمی‌شوند.',()=>{C().splice(i,1);CI=-1;save();draw()},'حذف');
const cR=(i,code)=>ask('این زبان‌آموز از کلاس خارج شود؟ سوابق حضور و غیاب و گزارش‌های قبلی حفظ می‌شود.',()=>{const c=C()[i];if(!c)return;addStudentHistory(code,'خروج از کلاس',c.name,'حذف عضویت از کلاس؛ اطلاعات زبان‌آموز و گزارش‌های قبلی حفظ شد');c.students=c.students.filter(x=>x!=code);clrTm(code);save();draw()},'خروج از کلاس');
/** Certificate: shown only while printing, so the browser's print sheet can "save as PDF". */
function cert(code,cls){const s=A().find(x=>x.code==code);if(!s)return toast('زبان‌آموز پیدا نشد');const c=C().find(x=>x.name==cls)||{};
 const old=document.getElementById('cert');if(old)old.remove();
 const el=document.createElement('div');el.id='cert';
 el.innerHTML=`<div class="cw"><img class="lg" src="logo.jpg" alt=""><h1>گواهی پایان دوره</h1><div class="sub">Moradi English Class</div><div class="line">بدین وسیله گواهی می‌شود</div><div class="name">${E(s.first)} ${E(s.last)}</div><div class="line">دورهٔ ${E(c.name||'—')}${c.level?' — سطح '+E(c.level):''} را با موفقیت به پایان رسانده است.</div><div class="foot"><span>تاریخ: ${todayJ()}</span><span>امضای مدیر آموزشگاه</span></div></div>`;
 document.body.appendChild(el);
 const done=()=>{try{el.remove()}catch(e){}window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);
 setTimeout(done,60000);
 try{window.print()}catch(e){toast('چاپ در این مرورگر در دسترس نیست')}}
function cM(i){const c=C()[i],cap=c.cap||0;if(cap&&c.students.length>=cap)return toast('ظرفیت این کلاس پر است ('+cap+' نفر)');const fr=A().filter(s=>clsOf(s.code)<0);if(!fr.length)return toast('زبان‌آموزِ بدون کلاس وجود ندارد (هر نفر فقط در یک کلاس است)');modal('افزودن به کلاس',fr.map(s=>`<label class="f" style="display:block;color:var(--t);font-size:16px"><input type="checkbox" style="width:auto" value="${E(s.code)}"> ${E(s.first)} ${E(s.last)} <span class="m">${E(s.code)}</span></label>`).join(''),m=>{let added=0;[...m.querySelectorAll('input:checked')].forEach(e=>{if(clsOf(e.value)>=0)return;if(cap&&c.students.length>=cap)return;c.students.push(e.value);addStudentHistory(e.value,'ورود به کلاس',c.name,'عضویت در کلاس ثبت شد');added++});save();draw();if(cap&&c.students.length>=cap&&added)toast('ظرفیت کلاس پر شد؛ بقیه اضافه نشدند')},'افزودن')}
// ---- settings, header parsing, merge ----
const DEF_T=['Asal','Asha'],DEF_O=['روخوانی تکرار گرفتند','معنی تکرار گرفتند','روخوانی با ارفاق پذیرفته شد','معنی با ارفاق پذیرفته شد','تمرینات انجام نداده بودند','تمرینات ناقص انجام شده بود'];
const SS=()=>D.settings&&typeof D.settings=='object'?D.settings:(D.settings={});
const uniq=a=>{const o=[];(Array.isArray(a)?a:[]).forEach(x=>{x=String(x).trim();if(x&&!o.includes(x))o.push(x)});return o};
const TCH=()=>SS().teachers?uniq(SS().teachers):DEF_T.slice(),OPT=()=>(SS().options?uniq(SS().options):DEF_O.slice()).slice(0,8);
const uid=()=>(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const hasStatus=t=>(t||'').split(/\r?\n/).some(l=>{const b=bare(norm(l));return b=='وضعیت امروز بچه ها'||b=='وضعیت بچه ها'});
const RES=/^(وضعیت|غایب|غیبت|تاخیر|کلاس|درس|تکلیف|یادداشت|با سلام|سلام|student|workbook)/;
function parseTeacher(t){const h=hidT(t);if(h)return h;let n=0;for(const line of t.split(/\r?\n/)){const l=line.trim();if(!l)continue;if(++n>3)break;const k=norm(l);if(k.startsWith('معلم')){const m=/^\S+\s*[:：]\s*(.+)$/.exec(l);if(m)return m[1].trim();continue}if(RES.test(k))continue;const c=/^([^\s:：][^:：]{0,30}?)\s*[:：]$/.exec(l);if(c)return c[1].trim()}return''}
function parseClass(t){for(const line of t.split(/\r?\n/)){const l=line.trim();if(!norm(l).startsWith('کلاس'))continue;const m=/^\S+\s*[:：]\s*(.+)$/.exec(l);if(m)return m[1].trim()}return''}
const matchCls=n=>{const k=norm(n);if(!k)return'';const c=C().find(x=>norm(x.name)==k);return c?c.name:n.trim()};
function inferCls(t){const n=norm(t);let best='',bc=0,tie=false;C().forEach(c=>{let k=0;c.students.forEach(code=>{const s=A().find(x=>x.code==code);if(!s)return;const f=norm(s.first);if(f&&tokRe(f).test(n))k++});if(k>bc){bc=k;best=c.name;tie=false}else if(k==bc&&k>0)tie=true});return tie?'':best}
function findDup(date,cls,tch,ex){if(!norm(cls))return-1;const d=pd(date);return R().findIndex((r,i)=>{if(i==ex||norm(r.class||'')!=norm(cls)||norm(r.teacher||'')!=norm(tch||''))return false;const rd=pd(r.date);return d!=null&&rd!=null?d==rd:norm(r.date)==norm(date)})}
const rk=x=>x.id?'id:'+x.id:'t:'+norm(x.date)+'|'+norm(x.class)+'|'+norm(x.teacher)+'|'+norm(x.text);
function mergeIn(r){const res={s:0,c:0,m:0,r:0,dr:0,n:0,e:0,eu:0,g:0,gu:0,f:0,fu:0,tm:0},map={},fk=s=>norm(s.first)+'|'+norm(s.last),ok=x=>x&&typeof x=='object';
(r.students||[]).filter(ok).forEach(s=>{const code=String(s.code||'');let f=null;const l=A().find(x=>fk(x)==fk(s));if(l)f=l.code;if(!f){const b=A().find(x=>x.code==code);if(b&&fk(b)==fk(s))f=code}if(!f){const cp={...s};let n2=code;if(!code||A().some(x=>norm(x.code)==norm(code)))n2=nc('S',A());cp.code=n2;A().push(cp);f=n2;res.s++}map[code]=f});
(r.classes||[]).filter(ok).forEach(c=>{let ci=C().findIndex(x=>norm(x.name)==norm(c.name));if(ci<0){const cp={...c,students:[]};if(!cp.code||C().some(x=>norm(x.code)==norm(cp.code)))cp.code=nc('C',C());C().push(cp);ci=C().length-1;res.c++}const loc=C()[ci];if(ol(c,'ts',0)>ol(loc,'ts',0)){['level','start','end','term','terms','days','time','notes','sched','cap','sess','teacher','plan','done'].forEach(k=>{if(k in c)loc[k]=JSON.parse(JSON.stringify(c[k]))});loc.ts=ol(c,'ts',0)}(Array.isArray(c.students)?c.students:[]).forEach(code=>{const lc=map[String(code)];if(lc&&clsOf(lc)<0){C()[ci].students.push(lc);res.m++}})});
const srcStudents=new Map((r.students||[]).filter(ok).map(st=>[String(st.code||''),studentSnapshot(st)]));
const archivedSrc=new Map((r.archivedStudents||[]).filter(ok).map(st=>[String(st.code||''),studentSnapshot(st)]));
const keys=new Set(R().map(rk));(r.reports||[]).filter(ok).forEach(x=>{if(keys.has(rk(x))){res.dr++;return}const cp=JSON.parse(JSON.stringify(x)),F=OBJ(cp.form)?cp.form:null,snaps={};if(F){const codes=new Set([...(Array.isArray(F.absent)?F.absent:[]),...(Array.isArray(F.late)?F.late:[]),...Object.keys(OBJ(F.marks)?F.marks:{})].map(String));const remapCode=code=>{const old=String(code),mapped=map[old]||old;let st=srcStudents.get(old)||archivedSrc.get(old)||D.archivedStudents.find(z=>String(z.code)==old)||A().find(z=>String(z.code)==mapped);if(st){snaps[mapped]={code:mapped,first:st.first||'',last:st.last||''};}else if(!D.archivedStudents.some(z=>String(z.code)==old)){const missing={code:old,first:'',last:'',archivedAt:Date.now(),archivedDate:cp.date||'',archiveReason:'ارجاع تاریخی در پشتیبان؛ مشخصات زبان‌آموز در فایل موجود نبود',unresolved:true};D.archivedStudents.push(missing);res.as=(res.as||0)+1;snaps[old]=studentSnapshot(missing)}return mapped};F.absent=Array.isArray(F.absent)?F.absent.map(remapCode):[];F.late=Array.isArray(F.late)?F.late.map(remapCode):[];if(OBJ(F.marks)){const nm={};Object.keys(F.marks).forEach(k=>{nm[remapCode(k)]=F.marks[k]});F.marks=nm}const oldSnaps=OBJ(F.studentSnapshots)?F.studentSnapshots:{};const remappedSnaps={};Object.keys(oldSnaps).forEach(k=>{const nk=map[k]||k;remappedSnaps[nk]={code:nk,first:oldSnaps[k].first||'',last:oldSnaps[k].last||''}});F.studentSnapshots={...snaps,...remappedSnaps}}keys.add(rk(cp));R().push(cp);res.r++});
ARR(r.archivedStudents).forEach(st=>{if(!OBJ(st)||!os(st,'code'))return;const code=os(st,'code');if(!A().some(x=>String(x.code)==code)&&!D.archivedStudents.some(x=>String(x.code)==code)){D.archivedStudents.push(studentSnapshot(st));res.as=(res.as||0)+1}});ARR(r.studentHistory).forEach(h=>{if(!OBJ(h)||!os(h,'id'))return;if(!D.studentHistory.some(x=>os(x,'id')==os(h,'id'))){D.studentHistory.push(JSON.parse(JSON.stringify(h)));res.sh=(res.sh||0)+1}});
const nn=r.notes&&typeof r.notes=='object'?r.notes:{};Object.keys(nn).forEach(k=>{let key=k;const u=k.indexOf('_');if(k.startsWith('studentNote')&&u>0){const l=map[k.slice(u+1)];if(l)key=k.slice(0,u+1)+l}if(!(key in D.notes)&&String(nn[k]).trim()){D.notes[key]=nn[k];res.n++}});
const sj=r.settings&&typeof r.settings=='object'?r.settings:null;if(sj){const t=TCH();uniq(sj.teachers).forEach(x=>{if(!t.includes(x))t.push(x)});if(sj.teachers||SS().teachers)SS().teachers=t;if(!SS().options&&Array.isArray(sj.options))SS().options=uniq(sj.options).slice(0,8)}
ARR(r.events).forEach(e=>{if(!OBJ(e)||!os(e,'id'))return;const at=EVS().findIndex(o=>os(o,'id')==os(e,'id'));if(at<0){EVS().push(JSON.parse(JSON.stringify(e)));res.e++}else if(ol(e,'ts',0)>ol(EVS()[at],'ts',0)){EVS()[at]=JSON.parse(JSON.stringify(e));res.eu++}});
ARR(r.grades).forEach(x=>{if(!OBJ(x)||!os(x,'id'))return;const code=map[os(x,'code')]||os(x,'code');const g=JSON.parse(JSON.stringify(x));g.code=code;const at=GRD().findIndex(o=>os(o,'id')==os(g,'id'));if(at<0){GRD().push(g);res.g++}else if(ol(g,'ts',0)>ol(GRD()[at],'ts',0)){GRD()[at]=g;res.gu++}});
ARR(r.finals).forEach(x=>{if(!OBJ(x)||!os(x,'id'))return;const g=JSON.parse(JSON.stringify(x));g.code=map[os(x,'code')]||os(x,'code');g.id='F_'+g.code;const at=FINS().findIndex(o=>os(o,'id')==g.id);if(at<0){FINS().push(g);res.f++}else if(ol(g,'ts',0)>ol(FINS()[at],'ts',0)){FINS()[at]=g;res.fu++}});
ARR(r.terms).forEach(x=>{if(!OBJ(x)||!os(x,'id'))return;if(!TRM().some(o=>os(o,'id')==os(x,'id'))){const g=JSON.parse(JSON.stringify(x));g.students=ARR(g.students).filter(OBJ).map(z=>({...z,code:map[os(z,'code')]||os(z,'code')}));TRM().push(g);res.tm++}});
Cal.touch();
fix();save();return res}
const mergeMsg=x=>`زبان‌آموز جدید: ${x.s}<br>کلاس جدید: ${x.c}<br>عضو جدید در کلاس‌ها: ${x.m}<br>گزارش جدید: ${x.r}<br>گزارش تکراری (نادیده گرفته شد): ${x.dr}<br>یادداشت جدید: ${x.n}<br>رویداد و برنامه درسی جدید: ${x.e}<br>رویداد و برنامه درسی به‌روز شده (نسخه جدیدتر): ${x.eu}<br>نمرهٔ جدید: ${x.g}<br>نمرهٔ به‌روز شده: ${x.gu}<br>نمرهٔ کل دوره (جدید / به‌روز): ${x.f} / ${x.fu}<br>دورهٔ آرشیوشدهٔ جدید: ${x.tm}<br>زبان‌آموز آرشیوشدهٔ جدید: ${x.as||0}<br>رویداد سابقهٔ عضویت جدید: ${x.sh||0}`;
const dn=code=>{const i=A().findIndex(x=>x.code==code);if(i<0)return code;const s=A()[i];return clashN(i,norm(s.first))?s.first.trim()+' '+s.last.trim():s.first.trim()};
const cmpS=(a,b)=>natCmp(String(a.last??'').trim(),String(b.last??'').trim())||natCmp(String(a.first??'').trim(),String(b.first??'').trim());
const cmpC=(a,b)=>natCmp(String(a.name??'').trim(),String(b.name??'').trim());
const byCode=(a,b)=>{const x=A().find(s=>s.code==a),y=A().find(s=>s.code==b);return x&&y?cmpS(x,y):0};
const memOf=cn=>{const c=C().find(x=>x.name==cn);return c?c.students.filter(code=>A().some(s=>s.code==code)).sort(byCode):[]};
const stripT=t=>{let n=0;const o=[];String(t??'').split(/\r?\n/).forEach(l=>{const q=l.trim(),k=norm(q);let d=false;if(q){n++;if(k.startsWith('معلم'))d=/^\S+\s*[:：]\s*(.+)$/.test(q);else if(n<=3&&!RES.test(k)&&/^([^\s:：][^:：]{0,30}?)\s*[:：]$/.test(q))d=true}if(!d)o.push(l)});return o.join('\n')};
const SCH='Moradi English Class',HID=/\u2063([\u200B\u2060]+)\u2063/;
const hidT=t=>{const m=HID.exec(String(t??''));if(!m||m[1].length%8)return'';const by=[];for(let i=0;i<m[1].length;i+=8){let v=0;for(let j=0;j<8;j++)v=v*2+(m[1][i+j]=='\u2060'?1:0);by.push(v)}try{return new TextDecoder().decode(new Uint8Array(by)).trim()}catch(e){return''}};
const hideT=n=>'\u2063'+[...new TextEncoder().encode(n.trim())].map(b=>b.toString(2).padStart(8,'0').replace(/0/g,'\u200B').replace(/1/g,'\u2060')).join('')+'\u2063';
const bldS=(t,hide)=>{t=String(t??'');const tch=parseTeacher(t);t=stripT(t).replace(new RegExp(HID.source,'g'),'');const l=t.split(/\r?\n/).find(x=>x.trim());if(!(l&&norm(l)==norm(SCH)))t=SCH+'\n'+t;if(hide&&tch){const ls=t.split('\n'),i=ls.findIndex(x=>x.trim());ls[i]+=hideT(tch);t=ls.join('\n')}return t};
const withSch=t=>bldS(t,true),plainSch=t=>bldS(t,false);
const prevT=t=>{const o=[];let n=0;plainSch(t).split(/\r?\n/).forEach(l=>{const q=l.trim(),k=norm(q);if(!q||k==norm(SCH)||/^(با سلام|سلام|کلاس|وضعیت|درس|تکلیف|student|workbook)/.test(k)||findDate(q))return;o.push(q)});const r=o.join(' ⏎ ');return r.length>70?r.slice(0,70)+'…':r};
const one=s=>String(s||'').replace(/\s*[\r\n]+\s*/g,' ').trim();
function formText(F,tch,date,cls,mem){const ab=new Set(F.absent),lt=new Set(F.late.filter(c=>!ab.has(c)));let s=SCH+'\n';if(tch.trim())s+='معلم : '+one(tch)+'\n';s+='با سلام\n\n'+date.trim()+'\n';if(cls.trim())s+='کلاس : '+cls.trim()+'\n';s+='\n';
const bk=one(F.book),wb=one(F.workbook),ot=one(F.other),un=(F.units||[]).join(' ، ');if(bk||wb||ot||un){s+='درس امروز\n';if(bk)s+="Student's book : "+bk+'\n';if(wb)s+='Workbook : '+wb+'\n';if(ot)s+=ot+'\n';if(un)s+='درس‌های برنامه : '+un+'\n';s+='\n'}
const a=mem.filter(c=>ab.has(c)),l=mem.filter(c=>!ab.has(c)&&lt.has(c));if(a.length||l.length){if(a.length)s+='غایب : '+a.map(dn).join(' ، ')+'\n';if(l.length)s+='تأخیر : '+l.map(dn).join(' ، ')+'\n';s+='\n'}
const hw=(F.homework||'').trim();if(hw)s+='تکلیف جلسه بعد\n'+hw+'\n\n';s+='وضعیت امروز بچه‌ها\n\n';
const G=new Map();mem.forEach(c=>{const m=F.marks[c];if(ab.has(c)||!m)return;const L=[...(m.opts||[])],o=one(m.other);if(o)L.push(o);if(!L.length)return;const k=L.join('\n');if(!G.has(k))G.set(k,{L,c:[]});G.get(k).c.push(c)});
G.forEach(g=>{s+=g.c.map(dn).join(' ، ')+'\n'+g.L.join('\n')+'\n\n'});const ge=(F.general||'').trim();if(ge)s+=ge+'\n';return s.replace(/\s+$/,'')+'\n'}
const emptyF=()=>({book:'',workbook:'',other:'',homework:'',general:'',units:[],absent:[],late:[],marks:{}});
function fNorm(F){F.late=F.late.filter(c=>!F.absent.includes(c));F.absent.forEach(c=>delete F.marks[c]);Object.keys(F.marks).forEach(c=>{const m=F.marks[c];if(!(m.opts||[]).length&&!String(m.other||'').trim())delete F.marks[c]});return F}
// ---- daily reports ----
const dayOf=r=>{const d=pd(r.date);if(d!=null)return[d,0];if(r.createdAt){const n=new Date(r.createdAt);return[ep(n.getFullYear(),n.getMonth()+1,n.getDate()),1]}return[null,2]};
const RO=new Set();
const FAB='ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی',rnk=c=>{c=c.toLowerCase();if(c>='a'&&c<='z')return 1000+c.charCodeAt(0)-97;c=({'آ':'ا','أ':'ا','إ':'ا','ء':'ا','ك':'ک','ي':'ی','ى':'ی','ئ':'ی','ة':'ه','ؤ':'و'})[c]||c;const k=FAB.indexOf(c);return k>=0?2000+k:3000+c.charCodeAt(0)};
// class names: Latin letters first, then Persian in alphabet order; numbers compare as numbers (A2 before A10)
function natCmp(a,b){const isD=c=>/[0-9\u06f0-\u06f9\u0660-\u0669]/.test(c);let i=0,j=0;while(i<a.length&&j<b.length){const x=a[i],y=b[j],dx=isD(x),dy=isD(y);
if(dx&&dy){let i2=i,j2=j;while(i2<a.length&&isD(a[i2]))i2++;while(j2<b.length&&isD(b[j2]))j2++;const na=dg(a.slice(i,i2)).replace(/^0+(?=.)/,''),nb=dg(b.slice(j,j2)).replace(/^0+(?=.)/,'');if(na.length!=nb.length)return na.length<nb.length?-1:1;if(na!=nb)return na<nb?-1:1;i=i2;j=j2}
else if(dx!=dy)return dx?-1:1;else{const r=rnk(x)-rnk(y);if(r)return r<0?-1:1;i++;j++}}return(a.length-i)-(b.length-j)}
function vR(){const ix=R().map((r,i)=>i).filter(i=>canR(R()[i])).sort((a,b)=>(dayOf(R()[b])[0]??-1e12)-(dayOf(R()[a])[0]??-1e12));
return`<div class="tb"><button class="p" onclick="fNew()">📝 ساخت گزارش با فرم</button><button onclick="rPaste()">📋 ورود از متن (چسباندن)</button>${pickBtn('📥 ورود فایل TXT','.txt,text/plain','rT')}<button onclick="rF(-1)">✍️ نوشتن متنی</button></div><div class="m">گزارش‌ها: ${R().length} • تاریخ هر گزارش (شمسی یا میلادی) مبنای گزارش‌های دوره‌ای است.</div>`+(()=>{const G=new Map();C().forEach(c=>canC(c)&&G.set(norm(c.name),{n:c.name,l:[]}));ix.forEach(i=>{const cl=(R()[i].class||'').trim(),k=cl?norm(cl):'';if(!G.has(k))G.set(k,{n:cl,l:[]});G.get(k).l.push(i)});const ks=[...G.keys()].filter(k=>k!=='').sort((x,y)=>natCmp(G.get(x).n,G.get(y).n));if(G.has(''))ks.push('');
return ks.filter(k=>G.get(k).l.length).map(k=>{const g=G.get(k);return`<details class="grp" ${RO.has(k)?'open':''} ontoggle="this.open?RO.add('${E(k).replace(/'/g,"\\'")}'):RO.delete('${E(k).replace(/'/g,"\\'")}')"><summary><b>${k===''?'بدون کلاس':'🏫 '+E(g.n)}</b> — ${g.l.length} گزارش</summary>`+g.l.map(i=>{const r=R()[i];return`<div class="card r" onclick="rV(${i})" style="cursor:pointer"><div>${E(r.date)}${r.teacher?' — '+E(r.teacher):''}<div class="m">${E(prevT(r.text))}</div></div><span>‹</span></div>`}).join('')+'</details>'}).join('')})()}
function rV(i){const r=R()[i],m=modal(E(r.date)+(r.class?' — '+E(r.class):'')+(r.teacher?' — '+E(r.teacher):''),`<pre>${E(r.text)}</pre>`);m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="e1">ویرایش</button><button id="e3">📨 ارسال</button><button id="e5">🖼 تصویر</button><button class="d" id="e2">حذف</button>');
m.querySelector('#e1').onclick=()=>{m.remove();rEdit(i)};m.querySelector('#e3').onclick=()=>shareText(r.text);m.querySelector('#e5').onclick=()=>shareImg(r.text,'report-'+String(r.date).replace(/[\/\\]/g,'-'));m.querySelector('#e2').onclick=()=>{m.remove();ask('این گزارش حذف شود؟',()=>{R().splice(i,1);save();draw()},'حذف')}}
async function mkImg(text,raw){text=raw?sch2(text):plainSch(text);const W=1080,P=64,fs=40,lh=58,mw=W-2*P,F=fs+'px system-ui,"Segoe UI",Tahoma,sans-serif';
const logo=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src='logo.jpg'});
const c=document.createElement('canvas'),x=c.getContext('2d');x.font=F;const L=[];
text.split(/\r?\n/).forEach(par=>{if(!par.trim()){L.push('');return}let cur='';par.split(' ').forEach(w=>{const t=cur?cur+' '+w:w;if(cur&&x.measureText(t).width>mw){L.push(cur);cur=w}else cur=t});L.push(cur)});
const H=Math.max(W,2*P+L.length*lh);if(H>14000)return null;c.width=W;c.height=H;x.fillStyle='#fff';x.fillRect(0,0,W,H);
if(logo){x.globalAlpha=.13;const z=W*.9;for(let y=0;y<H;y+=W){const cy=y+Math.min(W,H-y)/2;x.drawImage(logo,(W-z)/2,cy-z/2,z,z)}x.globalAlpha=1}
x.fillStyle='#19233c';x.font=F;x.direction='rtl';x.textAlign='right';x.textBaseline='top';L.forEach((l,i)=>x.fillText(l,W-P,P+i*lh));
return new Promise(r=>c.toBlob(r,'image/png'))}
// every report is shown first as the receiver will see it; it is sent / saved only after the OK button
function pvThen(t,lab,fn){modal('👁 پیش‌نمایش',`<pre class="pv" style="white-space:pre-wrap;direction:rtl;max-height:55vh;overflow:auto;margin:0;font:inherit">${E(plainSch(t))}</pre>`,()=>{fn()},lab)}
async function shareImg(text,name,raw){let b;try{b=await mkImg(text,raw)}catch(e){b=null}if(!b)return toast('ساخت تصویر ممکن نشد یا گزارش بسیار طولانی است؛ از ارسال متنی استفاده کنید');return shareBlob(b,name)}
async function shareBlob(b,name){
{const pu=URL.createObjectURL(b);const ok=await new Promise(res=>{let d=0;const m=modal('👁 پیش‌نمایش عکس',`<img src="${pu}" style="width:100%;display:block">`,()=>{d=1;res(1)},'ارسال');m.querySelector('#mx').addEventListener('click',()=>{if(!d)res(0)})});URL.revokeObjectURL(pu);if(!ok)return}

const fn=(name||'report')+'-'+new Date().toISOString().slice(0,10)+'.png',f=new File([b],fn,{type:'image/png'});
if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){if(e&&e.name=='AbortError')return}}
const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('تصویر گزارش آماده شد')}
// the month page itself drawn as a picture (Saturday on the right, class names inside each day)
async function mkMonthImg(jy,jm,cf){const W=1080,M=36,G=6,cw=Math.floor((W-2*M-6*G)/7),F='system-ui,"Segoe UI",Tahoma,sans-serif',ev=EVS(),n=Cal.monthLen(jy,jm),first=Cal.epoch(jy,jm,1),off=Cal.wd(first);
const logo=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src='logo.jpg'});
const c0=document.createElement('canvas'),m=c0.getContext('2d');
const fit=(t,w,f)=>{m.font=f;if(m.measureText(t).width<=w)return t;while(t.length>1&&m.measureText(t+'…').width>w)t=t.slice(0,-1);return t+'…'};
const wrap=(t,w,f)=>{m.font=f;const o=[];let cur='';t.split(' ').forEach(wd=>{const u=cur?cur+' '+wd:wd;if(cur&&m.measureText(u).width>w){o.push(cur);cur=wd}else cur=u});o.push(cur);while(o.length>3){const l=o.pop();o[o.length-1]+=' '+l}o.forEach((l,i)=>o[i]=fit(l,w,f));return o};
const cells=[];for(let d=1;d<=n;d++){const e=first+d-1,dy=Cal.day(C(),ev,e,cf,false),h=dy.holiday;cells.push({d,e,h,names:dy.items.filter(i=>i.kind!='event').map(i=>({t:i.cls,k:i.kind,L:wrap(i.cls+(i.term?' ت'+i.term:'')+(i.kind=='cancelled'?' (لغو)':i.kind=='makeup'?' (جبرانی)':''),cw-10,'22px '+F)})),evs:dy.items.filter(i=>i.kind=='event')})}
const rows=Math.ceil((off+n)/7),rh=[];for(let r=0;r<rows;r++){let mx=0;for(let k=0;k<7;k++){const i=r*7+k-off;if(i<0||i>=n)continue;const c=cells[i];mx=Math.max(mx,c.names.reduce((a,z)=>a+z.L.length,0)+(c.evs.length?1:0))}rh.push(Math.max(96,52+mx*26+14))}
const list=[];cells.forEach(c=>{if(c.h||c.evs.length)list.push({c,h:c.h,evs:c.evs})});
const head=150,hd=44,gridH=rh.reduce((a,b)=>a+b+G,0),legH=70+list.reduce((a,x)=>a+(x.h?32:0)+x.evs.length*32+16,0),H=head+hd+gridH+legH+M;
if(H>12000)return null;const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);
if(logo){x.globalAlpha=.1;const z=W*.8;x.drawImage(logo,(W-z)/2,(H-z)/2,z,z);x.globalAlpha=1}
x.direction='rtl';x.textBaseline='middle';x.fillStyle='#19233c';x.textAlign='center';x.font='bold 54px '+F;x.fillText('تقویم آموزشی — '+MONTHS[jm-1]+' '+jy,W/2,62);
x.font='30px '+F;x.fillStyle='#5a6785';x.fillText(cf?'کلاس: '+cf:'همه کلاس‌ها',W/2,114);
const X=k=>W-M-cw-k*(cw+G);let y=head;
KSH.forEach((t,k)=>{x.fillStyle=k==6?'#d33':'#5a6785';x.font='bold 28px '+F;x.textAlign='center';x.fillText(t,X(k)+cw/2,y+hd/2)});y+=hd;
for(let r=0;r<rows;r++){for(let k=0;k<7;k++){const i=r*7+k-off;if(i<0||i>=n)continue;const c=cells[i],cx=X(k),h=rh[r];
x.fillStyle=c.h?'#fdeaea':'#f2f5fb';x.strokeStyle='#c9d2e6';x.lineWidth=2;x.beginPath();x.roundRect?x.roundRect(cx,y,cw,h,12):x.rect(cx,y,cw,h);x.fill();x.stroke();
x.textAlign='center';x.fillStyle=(k==6||c.h)?'#d33':'#19233c';x.font='bold 32px '+F;x.fillText(String(c.d),cx+cw/2,y+26);
let ty=y+58;c.names.forEach(nm=>{x.font='22px '+F;x.fillStyle=nm.k=='cancelled'?'#999':'#1f5fbf';nm.L.forEach(t=>{x.fillText(t,cx+cw/2,ty);if(nm.k=='cancelled'){const w=x.measureText(t).width;x.fillRect(cx+cw/2-w/2,ty,w,2)}ty+=26});ty+=2});
if(c.evs.length){x.font='22px '+F;x.fillStyle='#9a6b00';x.fillText('📝 '+c.evs.length+' رویداد',cx+cw/2,ty)}}
y+=rh[r]+G}
y+=18;x.textAlign='right';x.font='bold 30px '+F;x.fillStyle='#19233c';x.fillText(list.length?'تعطیلی‌ها و رویدادهای این ماه':'رویداد یا تعطیلی خاصی ثبت نشده است',W-M,y+14);y+=44;
list.forEach(it=>{const jd=it.c.d+' '+MONTHS[jm-1];x.font='bold 26px '+F;x.fillStyle='#19233c';x.fillText(jd,W-M,y+14);y+=32;
if(it.h){x.font='26px '+F;x.fillStyle='#d33';x.fillText('🔴 '+fit(it.h,W-2*M-20,'26px '+F),W-M-10,y+14);y+=32}
it.evs.forEach(e=>{x.font='26px '+F;x.fillStyle='#333';x.fillText(fit(Cal.line(e),W-2*M-20,'26px '+F),W-M-10,y+14);y+=32});y+=16});
return new Promise(r=>c.toBlob(r,'image/png'))}
async function kImg(){const[jy,jm]=kNow();let b;try{b=await mkMonthImg(jy,jm,KC)}catch(e){b=null}if(!b)return toast('ساخت تصویر ممکن نشد');shareBlob(b,'calendar-'+jy+'-'+p2(jm))}
function shareText(t){t=withSch(t);pvThen(t,'ارسال',()=>shareText2(t))}
async function shareText2(t){if(navigator.share){try{await navigator.share({text:t});return}catch(e){if(e&&e.name=='AbortError')return}}try{await navigator.clipboard.writeText(t);toast('متن گزارش کپی شد')}catch(e){modal('گزارش (کپی کنید)',`<textarea rows="12" readonly onfocus="this.select()">${E(t)}</textarea>`)}}
function rEdit(i){const r=R()[i];if(r.form)fOpen({idx:i,teacher:r.teacher||'',date:r.date,cls:r.class||'',F:JSON.parse(JSON.stringify(Object.assign(emptyF(),r.form)))});else rF(i)}
function commit(idx,o){const r=idx>=0?R()[idx]:{};Object.assign(r,o);if(!r.id)r.id=uid();if(!r.createdAt)r.createdAt=Date.now();if(idx<0)R().push(r);save();return r}
function rF(i,dr){const o=i>=0?R()[i]:dr||{},cs=['',...C().filter(canC).sort(cmpC).map(c=>c.name)];if(o.class&&!cs.includes(o.class))cs.push(o.class);
modal('گزارش روزانه',f('date','تاریخ (مثلاً 1405/07/13)',o.date||todayJ())+f('teacher','نام معلم',o.teacher||'')+`<label>کلاس<select name="class">${cs.map(c=>`<option ${c==o.class?'selected':''} value="${E(c)}">${E(c||'(بدون کلاس)')}</option>`).join('')}</select></label>`+f('text','متن کامل گزارش',o.text,10),m=>{const v=g(m);if(!v.text)return toast('متن گزارش خالی است'),false;v.date=v.date||todayJ();v.text=m.querySelector('[name=text]').value;const fin=(ix)=>{commit(ix,{date:v.date,class:v.class,teacher:v.teacher,text:v.text});if(pd(v.date)==null)toast('تاریخ قابل تشخیص نبود؛ بر اساس زمان ثبت حساب می‌شود');draw()};const d=i<0?findDup(v.date,v.class,v.teacher,-1):-1;if(d>=0)ask('برای همین تاریخ، کلاس و معلم قبلاً گزارشی ثبت شده است. جایگزین شود؟',()=>fin(d),'جایگزین');else fin(i)})}
function rText(t){const d=findDate(t),c=matchCls(parseClass(t))||inferCls(t);rF(-1,{date:d||todayJ(),class:c,teacher:parseTeacher(t),text:t.replace(/^﻿/,'')})}
async function rT(file){if(!file)return;const b=await file.arrayBuffer();let t;try{t=new TextDecoder('utf-8',{fatal:true}).decode(b)}catch(e){t=new TextDecoder('windows-1256').decode(b)}rText(t)}
const rPaste=()=>modal('ورود گزارش از متن',`<textarea name="t" rows="12" placeholder="متن گزارش را اینجا بچسبانید"></textarea>`,m=>{const t=m.querySelector('[name=t]').value;if(!t.trim())return toast('متنی وارد نشده است'),false;setTimeout(()=>rText(t),0)},'ادامه');
// ---- tick-box form ----
function fNewFor(cls,e){fOpen({idx:-1,teacher:SS().lastTeacher||'',date:Cal.fmt(e),cls,F:emptyF()})}
function fNew(){fOpen({idx:-1,teacher:SS().lastTeacher||'',date:todayJ(),cls:'',F:emptyF()})}
function fOpen(o){FS=o;V='f';draw()}
function fCol(){const o=FS,F=emptyF(),mem=memOf(o.cls),v=id=>{const e=document.getElementById(id);return e?e.value:''};o.teacher=v('fT').trim();{const dw=document.getElementById('fDw'),dv=dw?dVal(dw,'fd'):o.date;if(dv===null)o.bd=true;else{o.bd=false;o.date=dv===''?((o.date&&Cal.parse(o.date)==null)?o.date:''):dv}}o.cls=v('fC');F.book=v('fB');F.workbook=v('fW');F.other=v('fO');F.homework=v('fH');F.general=v('fG');F.units=unitsFromForm();
mem.forEach((c,i)=>{const e=id=>document.getElementById(id);if(e('ab'+i).checked)F.absent.push(c);else if(e('lt'+i).checked)F.late.push(c);const m={opts:[],other:v('x'+i)};o.opts.forEach((t,j)=>{if(e('o'+i+'_'+j).checked)m.opts.push(t)});if(m.opts.length||m.other.trim())F.marks[c]=m});o.F=F;return F}
function fCls(){fCol();draw()}
function fRef(i){const a=document.getElementById('ab'+i).checked,d=document.getElementById('dt'+i),tg=document.getElementById('tg'+i);let n=0;FS.opts.forEach((t,j)=>{if(document.getElementById('o'+i+'_'+j).checked)n++});if(document.getElementById('x'+i).value.trim())n++;tg.style.display=a?'none':'';if(a)d.style.display='none';tg.textContent='وضعیت امروز'+(n?' ('+n+' مورد)':'')+(d.style.display=='none'?' ▾':' ▴')}
function fCk(i,w){const a=document.getElementById('ab'+i),l=document.getElementById('lt'+i);if(w=='a'&&a.checked)l.checked=false;if(w=='l'&&l.checked)a.checked=false;fRef(i)}
function fTg(i){const d=document.getElementById('dt'+i);d.style.display=d.style.display=='none'?'':'none';fRef(i)}
function vF(){const o=FS;if(!o){V='r';return vR()}const F=o.F,mem=memOf(o.cls);o.opts=OPT();Object.values(F.marks).forEach(m=>(m.opts||[]).forEach(t=>{if(!o.opts.includes(t))o.opts.push(t)}));
if(!C().length)return'<div class="w">ابتدا از بخش «کلاس‌ها» یک کلاس بسازید و زبان‌آموزان را به آن اضافه کنید.</div><button onclick="V=\'r\';FS=null;draw()">← بازگشت</button>';
const ts=TCH();const cs=['',...C().filter(canC).sort(cmpC).map(c=>c.name)];if(o.cls&&!cs.includes(o.cls))cs.push(o.cls);
const inp=(id,l,v)=>`<label>${l}<input id="${id}" value="${E(v)}"></label>`,ta=(id,l,v,n)=>`<label>${l}<textarea id="${id}" rows="${n}">${E(v)}</textarea></label>`;
const cards=mem.map((c,i)=>{const ab=F.absent.includes(c),lt=!ab&&F.late.includes(c),m=F.marks[c]||{opts:[],other:''},open=!ab&&((m.opts||[]).length||String(m.other||'').trim());
return`<div class="card"><div class="r"><b>${E(dn(c))}</b><span><label class="f" style="color:var(--t)"><input type="checkbox" id="ab${i}" style="width:auto" ${ab?'checked':''} onchange="fCk(${i},'a')"> غایب</label> &nbsp; <label class="f" style="color:var(--t)"><input type="checkbox" id="lt${i}" style="width:auto" ${lt?'checked':''} onchange="fCk(${i},'l')"> تأخیر</label></span></div>
<div id="tg${i}" style="color:var(--a);cursor:pointer;padding:6px 0" onclick="fTg(${i})"></div>
<div id="dt${i}" style="${open?'':'display:none'}">${o.opts.map((t,j)=>`<label class="f" style="display:block;color:var(--t);margin:2px 0"><input type="checkbox" id="o${i}_${j}" style="width:auto" ${(m.opts||[]).includes(t)?'checked':''} onchange="fRef(${i})"> ${E(t)}</label>`).join('')}<input id="x${i}" placeholder="توضیح دیگر" value="${E(m.other||'')}" oninput="fRef(${i})"></div></div>`}).join('');
return`<div class="tb"><button onclick="V='r';FS=null;draw()">← بازگشت</button></div><h3>${o.idx>=0?'ویرایش گزارش':'گزارش روزانه جدید'}</h3>
${inp('fT','نام معلم',o.teacher)}${ts.length?`<div class="tb">${ts.map((t,k)=>`<button onclick="document.getElementById('fT').value=TCH()[${k}]">${E(t)}</button>`).join('')}</div>`:''}<label id="fDw">تاریخ${dSel('fd',o.date)}</label>
<label>کلاس<select id="fC" onchange="fCls()">${cs.map(t=>`<option value="${E(t)}" ${t==o.cls?'selected':''}>${E(t||'(انتخاب کلاس)')}</option>`).join('')}</select></label>
<b>درس امروز</b>${inp('fB',"Student's book (مثلاً صفحه 20، 21)",F.book)}${inp('fW','Workbook (مثلاً صفحه 15)',F.workbook)}${inp('fO','سایر (مثلاً صفحات 21-24 کتاب داستان)',F.other)}${unitBoxes(o)}
<b>حضور و غیاب و وضعیت بچه‌ها</b>${o.cls?(mem.length?cards:'<div class="m">این کلاس عضو ندارد.</div>'):'<div class="m">کلاس را انتخاب کنید تا اسامی بیاید.</div>'}
<b>تکلیف جلسه بعد</b>${ta('fH','',F.homework,3)}<b>یادداشت کلی</b>${ta('fG','',F.general,3)}
<div class="tb"><button class="p" onclick="fSave(0)">💾 ذخیره گزارش</button><button onclick="fSave(1)">📨 ذخیره و ارسال</button><button onclick="fSave(2)">🖼 ذخیره و ارسال تصویر</button><button onclick="fPrev()">👁 پیش‌نمایش</button></div>`}
function fText(){const F=fNorm(fCol()),o=FS;return formText(F,o.teacher,(o.date||'').trim()||todayJ(),o.cls,memOf(o.cls))}
const fPrev=()=>modal('پیش‌نمایش',`<pre>${E(plainSch(fText()))}</pre>`);
function fSave(send){const F=fNorm(fCol()),o=FS;if(o.bd)return toast('تاریخ کامل یا معتبر نیست؛ روز، ماه و سال را انتخاب کنید');if(!o.cls)return toast('کلاس را انتخاب کنید');const date=(o.date||'').trim()||todayJ(),text=formText(F,o.teacher,date,o.cls,memOf(o.cls)),obj={date,class:o.cls,teacher:o.teacher,text,form:F};
const done=()=>{if(o.teacher)SS().lastTeacher=o.teacher;markUnits(o.cls,F.units,date);save();FS=null;V='r';draw();if(send==2)shareImg(text,'report');else if(send)shareText(text)};
const d=o.idx<0?findDup(date,o.cls,o.teacher,-1):-1;if(d>=0)ask('برای همین تاریخ، کلاس و معلم قبلاً گزارشی ثبت شده است. جایگزین شود؟',()=>{commit(d,obj);done()},'جایگزین');else{commit(o.idx,obj);done()}}
// ---- weekly / monthly ----
function per(days){const t=today(),o={ix:[],fb:0,un:0};R().forEach((r,i)=>{if(!canR(r))return;const[d,k]=dayOf(r);if(k==1)o.fb++;if(k==2){o.un++;o.ix.push(i);return}if(days===0&&PR?(d>=PR[0]&&d<=PR[1]):d>t-days)o.ix.push(i)});o.ix.sort((a,b)=>(dayOf(R()[a])[0]??-1e12)-(dayOf(R()[b])[0]??-1e12));return o}
const hd=(o,d)=>(o.fb?`<div class="w">⚠️ ${o.fb} گزارش تاریخ قابل تشخیص ندارند و بر اساس زمان ثبت حساب شده‌اند.</div>`:'')+(o.un?`<div class="w">⚠️ ${o.un} گزارش هیچ تاریخی ندارند و در همه بازه‌ها می‌آیند.</div>`:'');
const noteBox=k=>`<label>توضیحات دستی<textarea rows="3" oninput="D.notes['${k}']=this.value;save()">${E(D.notes[k]||'')}</textarea></label>`;
const STOP=new Set(['و','در','با','را','به','از','که','هم','این','آن']),tk=n=>new Set(n.split(/[^\p{L}\p{N}]+/u).filter(w=>w&&!STOP.has(w)));
const IMPL='حاضر — تکالیفش خوب انجام شده',bare=n=>n.replace(/[^\p{L}\p{N}\s]+/gu,' ').replace(/\s+/g,' ').trim();
const tokRe=n=>new RegExp('(^|[^\\p{L}\\p{N}])'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^\\p{L}\\p{N}]|$)','u');
function sim(a,na,b,nb){if(!a.size||!b.size)return na==nb;let i=0;a.forEach(w=>{if(b.has(w))i++});const u=a.size+b.size-i;return u>0&&i*10>=u*6}
function summ(es,total,key){const kt=tk(key);let ab=0,pr=0,lt=0;const gs=[],im=[],ad=[],ld=[];es.forEach((e,i)=>{if(e.late){lt++;ld.push(e.date)}if(e.implied){im.push(e.date);return}const L=e.text.split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&norm(l)!=key);if(e.absent){ab++;ad.push(e.date)}else if(L.length||e.late)pr++;L.forEach(l=>{const n=norm(l),t=tk(n);kt.forEach(w=>t.delete(w));let g=gs.find(x=>sim(x.t,x.n,t,n));if(!g){g={rep:l,n,t,c:0,last:-1,d:[]};gs.push(g)}if(g.last!=i){g.last=i;g.c++;g.d.push(e.date)}})});
gs.sort((a,b)=>b.c-a.c);const un=Math.max(0,total-pr-ab-im.length);
return'📊 خلاصه این بازه\nگزارش‌های بازه: '+total+'\nحاضر (با گزارش): '+pr+(ab?'\n❌ غایب: '+ab+' بار ('+ad.join('، ')+')':'')+(lt?'\n⏰ تأخیر: '+lt+' بار ('+ld.join('، ')+')':'')+(im.length?'\n✅ نامش در گزارش نیامده (حاضر، تکالیفش خوب انجام شده): '+im.length+' بار ('+im.join('، ')+')':'')+(un?'\nنامشخص (گزارش بدون کلاس یا نام مشابه): '+un:'')+(gs.length?'\n\n🔁 موارد گزارش‌شده (موارد مشابه با هم شمرده شده‌اند):\n'+gs.map(g=>'• '+g.c+' بار — '+g.rep+(g.c>1?' ('+g.d.join('، ')+')':'')).join('\n'):'')}
const clashN=(si,nf)=>A().filter((x,k)=>{if(k==si)return 0;const n=norm(x.first);return n==nf||n.startsWith(nf+' ')}).length;
const keyOf=si=>{const s=A()[si],nf=norm(s.first);return clashN(si,nf)?norm(s.first+' '+s.last):nf};
const heads=()=>{const h=new Set();A().forEach(x=>{h.add(norm(x.first));h.add(norm(x.first+' '+x.last))});h.delete('');return h};
const hNames=n=>n.split(/[,،;؛]|\sو\s/).map(bare).filter(Boolean);
const isHeadFor=(n,key)=>{if(!n||!key)return false;const ns=hNames(n);if(!ns.length||ns.length>8)return false;const kw=key.split(' ').length;let m=false;for(const p of ns){const w=p.split(' ').length;if(w>3)return false;if(p==key||(p.startsWith(key+' ')&&w-kw<=2))m=true}return m};
const isNameLine=(n,H)=>{const ns=hNames(n);return ns.length>0&&ns.every(p=>H.has(p)||[...H].some(h=>p.startsWith(h+' ')))};
const isAbs=n=>/^(غایب|غیبت)\S*\s*[:：]/.test(n),isLt=n=>/^(تاخیر|دیرکرد|دیر)\S*\s*[:：]/.test(n);
function hit(txt,key,H){H=H||heads();const L=(txt||'').split(/\r?\n/);if(!key)return{a:0,b:'',body:''};const re=tokRe(key);
const abm=n=>{const l=n.slice(n.indexOf(':')+1);return l.split(/[,،;؛]|\sو\s/).some(t=>{t=t.trim();return t&&(t==key||t.startsWith(key+' '))})};
let b='',bd='',on=0,a=0,lt=0,got=0,sk=0;
for(const l of L){const n=norm(l);if(isAbs(n)){if(abm(n))a=1;on=0;continue}if(isLt(n)){if(abm(n))lt=1;on=0;continue}
if(on){if(!n){if(!got&&!sk){sk=1;continue}on=0}else if(!isHeadFor(n,key)&&isNameLine(n,H)){on=0}else{b+=l+'\n';bd+=l+'\n';got++;continue}}
if(n&&isHeadFor(n,key)){on=1;got=0;sk=0;b+=l+'\n'}}
if(b)return{a,l:a?0:lt,b,body:bd};const f=L.filter(l=>!isAbs(norm(l))&&!isLt(norm(l))&&re.test(norm(l))).join('\n');return{a,l:a?0:lt,b:f,body:f}}
const mentionsAny=(txt,cn,H)=>A().some((x,k)=>{if(!cn||clsOf(x.code)<0||C()[clsOf(x.code)].name!=cn)return 0;const key=keyOf(k);if(!key)return 0;const h=hit(txt,key,H);return h.a||h.l||h.b.trim()});
const firstAppears=(txt,nf)=>{const re=tokRe(nf);return(txt||'').split(/\r?\n/).some(l=>re.test(norm(l)))};
const PK=d=>d===0&&PR?'R'+PR[0]+'-'+PR[1]:String(d),PF=()=>P==7?'weekly-':P===0?'range-':'monthly-',rgT=()=>PR?'از '+Cal.fmt(PR[0])+' تا '+Cal.fmt(PR[1]):'',pTitle=d=>d==7?'گزارش هفتگی':d===0?'گزارش بازه — '+rgT():'گزارش ماهانه',hdT=(o,d)=>'بازه: '+d+' روز اخیر • تعداد گزارش: '+o.ix.length+(o.fb?'\n⚠️ '+o.fb+' گزارش تاریخ قابل تشخیص ندارند و بر اساس زمان ثبت حساب شده‌اند.':'')+(o.un?'\n⚠️ '+o.un+' گزارش هیچ تاریخی ندارند و در همه بازه‌ها می‌آیند.':'');
// computes one student's report: summary text + list of {r,text}
function stu(si,o,H){const s=A()[si],nf=norm(s.first),clash=clashN(si,nf),key=keyOf(si),ci=clsOf(s.code),cn=ci>=0?C()[ci].name:'',ncl=norm(cn),items=[],es=[];let total=0;
if(key)o.ix.forEach(i=>{const r=R()[i],nrc=norm(r.class||'');if(ncl&&nrc&&nrc!=ncl)return;total++;const h=hit(r.text,key,H),ln='',stt=h.a?'   ❌ غایب':h.l?'   ⏰ تأخیر':'';
if(h.a||h.b){es.push({date:r.date,absent:!!h.a,late:!!h.l,text:h.body});items.push({r,t:h.body,st:stt})}
else if(ncl&&nrc==ncl&&!(clash&&firstAppears(r.text,nf))&&(hasStatus(r.text)||mentionsAny(r.text,cn,H))){es.push({date:r.date,implied:1,late:!!h.l,text:''});items.push({r,t:IMPL,st:stt})}
else if(h.l){es.push({date:r.date,late:1,text:''});items.push({r,t:'',st:stt})}});
return{s,clash,cn,items,summary:items.length?summ(es,total,key):''}}
function stuText(si,o,H,d){const x=stu(si,o,H),s=x.s;let t=pTitle(d)+' — '+s.first+' '+s.last+'\n'+(x.cn?'کلاس: '+x.cn+'\n':'');const n=(D.notes['studentNote'+PK(d)+'_'+s.code]||'').trim();if(n)t+='\nتوضیحات: '+n+'\n';t+='\n';
return t+(x.items.length?x.items.map(i=>'[ '+i.r.date+' | '+(i.r.class||'')+' ]'+i.st+'\n'+i.t+'\n').join('\n'):'موردی برای این زبان‌آموز در گزارش‌های این بازه پیدا نشد.')}
const filt=(o,fc,ft)=>o.ix.filter(i=>{const r=R()[i];return(!fc||norm(r.class||'')==norm(fc))&&(!ft||norm(r.teacher||'')==norm(ft))});
function attText(o,fc,ft){const ix=filt(o,fc,ft),H=heads();let s='';C().slice().sort(cmpC).forEach(c=>{if(!canC(c)||(fc&&norm(c.name)!=norm(fc)))return;const mem=memOf(c.name).map(code=>A().findIndex(x=>x.code==code)).filter(i=>i>=0);if(!mem.length)return;const mine=ix.filter(i=>norm(R()[i].class||'')==norm(c.name));s+='📋 حضور و غیاب — کلاس '+c.name+' ('+mine.length+' گزارش)\n';if(!mine.length){s+='گزارشی برای این کلاس در بازه نیست.\n\n';return}
mem.forEach(si=>{const key=keyOf(si),ab=[],lt=[];if(key)mine.forEach(i=>{const h=hit(R()[i].text,key,H);if(h.a)ab.push(R()[i].date);else if(h.l)lt.push(R()[i].date)});const st=A()[si];s+='• '+st.first+' '+st.last+' — '+(!ab.length&&!lt.length?'بدون غیبت و تأخیر':[ab.length?'غایب: '+ab.length+' بار ('+ab.join('، ')+')':'',lt.length?'تأخیر: '+lt.length+' بار ('+lt.join('، ')+')':''].filter(Boolean).join(' • '))+'\n'});s+='\n'});return s}
const fLine=()=>'کلاس: '+(FC||'همه');
function overallBody(o,sh){const ix=filt(o,FC,FT);let t=attText(o,FC,FT);if(!ix.length)return t+'در این بازه (با این فیلتر) گزارش روزانه‌ای وجود ندارد.\n';return t+ix.map(i=>{const r=R()[i];return'• '+r.date+' | '+(r.class||'')+(sh&&r.teacher?' | '+r.teacher:'')+'\n'+r.text+'\n'}).join('\n')}
function overallText(o,d){let t=pTitle(d)+' — گزارش کلی کلاس\n'+fLine()+'\n';const n=(D.notes['overallNote'+PK(d)]||'').trim();if(n)t+='\nتوضیحات: '+n+'\n';return t+'\n'+overallBody(o,false)}
function allText(o,d){const H=heads();return pTitle(d)+' — همه زبان‌آموزان\n'+A().map((_,i)=>i).sort((x,y)=>cmpS(A()[x],A()[y])).map(i=>'\n==============================\n'+stuText(i,o,H,d)).join('\n')}
const curText=(all)=>{const o=per(P);if(all)return[allText(o,P),'all-students'];if(SV==null||!A()[SV])return[overallText(o,P),'overall'];return[stuText(SV,o,heads(),P),(A()[SV].first+'-'+A()[SV].last).replace(/ /g,'_')]};
const touch=()=>{try{return matchMedia('(pointer:coarse)').matches}catch(e){return false}};
async function saveFile(name,text,mime){const blob=new Blob([text],{type:mime+';charset=utf-8'});
if(touch()&&navigator.canShare){try{const f=new File([blob],name,{type:mime});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return true}}catch(e){if(e&&e.name=='AbortError')return true}}
try{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return true}catch(e){return false}}
function xSave(all){const[t0]=curText(all);pvThen(plainSch(t0),'ذخیره',()=>xSave2(all))}
async function xSave2(all){const[t0,n]=curText(all),t=plainSch(t0),fn=PF()+n+'-'+new Date().toISOString().slice(0,10)+'.txt';if(await saveFile(fn,'\ufeff'+t,'text/plain'))toast('فایل گزارش آماده شد');else modal('گزارش (کپی کنید)',`<textarea rows="12" readonly onfocus="this.select()">${E(t)}</textarea>`)}
async function xImg(){const[t,n]=curText(0);shareImg(t,PF()+n)}
function xShare(all){const[t0]=curText(all),t=plainSch(t0);pvThen(t,'ارسال',()=>xShare2(t))}
async function xShare2(t){if(navigator.share){try{await navigator.share({text:t});return}catch(e){if(e&&e.name=='AbortError')return}}try{await navigator.clipboard.writeText(t);toast('متن گزارش کپی شد')}catch(e){modal('گزارش (کپی کنید)',`<textarea rows="12" readonly onfocus="this.select()">${E(t)}</textarea>`)}}
let PQ='';
const pOpts=()=>{const q=norm(PQ);return'<option value="">کل کلاس</option>'+A().map((s,i)=>[s,i]).filter(([s])=>canA(s)).sort((x,y)=>cmpS(x[0],y[0])).filter(([s,i])=>i===SV||!q||norm(s.first+' '+s.last).includes(q)).map(([s,i])=>`<option value="${i}" ${SV===i?'selected':''}>${E(s.first)} ${E(s.last)}</option>`).join('')};
function pFill(){const el=document.getElementById('ps');if(!el)return;el.innerHTML=pOpts();el.size=norm(PQ)?Math.min(7,el.options.length):1}
const prOn=()=>{if(!PR){const t=today();PR=[t-6,t]}P=0;draw()};
const prBox=()=>`<div class="card" id="prb"><div class="m">از تاریخ</div>${dSel('rf',Cal.fmt(PR[0]))}<div class="m">تا تاریخ</div>${dSel('rt',Cal.fmt(PR[1]))}<div class="m" style="margin-top:6px">گزارش‌هایی که تاریخ‌شان از ابتدا تا انتهای این بازه (هر دو روز هم حساب می‌شوند) است.</div></div>`;
function prSet(){const b=document.getElementById('prb');if(!b)return;const f=dVal(b,'rf'),t=dVal(b,'rt');if(!f||!t)return;const a=Cal.parse(f),z=Cal.parse(t);if(a==null||z==null)return;if(z<a)return toast('تاریخ پایان قبل از تاریخ شروع است');PR=[a,z];SV=SV;draw()}
document.addEventListener('change',e=>{if(e.target.closest&&e.target.closest('#prb'))prSet()});
function vP(){const o=per(P),sel=SV,H=heads();let body;
if(sel==null||!A()[sel]){const tl=[...new Set([...TCH(),...R().map(r=>r.teacher||'').filter(Boolean)])],fx=filt(o,FC,FT),at=attText(o,FC,FT);body=`<div class="card"><b>📌 گزارش کلی کلاس</b><label>کلاس<select onchange="FC=this.value;draw()"><option value="">همه</option>${C().filter(canC).sort(cmpC).map(c=>`<option ${c.name==FC?'selected':''} value="${E(c.name)}">${E(c.name)}</option>`).join('')}</select></label><label>معلم<select onchange="FT=this.value;draw()"><option value="">همه</option>${tl.map(t=>`<option ${t==FT?'selected':''} value="${E(t)}">${E(t)}</option>`).join('')}</select></label>${noteBox('overallNote'+PK(P))}</div>`+(at?`<div class="card"><pre>${E(at)}</pre></div>`:'')+(fx.length?fx.map(i=>{const r=R()[i];return`<div class="card"><div class="m">${E(r.date)} | ${E(r.class)}${r.teacher?' | '+E(r.teacher):''}</div><pre>${E(r.text)}</pre></div>`}).join(''):'<div class="m">در این بازه (با این فیلتر) گزارشی نیست.</div>')}
else{const x=stu(sel,o,H),s=x.s;body=(x.clash?'<div class="w">⚠️ نام کوچک مشترک یا مشابه است؛ فقط مواردی که نام و نام خانوادگی کامل در آن‌ها آمده نمایش داده می‌شود.</div>':'')+(x.cn?'':'<div class="m">ℹ️ این زبان‌آموز در هیچ کلاسی نیست؛ «حاضر بدون ذکر نام» فقط برای اعضای کلاس محاسبه می‌شود.</div>')+`<div class="card"><b>👤 ${E(s.first)} ${E(s.last)}</b>${noteBox('studentNote'+PK(P)+'_'+s.code)}</div>`+(x.items.length?x.items.map(i=>`<div class="card"><div class="m">${E(i.r.date)} | ${E(i.r.class)}<b style="color:var(--t)">${E(i.st)}</b></div><pre>${E(i.t)}</pre></div>`).join(''):'<div class="m">موردی برای این زبان‌آموز پیدا نشد.</div>')}
return`<div class="tb"><button class="${P==7?'p':''}" onclick="P=7;draw()">هفتگی</button><button class="${P==30?'p':''}" onclick="P=30;draw()">ماهانه</button><button class="${P===0?'p':''}" onclick="prOn()">📆 از تاریخ تا تاریخ</button></div>${P===0?prBox():''}<label>گزارش برای<input id="pq" placeholder="🔎 جستجوی نام زبان‌آموز" value="${E(PQ)}" oninput="PQ=this.value;pFill()"><select id="ps" onchange="SV=this.value===''?null:+this.value;draw()">${pOpts()}</select></label>`+hd(o,P)+`<div class="tb"><button class="p" onclick="xSave(0)">📤 ذخیره فایل (TXT)</button><button onclick="xShare(0)">📨 ارسال / کپی</button><button onclick="xSave(1)">📚 فایل همه زبان‌آموزان</button>${sel!=null&&A()[sel]?'<button class="p" onclick="xImg()">🖼 ارسال به‌صورت تصویر</button>':''}</div>`+body+`<button onclick="amb()">🔎 بررسی نام‌های مشابه</button>`}
function amb(){const G={};A().forEach(s=>{const n=norm(s.first);if(n)(G[n]=G[n]||[]).push(s)});const L=Object.values(G).filter(x=>x.length>1);modal('نام‌های مشابه',L.length?L.map(x=>`<div class="card"><b>${E(x[0].first)}</b> (${x.length} نفر)<br>`+x.map(s=>`• ${E(s.first)} ${E(s.last)} <span class="m">${E(s.code)}${clsOf(s.code)>=0?' • '+E(C()[clsOf(s.code)].name):''}</span>`).join('<br>')+'</div>').join('')+'<div class="m">گزارش‌ها فقط با نام و نام خانوادگی کامل در متن به این افراد نسبت داده می‌شوند.</div>':'نام کوچک تکراری پیدا نشد.')}
// ---- Excel export (hand-written .xlsx: no library needed, works offline) ----
const CRC=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zipStore(files){const te=new TextEncoder(),ch=[],cd=[];let off=0;const u16=v=>[v&255,v>>8&255],u32=v=>[v&255,v>>8&255,v>>16&255,v>>>24&255];
files.forEach(f=>{const nm=te.encode(f.n),d=typeof f.d=='string'?te.encode(f.d):f.d,cr=crc32(d);
const lh=[0x50,0x4b,3,4,...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(cr),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)];
ch.push(new Uint8Array(lh),nm,d);
cd.push(new Uint8Array([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(cr),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);off+=lh.length+nm.length+d.length});
const cs=cd.reduce((a,b)=>a+b.length,0);cd.push(new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0]));return new Blob([...ch,...cd],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
const xe=t=>String(t==null?'':t).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const xcol=i=>{let s='';i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
// rows = array of arrays of text; first row = header (bold). Every cell is stored as text, so leading zeros of phone numbers stay.
function xlsxBlob(sheetName,rows,widths){const sh=rows.map((r,i)=>`<row r="${i+1}">`+r.map((v,j)=>`<c r="${xcol(j)}${i+1}" t="inlineStr"${i==0?' s="1"':''}><is><t xml:space="preserve">${xe(v)}</t></is></c>`).join('')+'</row>').join('');
const cols=(widths||[]).map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('');
return zipStore([{n:'[Content_Types].xml',d:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
{n:'_rels/.rels',d:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
{n:'xl/workbook.xml',d:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xe(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`},
{n:'xl/_rels/workbook.xml.rels',d:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
{n:'xl/styles.xml',d:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'},
{n:'xl/worksheets/sheet1.xml',d:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols?'<cols>'+cols+'</cols>':''}<sheetData>${sh}</sheetData></worksheet>`}])}
const exRows=k=>k=='s'?[['کد','نام','نام خانوادگی','موبایل','کد ملی','تاریخ تولد','توضیحات','موبایل والدین','کلاس']].concat(A().slice().sort(cmpS).map(s=>{const ci=clsOf(s.code);return[s.code,s.first,s.last,s.mobile||'',s.national||'',s.birth||'',s.notes||'',s.parent||'',ci>=0?C()[ci].name:'']})):[['کد','نام کلاس','سطح','تاریخ شروع','تاریخ پایان','روزها','ساعت','توضیحات','روزها و ساعت هر روز','تعداد زبان‌آموز','زبان‌آموزان']].concat(C().slice().sort(cmpC).map(c=>{const mem=(c.students||[]).map(code=>A().find(x=>x.code==code)).filter(Boolean).sort(cmpS);return[c.code,c.name,c.level||'',c.start||'',c.end||'',c.days||'',c.time||'',c.notes||'',Cal.sched(c)||c.days||c.time?Cal.scheduleText(c):'',String(mem.length),mem.map(x=>x.first+' '+x.last).join('، ')]}));
async function xlExport(k){if(k=='s'?!A().length:!C().length)return toast('چیزی برای خروجی گرفتن نیست');const b=xlsxBlob(k=='s'?'زبان‌آموزان':'کلاس‌ها',exRows(k),k=='s'?[12,14,16,14,14,14,30,14,18]:[12,22,14,14,14,22,14,30,40,12,60]);
const fn=(k=='s'?'students-':'classes-')+new Date().toISOString().slice(0,10)+'.xlsx',f=new File([b],fn,{type:b.type});
if(touch()&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:fn});return}catch(e){if(e&&e.name=='AbortError')return}}
const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('فایل Excel آماده شد')}
// ---- Excel import ----
const fxM=s=>{const d=dg(s);return/^\d+$/.test(d)?(d.length==10&&d[0]=='9'?'0'+d:d):s},fxN=s=>{const d=dg(s);return/^\d+$/.test(d)?(d.length>=8&&d.length<10?d.padStart(10,'0'):d):s};
const fxD=s=>{if(/^\d{5}$/.test(s)&&+s>=20000&&+s<=70000){const d=new Date((+s-25569)*864e5);return d.getUTCFullYear()+'/'+p2(d.getUTCMonth()+1)+'/'+p2(d.getUTCDate())}return s},fxT=s=>{if(/^0\.\d+$/.test(s)){const m=Math.round(s*1440);return p2(Math.floor(m/60)%24)+':'+p2(m%60)}return s};
const XURL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const loadJs=(u,cors)=>new Promise(res=>{const e=document.createElement('script');e.src=u;if(cors)e.crossOrigin='anonymous';e.onload=()=>res(!!window.XLSX);e.onerror=()=>res(false);document.head.appendChild(e)});
const needX=async()=>window.XLSX?true:(await loadJs('xlsx.full.min.js',0))||(await loadJs(XURL,1));
async function xl(kind,file){if(!file)return;if(!await needX())return toast('کتابخانه Excel بارگذاری نشد؛ یک بار با اینترنت برنامه را باز کنید تا ذخیره شود');
try{const wb=XLSX.read(await file.arrayBuffer()),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:true,defval:''}).map(r=>r.map(c=>String(c).trim()));if(rows.length<2)return toast('فایل Excel ردیف داده ندارد');let ad=0,du=0,bd=0;
for(const r of rows.slice(1)){if(r.every(c=>!c))continue;const x=i=>r[i]||'';
if(kind=='s'){if(!x(1)&&!x(2)){bd++;continue}if((x(0)&&A().some(s=>norm(s.code)==norm(x(0))))||A().some(s=>norm(s.first)==norm(x(1))&&norm(s.last)==norm(x(2)))){du++;continue}A().push({code:x(0)||nc('S',A()),first:x(1),last:x(2),mobile:fxM(x(3)),national:fxN(x(4)),birth:fxD(x(5)),notes:x(6),parent:fxM(x(7))});ad++}
else{if(!x(1)){bd++;continue}if((x(0)&&C().some(c=>norm(c.code)==norm(x(0))))||C().some(c=>norm(c.name)==norm(x(1)))){du++;continue}C().push({code:x(0)||nc('C',C()),name:x(1),level:x(2),start:fxD(x(3)),end:fxD(x(4)),days:x(5),time:fxT(x(6)),notes:x(7),students:[]});ad++}}
save();draw();modal('نتیجه ورود Excel',`ثبت شد: ${ad}<br>تکراری (نادیده گرفته شد): ${du}<br>ردیف بدون نام: ${bd}`)}catch(e){toast('فایل Excel قابل خواندن نیست')}}
// ==== CAL/FIN LOGIC (port of Cal.java / Fin.java; keep texts identical) ====
const own=(o,k)=>o&&Object.prototype.hasOwnProperty.call(o,k)?o[k]:undefined,ol=(o,k,d=0)=>{const v=o?o[k]:undefined;return typeof v=='number'&&isFinite(v)?Math.trunc(v):d},os=(o,k)=>{const v=o?o[k]:undefined;return v==null?'':String(v)};
const ARR=a=>Array.isArray(a)?a:[],OBJ=o=>o&&typeof o=='object'&&!Array.isArray(o)?o:null;
const MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],DAYS=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه'];
const SCHOOL='Moradi English Class',sch2=t=>{t=String(t??'');const l=t.split(/\r?\n/).find(x=>x.trim());return l&&norm(l)==norm(SCH)?t:SCH+'\n'+t};
const Cal=(()=>{
const EXAM='exam',EVENT='event',REG='register',TS='termstart',TE='termend',MAKEUP='makeup',OFF='off',HOLIDAY='holiday',HIDE='hidehol',LESSON='lesson',NO_TIME=99999,MAX_SPAN=800;
const ADD_TYPES=[EXAM,EVENT,REG,TS,TE,MAKEUP,OFF,HOLIDAY];
const TL={exam:'آزمون',event:'رویداد',register:'ثبت‌نام',termstart:'شروع ترم',termend:'پایان ترم',makeup:'جلسه جبرانی',off:'لغو جلسه',holiday:'تعطیلی',lesson:'برنامه درسی'},TI={exam:'📝',event:'🎉',register:'🧾',termstart:'🚩',termend:'🏁',makeup:'🔁',off:'⛔',holiday:'🔴'};
const typeLabel=t=>TL[t]||t,typeIcon=t=>TI[t]||'•';
const PC=new Map();const parse=s=>{s=String(s??'');if(PC.has(s))return PC.get(s);const v=pd(s);if(PC.size>5000)PC.clear();PC.set(s,v);return v};
const jal=e=>{const d=new Date(e*864e5);return toJ(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate())};
const epoch=(jy,jm,jd)=>ep(...toG(jy,jm,jd));
const monthLen=(jy,jm)=>{if(jm<=6)return 31;if(jm<=11)return 30;const g=toG(jy,12,30),b=toJ(g[0],g[1],g[2]);return b[0]==jy&&b[1]==12&&b[2]==30?30:29};
const wd=e=>((e+5)%7+7)%7;
const fmt=e=>{const j=jal(e);return j[0]+'/'+p2(j[1])+'/'+p2(j[2])};
const fmtJ=(y,m,d)=>String(y).padStart(4,'0')+'/'+p2(m)+'/'+p2(d);
const T=Math.trunc;
const hijri=e=>{const jd=e+2440588;let l=jd-1948440+10632;const n=T((l-1)/10631);l=l-10631*n+354;const j=T((10985-l)/5316)*T((50*l)/17719)+T(l/5670)*T((43*l)/15238);l=l-T((30-j)/15)*T((17719*j)/50)-T(j/16)*T((15238*j)/43)+29;const m=T((24*l)/709),d=l-T((709*m)/24),y=30*n+j-30;return[y,m,d]};
const FIX={101:'نوروز (۱ فروردین)',102:'نوروز (۲ فروردین)',103:'نوروز (۳ فروردین)',104:'نوروز (۴ فروردین)',112:'روز جمهوری اسلامی',113:'روز طبیعت (سیزده‌به‌در)',314:'رحلت امام خمینی',315:'قیام ۱۵ خرداد',1122:'پیروزی انقلاب اسلامی',1229:'ملی شدن صنعت نفت'};
const LUN={109:'تاسوعای حسینی',110:'عاشورای حسینی',220:'اربعین حسینی',228:'رحلت پیامبر و شهادت امام حسن',317:'میلاد پیامبر و امام صادق',603:'شهادت حضرت فاطمه',713:'ولادت امام علی',727:'مبعث پیامبر',815:'ولادت امام زمان',921:'شهادت امام علی',1001:'عید سعید فطر',1002:'تعطیل به مناسبت عید فطر',1025:'شهادت امام صادق',1210:'عید سعید قربان',1218:'عید سعید غدیر'};
const builtinHoliday=e=>{const j=jal(e),k=j[1]*100+j[2];if(own(FIX,k))return FIX[k];const h=hijri(e),hk=h[1]*100+h[2];let name=own(LUN,hk)||null;if(name==null&&h[1]==2&&h[2]>=29&&hijri(e+1)[1]==3)name='شهادت امام رضا';return name==null?null:name+' (تقریبی)'};
const lessonId=(cls,date)=>'L|'+norm(cls)+'|'+date;
const forClass=(ev,cls)=>{const c=os(ev,'cls');return c==''||cls==null||cls==''||norm(c)==norm(cls)};
// index of events by day (rebuilt when the list changes)
let IX=null,IXA=null,IXN=-1,IXV=-1,VER=0;const touch=()=>{VER++};
const ix=ev=>{if(IX&&IXA===ev&&IXN===ev.length&&IXV===VER)return IX;IX=new Map();ev.forEach(o=>{if(!OBJ(o))return;const d=parse(os(o,'date'));if(d==null)return;(IX.get(d)||IX.set(d,[]).get(d)).push(o)});IXA=ev;IXN=ev.length;IXV=VER;return IX};
const eventsOn=(events,e)=>ix(ARR(events)).get(e)||[];
const holiday=(events,e)=>{let hidden=false;for(const o of eventsOn(events,e)){const t=os(o,'type');if(t==HOLIDAY){const title=os(o,'title').trim();return title==''?'تعطیل':title}if(t==HIDE)hidden=true}return hidden?null:builtinHoliday(e)};
const lesson=(events,cls,date)=>{const id=lessonId(cls,date);for(const o of ARR(events))if(OBJ(o)&&os(o,'id')==id)return o;return null};
const parseDays=s=>{const r=[false,false,false,false,false,false,false];let n=norm(s).replace(/ /g,'');const comp=['یکشنبه','دوشنبه','سهشنبه','چهارشنبه','پنجشنبه'];comp.forEach((c,i)=>{if(n.includes(c)){r[i+1]=true;n=n.split(c).join('')}});if(n.includes('شنبه'))r[0]=true;if(n.includes('جمعه'))r[6]=true;return r};
const startMin=time=>{const n=norm(time);let m=/(\d{1,2})[:.٫](\d{2})/.exec(n);if(m){const h=+m[1],mi=+m[2];if(h<24&&mi<60)return h*60+mi}m=/(^|[^\d])(\d{1,2})(?!\d)/.exec(n);if(m){const h=+m[2];if(h<24)return h*60}return NO_TIME};
// per-day schedule: sched = {"0":{s:"16:00",e:"17:30"},...}, key = weekday (Saturday = 0)
const sched=c=>{const x=c&&c.sched;return OBJ(x)&&Object.keys(x).length?x:null};
const span=(s,e)=>{s=String(s??'').trim();e=String(e??'').trim();return s==''?e:(e==''?s:s+' تا '+e)};
const timeAt=(c,e)=>{const sc=sched(c);if(!sc)return os(c,'time');const d=own(sc,String(wd(e)));return OBJ(d)?span(d.s,d.e):''};
const scheduleText=c=>{const sc=sched(c);if(!sc){const d=os(c,'days'),t=os(c,'time');return(d==''?'—':d)+(t==''?'':' • ساعت '+t)}const out=[];for(let i=0;i<7;i++){const d=own(sc,String(i));if(!OBJ(d))continue;const sp=span(d.s,d.e);out.push(DAYS[i]+(sp==''?'':' '+sp))}return out.length?out.join('، '):'—'};
const legacySched=c=>{const out={},d=parseDays(os(c,'days')),re=/(\d{1,2})[:.٫](\d{2})/g,n=norm(os(c,'time')),m1=re.exec(n),m2=re.exec(n),hm=m=>m&&+m[1]<24?p2(+m[1])+':'+m[2]:'';for(let i=0;i<7;i++)if(d[i])out[i]={s:hm(m1),e:hm(m2)};return out};
const termAt=(c,e)=>{const ts=c&&c.terms;if(OBJ(ts)){let best=null,any=false;for(const k of Object.keys(ts)){const n=+k,tt=ts[k];if(!(n>=1&&n<=4)||!OBJ(tt))continue;const s=parse(os(tt,'start')),en=parse(os(tt,'end'));if(s==null&&en==null)continue;any=true;if(s!=null&&e<s)continue;if(en!=null&&e>en)continue;if(best==null||(s==null?-1e9:s)>(best.s==null?-1e9:best.s))best={n,s,en}}if(any)return best}const s=parse(os(c,'start')),en=parse(os(c,'end'));if(s!=null&&e<s)return null;if(en!=null&&e>en)return null;return{n:tmOf(c),s,en}};
const termRanges=c=>{const out=[],ts=c&&c.terms;if(OBJ(ts))for(const k of Object.keys(ts)){const n=+k,tt=ts[k];if(!(n>=1&&n<=4)||!OBJ(tt))continue;const s=parse(os(tt,'start')),en=parse(os(tt,'end'));if(s==null)continue;out.push({n,s,en:en!=null?en:s+120})}if(out.length){out.sort((a,b)=>a.s-b.s);return out}let s=parse(os(c,'start')),en=parse(os(c,'end'));if(s==null)s=today();if(en==null)en=s+120;return[{n:tmOf(c),s,en}]};
const classDay=(c,e)=>{if(termAt(c,e)==null)return false;const sc=sched(c);if(sc)return OBJ(own(sc,String(wd(e))));return parseDays(os(c,'days'))[wd(e)]};
const cancelReason=(c,events,e)=>{const h=holiday(events,e);if(h!=null)return'تعطیل: '+h;for(const o of eventsOn(events,e))if(os(o,'type')==OFF&&forClass(o,os(c,'name'))){const t=os(o,'title').trim();return'لغو'+(t==''?'':': '+t)}return null};
const cancelEvent=(c,events,e)=>{for(const o of eventsOn(events,e))if(os(o,'type')==HOLIDAY)return o;for(const o of eventsOn(events,e))if(os(o,'type')==OFF&&forClass(o,os(c,'name')))return o;return null};
const makeupOn=(c,events,e)=>{for(const o of eventsOn(events,e))if(os(o,'type')==MAKEUP&&os(o,'cls')!=''&&norm(os(o,'cls'))==norm(os(c,'name')))return true;return false};
const held=(c,events,e)=>(classDay(c,e)&&cancelReason(c,events,e)==null)||makeupOn(c,events,e);
const number=(c,events,e)=>{const tt=termAt(c,e);let s=tt&&tt.s!=null?tt.s:parse(os(c,'start'));if(s==null)return 0;if(e-s>MAX_SPAN)s=e-MAX_SPAN;let n=0;for(let d=s;d<=e;d++)if(held(c,events,d))n++;return n};
const day=(classes,events,e,clsFilter,withNumbers=true)=>{const d={day:e,holiday:holiday(events,e),items:[]},used=new Set();
ARR(classes).forEach(c=>{if(!OBJ(c))return;const name=os(c,'name');if(clsFilter!=''&&norm(name)!=norm(clsFilter))return;let it=null;
if(classDay(c,e)){const why=cancelReason(c,events,e);it={kind:why==null?'session':'cancelled',cls:'',time:'',title:'',note:'',type:'',reason:why==null?'':why,num:0,sort:NO_TIME,ev:null};if(why!=null){it.ev=cancelEvent(c,events,e);if(it.ev)used.add(os(it.ev,'id'))}}
if(makeupOn(c,events,e)&&(it==null||it.kind=='cancelled'))it={kind:'makeup',cls:'',time:'',title:'',note:'',type:'',reason:'',num:0,sort:NO_TIME,ev:null};
if(it==null)return;it.cls=name;{const tz=termAt(c,e);it.term=tz?tz.n:tmOf(c)}it.time=timeAt(c,e);it.sort=startMin(it.time);if(it.kind!='cancelled'&&withNumbers)it.num=number(c,events,e);
if(it.kind=='makeup'){for(const o of eventsOn(events,e))if(os(o,'type')==MAKEUP&&norm(os(o,'cls'))==norm(name))it.ev=o;if(it.ev&&os(it.ev,'time').trim()!=''){it.time=os(it.ev,'time').trim();it.sort=startMin(it.time)}}d.items.push(it)});
d.items.sort((a,b)=>a.sort!=b.sort?(a.sort<b.sort?-1:1):(norm(a.cls)<norm(b.cls)?-1:norm(a.cls)>norm(b.cls)?1:0));
const evs=[];for(const o of eventsOn(events,e)){const t=os(o,'type');if(t==LESSON||t==HIDE||t==HOLIDAY||t==MAKEUP||t=='deleted')continue;if(used.has(os(o,'id')))continue;if(clsFilter!=''&&!forClass(o,clsFilter))continue;evs.push({kind:'event',type:t,cls:os(o,'cls'),time:os(o,'time'),title:os(o,'title'),note:os(o,'note'),reason:'',num:0,sort:startMin(os(o,'time')),ev:o})}
evs.sort((a,b)=>a.sort<b.sort?-1:a.sort>b.sort?1:0);d.items.push(...evs);return d};
const line=it=>{let b='';if(it.kind=='event'){b+=typeIcon(it.type)+' '+typeLabel(it.type);if(it.title!='')b+=': '+it.title;b+=it.cls!=''?' — کلاس '+it.cls:' — همه کلاس‌ها';if(it.time!='')b+=' — ساعت '+it.time;if(it.note!='')b+=' ('+it.note+')';return b}
if(it.time!='')b+=it.time+' — ';b+='کلاس '+it.cls+(it.term?' • ترم '+it.term:'');if(it.kind=='cancelled')return b+' — برگزار نمی‌شود ('+it.reason+')';if(it.kind=='makeup')b+=' — جلسه جبرانی';if(it.num>0)b+=' — جلسه '+it.num;return b};
const counts=(classes,events,e,clsFilter)=>{let s=0,v=0;for(const it of day(classes,events,e,clsFilter,false).items){if(it.kind=='event')v++;else if(it.kind!='cancelled')s++}return[s,v]};
const dayHeader=e=>{const j=jal(e);return DAYS[wd(e)]+' '+j[2]+' '+MONTHS[j[1]-1]+' '+j[0]+' ('+fmtJ(j[0],j[1],j[2])+')'};
const note=(events,cls,date)=>{const l=lesson(events,cls,date);return l&&os(l,'note').trim()!=''?os(l,'note').trim():''};
const monthText=(classes,events,jy,jm,clsFilter)=>{let b='تقویم آموزشی — '+MONTHS[jm-1]+' '+jy;if(clsFilter!='')b+=' — کلاس '+clsFilter;b+='\n';const n=monthLen(jy,jm);let any=false;
for(let d=1;d<=n;d++){const e=epoch(jy,jm,d),dy=day(classes,events,e,clsFilter);if(dy.holiday==null&&!dy.items.length)continue;any=true;b+='\n'+dayHeader(e)+'\n';if(dy.holiday!=null)b+='🔴 تعطیل: '+dy.holiday+'\n';
for(const it of dy.items){b+='• '+line(it)+'\n';if(it.kind!='event'&&it.kind!='cancelled'&&it.num>0){const l=note(events,it.cls,fmtJ(jy,jm,d));if(l)b+='   برنامه درسی: '+l+'\n'}}}
if(!any)b+='\nرویدادی ثبت نشده است.\n';return b.trim()};
const dayText=(classes,events,e,clsFilter)=>{const dy=day(classes,events,e,clsFilter);let b='تقویم آموزشی — '+dayHeader(e)+'\n';if(dy.holiday!=null)b+='🔴 تعطیل: '+dy.holiday+'\n';if(!dy.items.length&&dy.holiday==null)b+='جلسه یا رویدادی نیست.\n';
for(const it of dy.items){b+='• '+line(it)+'\n';if(it.kind!='event'&&it.kind!='cancelled'){const l=note(events,it.cls,fmt(e));if(l)b+='   برنامه درسی: '+l+'\n'}}return b.trim()};
const sessions=(c,events,from,to)=>{const out=[],t0=termAt(c,from);if(!(t0&&t0.s!=null)){for(let d=from;d<=to&&d-from<=MAX_SPAN;d++)if(held(c,events,d))out.push([d,0]);return out}let d0=from;if(t0.s<d0&&from-t0.s<=MAX_SPAN)d0=t0.s;let cur=null,n=0;for(let d=Math.max(d0,to-MAX_SPAN);d<=to;d++){const tz=termAt(c,d),key=tz?tz.n+':'+tz.s:'x';if(key!=cur){cur=key;n=0}if(held(c,events,d)){n++;if(d>=from)out.push([d,n])}}return out};
const classSessionsText=(c,events)=>{let b='برنامه جلسات کلاس '+os(c,'name')+'\n';b+='روزها و ساعت: '+scheduleText(c)+'\n';for(const r of termRanges(c)){b+='\n— ترم '+r.n+': '+fmt(r.s)+' تا '+fmt(r.en)+' —\n';for(const x of sessions(c,events,r.s,r.en)){const tm=timeAt(c,x[0]);b+='\nجلسه '+x[1]+' — '+dayHeader(x[0])+(tm==''?'':' — ساعت '+tm)+'\n';const l=note(events,os(c,'name'),fmt(x[0]));if(l)b+='   '+l+'\n'}}return b.trim()};
return{note,EXAM,EVENT,REG,TS,TE,MAKEUP,OFF,HOLIDAY,HIDE,LESSON,ADD_TYPES,typeLabel,typeIcon,parse,jal,epoch,monthLen,wd,fmt,fmtJ,hijri,builtinHoliday,lessonId,forClass,eventsOn,holiday,lesson,parseDays,startMin,classDay,termAt,termRanges,sched,span,timeAt,scheduleText,legacySched,cancelReason,cancelEvent,makeupOn,held,number,day,line,counts,dayHeader,monthText,dayText,sessions,classSessionsText,touch,NO_TIME}})();
// ---- events in the normal backup (D.events) ----
const EVS=()=>Array.isArray(D.events)?D.events:(D.events=[]);
const GRD=()=>Array.isArray(D.grades)?D.grades:(D.grades=[]);
function putEvent(ev){if(!os(ev,'id'))ev.id='E'+Date.now()+'_'+EVS().length;ev.ts=Date.now();const i=EVS().findIndex(o=>os(o,'id')==ev.id);if(i>=0)EVS()[i]=ev;else EVS().push(ev);Cal.touch();save()}
function removeEvent(id){const i=EVS().findIndex(o=>os(o,'id')==id);if(i<0)return;EVS()[i]={id,type:'deleted',ts:Date.now()};Cal.touch();save()}
function setLesson(cls,date,text){const id=Cal.lessonId(cls,date);if(!String(text).trim())return removeEvent(id);putEvent({id,type:Cal.LESSON,date,cls,note:String(text).trim()})}
// ---- finance data (own storage key: never in the normal backup) ----
const KF='class_web_fin_v1',KG='class_web_mgr';
const Fin=(()=>{
const KA=['payments','installs','salaries','ledger'],KM=['fees','accounts','rates'],METHODS=['cash','card','transfer','other'];
const fix=f=>{f=OBJ(f)||{};KA.forEach(k=>{if(!Array.isArray(f[k]))f[k]=[]});KM.forEach(k=>{if(!OBJ(f[k]))f[k]={}});return f};
let cnt=0;const newId=p=>p+Date.now()+'_'+(cnt++)+'_'+(1000+Math.floor(Math.random()*9000));
const live=(fin,k)=>ARR(fin[k]).filter(o=>OBJ(o)&&o.deleted!==true);
const upsert=(fin,k,rec,pre)=>{if(!os(rec,'id'))rec.id=newId(pre);rec.ts=Date.now();const a=fin[k],i=a.findIndex(o=>os(o,'id')==rec.id);if(i>=0)a[i]=rec;else a.push(rec);return rec};
const del=(fin,k,id)=>{const a=fin[k],i=a.findIndex(o=>os(o,'id')==id);if(i>=0)a[i]={id,deleted:true,ts:Date.now()}};
const find=(fin,k,id)=>ARR(fin[k]).find(o=>OBJ(o)&&os(o,'id')==id&&o.deleted!==true)||null;
const money=s=>{const d=dg(s??'');let b='';for(const c of d){if(c>='0'&&c<='9')b+=c;else if(',٬،  ‌٫'.includes(c))continue;else return -1}if(b==''||b.length>13)return -1;return parseInt(b,10)};
const fmt=v=>{const neg=v<0,s=String(Math.abs(v));let b='';for(let i=0;i<s.length;i++){if(i>0&&(s.length-i)%3==0)b+=',';b+=s[i]}return(neg?'-':'')+b};
const toman=v=>fmt(v)+' تومان';
const methodLabel=m=>m=='cash'?'نقدی':m=='card'?'کارت':m=='transfer'?'واریز':'سایر';
const nameKey=s=>norm(os(s,'first'))+'|'+norm(os(s,'last')),name=s=>(os(s,'first')+' '+os(s,'last')).trim();
const stOf=code=>A().find(s=>os(s,'code')==code)||null;
const student=rec=>{const s=stOf(os(rec,'code'));if(s)return s;const n=norm(os(rec,'name'));if(n=='')return null;return A().find(o=>norm(name(o))==n)||null};
const recsOf=(fin,k,code)=>live(fin,k).filter(r=>{const s=student(r),c=s?os(s,'code'):os(r,'code');return c==code});
const classOf=code=>{const i=clsOf(code);return i<0?null:C()[i]};
const feeRule=(fin,cls)=>OBJ(own(fin.fees,norm(cls)))||null;
const setFee=(fin,cls,mode,fee)=>{fin.fees[norm(cls)]={cls,mode:mode=='session'?'session':'term',fee,ts:Date.now()}};
const account=(fin,code)=>OBJ(own(fin.accounts,code))||null;
const setAccount=(fin,code,nm,personalFee,discount)=>{const o={name:nm};if(personalFee>=0)o.fee=personalFee;o.discount=Math.max(0,discount);o.ts=Date.now();fin.accounts[code]=o};
const heldSessions=(cls,todayE)=>{const s=Cal.parse(os(cls,'start')),en=Cal.parse(os(cls,'end'));const to=en!=null&&en<todayE?en:todayE;if(s!=null)return Cal.sessions(cls,EVS(),s,to).length;const days=new Set(),cn=norm(os(cls,'name'));R().forEach(r=>{if(r&&norm(os(r,'class'))==cn)days.add(norm(os(r,'date')))});return days.size};
const acc=(fin,stu)=>{const a={student:stu,code:os(stu,'code'),cls:'',mode:'term',unit:0,sessions:0,base:0,discount:0,charge:0,paid:0,balance:0};const c=classOf(a.code);let rule=null;if(c){a.cls=os(c,'name');rule=feeRule(fin,a.cls)}
if(rule){a.mode=os(rule,'mode')||'term';a.unit=Math.max(0,ol(rule,'fee',0))}const ac=account(fin,a.code);if(ac){if('fee' in ac&&ol(ac,'fee',-1)>=0)a.unit=ol(ac,'fee');a.discount=Math.max(0,ol(ac,'discount',0))}
if(a.mode=='session'&&c){a.sessions=heldSessions(c,today());a.base=a.unit*a.sessions}else a.base=a.unit;a.charge=Math.max(0,a.base-a.discount);recsOf(fin,'payments',a.code).forEach(p=>{a.paid+=Math.max(0,ol(p,'amount',0))});a.balance=a.charge-a.paid;return a};
const installments=(fin,code,paid,todayE)=>{const out=recsOf(fin,'installs',code).map(r=>({rec:r,due:Cal.parse(os(r,'date')),amount:Math.max(0,ol(r,'amount',0)),covered:0,status:''}));
const dv=x=>x.due==null?-Infinity:x.due;out.sort((a,b)=>dv(a)<dv(b)?-1:dv(a)>dv(b)?1:(os(a.rec,'id')<os(b.rec,'id')?-1:os(a.rec,'id')>os(b.rec,'id')?1:0));let left=paid;
for(const i of out){i.covered=Math.min(left,i.amount);left-=i.covered;if(i.covered>=i.amount)i.status='paid';else if(i.due!=null&&i.due<todayE)i.status='overdue';else i.status=i.covered>0?'partial':'upcoming'}return out};
const statusLabel=s=>s=='paid'?'پرداخت شده':s=='partial'?'بخشی پرداخت شده':s=='overdue'?'معوق':'در انتظار';
const dueLines=(fin,e)=>{const out=[],t=today(),seen=new Set();for(const r of live(fin,'installs')){if(Cal.parse(os(r,'date'))!==e)continue;const s=student(r),code=s?os(s,'code'):os(r,'code');if(seen.has(code))continue;seen.add(code);let paid=0;recsOf(fin,'payments',code).forEach(p=>{paid+=Math.max(0,ol(p,'amount',0))});
for(const i of installments(fin,code,paid,t))if(i.due===e&&i.status!='paid'){const nm=s?name(s):os(r,'name');out.push('💰 قسط '+nm+' — '+toman(i.amount-i.covered)+(i.status=='overdue'?' (معوق)':''))}}return out};
const allAccounts=(fin,cf)=>{const out=[];A().slice().sort(cmpS).forEach(s=>{const a=acc(fin,s);if(cf!=''&&norm(a.cls)!=norm(cf))return;if(a.charge==0&&a.paid==0)return;out.push(a)});return out};
const debtors=(fin,cf)=>allAccounts(fin,cf).filter(a=>a.balance>0);
const setRate=(fin,t,mode,amount)=>{fin.rates[norm(t)]={teacher:t,mode:mode=='month'?'month':'session',amount,ts:Date.now()}};
const rate=(fin,t)=>OBJ(own(fin.rates,norm(t)))||null;
const teachers=()=>{const out=TCH(),seen=new Set(out.map(norm));R().forEach(r=>{const t=os(r,'teacher').trim();if(t&&!seen.has(norm(t))){seen.add(norm(t));out.push(t)}});return out.sort(natCmp)};
const tSess=(t,from,to)=>{const s=new Set(),tn=norm(t);R().forEach(r=>{if(!r||norm(os(r,'teacher'))!=tn)return;const d=Cal.parse(os(r,'date'));if(d==null||d<from||d>to)return;s.add(d+'|'+norm(os(r,'class')))});return s.size};
const tMonths=(t,from,to)=>{const s=new Set(),tn=norm(t);R().forEach(r=>{if(!r||norm(os(r,'teacher'))!=tn)return;const d=Cal.parse(os(r,'date'));if(d==null||d<from||d>to)return;const j=Cal.jal(d);s.add(j[0]+'/'+j[1])});return s.size};
const tAccrued=(fin,t,from,to)=>{const r=rate(fin,t);if(!r)return 0;const amt=Math.max(0,ol(r,'amount',0));return os(r,'mode')=='month'?amt*tMonths(t,from,to):amt*tSess(t,from,to)};
const tPaid=(fin,t,from,to)=>{let sum=0;const tn=norm(t);for(const r of live(fin,'salaries')){const d=Cal.parse(os(r,'date'));if(norm(os(r,'teacher'))!=tn)continue;if(d!=null&&(d<from||d>to))continue;sum+=Math.max(0,ol(r,'amount',0))}return sum};
const ALL_FROM=0,ALL_TO=1000000;
const month=(fin,jy,jm)=>{const from=Cal.epoch(jy,jm,1),to=Cal.epoch(jy,jm,Cal.monthLen(jy,jm));let tu=0,ot=0,ex=0,sa=0;
live(fin,'payments').forEach(p=>{const d=Cal.parse(os(p,'date'));if(d!=null&&d>=from&&d<=to)tu+=Math.max(0,ol(p,'amount',0))});
live(fin,'ledger').forEach(l=>{const d=Cal.parse(os(l,'date'));if(d==null||d<from||d>to)return;if(os(l,'kind')=='income')ot+=Math.max(0,ol(l,'amount',0));else ex+=Math.max(0,ol(l,'amount',0))});
live(fin,'salaries').forEach(s=>{const d=Cal.parse(os(s,'date'));if(d!=null&&d>=from&&d<=to)sa+=Math.max(0,ol(s,'amount',0))});return[tu,ot,ex,sa,tu+ot-ex-sa]};
const head=t=>SCHOOL+'\n'+t+'\n';
const cmpD=(a,b)=>{const x=Cal.parse(os(a,'date')),y=Cal.parse(os(b,'date')),xv=x==null?-Infinity:x,yv=y==null?-Infinity:y;return xv<yv?-1:xv>yv?1:(os(a,'id')<os(b,'id')?-1:os(a,'id')>os(b,'id')?1:0)};
const sortByDate=l=>l.sort(cmpD);
const studentText=(fin,stu)=>{const a=acc(fin,stu),t=today();let b=head('صورت‌حساب مالی');b+='زبان‌آموز: '+name(stu)+'\n';if(a.cls!='')b+='کلاس: '+a.cls+'\n';if(a.mode=='session')b+='شهریه هر جلسه: '+toman(a.unit)+' × '+a.sessions+' جلسه\n';
b+='شهریه: '+toman(a.base)+'\n';if(a.discount>0)b+='تخفیف: '+toman(a.discount)+'\n';b+='مبلغ قابل پرداخت: '+toman(a.charge)+'\n';b+='پرداخت شده: '+toman(a.paid)+'\n';b+=(a.balance>=0?'مانده بدهی: ':'بستانکار: ')+toman(Math.abs(a.balance))+'\n';
const pays=recsOf(fin,'payments',a.code);sortByDate(pays);if(pays.length){b+='\nپرداخت‌ها:\n';for(const p of pays){b+='• '+os(p,'date')+' — '+toman(ol(p,'amount'))+' — '+methodLabel(os(p,'method'));if(os(p,'note').trim()!='')b+=' ('+os(p,'note').trim()+')';b+='\n'}}
const ins=installments(fin,a.code,a.paid,t);if(ins.length){b+='\nاقساط:\n';for(const i of ins)b+='• '+os(i.rec,'date')+' — '+toman(i.amount)+' — '+statusLabel(i.status)+'\n'}return b.trim()};
const debtorsText=(fin,cf)=>{let b=head('لیست بدهکاران'+(cf==''?'':' — کلاس '+cf));const l=debtors(fin,cf);let sum=0;for(const a of l){sum+=a.balance;b+='• '+name(a.student);if(a.cls!=''&&cf=='')b+=' ('+a.cls+')';b+=' — '+toman(a.balance)+'\n'}
if(!l.length)b+='بدهکاری وجود ندارد.\n';else b+='\nمجموع بدهی: '+toman(sum)+'\n';return b.trim()};
const classText=(fin,cls)=>{let b=head('وضعیت مالی کلاس '+cls),ch=0,pd2=0;for(const a of allAccounts(fin,cls)){ch+=a.charge;pd2+=a.paid;b+='• '+name(a.student)+' — شهریه '+fmt(a.charge)+' — پرداخت '+fmt(a.paid)+(a.balance>=0?' — مانده ':' — بستانکار ')+fmt(Math.abs(a.balance))+'\n'}
b+='\nجمع شهریه: '+toman(ch)+'\nجمع پرداخت: '+toman(pd2)+'\nجمع مانده: '+toman(ch-pd2)+'\n';return b.trim()};
const monthText=(fin,jy,jm)=>{const m=month(fin,jy,jm);let b=head('گزارش مالی '+MONTHS[jm-1]+' '+jy);b+='درآمد شهریه: '+toman(m[0])+'\n';b+='درآمد دیگر: '+toman(m[1])+'\n';b+='هزینه‌ها: '+toman(m[2])+'\n';b+='حقوق معلم‌ها: '+toman(m[3])+'\n';b+=(m[4]>=0?'سود خالص: ':'زیان: ')+toman(Math.abs(m[4]))+'\n';
const from=Cal.epoch(jy,jm,1),to=Cal.epoch(jy,jm,Cal.monthLen(jy,jm)),led=live(fin,'ledger').filter(l=>{const d=Cal.parse(os(l,'date'));return d!=null&&d>=from&&d<=to});sortByDate(led);
if(led.length){b+='\nدرآمد و هزینه‌های ثبت‌شده:\n';for(const l of led)b+='• '+os(l,'date')+' — '+(os(l,'kind')=='income'?'درآمد':'هزینه')+': '+os(l,'title')+' — '+toman(ol(l,'amount'))+'\n'}return b.trim()};
const teachersText=(fin,from,to,label)=>{let b=head('حقوق معلم‌ها'+(label==''?'':' — '+label));for(const t of teachers()){const r=rate(fin,t),n=tSess(t,from,to),ac=tAccrued(fin,t,from,to),pd2=tPaid(fin,t,from,to);if(!r&&n==0&&pd2==0)continue;b+='• '+t+' — '+n+' جلسه';if(r)b+=' — '+(os(r,'mode')=='month'?'ماهانه ':'هر جلسه ')+fmt(ol(r,'amount'));b+='\n   محاسبه‌شده: '+toman(ac)+' — پرداخت‌شده: '+toman(pd2)+' — مانده: '+toman(ac-pd2)+'\n'}return b.trim()};
const receiptNo=pay=>{const id=os(pay,'id');let d='';for(let i=1;i<id.length&&id[i]!='_';i++)if(id[i]>='0'&&id[i]<='9')d+=id[i];return d.length>7?d.slice(d.length-7):d};
const receiptText=(fin,pay)=>{const s=student(pay);let b=head('رسید پرداخت');b+='شماره رسید: '+receiptNo(pay)+'\n';b+='تاریخ: '+os(pay,'date')+'\n';b+='نام زبان‌آموز: '+(s?name(s):os(pay,'name'))+'\n';if(s){const ci=clsOf(os(s,'code'));if(ci>=0)b+='کلاس: '+os(C()[ci],'name')+'\n'}
b+='مبلغ پرداختی: '+toman(ol(pay,'amount'))+'\n';b+='روش پرداخت: '+methodLabel(os(pay,'method'))+'\n';if(os(pay,'note').trim()!='')b+='توضیح: '+os(pay,'note').trim()+'\n';if(s){const a=acc(fin,s);b+=(a.balance>=0?'مانده بدهی: ':'بستانکار: ')+toman(Math.abs(a.balance))+'\n'}return b.trim()};
const reminderText=(fin,stu)=>{const a=acc(fin,stu);let b=SCHOOL+'\n';b+='سلام '+name(stu)+' عزیز\n';b+='یادآوری شهریه';if(a.cls!='')b+=' کلاس '+a.cls;b+='\nمانده شهریه: '+toman(Math.max(0,a.balance))+'\n';const ins=installments(fin,a.code,a.paid,today());
for(const i of ins)if(i.status=='overdue')b+='قسط معوق '+os(i.rec,'date')+': '+toman(i.amount-i.covered)+'\n';for(const i of ins)if(i.status=='upcoming'||i.status=='partial'){b+='قسط بعدی '+os(i.rec,'date')+': '+toman(i.amount-i.covered)+'\n';break}
b+='لطفاً در اولین فرصت اقدام فرمایید. با تشکر';return b};
const exportJ=fin=>JSON.stringify({app:'class-fin',version:1,exportedAt:Date.now(),students:A().map(s=>({code:os(s,'code'),first:os(s,'first'),last:os(s,'last')})),fin},null,2);
const validate=r=>!r||r.app!='class-fin'||!OBJ(r.fin)?'این فایل، پشتیبان مالی برنامه نیست':null;
const codeMap=inn=>{const m={};ARR(inn.students).forEach(s=>{if(!OBJ(s))return;const code=os(s,'code'),loc=stOf(code);if(loc&&nameKey(loc)==nameKey(s)){m[code]=code;return}for(const l of A())if(nameKey(l)==nameKey(s)){m[code]=os(l,'code');break}});return m};
const remapped=(r,map)=>{const c=JSON.parse(JSON.stringify(r)),code=os(c,'code');if(code!=''&&own(map,code)!==undefined)c.code=map[code];return c};
const merge=(fin,inn)=>{const res={added:0,updated:0},f=fix(JSON.parse(JSON.stringify(inn.fin||{}))),map=codeMap(inn);
KA.forEach(k=>{const dst=fin[k];f[k].forEach(r=>{if(!OBJ(r)||os(r,'id')=='')return;const c=remapped(r,map),at=dst.findIndex(o=>os(o,'id')==os(c,'id'));if(at<0){dst.push(c);res.added++}else if(ol(c,'ts',0)>ol(dst[at],'ts',0)){dst[at]=c;res.updated++}})});
KM.forEach(k=>{const dst=fin[k];Object.keys(f[k]).forEach(key=>{const v=f[k][key];if(!OBJ(v))return;const nk=k=='accounts'&&own(map,key)!==undefined?map[key]:key,old=own(dst,nk);if(!old){dst[nk]=JSON.parse(JSON.stringify(v));res.added++}else if(ol(v,'ts',0)>ol(old,'ts',0)){dst[nk]=JSON.parse(JSON.stringify(v));res.updated++}})});return res};
const replace=inn=>{const f=fix(JSON.parse(JSON.stringify(inn.fin))),map=codeMap(inn);KA.forEach(k=>{f[k]=f[k].filter(OBJ).map(r=>remapped(r,map))});const na={};Object.keys(f.accounts).forEach(key=>{na[own(map,key)!==undefined?map[key]:key]=f.accounts[key]});f.accounts=na;return f};
const summary=r=>`مورد جدید: ${r.added}<br>مورد به‌روز شده (نسخه جدیدتر): ${r.updated}`;
return{stOf,fix,newId,live,upsert,del,find,money,fmt,toman,methodLabel,nameKey,name,student,recsOf,classOf,feeRule,setFee,account,setAccount,heldSessions,acc,installments,statusLabel,dueLines,allAccounts,debtors,setRate,rate,teachers,tSess,tMonths,tAccrued,tPaid,month,studentText,debtorsText,classText,monthText,teachersText,receiptText,receiptNo,reminderText,exportJ,validate,codeMap,merge,replace,summary,sortByDate,METHODS,ALL_FROM,ALL_TO}})();
let FN=Fin.fix(null);try{const x=JSON.parse(localStorage.getItem(KF)||'null');if(x&&typeof x=='object')FN=Fin.fix(x)}catch(e){}
const saveFin=()=>{try{localStorage.setItem(KF,JSON.stringify(FN))}catch(e){toast('ذخیره‌سازی مرورگر در دسترس نیست')}track()};
let MGR=false;try{MGR=localStorage.getItem(KG)=='1'}catch(e){}
const setMgr=on=>{MGR=!!on;try{localStorage.setItem(KG,MGR?'1':'0')}catch(e){}};
const Pw=(()=>{const K1='class_web_mgr_pw',K2='class_web_mgr_hint';
const sha=(str)=>{const b=unescape(encodeURIComponent(str)),K=[];for(let i=2,n=0;n<64;i++){let p=1;for(let j=2;j*j<=i;j++)if(i%j==0){p=0;break}if(p){K[n++]=(Math.pow(i,1/3)%1)*4294967296|0}}
let H=[];for(let i=2,n=0;n<8;i++){let p=1;for(let j=2;j*j<=i;j++)if(i%j==0){p=0;break}if(p){H[n++]=(Math.pow(i,.5)%1)*4294967296|0}}
const w=[],l=b.length*8;let m=b+'\x80';while(m.length%64!=56)m+='\0';for(let i=0;i<m.length;i++)w[i>>2]|=m.charCodeAt(i)<<((3-i%4)*8);w[(m.length>>2)]=Math.floor(l/4294967296);w[(m.length>>2)+1]=l|0;
const R=(x,n)=>(x>>>n)|(x<<(32-n));for(let o=0;o<w.length;o+=16){const a=new Array(64);for(let i=0;i<64;i++){if(i<16)a[i]=w[o+i]|0;else{const s0=R(a[i-15],7)^R(a[i-15],18)^(a[i-15]>>>3),s1=R(a[i-2],17)^R(a[i-2],19)^(a[i-2]>>>10);a[i]=(a[i-16]+s0+a[i-7]+s1)|0}}
let[A,B,C,D,E,F,G,Hh]=H;for(let i=0;i<64;i++){const S1=R(E,6)^R(E,11)^R(E,25),ch=(E&F)^(~E&G),t1=(Hh+S1+ch+K[i]+a[i])|0,S0=R(A,2)^R(A,13)^R(A,22),mj=(A&B)^(A&C)^(B&C),t2=(S0+mj)|0;Hh=G;G=F;F=E;E=(D+t1)|0;D=C;C=B;B=A;A=(t1+t2)|0}
H=[H[0]+A|0,H[1]+B|0,H[2]+C|0,H[3]+D|0,H[4]+E|0,H[5]+F|0,H[6]+G|0,H[7]+Hh|0]}
return H.map(x=>('00000000'+(x>>>0).toString(16)).slice(-8)).join('')};
const pin=r=>{const t=String(r==null?'':r).trim().replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776).replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632);return/^\d{4}$/.test(t)?t:null};
const rd=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}};
const has=()=>rd(K1).indexOf(':')>0;
const check=r=>{const p=pin(r),v=rd(K1),i=v.indexOf(':');if(p==null||i<1)return false;return sha(v.slice(0,i)+p)==v.slice(i+1)};
const set=(r,hint)=>{const p=pin(r);if(p==null)return false;const salt=Date.now().toString(36)+Math.random().toString(36).slice(2);try{localStorage.setItem(K1,salt+':'+sha(salt+p));localStorage.setItem(K2,String(hint||'').trim())}catch(e){return false}return true};
const hint=()=>rd(K2);const setHint=h=>{try{localStorage.setItem(K2,String(h||'').trim())}catch(e){}};
return{sha,pin,has,check,set,hint,setHint}})();
// ==== END CAL/FIN LOGIC ====
// ==== CALENDAR / FINANCE UI ====
const sl=(n,l,o,c)=>`<label>${l}<select name="${n}">${o.map(([v,t])=>`<option value="${E(v)}"${String(v)==String(c)?' selected':''}>${E(t)}</option>`).join('')}</select></label>`;
const okD=s=>{const m=/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/.exec(norm(s));if(!m)return null;const y=+m[1],mo=+m[2],d=+m[3];if(y<1200||y>1700||mo<1||mo>12||d<1||d>Cal.monthLen(y,mo))return null;return Cal.fmtJ(y,mo,d)};
const XT={};
const xbtn=(k,th,n)=>{XT[k]=[th,n];return`<button class="p" onclick="xo('t','${k}')">📤 TXT</button><button onclick="xo('s','${k}')">📨 ارسال / کپی</button><button onclick="xo('i','${k}')">🖼 تصویر</button>`};
function shareRaw(t0){const t=sch2(t0);pvThen(t,'ارسال',()=>shareRaw2(t))}
async function shareRaw2(t){if(navigator.share){try{await navigator.share({text:t});return}catch(e){if(e&&e.name=='AbortError')return}}try{await navigator.clipboard.writeText(t);toast('متن کپی شد')}catch(e){modal('متن (کپی کنید)',`<textarea rows="12" readonly onfocus="this.select()">${E(t)}</textarea>`)}}
async function xo(m,k){const[th,n]=XT[k],t=sch2(th());if(m=='i')return shareImg(t,n,true);if(m=='s')return shareRaw(t);pvThen(t,'ذخیره',async()=>{const fn=n+'-'+new Date().toISOString().slice(0,10)+'.txt';if(await saveFile(fn,'﻿'+t,'text/plain'))toast('فایل آماده شد');else modal('متن (کپی کنید)',`<textarea rows="12" readonly onfocus="this.select()">${E(t)}</textarea>`)})}
const mBack=(go,l)=>`<div class="tb"><button onclick="${go}">‹ ${l}</button></div>`;
const KSH=['ش','ی','د','س','چ','پ','ج'];
let KM=null,KC='',KD=null,KS=null,KI=[];
const kNow=()=>{if(!KM){const j=Cal.jal(today());KM=[j[0],j[1]]}return KM};
const clsSel=(v,fn)=>`<select style="width:auto;flex:1;margin:0" onchange="${fn}"><option value="">همه کلاس‌ها</option>${C().filter(canC).sort(cmpC).map(c=>`<option ${c.name==v?'selected':''} value="${E(c.name)}">${E(c.name)}</option>`).join('')}</select>`;
function vK(){if(KS!=null)return kSess();if(KD!=null)return kDay();return kMonth()}
const kCell=e=>{const dy=Cal.day(C(),EVS(),e,KC,false);return{names:dy.items.filter(i=>i.kind!='event').map(i=>({t:i.cls,m:i.term||0,k:i.kind})),ev:dy.items.filter(i=>i.kind=='event').length,holiday:dy.holiday}};
function kMonth(){const[jy,jm]=kNow(),n=Cal.monthLen(jy,jm),first=Cal.epoch(jy,jm,1),off=Cal.wd(first),t=today(),ev=EVS();let cells=KSH.map((x,i)=>`<div class="kh${i==6?' kr':''}">${x}</div>`).join('')+'<div class="ke"></div>'.repeat(off),list='';
for(let d=1;d<=n;d++){const e=first+d-1,h=Cal.holiday(ev,e),cd=kCell(e),due=MGR&&Fin.dueLines(FN,e).length;
cells+=`<div class="${Cal.wd(e)==6||h?'kr ':''}${h?'kx ':''}${e==t?'kt':''}" onclick="KU.open(${e})"><b>${d}</b>${cd.names.map(x=>`<i${x.k=='cancelled'?' class="kc"':''}>${E(x.t)}${x.m?'<small>ت'+x.m+'</small>':''}</i>`).join('')}${cd.ev?`<i class="kv">📝${cd.ev}</i>`:''}${due?'<i>💰</i>':''}</div>`;
const dy=Cal.day(C(),ev,e,KC,false),ex=dy.items.filter(i=>i.kind=='event');if(h||ex.length)list+=`<div class="card" onclick="KU.open(${e})" style="cursor:pointer"><b>${d} ${MONTHS[jm-1]}</b>${h?`<div style="color:var(--danger)">🔴 ${E(h)}</div>`:''}${ex.map(i=>`<div>${E(Cal.line(i))}</div>`).join('')}</div>`}
return`<div class="r"><button onclick="KU.mv(-1)">▶ قبلی</button><b style="font-size:18px">${MONTHS[jm-1]} ${jy}</b><button onclick="KU.mv(1)">بعدی ◀</button></div><div class="tb"><button onclick="KU.now()">امروز</button>${clsSel(KC,'KC=this.value;draw()')}</div><div class="kg">${cells}</div><div class="m">🔴 تعطیل (مناسبت‌های قمری با محاسبه تقریبی هستند و ممکن است یک روز اختلاف داشته باشند؛ مدیر می‌تواند تعطیلی را حذف یا اضافه کند) • زیر هر روز نام کلاس‌های همان روز آمده و کنار هر نام شمارهٔ ترم با حرف «ت» است (مثلاً کلاس C با ت2 یعنی ترم ۲؛ خط‌خورده = جلسهٔ لغوشده)</div>`
+`<div class="tb">${MGR?'<button class="p" onclick="KU.add(null)">➕ رویداد</button>':''}<button onclick="KS=\'\';draw()">📚 جلسات کلاس‌ها</button></div><div class="tb">${xbtn('km',()=>Cal.monthText(C(),EV(),jy,jm,KC),'calendar-'+jy+'-'+p2(jm)).replace(/<button onclick="xo\('i','km'\)">[^<]*<\/button>/,'')}<button class="p" onclick="kImg()">🖼 تصویر صفحهٔ تقویم</button></div>`+(list?`<b>رویدادها و تعطیلی‌های این ماه</b>${list}`:'<div class="m">رویداد یا تعطیلی خاصی در این ماه ثبت نشده است.</div>')}
const EV=()=>EVS();
function kDay(){const e=KD,ev=EVS(),dy=Cal.day(C(),ev,e,KC);KI=dy.items;const ds=Cal.fmt(e);
const cust=Cal.eventsOn(ev,e).find(o=>os(o,'type')==Cal.HOLIDAY),hid=Cal.eventsOn(ev,e).find(o=>os(o,'type')==Cal.HIDE),bi=Cal.builtinHoliday(e);
let h=`<div class="tb"><button onclick="KU.back()">‹ ماه</button><button onclick="KU.step(-1)">▶ روز قبل</button><button onclick="KU.step(1)">روز بعد ◀</button></div><div class="card"><b>${E(Cal.dayHeader(e))}</b></div>`;
if(dy.holiday!=null)h+=`<div class="w" style="background:var(--danger-bg);color:var(--danger-t)">🔴 تعطیل: ${E(dy.holiday)}${MGR&&cust?` <button class="d" onclick="KU.delHol('${E(os(cust,'id'))}')">حذف</button>`:''}</div>`;
if(MGR&&hid&&bi)h+=`<div class="w">تعطیلی رسمی «${E(bi)}» برای این روز حذف شده است. <button onclick="KU.delHol('${E(os(hid,'id'))}')">↩️ بازگرداندن</button></div>`;
h+=`<div class="tb"><div style="flex:1 0 100%"><label>کلاس${clsSel(KC,'KC=this.value;draw()')}</label></div></div>`;
if(!dy.items.length)h+='<div class="m">جلسه یا رویدادی در این روز نیست.</div>';
dy.items.forEach((it,i)=>{const les=it.kind=='session'||it.kind=='makeup',nt=les?Cal.note(ev,it.cls,ds):'';h+=`<div class="card" style="cursor:pointer${it.kind=='cancelled'?';opacity:.65':''}" onclick="KU.it(${i})">${E(Cal.line(it))}${les?`<div class="m">${nt?'📖 '+E(nt):'✏️ برنامه درسی را بنویسید'}</div>`:''}</div>`});
if(MGR)Fin.dueLines(FN,e).forEach(l=>{h+=`<div class="card">${E(l)}</div>`});
if(MGR)h+=`<div class="tb"><button class="p" onclick="KU.add('${ds}')">➕ رویداد</button><button onclick="KU.off()">⛔ لغو جلسه کلاس</button><button onclick="KU.hol()">🔴 تعطیل کردن این روز</button>${!cust&&!hid&&bi?'<button onclick="KU.hideHol()">🚫 حذف تعطیلی رسمی</button>':''}</div>`;
return h+`<div class="tb">${xbtn('kd',()=>Cal.dayText(C(),EVS(),e,KC),'calendar-'+ds.replace(/\//g,'-'))}</div>`}
function kSess(){const c=KS?C().find(x=>x.name==KS):null;let h=mBack('KS=null;draw()','تقویم')+`<label>کلاس<select onchange="KS=this.value;draw()"><option value="">— انتخاب کنید —</option>${C().slice().sort(cmpC).map(x=>`<option ${x.name==KS?'selected':''} value="${E(x.name)}">${E(x.name)}</option>`).join('')}</select></label>`;
if(!c)return h+(C().length?'':'<div class="m">هنوز کلاسی ثبت نشده است.</div>');
const ev0=EVS(),RG=Cal.termRanges(c);let tot=0,body='';RG.forEach(r=>{const L=Cal.sessions(c,ev0,r.s,r.en);tot+=L.length;body+='<h3>ترم '+r.n+' — '+E(Cal.fmt(r.s))+' تا '+E(Cal.fmt(r.en))+' • '+L.length+' جلسه'+(r.n==tmOf(c)?' (ترم فعلی)':'')+'</h3>'+L.map(([e,n])=>{const nt=Cal.note(EVS(),c.name,Cal.fmt(e));return`<div class="card" style="cursor:pointer" onclick="KU.ls('${E(c.name).replace(/'/g,"\\'")}',${e})"><b>جلسه ${n}</b> — ${E(Cal.dayHeader(e))}<div class="m">${nt?'📖 '+E(nt):'برنامه درسی ثبت نشده'}</div></div>`}).join('')});

h+=`<div class="m">روزها و ساعت: ${E(Cal.scheduleText(c))} • ${tot} جلسه در ${RG.length} ترم</div><div class="tb">${xbtn('ks',()=>Cal.classSessionsText(c,EVS()),'sessions-'+c.name.replace(/\s+/g,'_'))}</div>`;

return h+body}
function lesDlg(cls,date){const l=Cal.lesson(EVS(),cls,date);modal('برنامه درسی — '+E(cls)+' — '+date,f('note','برنامه درسی این جلسه (خالی = پاک شود)',l?os(l,'note'):'',6),m=>{setLesson(cls,date,m.querySelector('[name=note]').value);draw()})}
function evDlg(ev,ds,cls){const o=ev||{},cs=[['','همه کلاس‌ها'],...C().slice().sort(cmpC).map(c=>[c.name,c.name])];if(o.cls&&!cs.some(x=>x[0]==o.cls))cs.push([o.cls,o.cls]);
const m=modal(ev?'ویرایش رویداد':'رویداد جدید',sl('type','نوع',Cal.ADD_TYPES.map(t=>[t,Cal.typeIcon(t)+' '+Cal.typeLabel(t)]),o.type||Cal.EXAM)+f('title','عنوان',o.title||'')+sl('cls','کلاس (برای تعطیلی همه کلاس‌ها)',cs,o.cls??cls??'')+f('time','ساعت (اختیاری)',o.time||'')+f('date','تاریخ (مثلاً 1405/07/13)',o.date||ds)+f('note','توضیح',o.note||'',3),m=>{const v=g(m),d=okD(v.date);if(!d)return toast('تاریخ معتبر نیست (مثلاً 1405/07/13)'),false;
if(v.type==Cal.MAKEUP&&!v.cls)return toast('برای جلسه جبرانی یک کلاس انتخاب کنید'),false;if([Cal.EXAM,Cal.EVENT,Cal.HOLIDAY].includes(v.type)&&!v.title)return toast('عنوان را بنویسید'),false;
const r={...o,type:v.type,title:v.title,cls:v.type==Cal.HOLIDAY?'':v.cls,time:v.time,date:d,note:m.querySelector('[name=note]').value.trim()};putEvent(r);if(ev)toast('ذخیره شد');draw()});
if(ev){m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="d" id="dx">حذف</button>');m.querySelector('#dx').onclick=()=>{m.remove();ask('این رویداد حذف شود؟',()=>{removeEvent(ev.id);draw()},'حذف')}}}
const KU={
mv(d){const k=kNow();let y=k[0],m=k[1]+d;if(m>12){m=1;y++}if(m<1){m=12;y--}KM=[y,m];draw()},
now(){KM=null;draw()},
open(e){KD=e;draw()},back(){KD=null;draw()},
step(d){KD+=d;const j=Cal.jal(KD);KM=[j[0],j[1]];draw()},
add(ds){evDlg(null,ds||(KD!=null?Cal.fmt(KD):Cal.fmtJ(...(()=>{const k=kNow();return[k[0],k[1],1]})())),KC)},
ls(cls,e){lesDlg(cls,Cal.fmt(e))},
it(i){const it=KI[i];if(!it)return;if(it.kind=='session'||it.kind=='makeup'){if(it.kind=='makeup'&&MGR&&it.ev){const m=modal('جلسه جبرانی — '+E(it.cls),'<div class="m">می‌توانید برنامه درسی را بنویسید یا جلسه جبرانی را ویرایش کنید.</div>');m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="a1">📖 برنامه درسی</button><button id="a2">ویرایش</button>');m.querySelector('#a1').onclick=()=>{m.remove();lesDlg(it.cls,Cal.fmt(KD))};m.querySelector('#a2').onclick=()=>{m.remove();evDlg(it.ev)};return}return lesDlg(it.cls,Cal.fmt(KD))}
if(it.kind=='cancelled'){if(!MGR)return modal('جلسه برگزار نمی‌شود',E(Cal.line(it)));const m=modal('جلسه لغو شده',E(Cal.line(it)));
if(it.ev){const hol=os(it.ev,'type')==Cal.HOLIDAY;m.querySelector('.bt').insertAdjacentHTML('afterbegin',`<button id="a1">${hol?'حذف این تعطیلی (همه کلاس‌ها)':'↩️ بازگرداندن جلسه'}</button>`);m.querySelector('#a1').onclick=()=>{m.remove();removeEvent(it.ev.id);draw()}}
else{m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="a1">🚫 حذف تعطیلی رسمی این روز</button>');m.querySelector('#a1').onclick=()=>{m.remove();KU.hideHol()}}return}
if(MGR&&it.ev)return evDlg(it.ev);modal(Cal.typeLabel(it.type),E(Cal.line(it)))},
off(){const cs=[['','همه کلاس‌ها'],...C().filter(c=>Cal.classDay(c,KD)).map(c=>[c.name,c.name])];modal('لغو جلسه',sl('cls','کلاس',cs,'')+f('title','دلیل (اختیاری)',''),m=>{const v=g(m);putEvent({type:Cal.OFF,date:Cal.fmt(KD),cls:v.cls,title:v.title});draw()})},
hol(){modal('تعطیل کردن این روز',f('title','عنوان تعطیلی','تعطیل'),m=>{const v=g(m);putEvent({type:Cal.HOLIDAY,date:Cal.fmt(KD),title:v.title||'تعطیل'});draw()})},
hideHol(){putEvent({type:Cal.HIDE,date:Cal.fmt(KD)});draw()},
delHol(id){removeEvent(id);draw()}};
// ---- finance ----
let MS='h',MSV=null,MM=null,MC='',FQ='',FP='all';
const mNow=()=>{if(!MM){const j=Cal.jal(today());MM=[j[0],j[1]]}return MM};
const stLabel=a=>E(Fin.name(a.student))+(a.cls?` <span class="m">• ${E(a.cls)}</span>`:'');
// ---- prepared parent messages: "title|text" with {نام} {کلاس} {مانده} ----
const DEF_MSG=[
 'یادآوری شهریه|سلام {نام} عزیز،\nماندهٔ شهریهٔ شما {مانده} تومان است. لطفاً در اولین فرصت اقدام فرمایید.\nبا تشکر',
 'تشکر از پرداخت|سلام {نام} عزیز،\nپرداخت شما دریافت شد. با تشکر از همراهی شما.',
 'اطلاع حضور|سلام {نام} عزیز،\nدر جلسهٔ اخیر کلاس {کلاس} غیبت ثبت شده است. لطفاً در صورت امکان هماهنگ کنید.'
];
const MSG=()=>{const l=SS().msgs;return Array.isArray(l)&&l.length?l:DEF_MSG};
const msgFill=(t,s,a)=>t.replace(/\{نام\}/g,Fin.name(s)).replace(/\{کلاس\}/g,a.cls||'—').replace(/\{تاریخ\}/g,a.date||todayJ()).replace(/\{مانده\}/g,MGR?Fin.toman(Math.max(0,a.balance)):'—');
function msgPick(code){const s=Fin.stOf(code);if(!s)return;const a=Fin.acc(FN,s),L=MSG();
 const m=modal('پیام به والدین',`<div class="m">یک پیام را انتخاب کنید؛ نام، کلاس و ماندهٔ همین زبان‌آموز جای‌گذاری می‌شود.</div>`+L.map((x,i)=>`<button class="p" style="display:block;width:100%;margin:6px 0;text-align:right" data-i="${i}">${E(x.split('|')[0]||'پیام')}</button>`).join(''),null);
 m.querySelectorAll('[data-i]').forEach(b=>{b.onclick=()=>{m.remove();msgSend(code,+b.dataset.i)}})}
function msgSend(code,i){const s=Fin.stOf(code);if(!s)return;const a=Fin.acc(FN,s),raw=MSG()[i]||'';const t=raw.slice(raw.indexOf('|')+1);if(!t.trim())return toast('متن پیام خالی است');parentSend(code,msgFill(t,s,a))}
function msgEdit(){modal('پیام‌های آماده',`<div class="m">هر پیام در یک خط به شکل «عنوان|متن». جای‌نگهدارها: {نام} {کلاس} {مانده} {تاریخ}</div><textarea name="t" rows="10">${E(MSG().join('\n'))}</textarea>`,m=>{const L=uniq(m.querySelector('[name=t]').value.split(/\r?\n/)).filter(x=>x.includes('|'));if(!L.length)return toast('حداقل یک پیام با قالب «عنوان|متن» بنویسید'),false;SS().msgs=L;save();toast('ذخیره شد')})}
function vM(){if(!MGR)return'<div class="w">بخش مالی فقط در «حالت مدیر» در دسترس است (تنظیمات).</div>';const back=MS!='h'?mBack("FU.go('h')",'مالی'):'';
switch(MS){case'd':return back+mDebt();case'a':return back+mAccs();case'u':return back+mAcc();case'f':return back+mFees();case't':return back+mTeach();case'l':return back+mLed();case'n':return back+mMon();case'b':return back+mBk();default:return mHome()}}
function mHome(){const j=Cal.jal(today()),m=Fin.month(FN,j[0],j[1]),db=Fin.debtors(FN,''),tot=db.reduce((x,a)=>x+a.balance,0),B=(s,l)=>`<button onclick="FU.go('${s}')">${l}</button>`;
return`<div class="card"><b>📊 ${MONTHS[j[1]-1]} ${j[0]}</b><div>درآمد شهریه: ${Fin.toman(m[0])}</div><div>درآمد دیگر: ${Fin.toman(m[1])}</div><div>هزینه‌ها: ${Fin.toman(m[2])}</div><div>حقوق معلم‌ها: ${Fin.toman(m[3])}</div><div><b>${m[4]>=0?'سود خالص':'زیان'}: ${Fin.toman(Math.abs(m[4]))}</b></div></div><div class="card"><b>⏳ مجموع بدهی زبان‌آموزان: ${Fin.toman(tot)}</b><div class="m">${db.length} بدهکار</div></div>
<div class="tb"><button class="p" onclick="FU.pay(null)">💳 ثبت پرداخت</button>${B('a','👥 حساب زبان‌آموزان')}${B('d','⏳ بدهکاران')}${B('f','🏷 شهریه کلاس‌ها')}${B('t','👩‍🏫 حقوق معلم‌ها')}${B('l','🧾 درآمد و هزینه‌ها')}${B('n','📈 گزارش ماهانه')}${B('b','💾 پشتیبان مالی')}</div><div class="m">مبالغ به تومان است. اطلاعات مالی فقط روی همین دستگاه می‌ماند و در پشتیبان معمولی نیست؛ برای آن «پشتیبان مالی» جدا بگیرید.</div>`}
function mDebt(){const l=Fin.debtors(FN,MC);return`<label>کلاس${clsSel(MC,'MC=this.value;draw()')}</label><div class="tb">${xbtn('fd',()=>Fin.debtorsText(FN,MC),'debtors')}</div>`+(l.length?l.map(a=>`<div class="card r"><div>${stLabel(a)}<div class="m">${Fin.toman(a.balance)}</div></div><div><button onclick="FU.acc('${E(a.code)}')">حساب</button> <button onclick="FU.rem('${E(a.code)}')">📨 یادآوری</button></div></div>`).join(''):'<div class="m">بدهکاری وجود ندارد.</div>')}
function mAccList(){const q=norm(FQ);return A().map(s=>[s,Fin.acc(FN,s)]).filter(([s])=>norm(s.first+' '+s.last).includes(q)).map(([s,a])=>`<div class="card r" style="cursor:pointer" onclick="FU.acc('${E(a.code)}')"><div>${stLabel(a)}</div><div style="color:${a.balance>0?'var(--danger)':'inherit'}">${a.balance>0?'بدهی ':a.balance<0?'بستانکار ':''}${Fin.fmt(Math.abs(a.balance))}</div></div>`).join('')||'<div class="m">زبان‌آموزی نیست.</div>'}
function mAccs(){return`<input placeholder="🔎 جستجو" value="${E(FQ)}" oninput="FQ=this.value;$('#al').innerHTML=mAccList()"><div id="al">${mAccList()}</div>`}
function mAcc(){const s=Fin.stOf(MSV);if(!s){MS='a';return mAccs()}const a=Fin.acc(FN,s),ins=Fin.installments(FN,a.code,a.paid,today()),pays=Fin.recsOf(FN,'payments',a.code);Fin.sortByDate(pays);
const ln=(l,v,c)=>`<div class="r"><span>${l}</span><b${c?` style="color:${c}"`:''}>${v}</b></div>`;
return`<div class="card"><b>${stLabel(a)}</b>${a.mode=='session'?ln('شهریه هر جلسه',Fin.toman(a.unit)+' × '+a.sessions+' جلسه',''):''}${ln('شهریه',Fin.toman(a.base))}${a.discount>0?ln('تخفیف',Fin.toman(a.discount)):''}${ln('مبلغ قابل پرداخت',Fin.toman(a.charge))}${ln('پرداخت شده',Fin.toman(a.paid))}${ln(a.balance>=0?'مانده بدهی':'بستانکار',Fin.toman(Math.abs(a.balance)),a.balance>0?'var(--danger)':'')}${a.cls?'':'<div class="m">این زبان‌آموز در هیچ کلاسی نیست؛ شهریهٔ شخصی را تعیین کنید.</div>'}</div>
<div class="tb"><button class="p" onclick="FU.pay('${E(a.code)}')">💳 ثبت پرداخت</button><button onclick="FU.fee('${E(a.code)}')">✏️ شهریه شخصی و تخفیف</button><button onclick="FU.inst('${E(a.code)}')">➕ افزودن قسط</button><button onclick="FU.rem('${E(a.code)}')">📨 یادآوری</button><button onclick="msgPick('${E(a.code)}')">💬 پیام آماده</button></div><div class="tb">${xbtn('fs',()=>Fin.studentText(FN,s),'statement-'+a.code)}</div>`
+`<b>پرداخت‌ها</b>`+(pays.length?pays.map(p=>`<div class="card r" style="cursor:pointer" onclick="FU.rc('${E(os(p,'id'))}')"><div>${E(os(p,'date'))} — ${Fin.toman(ol(p,'amount'))}<div class="m">${Fin.methodLabel(os(p,'method'))}${os(p,'note')?' • '+E(os(p,'note')):''}</div></div><span>🧾</span></div>`).join(''):'<div class="m">پرداختی ثبت نشده است.</div>')
+`<b>اقساط</b>`+(ins.length?ins.map(i=>`<div class="card r" style="cursor:pointer" onclick="FU.ic('${E(os(i.rec,'id'))}')"><div>${E(os(i.rec,'date'))} — ${Fin.toman(i.amount)}</div><b style="color:${i.status=='overdue'?'var(--danger)':i.status=='paid'?'var(--ok)':'inherit'}">${Fin.statusLabel(i.status)}</b></div>`).join(''):'<div class="m">قسطی تعریف نشده است.</div>')}
function mFees(){return`<div class="m">شهریهٔ هر کلاس برای کل ترم (یا برای کلاس خصوصی، به‌ازای هر جلسه) تعیین می‌شود. هر زبان‌آموز می‌تواند شهریهٔ شخصی یا تخفیف داشته باشد.</div>`+(C().slice().sort(cmpC).map(c=>{const r=Fin.feeRule(FN,c.name);return`<div class="card r" style="cursor:pointer" onclick="FU.cf('${E(c.name).replace(/'/g,"\\'")}')"><div>${E(c.name)}<div class="m">${r?(os(r,'mode')=='session'?'هر جلسه ':'کل ترم ')+Fin.toman(ol(r,'fee')):'تعیین نشده'}</div></div><span>✏️</span></div>`}).join('')||'<div class="m">هنوز کلاسی ثبت نشده است.</div>')}
function mTeach(){const[jy,jm]=mNow(),all=FP=='all',from=all?Fin.ALL_FROM:Cal.epoch(jy,jm,1),to=all?Fin.ALL_TO:Cal.epoch(jy,jm,Cal.monthLen(jy,jm)),lab=all?'':MONTHS[jm-1]+' '+jy,sal=Fin.live(FN,'salaries');Fin.sortByDate(sal);
return`<div class="tb"><button class="${all?'p':''}" onclick="FP='all';draw()">کل زمان</button><button class="${all?'':'p'}" onclick="FP='month';draw()">یک ماه</button>${all?'':`<button onclick="FU.mm(-1)">▶</button><b>${lab}</b><button onclick="FU.mm(1)">◀</button>`}</div><div class="tb">${xbtn('ft',()=>Fin.teachersText(FN,from,to,lab),'teachers')}</div>`
+Fin.teachers().map(t=>{const r=Fin.rate(FN,t),n=Fin.tSess(t,from,to),ac=Fin.tAccrued(FN,t,from,to),pd2=Fin.tPaid(FN,t,from,to),q=E(t).replace(/'/g,"\\'");return`<div class="card"><b>${E(t)}</b> <span class="m">${n} جلسه • ${r?(os(r,'mode')=='month'?'ماهانه ':'هر جلسه ')+Fin.fmt(ol(r,'amount')):'نرخ تعیین نشده'}</span><div>محاسبه‌شده: ${Fin.toman(ac)} • پرداخت‌شده: ${Fin.toman(pd2)} • <b>مانده: ${Fin.toman(ac-pd2)}</b></div><div class="tb"><button onclick="FU.rate('${q}')">✏️ نرخ</button><button class="p" onclick="FU.sal('${q}')">💵 ثبت پرداخت</button></div></div>`}).join('')
+`<b>پرداخت‌های ثبت‌شده به معلم‌ها</b>`+(sal.length?sal.slice().reverse().map(x=>`<div class="card r" style="cursor:pointer" onclick="FU.sc('${E(os(x,'id'))}')"><div>${E(os(x,'date'))} — ${E(os(x,'teacher'))}<div class="m">${E(os(x,'note'))}</div></div><b>${Fin.toman(ol(x,'amount'))}</b></div>`).join(''):'<div class="m">پرداختی ثبت نشده است.</div>')}
function mLed(){const l=Fin.live(FN,'ledger');Fin.sortByDate(l);return`<div class="tb"><button class="p" onclick="FU.led(null)">➕ ثبت درآمد / هزینه</button></div>`+(l.length?l.slice().reverse().map(x=>`<div class="card r" style="cursor:pointer" onclick="FU.led('${E(os(x,'id'))}')"><div>${os(x,'kind')=='income'?'🟢':'🔴'} ${E(os(x,'title'))}<div class="m">${E(os(x,'date'))}${os(x,'note')?' • '+E(os(x,'note')):''}</div></div><b>${Fin.toman(ol(x,'amount'))}</b></div>`).join(''):'<div class="m">موردی ثبت نشده است (مثلاً اجاره، کتاب، چاپ...).</div>')}
function mMon(){const[jy,jm]=mNow();return`<div class="r"><button onclick="FU.mm(-1)">▶ قبلی</button><b style="font-size:18px">${MONTHS[jm-1]} ${jy}</b><button onclick="FU.mm(1)">بعدی ◀</button></div><div class="tb">${xbtn('fm',()=>Fin.monthText(FN,jy,jm),'finance-'+jy+'-'+p2(jm))}</div><div class="card"><pre>${E(Fin.monthText(FN,jy,jm))}</pre></div>`}
function mBk(){return`<div class="card"><b>💾 پشتیبان مالی</b><div class="m">اطلاعات مالی (شهریه، پرداخت، قسط، حقوق، هزینه) در پشتیبان معمولی نیست و برای معلم‌ها فرستاده نمی‌شود. این فایل جدا را فقط خودتان نگه دارید. «ادغام» بدون حذف چیزی اطلاعات فایل را اضافه می‌کند؛ نام زبان‌آموزان باید در هر دو دستگاه یکسان باشد.</div><div class="tb"><button class="p" onclick="FU.bk()">دانلود پشتیبان مالی</button><button onclick="FU.bkc()">کپی متن پشتیبان</button>${pickBtn('♻️ بازیابی / ادغام از فایل','.json,application/json','FU.rf')}<button onclick="FU.rp()">بازیابی با چسباندن متن</button></div></div>`}
const stOpts=()=>A().map(s=>[s.code,Fin.name(s)+(clsOf(s.code)>=0?' — '+C()[clsOf(s.code)].name:'')]);
const FU={
go(s){MS=s;MSV=null;draw()},acc(c){MS='u';MSV=c;V='m';draw()},
mm(d){const k=mNow();let y=k[0],m=k[1]+d;if(m>12){m=1;y++}if(m<1){m=12;y--}MM=[y,m];draw()},
rem(c){const s=Fin.stOf(c);if(s)shareRaw(Fin.reminderText(FN,s))},
pay(code,id){const o=id?Fin.find(FN,'payments',id):{};if(!A().length)return toast('ابتدا زبان‌آموز ثبت کنید');const cur=code||(o&&os(o,'code'))||A()[0].code;
const m=modal(id?'ویرایش پرداخت':'ثبت پرداخت',sl('code','زبان‌آموز',stOpts(),cur)+f('date','تاریخ (مثلاً 1405/07/13)',o.date||todayJ())+f('amount','مبلغ (تومان)',o.amount?Fin.fmt(o.amount):'')+sl('method','روش پرداخت',Fin.METHODS.map(x=>[x,Fin.methodLabel(x)]),o.method||'cash')+f('note','توضیح (اختیاری)',o.note||''),m=>{const v=g(m),d=okD(v.date),a=Fin.money(v.amount),s=Fin.stOf(v.code);
if(!s)return toast('زبان‌آموز را انتخاب کنید'),false;if(!d)return toast('تاریخ معتبر نیست'),false;if(a<=0)return toast('مبلغ را درست وارد کنید'),false;
const r=Fin.upsert(FN,'payments',{...o,code:v.code,name:Fin.name(s),date:d,amount:a,method:v.method,note:v.note},'P');saveFin();draw();if(!id)setTimeout(()=>FU.rc(r.id),0)})},
rc(id){const p=Fin.find(FN,'payments',id);if(!p)return;const t=()=>Fin.receiptText(FN,p),m=modal('رسید پرداخت',`<pre>${E(t())}</pre>`);
m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="r1">📨 ارسال</button><button id="r2">🖼 تصویر</button><button id="r3">ویرایش</button><button class="d" id="r4">حذف</button>');
m.querySelector('#r1').onclick=()=>shareRaw(t());m.querySelector('#r2').onclick=()=>shareImg(sch2(t()),'receipt-'+Fin.receiptNo(p),true);m.querySelector('#r3').onclick=()=>{m.remove();FU.pay(null,id)};m.querySelector('#r4').onclick=()=>{m.remove();ask('این پرداخت حذف شود؟',()=>{Fin.del(FN,'payments',id);saveFin();draw()},'حذف')}},
fee(code){const s=Fin.stOf(code);if(!s)return;const a=Fin.account(FN,code)||{},rule=Fin.acc(FN,s);modal('شهریه شخصی و تخفیف — '+E(Fin.name(s)),`<div class="m">شهریه کلاس${rule.cls?' ('+E(rule.cls)+')':''}: ${Fin.toman(rule.mode=='session'?rule.unit:rule.unit)}${rule.mode=='session'?' برای هر جلسه':''}. اگر شهریهٔ شخصی را خالی بگذارید، همین مبلغ حساب می‌شود.</div>`+f('fee','شهریه شخصی (تومان؛ برای کلاس جلسه‌ای = هر جلسه)','fee' in a&&ol(a,'fee',-1)>=0?Fin.fmt(ol(a,'fee')):'')+f('disc','تخفیف (تومان)',ol(a,'discount')?Fin.fmt(ol(a,'discount')):''),m=>{const v=g(m),pf=v.fee==''?-1:Fin.money(v.fee),dc=v.disc==''?0:Fin.money(v.disc);if(v.fee!=''&&pf<0||dc<0)return toast('مبلغ را درست وارد کنید'),false;Fin.setAccount(FN,code,Fin.name(s),pf,dc);saveFin();draw()})},
inst(code){const s=Fin.stOf(code);if(!s)return;const a=Fin.acc(FN,s),left=Math.max(0,a.balance);modal('افزودن قسط — '+E(Fin.name(s)),`<div class="m">مبلغ کل بین اقساط مساوی تقسیم می‌شود (باقی‌مانده به قسط آخر اضافه می‌شود).</div>`+f('total','مبلغ کل اقساط (تومان)',left?Fin.fmt(left):'')+f('n','تعداد قسط','1')+f('date','تاریخ اولین قسط (مثلاً 1405/08/15)',todayJ())+f('gap','فاصلهٔ اقساط (روز)','30'),m=>{const v=g(m),tot=Fin.money(v.total),n=parseInt(dg(v.n),10),gap=parseInt(dg(v.gap),10),d=okD(v.date);
if(tot<=0)return toast('مبلغ را درست وارد کنید'),false;if(!(n>=1&&n<=36))return toast('تعداد قسط باید بین ۱ تا ۳۶ باشد'),false;if(!d)return toast('تاریخ معتبر نیست'),false;if(!(gap>=1&&gap<=366))return toast('فاصلهٔ اقساط معتبر نیست'),false;
const base=Math.floor(tot/n),e0=Cal.parse(d);for(let k=0;k<n;k++)Fin.upsert(FN,'installs',{code,name:Fin.name(s),date:Cal.fmt(e0+k*gap),amount:k==n-1?tot-base*(n-1):base},'I');saveFin();draw()})},
ic(id){const r=Fin.find(FN,'installs',id);if(!r)return;const m=modal('قسط',`${E(os(r,'date'))} — ${Fin.toman(ol(r,'amount'))}`);m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="d" id="i1">حذف قسط</button>');m.querySelector('#i1').onclick=()=>{m.remove();Fin.del(FN,'installs',id);saveFin();draw()}},
cf(cls){const r=Fin.feeRule(FN,cls)||{};modal('شهریه کلاس '+E(cls),sl('mode','نوع',[['term','کل ترم'],['session','هر جلسه (کلاس خصوصی)']],os(r,'mode')||'term')+f('fee','مبلغ (تومان)',r.fee?Fin.fmt(r.fee):''),m=>{const v=g(m),a=v.fee==''?0:Fin.money(v.fee);if(a<0)return toast('مبلغ را درست وارد کنید'),false;Fin.setFee(FN,cls,v.mode,a);saveFin();draw()})},
rate(t){const r=Fin.rate(FN,t)||{};modal('نرخ '+E(t),sl('mode','نوع',[['session','به‌ازای هر جلسه'],['month','مبلغ ثابت ماهانه']],os(r,'mode')||'session')+f('amount','مبلغ (تومان)',r.amount?Fin.fmt(r.amount):''),m=>{const v=g(m),a=v.amount==''?0:Fin.money(v.amount);if(a<0)return toast('مبلغ را درست وارد کنید'),false;Fin.setRate(FN,t,v.mode,a);saveFin();draw()})},
sal(t,id){const o=id?Fin.find(FN,'salaries',id):{};const m=modal(id?'ویرایش پرداخت به معلم':'پرداخت به '+E(t),f('date','تاریخ (مثلاً 1405/07/13)',o.date||todayJ())+f('amount','مبلغ (تومان)',o.amount?Fin.fmt(o.amount):'')+f('note','توضیح (اختیاری)',o.note||''),m=>{const v=g(m),d=okD(v.date),a=Fin.money(v.amount);if(!d)return toast('تاریخ معتبر نیست'),false;if(a<=0)return toast('مبلغ را درست وارد کنید'),false;Fin.upsert(FN,'salaries',{...o,teacher:o.teacher||t,date:d,amount:a,note:v.note},'W');saveFin();draw()})},
sc(id){const o=Fin.find(FN,'salaries',id);if(!o)return;const m=modal('پرداخت به معلم',`${E(os(o,'date'))} — ${E(os(o,'teacher'))} — ${Fin.toman(ol(o,'amount'))}`);m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="s1">ویرایش</button><button class="d" id="s2">حذف</button>');m.querySelector('#s1').onclick=()=>{m.remove();FU.sal(os(o,'teacher'),id)};m.querySelector('#s2').onclick=()=>{m.remove();Fin.del(FN,'salaries',id);saveFin();draw()}},
led(id){const o=id?Fin.find(FN,'ledger',id):{};const m=modal(id?'ویرایش':'درآمد / هزینه',sl('kind','نوع',[['expense','هزینه'],['income','درآمد']],o.kind||'expense')+f('date','تاریخ (مثلاً 1405/07/13)',o.date||todayJ())+f('title','عنوان (مثلاً اجاره)',o.title||'')+f('amount','مبلغ (تومان)',o.amount?Fin.fmt(o.amount):'')+f('note','توضیح (اختیاری)',o.note||''),m=>{const v=g(m),d=okD(v.date),a=Fin.money(v.amount);if(!d)return toast('تاریخ معتبر نیست'),false;if(!v.title)return toast('عنوان را بنویسید'),false;if(a<=0)return toast('مبلغ را درست وارد کنید'),false;Fin.upsert(FN,'ledger',{...o,kind:v.kind,date:d,title:v.title,amount:a,note:v.note},'L');saveFin();draw()});
if(id){m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="d" id="l1">حذف</button>');m.querySelector('#l1').onclick=()=>{m.remove();ask('حذف شود؟',()=>{Fin.del(FN,'ledger',id);saveFin();draw()},'حذف')}}},
async bk(){const j=Fin.exportJ(FN),n='class-fin-backup-'+new Date().toISOString().slice(0,10)+'.json';let dl=null;if(typeof claude!=='undefined'){try{dl=await claude.use('downloads')}catch(e){}}if(dl){try{await dl.save({filename:n,data:j});return}catch(e){if(e&&e.code=='declined')return}}else if(await saveFile(n,j,'application/json')){toast('پشتیبان مالی آماده شد؛ آن را جای امن نگه دارید');return}modal('پشتیبان مالی (کپی کنید)',`<textarea rows="10" readonly onfocus="this.select()">${E(j)}</textarea>`)},
async bkc(){const j=Fin.exportJ(FN);try{await navigator.clipboard.writeText(j);toast('متن پشتیبان مالی کپی شد')}catch(e){modal('پشتیبان مالی (کپی کنید)',`<textarea rows="10" readonly onfocus="this.select()">${E(j)}</textarea>`)}},
async rf(file){if(file)FU.restore(await file.text())},
rp(){modal('بازیابی پشتیبان مالی',`<textarea name="t" rows="10" placeholder="متن فایل پشتیبان مالی را اینجا بچسبانید"></textarea>`,m=>{FU.restore(m.querySelector('[name=t]').value)},'ادامه')},
restore(t){let r;try{r=JSON.parse(t)}catch(e){return toast('فایل پشتیبان معتبر نیست')}const er=Fin.validate(r);if(er)return toast(er);
const m=modal('بازیابی اطلاعات مالی','<b>ادغام:</b> اطلاعات فایل بدون حذف چیزی به داده‌های فعلی اضافه می‌شود.<br><br><b>جایگزینی:</b> اطلاعات مالی فعلی کاملاً با فایل عوض می‌شود.',()=>{const x=Fin.merge(FN,r);saveFin();draw();modal('نتیجه ادغام',Fin.summary(x))},'ادغام');
m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="d" id="rr">جایگزینی</button>');m.querySelector('#rr').onclick=()=>{m.remove();ask('اطلاعات مالی فعلی حذف و با فایل عوض می‌شود. ادامه؟',()=>{FN=Fin.replace(r);saveFin();toast('بازیابی انجام شد');draw()},'جایگزین')}},
tg(){if(MGR){setMgr(false);if(V=='m')V='k';draw();return}if(!Pw.has()){setMgr(true);draw();return}FU.pwEnter()},
pwEnter(){const m=modal('ورود به حالت مدیر','<label>رمز ۴ رقمی<input name="pw" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>',m=>{if(!Pw.check(m.querySelector('[name=pw]').value))return toast('رمز درست نیست'),false;setMgr(true);draw()},'ورود');m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button id="hn">یادآوری رمز</button>');m.querySelector('#hn').onclick=()=>{const h=Pw.hint();toast(h?'یادآوری: '+h:'یادآوری‌ای ثبت نشده است')}},
pwSet(){const ch=Pw.has();modal(ch?'تغییر رمز حالت مدیر':'ساخت رمز ۴ رقمی',(ch?'<label>رمز فعلی<input name="cur" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>':'')+'<label>رمز جدید (۴ رقم)<input name="p1" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>تکرار رمز جدید<input name="p2" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>پیام یادآوری (اختیاری؛ خودتان برای خودتان بنویسید)<input name="hint" value="'+E(Pw.hint())+'"></label>',m=>{const q=n=>m.querySelector('[name='+n+']').value;if(ch&&!Pw.check(q('cur')))return toast('رمز فعلی درست نیست'),false;const p=Pw.pin(q('p1'));if(p==null)return toast('رمز باید دقیقاً ۴ رقم باشد'),false;if(p!==Pw.pin(q('p2')))return toast('تکرار رمز یکسان نیست'),false;const h=q('hint').trim();if(h.indexOf(p)>=0)return toast('پیام یادآوری نباید خود رمز را داشته باشد'),false;if(!Pw.set(p,h))return toast('ذخیره نشد'),false;toast('رمز ذخیره شد')&&0;draw()})}};
// ==== END CALENDAR / FINANCE UI ====
// ---- settings / backup ----
function vG(){const tl=[...new Set([...TCH(),...C().map(c=>c.teacher||'').filter(Boolean),...(ME?[ME]:[])])];return`<div class="card"><b>🧑‍🏫 نقش این دستگاه</b><div class="m">اگر نام یک معلم را انتخاب کنید و «حالت مدیر» خاموش باشد، فقط کلاس‌های همان معلم (و زبان‌آموزان و گزارش‌هایشان) نمایش داده می‌شود؛ با روشن کردن حالت مدیر همه چیز دیده می‌شود. کلاس‌ها را در فرم کلاس به معلم‌شان نسبت دهید. توجه: این فقط محدودیت نمایش است و فایل پشتیبان همهٔ اطلاعات را دارد.</div><label>این دستگاه برای<select onchange="setMe(this.value);_vis=null;draw()"><option value="">مدیر / همه</option>${tl.map(x=>`<option ${x==ME?'selected':''} value="${E(x)}">${E(x)}</option>`).join('')}</select></label></div>`+`<div class="card"><b>👩‍🏫 معلم‌ها و توضیحات آماده</b><div class="tb"><button onclick="lEd('t')">معلم‌ها</button><button onclick="lEd('o')">توضیحات آماده وضعیت بچه‌ها</button><button onclick="msgEdit()">💬 پیام‌های آماده</button></div></div><div class="card"><b>🕘 نسخه‌های خودکار</b><div class="m">برنامه روزی یک‌بار و پیش از هر بازیابی، خودش یک نسخهٔ کامل می‌سازد و ۷ نسخهٔ آخر را نگه می‌دارد. این نسخه‌ها روی همین دستگاه‌اند؛ برای نگهداری بیرونی از «دانلود فایل پشتیبان» استفاده کنید.</div><div class="tb"><button onclick="bkList()">مشاهده و بازیابی</button></div></div><div class="card"><b>💾 پشتیبان‌گیری و تبادل</b><div class="m">داده‌ها فقط روی همین دستگاه ذخیره می‌شوند. پاک کردن اطلاعات مرورگر یا حذف برنامه آن‌ها را از بین می‌برد؛ پس مرتب پشتیبان بگیرید. «ادغام» پشتیبان معلم‌ها را بدون حذف چیزی به داده‌های فعلی اضافه می‌کند. پشتیبان‌ها بین Android و آیفون قابل تبادل‌اند.</div><div class="tb"><button class="p" onclick="bk()">دانلود فایل پشتیبان</button><button onclick="bkCopy()">کپی متن پشتیبان</button>${pickBtn('♻️ بازیابی / ادغام از فایل','.json,application/json','rb')}<button onclick="rp()">بازیابی / ادغام با چسباندن متن</button></div></div><div class="card"><b>👔 حالت مدیر</b><div class="m">با رمز ۴ رقمی (اختیاری) روشن می‌شود و تا وقتی خودتان خاموش نکنید روشن می‌ماند؛ خاموش کردن رمز نمی‌خواهد. فقط مدیر باید آن را روشن کند: در حالت مدیر می‌توان رویداد، آزمون، تعطیلی و لغو جلسه را در تقویم اضافه کرد و بخش «💰 مالی» دیده می‌شود. برنامه درسی جلسه‌ها را معلم هم می‌تواند بنویسد. این انتخاب فقط روی همین دستگاه می‌ماند و در پشتیبان نیست.</div><div class="tb"><button class="${MGR?'p':''}" onclick="FU.tg()">${MGR?'✅ حالت مدیر روشن است (برای خاموش کردن بزنید)':'⬜ حالت مدیر خاموش است (برای روشن کردن بزنید)'}</button><button onclick="FU.pwSet()">${Pw.has()?'🔑 تغییر رمز حالت مدیر…':'🔑 ساخت رمز ۴ رقمی برای حالت مدیر'}</button></div></div><div class="card r"><span>نمایش ارقام فارسی (۱۲۳)</span><button class="${SS().fa?'p':''}" onclick="faToggle()">${SS().fa?'روشن':'خاموش'}</button></div><div class="card m">نسخه وب 1.31</div>`}
function lEd(k){const t=k=='t',cur=t?TCH():OPT();modal(t?'معلم‌ها':'توضیحات آماده',`<div class="m">${t?'نام هر معلم در یک خط':'هر توضیح در یک خط (حداکثر ۸ مورد)'}</div><textarea name="t" rows="9">${E(cur.join('\n'))}</textarea>`,m=>{const L=uniq(m.querySelector('[name=t]').value.split(/\r?\n/));if(!t&&L.length>8)return toast('حداکثر ۸ مورد مجاز است'),false;SS()[t?'teachers':'options']=L;save();toast('ذخیره شد')})}
const bj=()=>JSON.stringify({app:'class',version:9,exportedAt:Date.now(),students:D.students,classes:D.classes,reports:D.reports,notes:D.notes,settings:D.settings||{},events:EVS(),grades:GRD(),finals:FINS(),terms:TRM(),archivedStudents:D.archivedStudents||[],studentHistory:D.studentHistory||[]},null,2);
// ---- automatic snapshots: IndexedDB (localStorage's ~5 MB is not enough to keep history) ----
const AutoBk=(()=>{
 const DB='class_auto_bk',ST='snaps',MAX=7;let dbp=null,seq=0;
 const nid=()=>Date.now()*1000+(seq++%1000); // unique even for several snapshots in the same millisecond
 const open=()=>dbp||(dbp=new Promise((res,rej)=>{try{if(!window.indexedDB)return rej(new Error('no-idb'));const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(ST))d.createObjectStore(ST,{keyPath:'id'})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error||new Error('idb'))}catch(e){rej(e)}}));
 const st=m=>open().then(d=>d.transaction(ST,m).objectStore(ST));
 const req=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
 const all=async()=>{const s=await st('readonly');const l=(await req(s.getAll()))||[];return l.sort((a,b)=>b.at-a.at||b.id-a.id)};
 return{
  // bj() is evaluated before the first await, so a "before-restore" copy always holds the old state
  async take(reason){const json=bj();try{const s=await st('readwrite');await req(s.put({id:nid(),at:Date.now(),reason,json}));const l=await all();for(const x of l.slice(MAX))await req((await st('readwrite')).delete(x.id));return true}catch(e){return false}},
  async list(){try{return(await all()).slice(0,MAX)}catch(e){return[]}},
  async get(id){try{const s=await st('readonly');return await req(s.get(id))}catch(e){return null}},
  async daily(){try{const l=await this.list();if(l.length){const d=new Date(l[0].at),t=new Date();if(d.getFullYear()==t.getFullYear()&&d.getMonth()==t.getMonth()&&d.getDate()==t.getDate())return false}}catch(e){}return this.take('daily')}
 };
})();
const snapLabel=s=>{const d=new Date(s.at);return Cal.fmt(ep(d.getFullYear(),d.getMonth()+1,d.getDate()))+' — '+p2(d.getHours())+':'+p2(d.getMinutes())+(s.reason=='before-restore'?' — قبل از بازیابی':'')};
async function bkList(){const l=await AutoBk.list();const rows=l.length?l.map(s=>`<div class="card r"><div>${E(snapLabel(s))}<div class="m">${Math.max(1,Math.round(s.json.length/1024))}KB</div></div><button onclick="bkRestore(${s.id})">بازیابی</button></div>`).join(''):'<div class="m">هنوز نسخه‌ای ساخته نشده است.</div>';modal('نسخه‌های خودکار',rows)}
async function bkRestore(id){const s=await AutoBk.get(id);if(!s)return toast('نسخه پیدا نشد');await AutoBk.take('before-restore');restore(s.json)}
setTimeout(()=>{AutoBk.daily()},1500);
async function bk(){const j=bj(),n='class-backup-'+new Date().toISOString().slice(0,10)+'.json';let dl=null;if(typeof claude!=='undefined'){try{dl=await claude.use('downloads')}catch(e){}}if(dl){try{await dl.save({filename:n,data:j});markExport();return}catch(e){if(e&&e.code=='declined')return}}else if(await saveFile(n,j,'application/json')){markExport();toast('فایل پشتیبان آماده شد؛ آن را در Files یا جای امن ذخیره کنید');return}modal('پشتیبان (کپی کنید)',`<textarea rows="10" readonly onfocus="this.select()">${E(j)}</textarea>`)}
async function bkCopy(){const j=bj();try{await navigator.clipboard.writeText(j);markExport();toast('متن پشتیبان کپی شد؛ در Notes یا پیام‌رسان بچسبانید')}catch(e){modal('پشتیبان (کپی کنید)',`<textarea rows="10" readonly onfocus="this.select()">${E(j)}</textarea>`)}}
function restore(t){let r;try{r=JSON.parse(t)}catch(e){return toast('فایل پشتیبان معتبر نیست')}
 if(!r||typeof r!=='object')return toast('فایل پشتیبان معتبر نیست');
 if(r.app&&r.app!=='class')return toast('این فایل، پشتیبان این برنامه نیست');
 if(+r.version>9)return toast('این پشتیبان با نسخهٔ جدیدتری از برنامه ساخته شده است');
 if(!Array.isArray(r.students)||!Array.isArray(r.classes)||!Array.isArray(r.reports))return toast('فایل پشتیبان معتبر نیست');
const m=modal('بازیابی اطلاعات','<b>ادغام:</b> اطلاعات فایل به داده‌های فعلی اضافه می‌شود و چیزی حذف یا عوض نمی‌شود (مناسب جمع‌بندی گزارش معلم‌ها).<br><br><b>جایگزینی:</b> اطلاعات فعلی کاملاً با فایل عوض می‌شود.',()=>{AutoBk.take('before-restore');const x=mergeIn(r);draw();modal('نتیجه ادغام',mergeMsg(x))},'ادغام');
m.querySelector('.bt').insertAdjacentHTML('afterbegin','<button class="d" id="rr">جایگزینی</button>');m.querySelector('#rr').onclick=()=>{m.remove();ask('اطلاعات فعلی حذف و با فایل عوض می‌شود. ادامه؟',()=>{AutoBk.take('before-restore');const o=a=>(Array.isArray(a)?a:[]).filter(x=>x&&typeof x=='object');D={students:o(r.students),classes:o(r.classes).map(c=>({...c,students:Array.isArray(c.students)?c.students.map(String):[]})),reports:o(r.reports),notes:r.notes&&typeof r.notes=='object'?r.notes:{},settings:r.settings&&typeof r.settings=='object'?r.settings:(D.settings||{}),events:Array.isArray(r.events)?o(r.events):EVS(),grades:Array.isArray(r.grades)?o(r.grades):[],finals:Array.isArray(r.finals)?o(r.finals):[],terms:Array.isArray(r.terms)?o(r.terms):[],archivedStudents:Array.isArray(r.archivedStudents)?o(r.archivedStudents):[],studentHistory:Array.isArray(r.studentHistory)?o(r.studentHistory):[]};D.reports.forEach(rep=>{const F=OBJ(rep.form)?rep.form:null;if(!F)return;const codes=new Set([...(Array.isArray(F.absent)?F.absent:[]),...(Array.isArray(F.late)?F.late:[]),...Object.keys(OBJ(F.marks)?F.marks:{})].map(String));const ss=OBJ(F.studentSnapshots)?F.studentSnapshots:{};codes.forEach(code=>{let st=D.students.find(x=>String(x.code)==code)||D.archivedStudents.find(x=>String(x.code)==code);if(!st){st={code,first:'',last:'',archivedAt:Date.now(),archivedDate:rep.date||'',archiveReason:'ارجاع تاریخی در پشتیبان؛ مشخصات زبان‌آموز در فایل موجود نبود',unresolved:true};if(!D.archivedStudents.some(x=>String(x.code)==code))D.archivedStudents.push(st)}if(!ss[code]||typeof ss[code]!=='object')ss[code]={code,first:st.first||'',last:st.last||''}});F.studentSnapshots=ss});Cal.touch();fix();save();toast('بازیابی انجام شد');draw()},'جایگزین')}}
const rb=async f=>{if(f)restore(await f.text())},rp=()=>modal('بازیابی',`<textarea name="t" rows="10" placeholder="متن فایل پشتیبان را اینجا بچسبانید"></textarea>`,m=>{restore(m.querySelector('[name=t]').value)},'ادامه');
LAST=snap();draw();undoUI();faApply();
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
if('serviceWorker' in navigator&&location.protocol!='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
(function(){try{const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),sa=navigator.standalone||matchMedia('(display-mode: standalone)').matches;let dis=null;try{dis=localStorage.getItem('class_hint')}catch(e){}
if(ios&&!sa&&!dis){const d=document.createElement('div');d.className='w';d.style.cssText='margin:8px 12px;display:flex;gap:8px;justify-content:space-between;align-items:center';d.innerHTML='<span>📲 برای نصب: دکمه اشتراک‌گذاری (مربع با فلش) را بزنید و «Add to Home Screen» را انتخاب کنید. <b>اول نصب کنید، بعد اطلاعات را وارد کنید</b>؛ داده‌های Safari و برنامه نصب‌شده جدا هستند.</span>';const b=document.createElement('button');b.textContent='باشه';b.style.padding='4px 10px';b.onclick=()=>{try{localStorage.setItem('class_hint','1')}catch(e){}d.remove()};d.appendChild(b);document.querySelector('header').after(d)}}catch(e){}})();
