# PDF Suallarının Cavabları

---

## 1. Robotun hərəkətinin idarə olunması nədir?

Robotların idarə olunması problemi ədəbiyyatlarda geniş şəkildə verilmişdir. Hazırda sənaye robotların idarə olunmasında ən çox hər bir sərbəstlik dərəcəsinin mərkəzləşməmiş "proporsional, inteqral, diferensial" (PİD) tənzimləmə qanunları ilə tənzimlənməsidir. Həminin, fırlanma momentinin kompyuterlə tənzimlənməsi kimi daha inkişaf etmiş qeyri-xətti idarəetmə sistemi işlənib hazırlanmışdır və tərs dinamik idarəetmə adlanır.

Robotun idarəedilməsinin təməl problemini başa düşmək üçün robotun dinamik modelini bilmək lazımdır. n dərəcəli sərbəstlik dərəcəli robot üçün hərəkət tənliyi verilir. Burada, Г - (nx1) ölçülü fırlanma momenti vektoru; A(q) – robotun (nxn) ölülü ətalət matrisidir; (nx1) ölçülü Coriolis və mərkəzdənqaçma vektorudur; Q(q) – qravitasiya momenti vektorudur; Fv və Fc – müvafiq olaraq vizkoz sürtünmə və Kolumb sürtünmə parametrləridir.

---

## 3. PİD tənzimləyici və hansı hissələrdən ibarətdir?

Dinamik model n cüt qeyri-xətti ikinci dərəcəli diferensial tənliklər sistemi ilə verilir. Burada, n – birləmələrin sayıdır. Lakin, bir çox müasir sənaye robotlarında lokal, mərkəzləşməmiş sabit əmsallı "proprsional, inteqral, diferensial" (PİD) tənzimləmə hər bir bənd üçün tətbiq edilir. Belə texnikanın əsas üstünlüyü tətbiqinin sadəliyi və az hesablamaya malik olmasıdır.

İdarəetmə qanunu aşağıdakı kimidir:

Burada, qd(t) və - arzu olunan bənd mövqelərini və sürətləri göstərir. Burada, Kp, Kd, və Ki (nxn) ölçülü müsbət müəyyən dioqonal matrisinin elementləridir:
- **Kpj** - proporsional gücləndirmə əmsalı
- **Kdj** - diferensial gücləndirmə əmsalı
- **Kij** – inteqral gücləndirmə əmsalı

**Hissələri:**
- **Kp** və **Kd** əmsallarının yüksək olması izləmə xətasını azaldır, ancaq sistemi qeyri-stabil üstünlüyün qonşuluğuna gətirir;
- İnteqral təsir olmadıqda qravitasiyaya görə statik xəta artaraq son mövqeləşməyə təsir edir. Praktik olaraq, proporsional təsir yetərli olmadıqda mövqeləşmə xətası çox böyük olduqda inteqral təsir deaktiv edilir.
- Kd – gücləndirmə əmsalı servo gücləndirici ilə inteqrə olunmuş şəkildə olur, Kp gücləndirmə əmsalı ədədi olaraq həyata keçirilir.

---

## 4. Blok-sxem üzrə izləyici idarəetməni izah edin.

w(t)-ni aşağıdakı tənlikdən təyin edək:

Burada Kp və Kd (nxn) ölçülü müsbət müəyyən dioqonal matrisidir; qapalı sistemin nəticəsi aşağıdakı ayrılmış xətti xəta tənliyi ilə təyin olunub.

Xəta tənliyinin e(t) həlli qlobal exponensial olaraq stasionardır. Kpj və Kdj əmsalları robotun konfiqurasiyasının bütün tənzimləmələri üzrə j oxunu təmin etmək üçün tənzimlənir.

Ümumiyyətlə, bir kritik pozulmuş sistem üçün ifrat tənzimləmə olmadan ən sürətli reaksiyasını əldə etmək üçündür. Belə idarəetmə sxeminin blok diaqramı aşağıdakı şəkildə göstərilmişdir: Ötürücülərə nəzarət giriş momenti üç komponenti vardır: Bunlardan birincisi Koriolis, mərkəzdənqaçma, qravitasiya və sürtünmə effektidir. İkincisi, müvafiq olaraq əmsalı ilə proporsional və diferensial idarəetmədir.

Modelləşmə xətalarının olduqda, qapalı tənzipləmə tənliyi verilir. Bu tənlikdə, modelləşmə xətası, xəta tənliyi üçün həyəcanını təşkil edir. Bu xətalar çox böyük olduqda, proporsional və diferensial əmsalları artırmaq lazımdır. Ancaq onların amplitudları sistemin stabilliyi ilə məhdudlaşdırılır.

---

## 5. Ayrılma idarəsi nə üçün istifadə olunur?

Robotun cəld hərəkəti və yüksək dinamik dəqiqlik tapşırılbsa, dinamik qarşılıqlı əlaqə momenti qismən və ya tamamilə hesaba alınaraq idarəetmənin performansını artırmaq lazımdır. Xəttiləşdirmə və ayrılma idarəsi robot dinamikasında qeyr-xəttiliyin aradan qaldırılmasına əsaslanır. Bu idarələr hesablanmış moment idarəsi və ya invers dinamik idarə adlanır, dinamik modelin istifadəsinə əsaslanır.

Bu modelin həyata keçirilməsi invers dinamik modelin onlayn hesablamasını tələb edir, Bu inersial parametrlər və sürtünmə parametrlərinin ədədi qiymətlərinin biliklərinə əsaslanır.

Xəttiləşdirmə və ayırma texnikaları qeyri-xətti idarəetmə probleminin uyğun əks-əlaqə qanunundan istifadə etməklə xətti idarəetməyə çevirməkdən ibarətdir.

---

## 6. Robot sistemində enerji anlayışı necə istifadə olunur?

Hamilton formulu robotun tam enerjisini verir:
**H=E+U**

Burada:
- E(q,) robotun kinetik enerjisidir
- U(q) robotun potensial enerjisidir
- A(q) robotun ətalət matrisidir

