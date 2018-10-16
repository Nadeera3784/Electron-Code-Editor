
    
    // --- Constants ---
    var SIZE_ANY        = 0,
        SIZE_SHORT      = 1,
        SIZE_MEDIUM     = 2,
        SIZE_LONG       = 3,
        SIZE_VERY_LONG  = 4;
    
    var DEFAULT_UNIT_TYPE   = "paragraph",
        DEFAULT_UNIT_COUNT  = 1,
        DEFAULT_UNIT_SIZE   = SIZE_MEDIUM,
        DEFAULT_IS_WRAPPED  = true,
        DEFAULT_WRAP_WIDTH  = 80,
        DEFAULT_IS_HTML     = false,
        DEFAULT_SHOW_HELP   = false;
    
    
    var HELP_URL = "https://github.com/YoruNoHikage/brackets-lorem-breizhum#how-to-use-lorem-breizhum-generator";
    
    // --- Private members
    var _allSizes = [ SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG ];
    
    var _shortWords     = [ // Words with less than four letters
        "ael", "aer", "aes", "aes", "aet", "ali", "ali", "all", "anv", "aod", "aon", "bag", "Baz", "bed", "beg", "bev", "bez", "biz", "bod", "bro",
        "da", "dek", "den", "den", "dir", "don", "dor", "dra", "dre", "du", "du", "du", "e", "e", "e", "e", "eil", "eme", "eñ", "eno", "eo", "eor",
        "eta", "eur", "eus", "fri", "fur", "gar", "ger", "giz", "giz", "giz", "goz", "hag", "he", "he", "he", "hep", "hi", "hir", "hol", "hol", "hon",
        "hon", "hor", "hor", "jod", "kae", "kar", "kas", "kav", "ken", "ken", "ker", "kêr", "kêr", "kêr", "ki", "kig", "kof", "las", "ler", "liv",
        "liv", "liv", "loa", "lun", "lur", "ma", "mab", "mae", "mar", "mat", "mat", "me", "me", "mel", "met", "mil", "miz", "mor", "mui", "na", "nag",
        "nav", "ni", "niz", "noz", "o", "oan", "pa", "pal", "pe", "pe", "pep", "per", "piv", "piz", "pod", "pri", "rak", "re", "re", "ret", "rev",
        "ruz", "sae", "spi", "sul", "Sun", "tad", "tal", "tan", "te", "ti", "tog", "tre", "tri", "tro", "tu", "tud", "vi", "war", "ya", "yar", "yen",
        "yod"
    ];
    
    var _mediumWords    = [ // Words with four to six letters
        "a zo", "a-bell", "a-bell", "a-benn", "a-bezh", "a-hed", "a-raok", "abaoe", "abeg", "abeg", "abred", "adarre", "adarre", "ahont", "aketus",
        "alies", "amañ", "amezeg", "ampart", "amzer", "anal", "anal", "anzav", "aotre", "aotrou", "aotrou", "aour", "aozañ", "ar re", "ar re",
        "arabat", "arar", "arat", "arc'h", "armel", "arnev", "arvar", "asied", "askell", "askorn", "atav", "aval", "avat", "avat", "avel", "azezañ",
        "bagad", "bagad", "bale", "bale", "bank", "bann", "banne", "bara", "barv", "bazh", "beaj", "beajiñ", "beleg", "bemdez", "bemnoz", "benveg",
        "bered", "bern", "berr", "betek", "beuziñ", "beuziñ", "bevañ", "bier", "bihan", "biken", "birviñ", "bleud", "bleun", "blev", "bloaz", "blot",
        "bodañ", "bodet", "bodet", "bolz", "botez", "boued", "boull", "boutañ", "bouton", "bouzar", "bragoù", "brank", "bras", "brav", "Breizh",
        "bremañ", "Brest", "breur", "brezel", "Briad", "brodañ", "broust", "brozh", "brozh", "brudet", "bruzun", "buan", "bugale", "bugel", "buhez",
        "buoc'h", "butun", "c'hewz", "c'hoar", "c'hwi", "chal", "chapel", "chase", "chom", "chom", "daeroù", "dale", "dall", "dant", "dañvad",
        "danvez", "daou", "darev", "darev", "darn", "dastum", "debriñ", "dec'h", "degas", "dehou", "deiz", "delioù", "deskiñ", "devezh", "diaes",
        "dianav", "diaoul", "dibab", "dienn", "difenn", "digant", "digor", "digor", "dija", "dilhad", "dilun", "dindan", "diouzh", "dirak", "diskar",
        "diskar", "disul", "divjod", "diwall", "diwall", "diwar", "diwezh", "dlead", "dleout", "doare", "doñjer", "dont", "doñv", "doñv", "doñv",
        "dorn", "douar", "dougen", "doujañ", "dour", "dreist", "dremm", "dremm", "droug", "droug", "e-mesk", "e-pad", "ebeul", "ebrel", "echu",
        "echuiñ", "eeun", "eeun", "eget", "egile", "ehan", "eizh", "elgez", "embann", "en-dro", "enep", "enor", "envel", "eost", "eost", "eoul",
        "erc'h", "Erwan", "esaeañ", "etre", "eured", "eured", "Europa", "Eusa", "evañ", "evel", "evezh", "evit", "eürus", "ezel", "ezhomm", "fall",
        "farsus", "farsus", "fazi", "fazi", "feiz", "fiñval", "flamm", "foenn", "formaj", "forn", "fresk", "froud", "frout", "galleg", "gallek",
        "galv", "ganet", "gant", "gant", "gaou", "garm", "garmiñ", "garv", "gavr", "genou", "genver", "geot", "gervel", "glas", "glav", "gleb",
        "gleb", "glin", "gloan", "goañv", "godell", "goleiñ", "golo", "golo", "gorre", "gortoz", "goude", "gouel", "gouel", "gouere", "gouest",
        "gouez", "goullo", "goulou", "gounez", "gounit", "gouriz", "graet", "Groe", "gwad", "Gwaien", "gwaz", "gwaz", "gwaz", "gwazh", "gwech",
        "gwele", "gwenan", "Gwened", "gwener", "gwenn", "gwer", "gwer", "gwern", "gwez", "gwin", "gwir", "gwriat", "hadañ", "hanter", "harp", "harz",
        "harzoù", "hejañ", "hemañ", "hent", "hent", "heñvel", "heol", "hepken", "hervez", "hini", "hini", "hiziv", "holen", "holl", "holl", "homañ",
        "houad", "houarn", "huchal", "huñvre", "ifern", "ijinañ", "ilin", "iskis", "istor", "itron", "ivez", "ivin", "izel", "kador", "kaer", "kaier",
        "kalet", "kalon", "kalz", "kambr", "kanañ", "kann", "kant", "kaol", "kaoued", "kaout", "kargañ", "karout", "karr", "karr", "karrez", "kasoni",
        "kavout", "kazh", "kefe", "kegin", "kein", "kelc'h", "kelenn", "kelien", "keloù", "Kembre", "kemmañ", "Kemper", "ken na", "kenavo", "kentañ",
        "kentel", "kerc'h", "Kernev", "kerzu", "keuz", "keuz", "kezeg", "kibell", "kiger", "kilañ", "kilhog", "klañv", "klask", "kleiz", "kleuz",
        "kloc'h", "klouar", "kloued", "koad", "koan", "koant", "koar", "koef", "koll", "komz", "komz", "kontañ", "kontañ", "korf", "korn", "korn",
        "kotoñs", "kouevr", "kozh", "kraou", "krediñ", "kregiñ", "kregiñ", "kreion", "kreiz", "kreñv", "krib", "kribañ", "kriz", "kroaz", "kromm",
        "Krouer", "krouiñ", "kurun", "kustum", "kustum", "kuzh", "kuzh", "kuzhat", "kzaeg", "labous", "laer", "laezh", "lagad", "lakaat", "lamm",
        "lamm", "lammat", "lamp", "lann", "Lanuon", "laouen", "lazhañ", "leal", "lec'h", "lec'h", "ledan", "lein", "lein", "lemm", "lemm", "lenn",
        "lenn", "lerenn", "leskiñ", "lestr", "lestr", "leue", "leun", "leur", "levr", "lezel", "lezenn", "lien", "lies", "Liger", "linenn", "liorzh",
        "lipat", "livañ", "livet", "lizher", "loar", "loen", "loer", "logod", "lonkañ", "lost", "louet", "lous", "maen", "magañ", "mall", "mamm",
        "maneg", "maouez", "marc'h", "marv", "matezh", "melen", "melen", "menez", "menoz", "menoz", "merc'h", "merenn", "merkañ", "merkañ", "mervel",
        "meskañ", "mestr", "metrad", "meurzh", "meurzh", "mevel", "mevel", "mezher", "mignon", "milin", "mintin", "mirout", "mirout", "moan", "moc'h",
        "moereb", "moged", "moger", "mont", "montr", "mouezh", "moulañ", "muzell", "muzul", "nadoz", "naer", "naer", "naet", "nann", "naon", "Naoned",
        "nebeut", "nec'h", "nec'h", "nemet", "neñv", "nerzh", "netra", "neud", "neuiñ", "neuze", "nevez", "nevez", "nijal", "niver", "nizez", "noazh",
        "oabl", "oaled", "ober", "ober", "oentr", "onest", "ouzh", "padout", "paeañ", "pakad", "pakañ", "paner", "paot", "paotr", "paotr", "paouez",
        "paour", "paper", "park", "Pask", "pediñ", "pediñ", "pegañ", "pegeit", "pegen", "pehini", "pehini", "pell", "pell", "pemp", "pemzek",
        "penaos", "penn", "pennad", "peoc'h", "perak", "pesk", "petra", "pevar", "pignat", "pignat", "piler", "plac'h", "plac'h", "plad", "plant",
        "plouz", "pluenn", "poan", "poan", "poazh", "pobl", "poent", "poent", "pomper", "pont", "porzh", "porzh", "poull", "poull", "prad", "pred",
        "prenañ", "preñv", "prest", "priz", "puñs", "rannañ", "razh", "redek", "regiñ", "reiñ", "reizh", "ribl", "rimiañ", "riskl", "roc'h", "roched",
        "rodell", "roll", "romant", "roud", "rumm", "rumm", "sac'h", "sachañ", "sadorn", "sailh", "sankañ", "saout", "sec'h", "seitek", "seiz",
        "seizh", "sell", "señin", "sentiñ", "setu", "setu", "seul", "sevel", "sevel", "sevel", "sioul", "sistr", "sivi", "siwazh", "siwazh", "sizhun",
        "skañv", "skeud", "skiant", "sklaer", "skorn", "skouer", "skubañ", "skuizh", "soavon", "solier", "soñj", "soñj", "soñjal", "soubañ", "spont",
        "stag", "stagañ", "stal", "stank", "start", "start", "stêr", "stouiñ", "stourm", "stourm", "strad", "stumm", "stur", "sukr", "tabut", "tach",
        "taer", "tagañ", "tamall", "tamm", "taol", "taol", "tarv", "tasenn", "tavarn", "tenn", "tenn", "tennañ", "teñval", "teod", "terriñ", "teurel",
        "tevel", "ti-kêr", "toenn", "tomm", "torfed", "tost", "tost", "toull", "tour", "traezh", "traezh", "traoñ", "trec'h", "tregas", "treiñ",
        "tremen", "treñ", "tresañ", "tresañ", "treut", "trizek", "troad", "trouz", "truez", "ugent", "uhel", "unan", "unnek", "urzh", "yac'h",
        "yac'h", "yalc'h", "yaou", "yezh", "zoken"
    ];
    
    var _longWords      = [ // Words with seven to ten letters
        "a-dreuz", "a-us da", "a-walc'h", "a-wechoù", "abardaez", "ac'hano", "adaozañ", "adaozañ", "alc'houez", "amanenn", "amprevan", "an Orient",
        "anavezout", "antronoz", "ar Gerveur", "ar gwellañ", "ar gwellañ", "ar muiañ", "ar re all", "arc'hant", "arrebeuri", "aval-douar", "bandenn",
        "banniel", "banniel", "baradoz", "beajour", "beg-douar", "berrloer", "biskoazh", "biz-bihan", "biz-bras", "biz-meud", "biz-yod", "bleunioù",
        "bloavezh", "bourc'h", "boutailh", "Brasparz", "breur-kaer", "brezhoneg", "Bro-C'hall", "Bro-saoz", "Bro-Skos", "broustañ", "bruched",
        "brumenn", "burzhud", "butuniñ", "c'hoant", "c'hoant", "c'hoari", "c'hoarzhin", "c'hoazh", "c'hwec'h", "c'hwevrer", "c'hwezek", "c'hwezhañ",
        "chadenn", "chaseal", "chaseour", "chokolad", "da gentañ", "daou-ugnet", "daouarn", "daoudroad", "daoulagad", "daoust ha", "daouzek",
        "darn-muiañ", "degemer", "deiz mat", "den ebet", "derc'hel", "derc'hent", "digalon", "digalon", "digarez", "digempenn", "digwener",
        "dihuniñ", "dimerc'her", "dimeurzh", "dimezell", "dimeziñ", "diouzhtu", "diriaou", "disadorn", "disheol", "diskenn", "diskenn", "diskiant",
        "diskiant", "dispign", "distagañ", "distreiñ", "distreiñ", "divalav", "divskouarn", "diwar-benn", "diwezhañ", "diwezhat", "Douarnenez",
        "doujañs", "dre-holl", "droug-mor", "e-barzh", "e-dreñv", "e-keit-se", "e-keñver", "e-kichen", "e-lec'h", "eizhvet", "en diwezh",
        "en un taol", "endervezh", "enebour", "er-maez", "etrezek", "evel-se", "evel-se", "falc'hat", "fellout", "feunten", "fiziañs", "flourañ",
        "follenn", "fourchetez", "fraoñval", "fraoñval", "frouezh", "fuzuilh", "gallout", "glac'har", "glebiañ", "gouelañ", "gouiziek", "goulenn",
        "gousperoù", "goustad", "gouzañv", "gouzañv", "gouzoug", "gouzout", "grizilh", "gwalc'hiñ", "gwalenn", "gwalenn", "gwaskañ", "gwastell",
        "gwec'h-mañ", "gwech ebet", "gwechall", "gwelloc'h", "gwelloc'h", "gwelout", "Gwengamp", "gwengolo", "gwenodenn", "gwerenn", "gwerenn",
        "gwerzhañ", "gwinegr", "gwinizh", "gwirionez", "gwiskamant", "gwiskañ", "gwiskañ", "gwrierez", "hag all", "hantereur", "hanternoz",
        "hanternoz", "harzhal", "hegarat", "hennezh", "hennont", "hep arvar", "heuliañ", "hevelep", "hevelep", "hevelep", "honnezh", "honnont",
        "horolaj", "horolaj", "houlenn", "huanadiñ", "jiletenn", "kaeraat", "kaeraat", "kalonek", "kaozeadenn", "karantez", "kardeur", "karr-tann",
        "karrezek", "kartoñs", "kastell", "kazetenn", "kelc'hiek", "kelenner", "kemener", "kement ha", "kempenn", "kempenn", "ken lies", "kenderv",
        "keniterv", "kennebeut", "kenwerzh", "kerc'hat", "kerkent", "kerzhout", "kilometrad", "kilpenn", "kleñved", "klevout", "kluchañ", "kompren",
        "kontadenn", "kontadenn", "kontell", "kontrol", "kouezhañ", "koulskoude", "koulz ha", "koumanant", "koumoul", "kousket", "koustañ",
        "kreisteiz", "kreisteiz", "kreskiñ", "kreskiñ", "kreskiñ", "kroc'hen", "kuz'h-heol", "kuzuliañ", "labourat", "laerezh", "laerezh",
        "Landreger", "lavarout", "lec'h all", "legumaj", "leziregezh", "lezirek", "lizherenn", "lunedoù", "mab-bihan", "mab-kaer", "mamm-gaer",
        "mamm-gozh", "mantell", "mar plij", "marc'had", "marennañ", "marteze", "martolod", "medisin", "melezour", "Menez Arre", "Menez Du",
        "merc'hed", "merc'her", "mezheven", "micherour", "mignonez", "miliner", "mont kuit", "Montroulez", "Mor Bihan", "Mor Breizh", "morzhol",
        "mouchouer", "muioc'h", "munutenn", "naetaat", "naontek", "nebeutoc'h", "nec'hin", "nec'hin", "Nedeleg", "niverenn", "niverenn", "ober goap",
        "oferenn", "ostaleri", "ouzhpenn", "ouzhpenn", "paotred", "paotrig", "patatez", "pegement", "pegoulz", "pelec'h", "penn-araok", "peogwir",
        "perc'henn", "pesketa", "pesketaer", "peurvuiañ", "pevarzek", "pinvidik", "piz bihañ", "pla'hig", "planken", "pleg-mor", "plijadur",
        "plijout", "poazhañ", "POD -LIV", "porpant", "poultrenn", "pounner", "prenestr", "prennañ", "prizius", "purgator", "reolenn", "respont",
        "respont", "Roazhon", "ruilhañ", "sal-debriñ", "Sant-Brieg", "Sant-Malo", "Sant-Nazer", "santout", "santout", "sav-heol", "saveteiñ",
        "seblantout", "sec'hañ", "sec'hed", "seizhvet", "sellout", "servijañ", "sigaretenn", "siminal", "sizailh", "skalier", "skeudenn", "skevent",
        "skignañ", "sklerijenn", "skolaer", "skouarn", "skrabañ", "skrijañ", "skuizhañ", "soubenn", "soudard", "spontus", "stlakañ", "tachenn",
        "tad-kaer", "tad-kozh", "talvezout", "talvoudus", "talvoudus", "tavañjer", "tavarnour", "tec'hout", "tiegezh", "torchañ", "torgenn",
        "touellañ", "toullañ", "tour-tan", "traonienn", "tregont", "treuziñ", "tri-ugent", "triwec'h", "tro-vrec'h", "troc'hañ", "trubard",
        "trugarez", "uhelder", "un tammig", "va Doue", "voulouz", "war-dre", "war-dro", "war-lec'h", "war-raok", "warc'hoazh", "warlene", "yaouank",
        "yaouankiz", "yec'hed", "yenijenn"
    ];
    
    var _veryLongWords  = [ // Words with more than ten letters
        "a-greiz-holl", "ankouna'haat", "armel-levrioù", "bag dre lien", "bag-dre-dan", "barrad-glav", "biz-gwalenn", "Breizh-Izel", "Breizh-Uhel",
        "Breizh-Veur", "c'hoar-gaer", "c'hoarvezout", "c'hoarvezout", "c'hwec'hvet", "c'hwezhañ e fri", "d'a-vihanañ", "degouezhout", "deiz ar bloaz",
        "dilhad-gwele", "dilhad-kerf", "diskar-amzer", "diwar ar maez", "dont a-benn", "dont a-benn", "doug-pluenn", "dreist-holl", "dreist-holl",
        "forzh penaos", "gourc'hemenn", "gourc'hemennoù", "hanter-kant", "hent-houarn", "kambrig-kibellañ", "karr-beajourien", "kerkoulz ha",
        "Konk-Kernev", "koulz-amzer", "Menez Mikael", "merc'h-gaer", "merc'h-vihan", "meur a gwech", "Mor Atlantel", "mousc'hoarzhin", "n'eus forzh",
        "nevez-amzer", "ober e venoz", "ober war-dro", "pevar-ugent", "poull-kalon", "sal-degemer", "tachenn-c'hoari", "tamm-ha-tamm",
        "tennañ e anal", "teñvalijenn", "ti-hent-houarn", "tra bennak", "tro-c'houzoug"
    ];
    
    var _allWords = _shortWords.concat(_mediumWords, _longWords, _veryLongWords);
    
    // Sentence fragment patterns, based off of randomly selected Latin phrases.
    // Used to build all sentences and paragraphs.
    var _fragmentPatterns = [
        // Three words
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_VERY_LONG],
        [SIZE_SHORT, SIZE_SHORT, SIZE_VERY_LONG],
        [SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG],
        [SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
        [SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG],
        [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG],
        [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM],
        [SIZE_LONG, SIZE_SHORT, SIZE_LONG],
        [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG],
        
        // Four words
        [SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG, SIZE_VERY_LONG],
        [SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_LONG],
        [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_LONG],
        [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_VERY_LONG],
        [SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_LONG, SIZE_MEDIUM, SIZE_LONG, SIZE_LONG],
        [SIZE_LONG, SIZE_VERY_LONG, SIZE_SHORT, SIZE_LONG],
        
        // Five words
        [SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG],
        [SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_MEDIUM, SIZE_SHORT, SIZE_SHORT, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM],
        [SIZE_MEDIUM, SIZE_LONG, SIZE_SHORT, SIZE_MEDIUM, SIZE_MEDIUM],
        [SIZE_MEDIUM, SIZE_VERY_LONG, SIZE_LONG, SIZE_MEDIUM, SIZE_LONG],
        [SIZE_LONG, SIZE_MEDIUM, SIZE_SHORT, SIZE_LONG, SIZE_VERY_LONG],
        [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_SHORT, SIZE_MEDIUM],
        [SIZE_LONG, SIZE_MEDIUM, SIZE_MEDIUM, SIZE_LONG, SIZE_MEDIUM]
    ];
    
    // --- Utility Functions
    function _getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    function _isNumber(value) {
        return (typeof value === "number") && (isFinite(value));
    }

    // From http://james.padolsey.com/javascript/wordwrap-for-javascript/
    function _wordwrap(str, width, brk, cut) {
        brk = brk || "\n";
        width = width || 75;
        cut = cut || false;
        
        if (!str) { return str; }
        
        var regex = ".{1," + width + "}(\\s|$)" + (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");
        
        return str.match(new RegExp(regex, "g")).join(brk);
    }
    
    // --- Lorem Breizhum helper functions
    function _getRandomWord(size) {
        var wordArray = [];
        
        switch (size) {
        case SIZE_ANY:
            wordArray = _allWords;
            break;
        case SIZE_SHORT:
            wordArray = _shortWords;
            break;
        case SIZE_MEDIUM:
            wordArray = _mediumWords;
            break;
        case SIZE_LONG:
            wordArray = _longWords;
            break;
        case SIZE_VERY_LONG:
            wordArray = _veryLongWords;
            break;
        default:
            wordArray = _allWords;
        }
        
        return _getRandomElement(wordArray);
    }
    
    function _getRandomWords(count) {
        var finalText   = "",
            i           = 0;
        
        for (i = 0; i < count; i++) {
            finalText += _getRandomWord(SIZE_ANY);
            finalText += " ";
        }
        
        finalText = finalText.trim();
        return finalText;
    }
    
    function _getRandomFragment() {
        var pattern     = [],
            i           = 0,
            finalText   = "";
            
        pattern = _getRandomElement(_fragmentPatterns);
        
        for (i = 0; i < pattern.length; i++) {
            finalText += _getRandomWord(pattern[i]);
            finalText += " ";
        }
        
        finalText = finalText.trim();
        return finalText;
    }
    
    function _getSentenceConnector() {
        var finalText = "";
        
        if (Math.random() < 0.5) {
            finalText += ", ";
        } else {
            finalText += " ";
            finalText += _getRandomWord(SIZE_SHORT);
            finalText += " ";
        }
        
        return finalText;
    }
    
    function _getRandomSentence(size) {
        var randomSize  = DEFAULT_UNIT_SIZE,
            finalText   = "";
        
        switch (size) {
        case SIZE_ANY:
            randomSize =  _getRandomElement(_allSizes);
            finalText  += _getRandomSentence(randomSize);
            break;
        case SIZE_SHORT:
            finalText += _getRandomFragment();
            break;
        case SIZE_MEDIUM:
            finalText += _getRandomSentence(SIZE_SHORT);
            finalText += _getSentenceConnector();
            finalText += _getRandomSentence(SIZE_SHORT);
            break;
        case SIZE_LONG:
            finalText += _getRandomSentence(SIZE_MEDIUM);
            finalText += _getSentenceConnector();
            finalText += _getRandomSentence(SIZE_MEDIUM);
            break;
        case SIZE_VERY_LONG:
            finalText += _getRandomSentence(SIZE_LONG);
            finalText += _getSentenceConnector();
            finalText += _getRandomSentence(SIZE_LONG);
            break;
        default:
            finalText += _getRandomSentence(DEFAULT_UNIT_SIZE);
        }
        
        return finalText;
    }
    
    function _getRandomSentences(count, size) {
        var i           = 0,
            sentence    = "",
            finalText   = "";
        
        for (i = 0; i < count; i++) {
            sentence    = _getRandomSentence(size);
            sentence    = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";
            finalText   += sentence.trim();
            finalText   += "\n\n";
        }
        
        finalText = finalText.trim();
        return finalText;
    }
    
    function _getRandomParagraph(size) {
        var finalText       = "",
            sentenceCount   = 0,
            i               = 0,
            sentence        = "";
        
        switch (size) {
        case SIZE_SHORT:
            sentenceCount = 3 + Math.floor(Math.random() * 2); // Three or four sentences
            for (i = 0; i < sentenceCount; i++) {
                sentence    = _getRandomSentence(SIZE_ANY);
                sentence    = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";
                finalText   += sentence;
            }
            break;
        case SIZE_MEDIUM:
            finalText += _getRandomParagraph(SIZE_SHORT);
            finalText += _getRandomParagraph(SIZE_SHORT);
            break;
        case SIZE_LONG:
            finalText += _getRandomParagraph(SIZE_MEDIUM);
            finalText += _getRandomParagraph(SIZE_MEDIUM);
            break;
        case SIZE_VERY_LONG:
            finalText += _getRandomParagraph(SIZE_LONG);
            finalText += _getRandomParagraph(SIZE_LONG);
            break;
        default:
            finalText += _getRandomParagraph(DEFAULT_UNIT_SIZE);
        }
        
        return finalText;
    }
    
    function _getRandomParagraphs(count, size) {
        var i           = 0,
            paragraph   = "",
            finalText   = "";
        
        for (i = 0; i < count; i++) {
            paragraph   = _getRandomParagraph(size);
            finalText   += paragraph.trim();
            finalText   += "\n\n";
        }
        
        finalText = finalText.trim();
        return finalText;
    }
    
    function _getRandomLinks(count) {
        var i           = 0,
            finalText   = "";
        
        for (i = 0; i < count; i++) {
            finalText   += "<a href='http://www.brackets.io'>";
            finalText   += _getRandomFragment();
            finalText   += "</a><br/>\n";
        }
        
        finalText = finalText.substring(0, (finalText.length - "<br/>\n".length));
        return finalText;
    }
    
    function _getRandomList(count, isOrdered) {
        var i           = 0,
            finalText   = "";
        
        finalText += (isOrdered ? "<ol>" : "<ul>") + "\n";
        
        for (i = 0; i < count; i++) {
            finalText   += "<li>";
            finalText   += _getRandomFragment();
            finalText   += "</li>\n";
        }
        
        finalText += (isOrdered ? "</ol>" : "</ul>");
        return finalText;
    }

    // -- Public methods
    function parseCommand(command) {
        var i,
            commandArray    = command.split("_"),
            optionRegExp    = null,
            optionResult    = [],
            optionString    = "",
            optionInt       = 0,
            finalText       = "";
        
        // Command options
        var unitType    = DEFAULT_UNIT_TYPE,
            unitCount   = DEFAULT_UNIT_COUNT,
            unitSize    = DEFAULT_UNIT_SIZE,
            isWrapped   = DEFAULT_IS_WRAPPED,
            wrapWidth   = DEFAULT_WRAP_WIDTH,
            isHTML      = DEFAULT_IS_HTML,
            showHelp    = DEFAULT_SHOW_HELP;
        
        // Parse the command string
        for (i = 1; i < commandArray.length; i++) {
            
            if (commandArray[i] === "") {
                if (i === (commandArray.length - 1)) {
                    return "Error: Unrecognized option '_'.";
                } else {
                    return "Error: Two or more underscore characters adjacent to each other.";
                }
            }
            
            optionRegExp    = /^([a-z\?]+)(\d*)$/;  // _[option][number], e.g. _p3, _wrap40
            optionResult    = commandArray[i].match(optionRegExp);
            
            if (optionResult) {
                optionString   = optionResult[1];
                optionInt      = parseInt(optionResult[2], 10);
            } else {
                optionRegExp    = /^(\d*)([a-z\?]+)$/; // _[number][option], e.g. _3p, _40wrap
                optionResult    = commandArray[i].match(optionRegExp);
                
                if (optionResult) {
                    optionInt      = parseInt(optionResult[1], 10);
                    optionString   = optionResult[2];
                } else {
                    // Unrecognized option
                    return "Error: Unrecognized option '_" + commandArray[i] + "'.";
                }
            }
            
            switch (optionString) {
            case "p":
                unitType = "paragraph";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "w":
                unitType = "word";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "s":
                unitType = "sentence";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "short":
                unitSize = SIZE_SHORT;
                break;
            case "medium":
                unitSize = SIZE_MEDIUM;
                break;
            case "long":
                unitSize = SIZE_LONG;
                break;
            case "vlong":
                unitSize = SIZE_VERY_LONG;
                break;
            case "nowrap":
                isWrapped = false;
                break;
            case "wrap":
                isWrapped = true;
                wrapWidth = (_isNumber(optionInt)) ? optionInt : DEFAULT_WRAP_WIDTH;
                break;
            case "link":
                unitType = "link";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "ol":
                unitType = "orderedList";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "ul":
                unitType = "unorderedList";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "fortune":
                unitType = "fortune";
                unitCount = (_isNumber(optionInt)) ? optionInt : DEFAULT_UNIT_COUNT;
                break;
            case "html":
                isHTML = true;
                break;
            case "help":
            case "?":
                showHelp = true;
                break;
            default:
                // Unrecognized option
                return "Error: Unrecognized option '_" + commandArray[i] + "'.";
            }
        }
        
        if (showHelp) {
            finalText = "";
        } else {
            switch (unitType) {
            case "paragraph":
                finalText = _getRandomParagraphs(unitCount, unitSize);
                break;
            case "sentence":
                finalText = _getRandomSentences(unitCount, unitSize);
                break;
            case "word":
                finalText = _getRandomWords(unitCount);
                break;
            case "link":
                finalText = _getRandomLinks(unitCount);
                break;
            case "orderedList":
                finalText = _getRandomList(unitCount, true);
                break;
            case "unorderedList":
                finalText = _getRandomList(unitCount, false);
                break;
            default:
                finalText = _getRandomParagraphs(DEFAULT_UNIT_COUNT, DEFAULT_UNIT_SIZE);
            }
            
            // To avoid badly formatted HTML, links and lists are never word wrapped
            if ((/^(link|orderedList|unorderedList)$/.test(unitType))) {
                isWrapped = false;
            }
            
            if (isWrapped) {
                if (wrapWidth && (wrapWidth > 0)) {
                    finalText = _wordwrap(finalText, wrapWidth);
                } else {
                    finalText = _wordwrap(finalText, DEFAULT_WRAP_WIDTH);
                }
            }
            
            // Ignore _html option for lists, should never be in paragraphs.
            if ((/^(orderedList|unorderedList)$/.test(unitType))) {
                isHTML = false;
            }
            
            if (isHTML) {
                if ((/^(paragraph|sentence|fortune)$/.test(unitType))) {
                    // Wrap each individual paragraph, sentence, or fortune
                    finalText = finalText.replace(/\n{2,}/g, "\n</p>\n\n<p>\n");
                }
                
                finalText = "<p>\n" + finalText + "\n</p>";
            }
        }
        
        return finalText;
    }
    
    // --- Public API ---
exports.parseCommand = parseCommand;