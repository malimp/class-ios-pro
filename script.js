

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
const PGN={t:'امروز',s:'زبان‌آموزان',c:'کلاس‌ها',r:'گزارش روزانه',p:'گزارش‌های دوره‌ای',k:'تقویم',h:'حضور و غیاب',a:'کارنامه و نمره‌ها',q:'جستجو',m:'مالی',g:'تنظیمات','?':'راهنما',f:'گزارش جدید',sp:'پروفایل زبان‌آموز',ac:'کارنامه‌های خودکار'};
function goTab(k){document.querySelectorAll('.ov').forEach(x=>x.remove());V=k;CI=-1;CPV=-1;SV=null;SP=null;FS=null;KD=null;KS=null;MS='h';MSV=null;draw()}
function moreSheet(){const it=[['ac','📅','کارنامه‌های خودکار'],['s','👨‍🎓','زبان‌آموزان'],['p','📊','دوره‌ای'],['h','📋','حضور و غیاب'],['a','🎓','کارنامه و نمره‌ها'],['q','🔎','جستجو'],...(MGR?[['m','💰','مالی']]:[]),['g','⚙️','تنظیمات'],['?','❓','راهنما']];
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
// ===== Auto monthly report cards (additive module; preserves legacy monthly report/print) =====
let ACM={cls:'',year:rmNow().y,month:rmNow().m,selected:[]};
const ACR=()=>Array.isArray(D.autoReportCards)?D.autoReportCards:(D.autoReportCards=[]);
function autoMonthlyPage(){
 const classes=C().filter(canC);if(!ACM.cls&&classes.length)ACM.cls=classes[0].name;
 const c=classes.find(x=>x.name===ACM.cls),mem=c?c.students.map(code=>A().find(s=>s.code==code)).filter(Boolean):[];
 const y=ACM.year,m=ACM.month,range=rmRange(y,m),period=rmName(y,m),records=ACR().filter(x=>x.className==ACM.cls&&x.year==y&&x.month==m);
 const dateReports=R().filter(r=>norm(r.class||'')==norm(ACM.cls)&&(()=>{const d=pd(r.date);return d!=null&&d>=range.s&&d<=range.e})());
 const dataStatus=s=>{const d=monthData(s.code,y,m);return d&&d.has?'داده موجود':'داده محدود/ناموجود'};
 return `<div class="card"><b>📅 کارنامه ماهانه خودکار</b><div class="m">کارنامه با محاسبات و قالب ماهانه موجود تولید می‌شود؛ پیش‌نمایش، متن و چاپ پایهٔ قبلی حفظ شده است. تولید انبوه و تاریخچه در این ماژول ذخیره می‌شوند.</div>
 <label>کلاس<select id="accls" onchange="autoSetRange();ACM.selected=[];draw()">${classes.map(k=>`<option ${k.name==ACM.cls?'selected':''}>${E(k.name)}</option>`).join('')}</select></label>
 <div class="r" style="gap:8px"><label style="flex:1">ماه<select id="acm" onchange="autoSetRange();draw()">${MONTHS.map((n,i)=>`<option value="${i+1}" ${i+1==m?'selected':''}>${n}</option>`).join('')}</select></label><label style="flex:1">سال<input id="acy" type="number" value="${y}" onchange="autoSetRange();draw()"></label></div>
 <div class="tb"><button onclick="autoSelectAll()">انتخاب همه</button><button onclick="ACM.selected=[];autoMonthlyPageRefresh()">پاک کردن انتخاب</button><button class="p" onclick="autoGenerateBatch()">⚙️ تولید کارنامه انتخاب‌شده‌ها</button></div>
 <div class="m">${mem.length} زبان‌آموز • ${dateReports.length} گزارش روزانه در بازهٔ انتخابی • ${records.length} کارنامه ذخیره‌شده</div></div>
 ${mem.length?mem.map(s=>{const d=monthData(s.code,y,m),old=records.find(x=>x.studentCode==s.code);return `<div class="card"><label class="r" style="display:flex;align-items:center"><span><input type="checkbox" class="acsel" value="${E(s.code)}" ${ACM.selected.includes(s.code)?'checked':''}> <b>${E(s.first)} ${E(s.last)}</b></span><span class="m">${d&&d.has?'داده موجود':'⚠️ داده محدود/ناموجود'}</span></label><div class="m">${old?'کارنامه ذخیره شده • نسخه '+old.version+' • '+E(old.status):'کارنامه تولید نشده'}</div><div class="tb">${old?`<button onclick="autoCardOpen('${E(old.id)}')">بازبینی / ویرایش</button><button onclick="autoCardPrint('${E(old.id)}')">🖨 چاپ</button>`:`<button onclick="autoGenerateOne('${E(s.code)}')">تولید کارنامه</button>`}</div></div>`}).join(''):'<div class="m">ابتدا کلاس انتخاب کنید.</div>'}
 <div class="card"><b>📚 سوابق کارنامه‌های این بازه</b>${records.length?records.map(x=>{const s=A().find(z=>z.code==x.studentCode);return `<div class="r"><span>${E(s?s.first+' '+s.last:x.studentCode)} • v${x.version} • ${E(x.status)}</span><button onclick="autoCardOpen('${E(x.id)}')">بازبینی</button></div>`}).join(''):'<div class="m">هنوز کارنامه‌ای در این بازه ذخیره نشده است.</div>'}</div>`;
}
function autoMonthlyPageRefresh(){draw()}
function autoSelectAll(){autoSetRange();const c=C().find(x=>x.name==ACM.cls);ACM.selected=c?c.students.filter(code=>A().some(s=>s.code==code)):[];draw()}
function autoSetRange(){ACM.cls=document.getElementById('accls')?.value||ACM.cls;ACM.month=+(document.getElementById('acm')?.value||ACM.month);ACM.year=+(document.getElementById('acy')?.value||ACM.year);ACM.selected=[...document.querySelectorAll('.acsel:checked')].map(x=>x.value)}
function autoSourceSnapshot(code,y,m){const rg=rmRange(y,m),cls=C().find(x=>x.name==ACM.cls);return R().filter(r=>norm(r.class||'')==norm(cls?.name||'')&&(()=>{const d=pd(r.date);return d!=null&&d>=rg.s&&d<=rg.e})()).map(r=>({date:r.date,class:r.class,text:r.text}))}
function autoGenerateOne(code){autoSetRange();autoMake(code)}
function autoGenerateBatch(){autoSetRange();if(!ACM.selected.length){toast('ابتدا زبان‌آموزان را انتخاب کنید');return}const codes=ACM.selected.slice();let n=0;codes.forEach(code=>{autoMake(code,true);n++});draw();toast(n+' کارنامه تولید/به‌روزرسانی شد')}
function autoMake(code,silent){autoSetRange();const s=A().find(x=>String(x.code)==String(code));if(!s)return;const cls=ACM.cls;let from,to,rangeName,type,fy=ACM.year,fm=ACM.month,periodFrom='',periodTo='';if(ACM_MODE==='monthly'){const rg=rmRange(ACM.year,ACM.month);from=rg.s;to=rg.e;rangeName=rmName(ACM.year,ACM.month);type='monthly'}else{let [fy0,fm0]=ACM_FROM.split('/').map(Number),[ty0,tm0]=ACM_TO.split('/').map(Number);if(!fy0||fm0<1||fm0>12||!ty0||tm0<1||tm0>12||pd(ACM_FROM+'/01')>pd(ACM_TO+'/01')){toast('بازه ماه‌ها معتبر نیست');return}from=rmRange(fy0,fm0).s;to=rmRange(ty0,tm0).e;rangeName=ACM_FROM+' تا '+ACM_TO;type='periodic';fy=fy0;fm=fm0;periodFrom=ACM_FROM;periodTo=ACM_TO}const evidence=autoReportEvidence(code,cls,from,to);const sources=R().filter(r=>norm(r.class||'')==norm(cls)&&(()=>{const d=pd(r.date);return d!=null&&d>=from&&d<=to})()).map(r=>({date:r.date,class:r.class,text:r.text,form:r.form?JSON.parse(JSON.stringify(r.form)):null}));let content;if(type==='monthly'){content=autoAnalyticCompose(code,cls,from,to,rangeName,'monthly')}else content=autoAnalyticCompose(code,cls,from,to,rangeName,'periodic');const dataCheck=evidence.length>=2?'نیازمند بازبینی': 'داده محدود — نیازمند بازبینی';const existing=ACR().find(x=>x.className==cls&&x.studentCode==code&&x.type==type&&(type==='monthly'?x.year==ACM.year&&x.month==ACM.month:x.from==periodFrom&&x.to==periodTo));const history=existing?[...(existing.history||[]),{version:existing.version,content:existing.content,status:existing.status,updatedAt:existing.updatedAt}]:[];const rec={id:existing?.id||('AC'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)),studentCode:code,studentName:s.first+' '+s.last,className:cls,year:fy,month:fm,from:periodFrom,to:periodTo,type,content,status:sources.length?dataCheck:'داده محدود — نیازمند بازبینی',version:(existing?.version||0)+1,createdAt:existing?.createdAt||Date.now(),updatedAt:Date.now(),sourceSnapshot:sources,sourceCount:sources.length,score:type==='monthly'?(monthData(code,ACM.year,ACM.month)?.total??null):null,history};if(existing)Object.assign(existing,rec);else ACR().push(rec);save();if(!silent)autoCardOpen(rec.id)}
function autoGenerateBatch(){autoSetRange();if(!ACM.selected.length)return toast('ابتدا زبان‌آموزان را انتخاب کنید');const codes=ACM.selected.slice();codes.forEach(code=>autoMake(code,true));draw();toast(codes.length+' کارنامه تولید شد')}
function autoCardPrint(id){const r=ACR().find(x=>x.id==id);if(!r)return;const w=window.open('','_blank');if(!w)return toast('اجازهٔ پنجره چاپ داده نشد');w.document.write(`<html><head><meta charset="utf-8"><title>کارنامه</title><style>body{font-family:Tahoma,Arial;direction:rtl;padding:18px;color:#222}.page{max-width:780px;margin:auto;border:1px solid #ddd;border-radius:14px;padding:24px}.header{display:flex;align-items:center;gap:18px;border-bottom:2px solid #777;padding-bottom:14px}.logo{width:72px;height:72px;object-fit:contain}.brand{text-align:center;flex:1}.brand h1{font-size:24px;margin:0 0 6px}.meta{margin:16px 0;padding:12px;background:#f5f5f5;border-radius:8px}.body{white-space:pre-wrap;line-height:2;font-size:15px}.foot{display:flex;justify-content:space-between;margin-top:42px;padding-top:24px}@media print{@page{size:A4 portrait;margin:12mm}.page{border:0;padding:0}}</style></head><body><div class="page"><div class="header"><img class="logo" src="logo.jpg"><div class="brand"><h1>${r.type==='periodic'?'کارنامه دوره‌ای':'کارنامه ماهانه'}</h1><small>Moradi English Class</small></div><img class="logo" src="logo.jpg"></div><div class="meta"><b>${E(r.studentName)}</b><div>${E(r.className)} • ${E(r.type==='periodic'?r.from+' تا '+r.to:rmName(r.year,r.month))}</div><small>تاریخ صدور: ${E(todayJ())} • نسخه ${r.version}</small></div><div class="body">${E(r.content)}</div><div class="foot"><span>امضای مدیر آموزشگاه</span><span>مهر آموزشگاه</span></div></div><script>window.onload=function(){window.print()}<\/script></body></html>`);w.document.close()}


function autoRegenerate(id){const r=ACR().find(x=>x.id==id);if(!r)return;const oldMode=ACM_MODE,oldClass=ACM.cls,oldY=ACM.year,oldM=ACM.month,oldFrom=ACM_FROM,oldTo=ACM_TO;ACM.cls=r.className;ACM_MODE=r.type==='periodic'?'periodic':'monthly';ACM.year=r.year;ACM.month=r.month;if(r.type==='periodic'){ACM_FROM=r.from;ACM_TO=r.to}autoMake(r.studentCode,true);ACM_MODE=oldMode;ACM.cls=oldClass;ACM.year=oldY;ACM.month=oldM;ACM_FROM=oldFrom;ACM_TO=oldTo;autoCardOpen(id)}