Generasiya momentinin (nx1) ölçülü vektoru belə təyin olunur:
P=A(q)

L=E-U robotun Laqranj tənliyidir.

Q və p vektorları ilə sabit dəyişənləri təyin etməklə, tapşırıq fəzasında hərəkətin Hamilton tənliyini əldə etmək olar.

Sərt robot passiv kimi Г girişindən çıxışına təyin olunur. Robotu arzu olunan qd vəziyyətinə aparmaq lazımdır. İntuitiv olaraq, bunu açıq idarəetmə enerjisi minimumundan, qapalı-idarəetmə sisteminə dəyişməkdən ibarətdir.

---

## 7. Lyapunov funksiyası nədir?

PD idarəetmə qanunu tənzimləmə problemini tənzimləmək üçün asimptotik stabildir. Nümayiş aşağıdakı Lyapunov funksiyasının tərifinə əsaslanır.

Burada, e=qd – q mövqeləşmə xətasıdır və qd arzu olunan bənd mövqeləşməsidir.

Lyapunov funksiyasının zaman məhsuladarlığına görə fərqləndirilməsi aparılır. Bu nəticə göstərir ki, mənfi yarım-müəyyəndir, hansı ki, (e=0, =0) tarazılıq nöqtəsinin asimptotik stabil olduğunu göstərməyə kifayət etmir. Buradan sübut etmək olar ki, =0 olduğu halda robot qd konfiqurasiyasına çatmağa imkan vermir. Bu La Salle invariant sazlama teoreminə əsasən ola bilər.

Həmçinin adaptiv idarəetmədə Lyapunov funksiyası aşağıdakı kimi istifadə olunur: müsbət müəyyən adaptiv gücləndirmə matrisidir. P – unikal müsbət-müəyyən matrisdir. Lyapunov tənliyinin həlli verilir.

---

## 8. Qapalı idarə etmə sisteminin əks əlaqə ilə təsvirini izah et

Qapalı idarəetmə sisteminin tənliyinin ekvivalent əks əlaqə ilə təsviri bir-biri ilə əlaqəli iki əks-əlaqə blokunun sistemini əks etdirir:
- müvafiq olaraq giriş və çıxışı olan irəli ötürücü B1 xətti bloku;
- müvafiq olaraq giriş və çıxışı olan əks-əlaqə qeyri-xətti B2 bloku;

Qeyri-xətti blokun passiv olduğunu sübut etmək üçün giriş-çıxış məhsulunun inteqralını nəzərdən keçirmək lazımdır.

İrəli bəsləmə dövrəsinin xətti bloku müsbət real ötürmə matrisi ilə xarakterizə olunur. Stabil və daha dəqiqi xətti sistemin e xətası məhduddur.

İrəli bəsləmə dövrəsinin ötürmə funksiyası ciddi şəkildə müsbət real olmalıdır. Bu qütbün başlanğıcdan silinməsi ilə həyata keçirilə bilər.

---

## 9. Passivlik anlayışı nədir?

Robotun sürətli hərəkəti və dəqiqlik tələb olunursa, burucu momentin dinamik inteqrasiyasına paralel olaraq idarəetmə təsirini də artırmaq lazımdır. Xəttiləşmiş və ayrılmış idarəetmə robotun dinamikasında qeyri-xəttiliyin aradan qaldırılmasına əsaslanır. Belə idarəetmə hesablanmış burucu moment və ya invers dinamik idarəetmə adlanır.

Passivliyə əsaslanan idarəetmədə idarəetmə qanunundan istifadə edərək ilkin Hamilton tənliyini H(p,q), arzu olunan H*(p,q) arzu olunan Hamilton tənliyinə dəyişə bilər. Bu o deməkdir ki, robot yeni v-girişindən çıxışına qədər passivdir.

Sistemi asimptotik stabilləşdirsək, demfirləməni yazmaq olar. Bu ifadə mənfi yarım müəyyəndir. La Salle invariant teoremindən istifadə edərək asimptotik stabillik tarazılığı sübut edilə bilər.

---

## 10. Adaptiv idarəetmə nədir?

Dinamik model həmişə dəqiq məlum olmadığından (robotun dinamik parametrlərinin, faydalı yükün, yüksək tezlikli modelləşdirilməmiş dinamikanın qeyri-dəqiqliyi) adaptiv idarəetmə nəzəriyyəsi geniş şəkildə tədqiq edilir. Sərt robot-manipulyatorların qeyri-xətti adaptiv idarəetmə sistemi mükəmməl hesab oluna bilər.

Adaptiv idarəetməyə müxtəlif yanaşmalar aşağıdakı kimi təsnifat oluna bilər:
1. dinamik modelin sadələşdirilməsi;
2. xətti sistemlər üçün hazırlanmış adaptiv texnikanın tətbiqi;
3. qeyri-xətti ayrılma və xəttiləşmə adaptiv idarəetmənin formalaşdırılması;
4. robotun passivlik xassəsinə əsaslanan qeyri-xətti adaptiv idarəetmənin formalaşdırılması;
5. filtirləşmiş dinamik model və ya enerji əsaslı model kimi bənd təcili hesablamasından yayınan adaptiv mexanizmlərin parametlərinin formalaşdırılması.

---

## 11. Adaptiv idarəetmədə parametrlər necə dəyişir?

Adaptiv dinamik idarəetmənin birinci versiyası Kraik tərəfindən formalaşdırılmışdır. İdarəetmə qanunu hesablanmış burucu moment idarəetmə qanununda olduğu kimi eyni struktura malikdir.

Harada ki, təxmin edilən əsas dinamik parametrin vektorudur. İdarəetmə qanunu real zamandakı idarəetmə qanunu ilə əlaqələndirilərək x(t)-ni təmin edir.

Adaptasiya qanunu verilir. Harada ki, F⁻¹ adaptasiya vuruğudur.

Bu metodun iki əsas məhdudiyyətləri vardır: birincisi odur ki, bəndin təcili həyata keçirilməsi üçün tələb olunur. İkincisi odur ki, təxmin edilən ətalətin tərs matrisi məhdud olmalıdır.

Adaptiv passivliyə əsaslanan idarəetmədə tam dinamik modelə əsaslanan adaptiv alqoritm hazırlamaq üçün matrisinin əyri-simmetriya xüsusiyyətindən istifadə edilir. Bu xüsusiyyət robotun passivliyinin nəticəsidir.

---

## 12. Adaptiv idarəetmənin üstünlükləri hansılardır?

PDF-də adaptiv idarəetmənin üstünlükləri birbaşa siyahı şəklində verilməyib, lakin aşağıdakılar PDF-dən çıxarıla bilər:

- Dinamik model həmişə dəqiq məlum olmadığından adaptiv idarəetmə bu qeyri-dəqiqlikləri aradan qaldırır
- Sərt robot-manipulyatorların qeyri-xətti adaptiv idarəetmə sistemi mükəmməl hesab oluna bilər
- Passivliyə əsaslanan adaptiv idarəetmə qanunu bənd təcili təxminlərini tələb etmir
- Adaptiv idarəetmə qanunu qlobal asimptotik dayanıqlıdır
- Robot parametrlərinin dəyişməsinə uyğunlaşma təmin edir
- Faydalı yükün dəyişməsi halında sistemin performansını qoruyur

---

## 13. Uyğunlaşmış hərəkət nədir?

Bir çox sənaye tətbiqləri qeyri-müəyyən mühitlə robot son effektorun təmasını tələb edir. Bu cür tətbiqlərin uzun siyahısı verilə bilər. Buraya kontur izləmə, itələmə, cilalama, bükmə, çapıq alma, üyütmə, yığma və s. tətbiqləri göstərmək olar.

Bütün bu tapşırıqların yerinə-yetirilməsi robotun bu tələblərə, yəni istər, müqaviməti dəf etmək üçün lazım olan qüvvəni təmin edərkən ya da əməl etməsini tələb edir.

Xalis vəziyyətə görə idarəetmədə, istifadəçi vəziyyətə və orientasiyaya görə son effekti tam olaraq təyin etməlidir. Bu robotun boş fəzada hərəkətini nəzərdə tutur. Hər hansı əlaqənin olmaması qüvvələrin toplanmasını önləyir. Digər tərəfdən, xalis qüvvəyə görə idarəetmə manipulyatorun son effektini bütün istiqamətlərdə ətraf mühitlə məhdudlaşdırır, yəni heç bir hərəkət olmur.

Praktiki olaraq, tapşırıq bir çərçivə daxilində müəyyən edilir, uyğunluq çərçivəsi adlandırılır, çərçivə oxları boyunca və ətrafında altı sərbəstliyi təmin edir. Hər dərəcə üçün sərbəstlikdən asılı olmayaraq ya mövqeni ya da qüvvəni müəyyən etmək olur.

---

## 14. Qüvvə və mövqe idarəetməsi eyni vaxtda mümkündürmü?

Mövqeyə və gücə görə idarəetmə özlərini qarşılıqlı olaraq istisna edir, yəni eyni vaxtda eyni istiqamətdə yalnız qüvvəni və vəziyyəti idarə etmək olmur.

Lakin, qüvvə C səthi normaları boyunca tətbiq edildiyi halda, yalnız C səthi tangensi boyunca hərəkət mümkündür. Beləliklə, fərqli istiqamətlərdə eyni vaxtda həm mövqe, həm də qüvvə idarə edilə bilər – bu hibrid idarəetmə adlanır.

---

## 15. Aktiv sərtlik idarəetməsi necə işləyir?

Bu üsul robot son effektorun görünən sərtliyini aktiv idarə edir və eyni zamanda mövqe və qüvvəyə görə idarə etməyə də imkan verir. İstifadəçi arzu olunan uyğunluq çərçivəsinin üç çevirmə və üç fırlanma sərtliyini təyin edə bilər.

Sərtlik proqram idarəetməsi altında müxtəlif tapşırıq tələblərinə uyğun dəyişdirilə bilər. Mövqeləşməsi lazım olan istiqamətlərə yüksək məhsuldarlıqla idarəetmə tətbiq olunur, aşağı məhsuldarlıq isə qüvvəyə görə idarəetmə istiqamətində tətbiq edilir.

Əsas sərtlik düsturu: **cfc=KccdXc**

Harada ki, Kc-arzu olunan (6x6) ölçülü sərtlik matrisidir, hansı ki, dioqonalı Rc çərçivəsindədir.

Bəndin burucu moment vektoru: **Г=Kq(qd-q)+Kd(-)+Q**

Harada ki, Q – qravitasiya burucu moment kompensasiyasını ifadə edir, Kd – sönən matris kimi şərh edilə bilər.

Belə aktiv sərtliyə görə idarəetmə sxeminin üstünlüyü onun həyata keçirmək üçün nisbətən asan olmasıdır. Sərtlik matrisi müxtəlif tapşırıq məhdudiyyətlərinə qarşı robotun davranışını adaptasiya etmək üçün onlayn olaraq dəyişdirilə bilər.

---

## 16. Hibrid idarəetmə nədir?

Əvvəlki üsullardan istifadə edərək, arzu olunan dinamik davranışı müəyyən etmək olar, ancaq arzu olunan dartılmanı müəyyən etmək olmur. Aşağıdakı üsullarla həm mövqe, həm də qüvvə müəyyən edilə bilir.

Qüvvəyə görə idarəetmə ilə idarəetmə sxemlərinin iki ailəsi verilir:
- **Paralel hibrid vəziyyətə/qüvvəyə görə idarəetmə**
- **Xarici hibrid idarəetmə**

**Paralel hibrid** mövqeyə/qüvvəyə görə idarəetmə öz kökünü Ribert və Craigin işlərindən tapır. O, eyni zamanda tapşırığın arzu olunan vəziyyət və qüvvə məhdudiyyətlərini təmin edir.

**Xarici hibrid idarəetmə** sxemi iki daxili idarəetmə dövrəsindən ibarətdir: daxili dövrə vəziyyətə görə idarə edir, xarici dövrə isə qüvvəyə görə idarəetmə dövrəsidir. Xarici dövrənin çıxışı daxili dövrə üçün arzu olunan vəziyyət girişinə çevrilir.

---

## 17. Hibrid idarəetmə blok sxemini çək və izah et

PDF-dən Hibrid idarəetmə blok sxeminin izahı:

Paralel hibrid idarəetmə metodunda robot iki əks əlaqə ilə idarə olunur, biri vəziyyətə görə digəri qüvvəyə görə. Hər birinin özünəməxsus sensor sistemi və idarəetmə qanunları vardır. Hər iki dövrənin idarəetmə qanunları qlobal idarəetmə siqnalı G kimi aktuatora göndərilməzdən əvvəl əlavə olunur.

Uyğun olaraq G qlobal idarəetmə siqnalının növünə görə hibrid idarəetmə sxemlərinin üç formasını ayırd etmək olar:
- G bəndin momentinə ekvivalent
- G tapşırıq fəzasında yerdəyişməyə və ya sürətə ekvivalent olub, bəndin vəziyyətini əldə etmək üçün robotun tərs Jacobian matrisinə vurmaqla əldə edilir
- G tapşırıq fəzasında qüvvəyə ekvivalent olub, Jacobian matrisinin yerdəyişməsinə vurmaqla əldə edilir

PDF-dəki Şəkil 8 "Hibrid vəziyyətə/qüvvəyə görə idarəetmə prinsipi" adlanır.

---

## 18. Seçim matrisi S nə üçündür?

Uyğun seçmə matrisi S-dən istifadə edilir, hansı ki, dioqonal matrisi aşağıdakı kimidir:

**S=diag(s1, s2, ..,s6)**

Harada ki, uyğunluq çərçivəsinin j-ci sərbəstlik dərəcəsi vəziyyətə görə idarə olunursa, **sj=1** və ya qüvvəyə görə idarə olunursa **sj=0**.

S seçmə matrisi tapşırıq fəzasını arzu olunan alt fəzaya həndəsi olaraq azaldan bir proyeksiyadır. S və (I-S) matrisləri uyğunlaşma çərçivəsində ifadə olunan siqnallara tətbiq olunurlar.

Seçim matrisi tapşırıq fəzasını arzu olunan alt fəzaya həndəsi olaraq azaldan bir proyeksiyadır. Robotun Yakobi matrisindən istifadə edərək seçilmiş tapşırığın alt fəzası bənd fəzasına çəkildikdə problem yarana bilər.

---

## 19. Proporsional (P) inteqral (İ) Diferensial (D) təsirlər nəyi ifadə edir?

PID genişlənməsi mütənasib (proporsional), inteqral və törəmədir (törəmə). PID nəzarəti sistemin istinad dəyəri və sistemin çıxışı arasında xəta dəyərini istifadə edərək sistem çıxışının istinad dəyərinə çatmasını təmin edir.

PID girişinə xəta dəyərini verərək, paralel olaraq çarpanla çarparaq, inteqral və törəmə əməliyyatlar tətbiq edilir. Bu əməliyyatların çəkili məbləğləri PID nəzarətin çıxışını yaradır.

PDF-dən əlavə:
- **Kp** və **Kd** əmsallarının yüksək olması izləmə xətasını azaldır, ancaq sistemi qeyri-stabil üstünlüyün qonşuluğuna gətirir
- **İnteqral** təsir olmadıqda qravitasiyaya görə statik xəta artaraq son mövqeləşməyə təsir edir
- **Kd** qabaqlayıcı təsirləri izləmə xətalarını əhəmiyyətli dərəcədə azaldır

---

## 20. Addım mühərriklərinin işləmə prinsipləri

Bir sıra addım mühərrikləri qısa elektrik cərəyanı ilə hərəkət edirlər. Stator bir-birinə perpentikulyar maqnit sahəsi yaradan iki sarğıdan ibarətdir. Bu sarğılara növbə ilə elektrik cərəyanı verilərək statorun içərisində döndürmə təsirinə sahib bir maqnit sahəsi yaradılır.

Statorun içindəki rotor sarğılar tərəfindən sıra ilə maqnit sahəsi ilə polyarizə olaraq dönür. Hər bir elektrik cərəyanı impulsu rotorun müəyyən bir bucaq qədər dönməsinə səbəb olur.

Əgər güc sadəcə bir sarğıya verilərsə maqnit sahəsinin təsiri ilə rotor sabitlənəcəkdir. Bu mühərrikin dayandırılması üçün istifadə olunur.

---

## 21. Addım mühərrikinin təməl prinsipial sxemini izah et

Addım mühərriki bir dairə içində elektromaqnit sahələrin dönüşü ilə ifadə edilə bilir. 1 dolağı açarı qapandıqda (SW-1) rotor öz-özünə 1 elektromaqnit sahəsi ilə eyni xəttə gələcəkdir.

Bundan sonra 1 dolağı açarı açılıb 2 dolağı açarı qapadılarsa sabit maqnit 2 elektomaqnit sahənin qarşısına gələcəkdir. Bu hadisə təkrarlandıqca rotor bir dairə içində dönəcəkdir.

---

## 22. Bipolyar və unipolyar mühərriklərini izah et

Bir sarğının yaratmış olduğu maqnit sahəsinin istiqaməti, sarğının sarınma istiqamətinə və sarğının içindən keçən cərəyanın istiqamətindən asılıdır.

Maqnit selinin istiqaməti sarğıdan keçən selin istiqaməti ilə dəyişdirilə bilir. Bəzi hallarda isə cərəyanın istiqaməti əvəzinə sarğı istiqamətinin dəyişdirilməsi lazım gəlir.

**Bipolyar mühərrik** – cərəyanın istiqamətini dəyişdirərək maqnit sahəsinin istiqamətini dəyişdirir.

**Unipolyar mühərrik** – sarğı istiqamətinin dəyişdirilməsi ilə maqnit sahəsinin istiqaməti dəyişdirilir.

---

## 25. Elektrik mühərrikləri neçə yerə ayrılır və izah et

Elektrik mühərrikləri elektrik enerjisini mexaniki enerjiyə çevirən maşınlardır. Elektrik mühərrikləri işləmə gərginliyinə görə iki fərqli şəkildə qruplaşdırılır:

1. **Sabit cərəyan mühərrikləri** – DC gərginliyi ilə işləyir. Bu mühərriklər girişlərinə sabit cərəyan verildikdə onların çıxışlarından mexaniki şəkildə idarə olunur. Sabit cərəyan mühərrikləri, sürətə nəzarətinin asanlığı və səlis hərəkət dəqiqliyinə görə sənayedə bir çox sahədə istifadə üçün yer tapmışdır.

2. **Dəyişən cərəyan mühərrikləri** – AC gərginliyi ilə işləyən mühərriklərdir.

---

## 26. Sabit cərəyan mühərriklərinin istiqamətinin və sürətinin tənzimlənməsini izah et

Sabit cərəyan mühərrikləri sürət və istiqamətə nəzarətin çox asan olduğu mühərriklərdir. O mühərriklərdə sürət, dəyişən cərəyan mühərriklərindən fərqli olaraq, xarici amillərdən çox azdır.

**İstiqamətin dəyişdirilməsi:** Motorun giriş terminalları əks şəkildə birləşdirilirsə, sabit cərəyan motorun fırlanma istiqaməti də dəyişir. H-körpüsü dövrəsi istifadə edilir.

Giriş siqnallarına görə: ya Input1=Input4=1 və Input2=Input3=0 olarsa motor bir tərəfə dönəcək. Mühərriki geri qaytarmaq üçün Giriş1=Giriş4=0 və Giriş2=Giriş3=1.

**Sürətin tənzimlənməsi 3 üsulla idarə oluna bilər:**
1. Mühərrikə tətbiq olunan gərginliyin dəyişdirilməsi
2. Maqnit sahəsinin dəyişdirilməsi
3. Rotor dövrəsinə əlavə müqavimətin əlavə edilməsi

Bu üç üsuldan ən çox istifadə ediləni gərginliyi dəyişdirərək sürəti artırmaqdır.

---

## 29. Sürət qutuları nədir izah et

Redüktör mühərrikinin çıxışlarına quraşdırılmış sürət qutularına verilən addır. Ümumiyyətlə mühərrikin sürətini və ya fırlanma anını artırmaq və ya azaltmaq üçün istifadə olunur.

Bu keçid əməliyyatında mühərrikin sürəti onun fırlanma momenti ilə tərs mütənasibdir. Əgər reduktorun ucundan mühərrikdən daha yüksək sürət götürüləcəksə, mühərrikin sonunda əldə edilə bilən fırlanma momenti mühərrikin çıxışındakı torkdan daha aşağı olacaq. Əgər sürət qutusunda sürət azaldılırsa, sürət qutusunun sonundakı fırlanma momenti artacaq.

Müxtəlif diametrli dişlilər reduktorun içərisində bir-birini fırladır. Bu diametr fərqə görə, giriş və çıxışda sürət və tork nisbətləri diametrlərin nisbətindədir. Bütün dişlilərin bir-birinə nisbətləri hesablandıqda, giriş və çıxış arasında nisbət var. Bu nisbət reduktorun reduksiya nisbəti adlanır.

---

## 30. Dönmə momentinin hesablanması və sabit cərəyan mühərrikinin seçilməsi izah et

Robot qolu dizayn edilərkən nəzərə alınmalı ən vacib məsələlərdən biri düzgün mühərrik seçimidir.

Prototip kimi hazırlanan əzaların çəkiləri 90 qram, uzunluğu 220 mm olaraq ölçülmüşdür.

**Ox2 Motor Torku hesablanması:**
- Ox2 Motor Torku = (Əza2 uzunluğu / 2) x Əza 2 Çəki
- Ox2 Motor Torku = (22 sm / 2) x 90 x 10⁻³ kq
- Ox2 Motor Torku = 990 x 10⁻³ kq.sm = 0,098096 Nm = 13,877 oz.in

**Ox1 Motor Torku hesablanması:**
- Ox1 Motor Torku = ((Əza1 uzunluğu + Əza2 uzunluğu / 2) x Əza2 Çəki) + ((Əza1 uzunluğu / 2) x Əza1 Çəki) + (Ox2 mühərrik çəkisi x əza uzunluğu)
- Ox1 Mühərrik fırlanma anı = 16,17 kq.sm = 1,5856 Nm = 224 oz.in

Ox2 üçün Nidec-Servonun DME34BE50G motoru istifadə olunur. Mühərrikin çəkisi 300 qr, ən yüksək fırlanma momenti 9,8 kq.sm-dir.

---

## 31. Servo mühərriklər haqqında məlumat yaz

Adını ingiliscə xidmətçi sözündən götürüb. Bu gün aktiv şəkildə istifadə olunan müxtəlif növ servo mühərriklər var.

Mini DC servo mühərrikləri DC mühərriki və onun mili ilə əlaqəli dişli sistemidir. Onlar potensiometrdən və idarəetmə dövrəsindən ibarət strukturlardır. Ötürücü sistem böyük reduksiya nisbətlərinə malik olduğundan, bu servo mühərriklər, ölçüsü ilə müqayisədə çox ciddi fırlanma momentlərinə nail olmaq mümkündür.

Servo mühərriklərin içərisində bir potensiometr var. Bu potensiometr mühərrikin vəziyyətini təyin etmək üçün istifadə olunur.

İçindəki idarəetmə kartı sayəsində servo motor sabit mövqeyə keçir və həmin mövqedə qalır. Mövqe məlumatı PWM siqnalları vasitəsilə verilir.

Mini DC servo mühərrikləri, normal DC mühərriklərdə olduğu kimi sonsuz dönüşləri yoxdur. Bucaq dəyərlərinin aşağı və yuxarı hədləri var.

Bu işdə Hextronic markasının HX12K modeli seçilmişdir. HX12K 10 Kg.sm fırlanma momenti verə bilən metal mini servo motordur. HX12K PWM siqnalı kimi 2ms siqnal gözləyir. 0,8 ms doluluq dərəcəsi verilsə "0"-a gedəcək, 2,2 ms verilsə 135 dərəcəyə keçir.

---

## 32. Robot manipulyatorun əsas komponentləri hansılardır?

PDF-dən (Mühazirə 9, 10):
- **Elektrik mühərrikləri** (sabit cərəyan və dəyişən cərəyan mühərrikləri)
- **Addım mühərrikləri**
- **Servo mühərriklər**
- **Kodlayıcılar** (kodlayıcılar şaftın fırlanması ilə rəqəmsal elektrik siqnalı yaradan strukturlardır)
- **Sürət qutuları (reduktorlar)**
- **Sürücü dövrələri**
- **İdarəetmə sxemləri**

---

## 33. Artan tipli optik kodlayıcıları izah et

Hərəkətli optik kodlayıcılar disk vasitəsilə oxumaq edə bilən strukturlardır. Kobud iş prinsipi: işıq mənbəyi foto tranzistorlar tərəfindən aşkar edilir. İşıq mənbəyi və foto tranzistorlar arasında dəlikli disk daxil edilərsə, işıq yalnız diskin delikli hissələrinə qarşı olacaq. Foto tranzistor deşik olmayan hissələrdə bağlı qalır.

Artan tipli kodlayıcılarda disk vasitəsilə işığın foto tranzistora çatmaq məntiqi ilə oxuyur. Artan kodlayıcılarda, kanallarda yalnız müxtəlif başlanğıc nöqtələri olan dövri dəliklər var.

Artan tipli kodlayıcılar kanalların sayına görə:
- **X tipli** - bir kanala malik, yalnız sürət ölçməyə malikdir
- **XY tipli** - iki kanal var, həm sürət, həm də istiqamətə nəzarət edilə bilər, lakin tur məlumatı vermir
- **XYZ tipli** - həm istiqamət, həm sürət, həm də tur məlumatı əldə edilə bilər

İstiqaməti müəyyən etmək üçün CHA və CHB siqnallarından XOR operatorundan istifadə edilir.

---

## 34. Robot komponentlərinin funksiyaları hansılardır?

PDF-dən çıxarılan funksiyalar:

- **Elektrik mühərrikləri** – elektrik enerjisini mexaniki enerjiyə çevirən maşınlardır
- **Kodlayıcılar** – şaftın fırlanması ilə rəqəmsal elektrik siqnalı yaradan strukturlardır. Materialın/milin mövqeyi haqqında məlumat, hərəkət sürətini/sürətini tapa biləcək rəqəmsal siqnallar istehsal edir
- **Sürət qutuları (reduktorlar)** – mühərrikin sürətini və ya fırlanma anını artırmaq və ya azaltmaq üçün istifadə olunur
- **Servo mühərriklər** – dəqiq mövqeləşmə üçün istifadə olunur, PWM siqnalları ilə idarə olunur
- **Sürücü dövrələri** – mühərrikə lazımi gərginlik və cərəyanı təmin edir
- **İdarəetmə sxemləri** – robot qolunun hərəkətini idarə edir

---

## 36. Adaptiv idarəetmə nədir açıqla

*(Bu sual 10-cu sualla eynidir. PDF-dən əlavə məlumat:)*

Adaptiv idarəetmədə, ilk növbədə, yaradılmış bitki modeli istədiyiniz kimi tərtib edilir. İdarə edə bilən idarəetmə bloku nəzərdə tutulmuşdur. Bu idarəetmə bloku ilə bitki modeli çalışır və nəticələr müşahidə olunur. Əgər idarəetmə bloku zavod modelinin çıxışında istənilən dəyərləri təmin edə bilsə, bu idarəetmə bloku fiziki qurğuya tətbiq olunur.

İdarəetmə blokunu layihələndirərkən zavodun giriş və çıxışları arasındakı əlaqəni mümkün qədər sadə bir tənlik ilə istifadə etmək lazımdır. Sadə modelin idarə edilməsi adətən başa düşülməsi və həyata keçirilməsi asan olan idarəetmə bloku ilə təmin edilə bilər.

---

## 38. Süni neyron şəbəkə nədir?

Süni neyron şəbəkələri insanın sinir sistemini süni surətdə təkrarlamaq səyləri nəticəsində yaranan strukturlardır. Onu qısaca ANN də adlandırmaq olar.

Süni neyron şəbəkələri hazırda mühəndislik, elektronika, riyaziyyat və fizika kimi bir çox sahədə istifadə olunur. Süni neyron şəbəkələrini klassik üsullardan istifadə etməklə həll etmək çətindir problemlərin dəyişən həlli kimi ortaya çıxır.

Süni neyron şəbəkələri istismar baxımından bioloji neyron şəbəkələrinə bənzər bir quruluşa malikdir. Hər bir süni sinir şəbəkəsi süni sinir hüceyrələrindən ibarətdir.

Ümumiyyətlə, süni neyron hissələrdən ibarətdir:
- **Girişlər** (X1, X2, X3, …… Xn)
- **Çəkilər** (W1, W2, W3,…… Wn)
- **Əlavə funksiyası** ( Σ )
- **Aktivləşdirmə funksiyası** ( f )
- **Çıxış** (V)

---

## 39. Neyron şəbəkələr idarəetmədə niyə istifadə olunur?

Süni neyron şəbəkələri mürəkkəb problemlərin dəyişən həlli kimi tanınır və bir çox sistemlərdə uğurla tətbiq olunur. Bu gün süni neyron şəbəkələri, robot sistemləri, təsnifat, proqnoz, nümunə və ya əl mətn, üz, məlumat assosiasiyası, filtrləmə və ya kimi təsvirin tanınması prosesləri, təfsir əməliyyatları və təsvirin işlənməsi kimi bir çox əməliyyatlarda istifadə edilmişdir.

Süni neyron şəbəkəsi əsaslı model istinad nəzarət üsulu ilə hazırlanmış sistemin aşağı bucaq dəyərlərində əks əlaqə nəzarətindən daha yaxşı nəzarət verdiyi, 0-90 dərəcə arasında nəticə və istinadlar verdiyi zaman stabilləşmə istinad nöqtəsinə çatmaq üçün vaxt PID nəzarətindən daha yaxşı olduğu müşahidə olunur.

---

## 40. DC mühərriklərin idarə edilməsi üçün quraşdırılmış simulink blokunu çək və izah et

PDF-dən (Şəkil 4.4 DC mühərrik modeli):

DC Motor Modelinin Parametrlərinin Tapılması üçün əvvəlcə motor tənlikləri çıxarılmalıdır. DC mühərrikinin elektrik və mexaniki modeli verilir.

Mühərrikin cərəyandan asılı fırlanma momenti və bucaq sürətindən asılı əks emf qüvvəsi tənlikləri verilir. Bucaq sürətini və cərəyanın törəməsinin zamana görə inteqrasiyası tənlikləri əldə edilir.

Simulink DC motor tənliklərindən istifadə edərək yaradılmışdır. DC motor modelinə giriş və çıxış kimi gərginlik və bucaq sürəti dəyərləri verilir.

DC mühərrik modeli + kodlayıcı bloku birləşdirilərək sistemin bitki modeli əldə edilir.

---

## 41. PWM nədir izah et

PWM adı **Pulse Width Modulation** sözlərindən götürülüb, eninə impuls modulyasiyası (EİM) deməkdir. Yaranan impulsların genişlikləri, gərginlik səviyyələri ilə oynayaraq əvəz olunur.

EİM siqnalının xüsusiyyəti onun yüksək tezliklərdə əmələ gəlməsidir. Siqnal aşağı tezliklərdə yaradılarsa mühərrik tərəfindən iki gərginlik səviyyəsi arasında dəyişən siqnal olaraq görülə bilər. Bununla belə, yüksək tezliklərdə yaradılan EİM siqnalı mühərrikə tətbiq edildikdə, sabit cərəyan verildiyi kimi bir nəticə əldə edilir.

EİM siqnalının boşluq nisbəti ilə çıxışı kimi görünən DC gərginlik dəyəri eyni nisbətə malikdir. Məsələn, 5V enerji təchizatı tərəfindən yaradılan 10% doluluq boşluq nisbəti ilə EİM siqnalının çıxışı 5V x %10 = 0.5V kimi ölçülür.

---

## 42. Mini Servo Motorun İdarə edilməsi blok sxemi çək izah et

PDF-dən (Şəkil 4.32):

Robotun altındakı mini servo motor üçün Simulink bloku yaradılıb. FCN4 blokunun məzmunu proqramda verilir.

Bucaq məlumatı gələn kimi alqoritm işə başlayır. Proqrama bucaq məlumatı gəldikdə, süni neyron şəbəkələri blokunun girişlərində istənilən bucaq və həmin anda motorun yerləşdiyi bucaq istifadə edilərək çıxış dəyəri yaradılır.

Əgər çıxış dəyəri sıfırdan böyükdürsə prosessorun çıxışı 1 aşağı, çıxış 2 isə yüksək olur və motor saat yönünün əksinə fırlanır. Əgər çıxış qiyməti sıfırdan azdırsa, prosessorun 1-ci çıxışı yüksək olur, çıxış 2 aşağı olur və motor əks istiqamətdə fırlanır. Mövqe məlumatının istinad dəyərinə çatdıqda çıxış sıfır olur və motor dayanır.

---

## 43. Süni neyron şəbəkələrinin növlərini yaz

Süni neyron şəbəkələrinin növləri strukturlarına görə üç qrupda araşdırıla bilər:

1. **Feed Forward Neyron Networks** (İrəli qidalandıran neyron şəbəkələri) – sinir hüceyrələri çıxışa doğru bir quruluş nümayiş etdirirlər. Bir təbəqə yalnız növbəti təbəqəyə əlavə edilə bilər.

2. **Əlaqə ilə süni neyron şəbəkələri** (Əks əlaqəli) – neyronun çıxışı ya əvvəlki təbəqədəki neyrona, ya da özünə yuxarı təbəqədəki sinir hüceyrəsinə verilir.

3. **Kaskad bağlı süni neyron şəbəkələri** – sinir hüceyrəsi yalnız əvvəlki təbəqələrdəki sinir hüceyrələrindən məlumat alır.

**Öyrənmə alqoritmlərinə əsasən üç qrup:**
1. **Educational Learning (Təlimçili Öyrənmə)** – daxil edilən məlumatlara əlavə olaraq çıxış məlumatları verilir
2. **Təlimçisiz Öyrənmə** – neyron şəbəkəsinə istənilən çıxış məlumat verilmir, şəbəkə məlumatı girişlərə görə təsnif edir
3. **Dəstəklənən Öyrənmə** – hər iterasiyadan sonra çıxışın yaxşı və ya pis olması barədə məlumat verilir

---

## 44. İdarəetmə sisteminin ümumi blok sxemini izah et

PDF-dən:

İdarəetmə sistemi robot tətbiqlərində mühüm rol oynayır. İstifadəçi asılı robotlarda, robotun hərəkətlərindən proqram təminatının quraşdırılmasına qədər bütün əməliyyatlara nəzarət edilməlidir.

Əks əlaqə nəzarətində sistemin çıxışı çarpanla vurulan xəta dəyəri sistemin girişinə verilir. Əks əlaqə əmsalı vasitəsilə sistemin girişinə verilən istinad qiymətinə sinxronizasiya əldə edilir.

Sistemdə nəzarət bloku zavodun çıxışında istənilən çıxış dəyərlərə çatmaq üçün zavod girişinə lazımi giriş dəyərlərini tətbiq etmək məsuliyyəti daşıyır.

---

## 45. Sensor və aktuatorun qarşılıqlı əlaqəsini izah et

> Bu suala cavab PDF-də birbaşa ayrıca bölmə kimi verilməyib. Lakin PDF-dən çıxarılan məlumata əsasən: Sensorlar (kodlayıcılar) mühərrikin mövqeyi haqqında məlumat verir, bu məlumat əks əlaqə vasitəsilə idarəetmə blokuna ötürülür. İdarəetmə bloku bu məlumat əsasında aktuatorlara (mühərriklərə) lazımi idarəetmə siqnallarını göndərir. Beləliklə sensor və aktuator qapalı dövrə idarəetmə sistemini təşkil edir.

---

## 46. İdarəetmə sistemində sensor nədir?

PDF-dən çıxarılan cavab: Sensorlar idarəetmə sistemində mühərrikin/robotun vəziyyəti haqqında məlumat toplayan elementlərdir. PDF-də əsas sensor kimi **kodlayıcılar (enkoderlər)** istifadə olunur. Kodlayıcılar şaftın fırlanması ilə rəqəmsal elektrik siqnalı yaradan strukturlardır. Adətən bir motorun şaftına və ya hərəkət edən hissəyə qoşularaq, materialın/milin mövqeyi haqqında məlumat, hərəkət sürətini/sürətini tapa biləcək rəqəmsal siqnallar istehsal edir. Həmçinin qüvvə sensorları da istifadə olunur.

---

## 47. Aktuator nədir?

> Bu suala birbaşa tərif PDF-də ayrıca verilməyib. Lakin PDF-dən çıxarılan kontekstə əsasən: Aktuatorlar idarəetmə siqnalını mexaniki hərəkətə çevirən elementlərdir. PDF-də aktuator kimi əsasən elektrik mühərrikləri (DC mühərriklər, addım mühərrikləri, servo mühərriklər) istifadə olunur. Onlar idarəetmə blokun göndərdiyi siqnala əsasən robot qolunun hissələrini hərəkət etdirir.

---

## 48. Simulink Matlab və Code Composer Studio arasında proqram təminatının prosessora yüklənmə prosesini mərhələli şəkildə izah edin

PDF-dən (Şəkil 5.8):

Proses Simulink ilə başlayır:

1. **Mərhələ 1**: İstifadəçi prosesə başladıqdan sonra Simulink bloklarla hazırlanmış proqramı işə salır və Matlaba göndərir.

2. **Mərhələ 2**: Matlab, CCS (Code Composer Studio) proqramı açıq deyilsə, CCS proqramını işlədir və məlumatlar CCS proqramına göndərilir.

3. **Mərhələ 3**: Matlab-dan CCS proqramına daxil olan məlumata görə C kodları hazırlanır. Bu arada Matlab yenidən Code Composer Setup proqramını açır.

4. **Mərhələ 4**: Code Composer Setup proqramı tərəfindən qurulan əlaqə vasitəsilə montaj kodları dok stansiyasına (TMS320F28335) göndərilir və prosessora yazılır.

5. **Mərhələ 5**: Bu proses proqramın ölçüsündən asılı olaraq bir neçə dəqiqə çəkə bilər. Proseslər CCS ekranında izlənilə bilər.

**Hər proqramın funksiyası:**
- **Simulink** – blok diaqramlarla proqram hazırlanır
- **Matlab** – Simulink ilə CCS arasında əlaqəni təmin edir, kompilyasiyanı idarə edir
- **CCS (Code Composer Studio)** – kompilyator kimi çıxış edir, C kodları hazırlayır
- **Code Composer Studio Setup** – TMS320F28335 eksperimentator dəsti ilə əlaqə yaratmaq üçün istifadə olunur

---

## 49. RTDX texnologiyasının robot qolunun idarə olunmasında rolunu izah edin

PDF-dən:

Bələdçi (Guide) pəncərəsi ilə robot qolu arasındakı əlaqə real vaxt məlumat mübadiləsi (**RTDX** - Real Time Data Exchange) vasitəsilə həyata keçirilir.

İstifadəçinin Bələdçi pəncərəsindən daxil etdiyi koordinat məlumatı RTDX vasitəsilə prosessora ötürülür və robot qolunun həmin koordinatlara getməsi təmin edilir.

Beləliklə, RTDX texnologiyası prosessor işləyərkən real zamanda istifadəçi interfeysi ilə prosessor arasında məlumat mübadiləsini təmin edir.

---

## 50. Robot qolunun idarə olunması üçün istifadə olunan aparat hissələrini sadalayın və onların sistemdəki əsas funksiyalarını qısa şəkildə izah edin

PDF-dən:

1. **TMS320F28335 Təcrübə Dəsti (Prosessor)** – Texas Instruments-dən olan prosessor lövhəsidir. CCS ilə əlaqə saxlaya bilər və proqram təminatını prosessora yükləyə bilər. Robot qolunun əsas idarəetmə beynidir.

2. **DC mühərriklər** – Robot qolunun əsas hərəkət mənbəyidir. Ox1 və Ox2 birləşmələrində istifadə olunur.

3. **Mini DC Servo Motor (HX12K)** – Alt üfüqi oxda istifadə edilir, PWM siqnalı ilə idarə olunur, 10 Kg.sm fırlanma momenti verir.

4. **Kodlayıcılar (Enkoderlər)** – Mühərriklərin mövqeyi haqqında məlumat verir. Opkon PRI50 modeli 1024 impuls/dövrə siqnal çıxışı verir, 3 çıxış kanalına malikdir (A, B, X).

5. **L293B Motor Sürücü IC** – 4 kanallı motor sürücüsüdür. DC mühərrikləri idarə edir. 4 fərqli mühərriki eyni anda idarə etməyə imkan verir.

6. **PC817 Optokupllar** – Prosessor və L293B arasında müdafiə üçün yerləşdirilir.

7. **Sürücü lövhəsi** – İnteqrasiya olunmuş optokupl və L293B-dən ibarətdir.

8. **Reduktorlar (Sürət qutuları)** – Mühərriklərin fırlanma momentini artırmaq və sürətini azaltmaq üçün istifadə olunur.
