if ((window.location.host.indexOf('transifex') !== -1) || window.location.search.startsWith('?tfxpreview') || window.location.search.startsWith('?transifex')) {
  (function() {
    window.liveSettings={api_key:"cdbb199282754614bb488676c54fcc7b"};
    var script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute('src', '//cdn.transifex.com/live.js');
    document.head.appendChild(script_tag);

    var add_translate_timer = setInterval(function() {
      var language_picker = document.getElementById('tx-live-lang-picker')
      if (language_picker) {
        clearInterval(add_translate_timer);
        var help_translate = document.createElement('li');
        help_translate.setAttribute('onclick', 'window.location.href="https://www.transifex.com/gkovacs/unetbootin-website/"');
        help_translate.setAttribute('data-value', 'en');
        help_translate.innerHTML = 'Translate';
        language_picker.appendChild(help_translate);
        document.querySelector('#tx-live-lang-container').style.display = 'block';
      }
    }, 100);
  })();
} else {
var helpful_message_translations = {
  // from https://www.tensorflow.org/install/gpu
  'en': 'Was this page helpful?',
  'es': '¿Te sirvió esta página?',
  'fr': 'Cette page vous a-t-elle été utile?',
  'zh': '此页内容对您有帮助吗？',
  'zh-CN': '此页内容对您有帮助吗？',
  'zh-TW': '此頁內容對您有幫助嗎？',
  'zh-HK': '此頁內容對您有幫助嗎？',
  'zh-MO': '此頁內容對您有幫助嗎？',
  'id': 'Apakah halaman ini membantu?',
  'de': 'War diese Seite hilfreich?',
  'it': 'Hai trovato utile questa pagina?',
  'pl': 'Czy ta strona była pomocna?',
  'pt': 'Esta página foi útil?',
  'pt-BR': 'Esta página foi útil?',
  'pt-PT': 'Esta página foi útil?',
  'vi': 'Trang này có hữu ích không?',
  'tr': 'Bu sayfayı yararlı buldunuz mu?',
  'ru': 'Вы нашли то, что искали?',
  'he': 'האם הדף הזה הועיל לך?',
  'ar': 'هل كان المحتوى في هذه الصفحة مفيدًا؟',
  'fa': 'این صفحه مفید بود؟',
  'hi': 'क्या इस पेज से कोई मदद मिली?',
  'bn': 'এই পেজটি কি সহায়ক ছিল?',
  'th': 'หน้านี้มีประโยชน์ไหม?',
  'ja': 'このページはお役に立ちましたか？',
  'ko': '이 페이지가 도움이 되셨나요?',
  // from zendesk at https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features
  'cs': 'Byl tento článek srozumitelný?',
  'da': 'Hjalp denne artikel?',
  'el': 'Ήταν χρήσιμο αυτό το άρθρο;',
  'hu': 'Hasznos volt a leírás?',
  'ms': 'Artikel ini bermanfaat?',
  'nl': 'Was dit artikel nuttig?',
  'nb': 'Var artikkelen nyttig?',
  'no': 'Var artikkelen nyttig?',
  'ro': 'A fost acest articol de ajutor?',
  'sv': 'Var den här artikeln till hjälp?',
  'uk': 'Ця стаття допомогла?',
  // from google translate verified translations for "Was this page helpful?"
  'ca': "T'ha ajudat, aquesta pàgina?",
  // from google translate unverified translations for "Was this page helpul?"
  'gl': 'Foi útil esta páxina?',
  'az': 'Bu səhifə faydalı oldu?',
  // from google translate verified translations for "Was this article helpful?"
  // guessed
  //'ms': 'Apakah halaman ini membantu?', // indonesian as well as malaysian
}

var lang_names = {
  // from https://meta.wikimedia.org/wiki/Wiktionary#List_of_Wiktionaries
  'ar': 'العربية', 
  'az': 'Azərbaycanca',
  'bn': 'বাংলা',
  'ca': 'Català',
  'cs': 'Čeština',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'fa': 'فارسی',
  'fr': 'Français',
  'gl': 'Galego',
  'he': 'עברית',
  'hi': 'हिंदी',
  'hu': 'Magyar',
  'id': 'Bahasa Indonesia',
  'it': 'Italiano',
  'ja': '日本語',
  'ko': '한국어',
  'ms': 'Bahasa Melayu',
  'nl': 'Nederlands',
  'nb': 'Norsk (bokmål)',
  'no': 'Norsk (bokmål)',
  'pl': 'Polski',
  'pt': 'Português',
  'pt-BR': 'Português',
  'pt-PT': 'Português',
  'ro': 'Română',
  'ru': 'Русский',
  'sv': 'Svenska',
  'th': 'ภาษาไทย',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh': '中文（简体）',
  'zh-CN': '中文（简体）',
  'zh-TW': '中文（繁體）',
  'zh-HK': '中文（繁體）',
  'zh-MO': '中文（繁體）',
}

// var language_names = {
//   'en': 'English',
//   'zh-CN': '中文（中国）',
//   'es': 'Español',
// }

var lang_emojis = {
  'ar': '🇸🇦',
  'az': '🇦🇿',
  'bn': '🇧🇩',
  'ca': '🇪🇸',
  'cs': '🇨🇿',
  'da': '🇩🇰',
  'de': '🇩🇪',
  'el': '🇬🇷',
  'en': '🇺🇸',
  'en-US': '🇺🇸',
  'en-UK': '🇬🇧',
  'es': '🇪🇸',
  'fa': '🇮🇷',
  'fr': '🇫🇷',
  'gl': '🇪🇸',
  'he': '🇮🇱',
  'hi': '🇮🇳',
  'hu': '🇭🇺',
  'id': '🇮🇩',
  'it': '🇮🇹',
  'ja': '🇯🇵',
  'ko': '🇰🇷',
  'ms': '🇲🇾',
  'nb': '🇳🇴',
  'no': '🇳🇴',
  'nl': '🇳🇱',
  'pl': '🇵🇱',
  'pt': '🇧🇷',
  'pt-BR': '🇧🇷',
  'pt-PT': '🇵🇹',
  'ro': '🇷🇴',
  'ru': '🇷🇺',
  'sv': '🇸🇪',
  'th': '🇹🇭',
  'tr': '🇹🇷',
  'uk': '🇺🇦',
  'vi': '🇻🇳',
  'zh': '🇨🇳',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  'zh-HK': '🇭🇰',
  'zh-MO': '🇲🇴',
}

var lang_names_list = ['ar', 'az', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fr', 'gl', 'he', 'hu', 'it', 'ja', 'ms', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW']

// var lang_names_list = [
//   'en',
//   'ar',
//   'es',
//   'fr',
//   'zh-CN',
//   'zh-TW',
//   'vi',
// ] //.sort();

// var emoji_and_languages = {
//   'en': '🇺🇸 English',
//   'es': '🇪🇸 Español',
//   'fr': '🇫🇷 Français',
//   'zh-CN': '🇨🇳 中文（简体）',
//   'zh-TW': '🇹🇼 中文（繁體）',
//   'zh-HK': '🇭🇰 中文（繁體）',
//   'zh-MO': '🇲🇴 中文（繁體）',
// }

var mtLang = undefined
var prevMtLang = undefined

var nextBestLang = 'en'
var selectedLang = 'en'

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

var user_id = localStorage.user_id
if (user_id === undefined) {
  user_id = generateUUID()
  localStorage.user_id = user_id
}

var session_id = generateUUID() // don't want 0 as a session_id
var translation_mode = Math.floor(Math.random() * 5);
// 0 = human translation, default foreign
// 1 = human translation, default english
// 2 = MT translation, default foreign
// 3 = MT translation, default english
// 4 = no translation (english)
var human_translation = true;
if (translation_mode === 2 || translation_mode === 3 || translation_mode === 4) {
  human_translation = false;
}
var default_to_english = false;
if (translation_mode === 1 || translation_mode === 3 || translation_mode === 4) {
  default_to_english = true;
}
var translation_condition_names = [
  'HT For',
  'HT Eng',
  'MT For',
  'MT Eng',
  'No Tr',
]
var translation_condition_name = translation_condition_names[translation_mode];

function addLog(eventType, data, callback, timeLimit) {
  //console.log(eventType)
  //console.log(JSON.stringify(data))
  if (data.Lang === undefined) {
    data.Lang = selectedLang;
  }
  if (data.MtLang === undefined && mtLang !== undefined) {
    data.MtLang = mtLang;
  }
  // user id and session id also send
  var dataVersion = 4;
  var time = Date.now();
  var insert_id = generateUUID();
  var rows = {
    eventType: eventType,
    insertId: insert_id,
    userId: user_id,
    sessionId: session_id,
    clientTime: time,
    dataVersion: dataVersion,
    site: 'unetbootin.github.io',
  }
  if (callback === undefined) {
    callback = function() {};
  }
  sendData(rows, data, callback, timeLimit);
}

var initdata = {
  'Cond': translation_condition_name,
  'CondList': translation_condition_names,
  'Lang': navigator.language,
  'LangList': navigator.languages,
  'Browser': navigator.userAgent,
}
if (Intl && Intl.DateTimeFormat) {
  initdata.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

function getDocHeight() {
  var D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

function amountscrolled() {
  var winheight = window.innerHeight // $(window).height()
  var docheight = document.body.clientHeight; //$(document).height()
  var scrollTop = window.scrollY // $(window).scrollTop()
  var trackLength = docheight - winheight
  var pctScrolled = Math.floor(scrollTop/trackLength * 100) // gets percentage scrolled (ie: 80 NaN if tracklength == 0)
  return pctScrolled
}

var display_language = navigator.language

var node_list = document.querySelectorAll('*[translatable="true"]');

function substitute_template(template_text, groups) {
  for (var i = 0; i < groups.length; ++i) {
    var group = groups[i];
    template_text = template_text.split('{{' + i + '}}').join(group);
  }
  return template_text;
}

function strip_html_tags(str) {
  if ((str===null) || (str===''))
    return false;
  else
    str = str.toString();
  return str.replace(/<[^>]*>/g, '').trim();
}

function remove_spaces(str) {
  return str.split('&nbsp;').join('').split(new RegExp('\\s+')).join('')
}

function text_equal(str1, str2) {
  var str1t = strip_html_tags(str1)
  var str2t = strip_html_tags(str2)
  return remove_spaces(str1t) === remove_spaces(str2t)
}

function runOnceAvailable(query, func) {
  if (document.querySelector(query)) {
    func()
    return;
  }
  var onceRendered = setInterval(() => {
    if (!document.querySelector(query)) {
      return
    }
    func();
    clearInterval(onceRendered);
    onceRendered = undefined;
  }, 100);
}

function runOnceWindowVarExists(query, func) {
  if (window[query]) {
    func();
    return;
  }
  var onceRendered = setInterval(() => {
    if (!window[query]) {
      return
    }
    func();
    clearInterval(onceRendered);
    onceRendered = undefined;
  }, 100);
}

function runOnceTrue(queryFunc, func) {
  if (queryFunc()) {
    func();
    return;
  }
  var onceRendered = setInterval(() => {
    if (!queryFunc()) {
      return
    }
    func();
    clearInterval(onceRendered);
    onceRendered = undefined;
  }, 100);
}

function setSelectedLanguage(selected_lang) {
  selectedLang = selected_lang
  runOnceAvailable('#tx-live-lang-current', () => {
      //document.querySelector('#tx-live-lang-container').style.display = 'block';
      document.querySelector('#tx-live-lang-current').innerHTML = lang_names[selected_lang];
      if (helpful_message_translations[selected_lang] !== undefined) {
        document.querySelector('#was_this_page_helpful').innerHTML = helpful_message_translations[selected_lang]
      } else {
        // TODO remove
        document.querySelector('#was_this_page_helpful').innerHTML = helpful_message_translations['en']
      }
      if (selected_lang === 'en') {
        var prefLang = getPreferredLanguage()
        if (prefLang === 'en') {
          document.querySelector('#view_in_english_link').style.display = 'none';
          nextBestLang = 'en';
        } else {
          document.querySelector('#view_eng_lang_name').innerHTML = lang_names[prefLang]
          if (lang_emojis[prefLang] !== undefined) {
            document.querySelector('#view_eng_lang_emoji').innerHTML = lang_emojis[prefLang]
          } else {
            // TODO remove
            document.querySelector('#view_eng_lang_emoji').innerHTML = lang_emojis['en']
          }
          document.querySelector('#view_in_english_link').style.display = 'inline';
          nextBestLang = prefLang;
        }
      } else {
        document.querySelector('#view_eng_lang_name').innerHTML = lang_names['en']
        document.querySelector('#view_eng_lang_emoji').innerHTML = lang_emojis['en']
        document.querySelector('#view_in_english_link').style.display = 'inline';
        nextBestLang = 'en'
      }
    // if (translation_mode === 0) {
    //   //document.querySelector('#tx-live-lang-container').style.display = 'none';
    //   document.querySelector('#tx-live-lang-current').innerHTML = lang_names['en']
    //   document.querySelector('#was_this_page_helpful').innerHTML = helpful_message_translations['en']
    //   document.querySelector('#view_eng_lang_name').innerHTML = lang_names['en']
    //   document.querySelector('#view_eng_lang_emoji').innerHTML = lang_emojis['en']
    // } else {
    //   //document.querySelector('#tx-live-lang-container').style.display = 'block';
    //   document.querySelector('#tx-live-lang-current').innerHTML = lang_names[display_language];
    //   document.querySelector('#was_this_page_helpful').innerHTML = helpful_message_translations[display_language]
    //   document.querySelector('#view_eng_lang_name').innerHTML = lang_names['en']
    //   document.querySelector('#view_eng_lang_emoji').innerHTML = lang_emojis['en']
    // }

    if (translation_condition_name === 'No Tr') {
      document.querySelector('#view_eng_lang_name').style.display = 'none';
      document.querySelector('#view_eng_lang_emoji').style.display = 'none';
      document.querySelector('#helpful_container').style.display = 'block';
      document.querySelector('#tx-live-lang-container').style.display = 'none';
    } else {
      document.querySelector('#helpful_container').style.display = 'block';
      document.querySelector('#tx-live-lang-container').style.display = 'block';
    }
  });
  
  // console.log('making helpful_container shown');
  // runOnceAvailable('#helpful_container', () => {
  //   //if (translation_mode === 0) {
  //   //  document.querySelector('#helpful_container').style.display = 'none';
  //   //} else {
  //     document.querySelector('#helpful_container').style.display = 'block';
  //   //}
  // })

  for (var i = 0; i < node_list.length; ++i) {
    var node = node_list[i];
    var match_info = match_info_list[i];
    var translation_info;
    if (selected_lang === 'en') {
      translation_info = match_info;
    } else {
      //if (human_translation && strip_html_tags(match_info.translations[selected_lang].template) !== strip_html_tags(match_info.template)) {
      if (human_translation && !text_equal(match_info.translations[selected_lang].template, match_info.template)) {
        translation_info = match_info.translations[selected_lang];
      } else {
        translation_info = match_info.translations_mt[selected_lang];
      }
    }
    // if (translation_mode === 0) {
    //   translation_info = match_info;
    // } else if (translation_mode === 1) {
    //   translation_info = match_info.translations[display_language];
    // } else if (translation_mode === 2) {
    //   translation_info = match_info.translations_mt[display_language];
    // }
    node.innerHTML = substitute_template(translation_info.template, match_info.groups);
    //console.log(match_info.translations_mt.es.template);
  }
}

function viewInNextBestLang() {
  //setTranslationMode(0);
  //setSelectedLanguage('en')
  addLog('SwitchLang', {
    PrevLang: selectedLang,
    Lang: nextBestLang,
    Via: 'HelpfulBar',
  })
  setSelectedLanguage(nextBestLang);
}

// function isDefaultLanguageEnglish() {
//   return getDefaultLanguage() === 'en';
// }

function getPreferredLanguage() {
  for (var i = 0; i < window.navigator.languages.length; ++i) {
    var x = window.navigator.languages[i];
    if (lang_names_list.indexOf(x) !== -1) {
      return x
    }
    if (x.indexOf('-') !== -1) {
      x = x.split('-')[0]
      if (lang_names_list.indexOf(x) !== -1) {
        return x
      }
    }
  }
  return 'en'
  //return window.navigator.language;
}

function getDefaultLanguage() {
  if (default_to_english) {
    return 'en'
  }
  return getPreferredLanguage();
}

setSelectedLanguage(getDefaultLanguage())
//setTranslationMode(translation_mode);

runOnceAvailable('#tx-live-lang-picker', function() {
  var langpicker = document.querySelector('#tx-live-lang-picker');
  //var langList = Object.keys(lang_names);
  //langList.sort((x,y) => lang_names[x].localeCompare(lang_names[y], 'en'));
  for (var i = 0; i < lang_names_list.length; ++i) {
    var x = lang_names_list[i];
    var newEntry = document.createElement('li');
    newEntry.setAttribute('data-value', x);
    newEntry.onclick = function() {
      var langSelected = this.getAttribute('data-value');
      addLog('SwitchLang', {
        PrevLang: selectedLang,
        Lang: langSelected,
        Via: 'LangSel',
      })
      setSelectedLanguage(langSelected);
      closeLangPicker();

    }
    newEntry.innerText = lang_names[x]; // lang_emojis[x] + ' ' + lang_names[x];
    langpicker.appendChild(newEntry);
  }
})

runOnceAvailable('img[src="windows.svg"]', function() {
  document.querySelector('img[src="windows.svg"]').parentElement.parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Download', {'Ver': 'Win'}, function() {
      //console.log('download button clicked')
      //window.location.href = 'linux_download.html'
      window.location = document.querySelector('img[src="windows.svg"]').parentElement.parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
    //setTimeout(() => { addLog('Download', {'Ver': 'Win'}) }, 2000)
  });
});

runOnceAvailable('img[src="linux.svg"]', function() {
  document.querySelector('img[src="linux.svg"]').parentElement.parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Download', {'Ver': 'Linux'}, function() {
      window.location = document.querySelector('img[src="linux.svg"]').parentElement.parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
  });
});

runOnceAvailable('img[src="apple.svg"]', function() {
  document.querySelector('img[src="apple.svg"]').parentElement.parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Download', {'Ver': 'Mac'}, function() {
      window.location = document.querySelector('img[src="apple.svg"]').parentElement.parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
  });
});

runOnceAvailable('img[src="paypal.svg"]', function() {
  document.querySelector('img[src="paypal.svg"]').parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Donate', {'Via': 'Paypal'}, function() {
      window.location = document.querySelector('img[src="paypal.svg"]').parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
  });
});

runOnceAvailable('img[src="bitcoin.svg"]', function() {
  document.querySelector('img[src="bitcoin.svg"]').parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Donate', {'Via': 'Bitcoin'}, function() {
      window.location = document.querySelector('img[src="bitcoin.svg"]').parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
  });
});

runOnceAvailable('img[src="venmo.svg"]', function() {
  document.querySelector('img[src="venmo.svg"]').parentElement.parentElement.addEventListener('click', function(evt) {
    addLog('Donate', {'Via': 'Venmo'}, function() {
      window.location = document.querySelector('img[src="venmo.svg"]').parentElement.parentElement.getAttribute('href');
    }, 500);
    evt.preventDefault();
  });
});

setTimeout(function() {
  runOnceAvailable('a[trcl]', function() {
    var trcl_list = document.querySelectorAll('a[trcl]');
    for (var i = 0; i < trcl_list.length; ++i) {
      var trcl = trcl_list[i];
      (function (trcl) {
        var url = trcl.getAttribute('href');
        var is_local = url.startsWith('#');
        if (is_local) {
          trcl.addEventListener('click', function(evt) {
            addLog('ClickLink', {'Url': trcl.getAttribute('href'), 'Name': trcl.getAttribute('trcl')});
          });
        } else {
          trcl.addEventListener('click', function(evt) {
            addLog('ClickLink', {'Url': trcl.getAttribute('href'), 'Name': trcl.getAttribute('trcl')}, function() {
              window.location = trcl.getAttribute('href');
            }, 500);
            evt.preventDefault();
          });
        }
      })(trcl);
    }
  });
}, 1000);

function closeLangPicker() {
  var langpicker = document.querySelector('#tx-live-lang-picker')
  if (langpicker.classList.contains('txlive-langselector-list-opened')) {
    langpicker.classList.remove('txlive-langselector-list-opened')
  }
}

function langSelectorMouseDown() {
  var langpicker = document.querySelector('#tx-live-lang-picker')
  if (langpicker.classList.contains('txlive-langselector-list-opened')) {
    langpicker.classList.remove('txlive-langselector-list-opened')
  } else {
    langpicker.classList.add('txlive-langselector-list-opened')
  }
  addLog('LangSelOpen', {
    Lang: selectedLang
  })
  //console.log('langSelectorMouseDown')
}

function onceLangDetectorAvailable(callback) {
  if (window.langdetector) {
    callback();
    return
  }
  if (window.loading_langdetector) {
    runOnceWindowVarExists('langdetector', callback);
    return
  }
  window.loading_langdetector = true;
  var script_tag = document.createElement('script');
  script_tag.setAttribute('src', 'cld3.js')
  document.head.appendChild(script_tag)
  runOnceWindowVarExists('langdetector', callback);
}

function detectLanguageCounts(text_list, callback) {
  onceLangDetectorAvailable(function() {
    var lang_to_counts = {}
    for (var i = 0; i < text_list.length; ++i) {
      var plain_text = text_list[i];
      var mt_lang = langdetector.findLanguage(plain_text).language
      if (lang_to_counts[mt_lang] === undefined) {
        lang_to_counts[mt_lang] = 1
      } else {
        lang_to_counts[mt_lang] += 1
      }
    }
    callback(lang_to_counts)
  })
}

setInterval(() => {
  var selected_lang = selectedLang
  var text_to_detect_list = []
  for (var i = 0; i < node_list.length; ++i) {
    var node = node_list[i];
    var match_info = match_info_list[i];
    var translation_info;
    if (selected_lang === 'en') {
      translation_info = match_info;
    } else {
      //if (human_translation && strip_html_tags(match_info.translations[selected_lang].template) !== strip_html_tags(match_info.template)) {
      if (human_translation && !text_equal(match_info.translations[selected_lang].template, match_info.template)) {
        translation_info = match_info.translations[selected_lang];
      } else {
        translation_info = match_info.translations_mt[selected_lang];
      }
    }
    // if (translation_mode === 0) {
    //   translation_info = match_info;
    // } else if (translation_mode === 1) {
    //   translation_info = match_info.translations[display_language];
    // } else if (translation_mode === 2) {
    //   translation_info = match_info.translations_mt[display_language];
    // }
    var expectedInnerHtml = substitute_template(translation_info.template, match_info.groups);
    var expectedInnerHtmlText = strip_html_tags(expectedInnerHtml)
    var actualInnerHtmlText = strip_html_tags(node.innerHTML)
    if (remove_spaces(expectedInnerHtmlText) === remove_spaces(actualInnerHtmlText)) {
      //console.log('matches expected html')
    } else {
      text_to_detect_list.push(actualInnerHtmlText)
      // console.log('expectedInnerHtmlText differs from actualInnerHtmlText')
      // console.log(expectedInnerHtmlText)
      // console.log(actualInnerHtmlText)
      // posssibly now translated via MT
      //console.log('does not match expected html')
    }
    //node.innerHTML = substitute_template(translation_info.template, match_info.groups);
    //console.log(match_info.translations_mt.es.template);
  }
  function processLangToCounts(lang_to_counts) {
    if (Object.keys(lang_to_counts).length > 0) {
      var maxVal = 0;
      var curMaxKey = undefined;
      var lang_list = Object.keys(lang_to_counts);
      for (var i = 0; i < lang_list.length; ++i) {
        var key = lang_list[i];
        var val = lang_to_counts[key];
        if (val > maxVal) {
          curMaxKey = key;
          maxVal = val;
        }
      }
      mtLang = curMaxKey;
    } else {
      mtLang = undefined;
    }
    if (mtLang !== prevMtLang) {
      if (mtLang !== undefined) {
        var data = {
          'SrcLang': selected_lang,
          'MtLang': mtLang,
        }
        if (prevMtLang !== undefined) {
          data.PrevMtLang = prevMtLang
        }
        if (node_list[0].getAttribute('_msthash')) {
          data.MtEng = 'MS'
        } else if (document.querySelector('html').classList.contains('translated-ltr')) {
          data.MtEng = 'Google'
        }
        addLog('MtOn', data)
      } else {
        var data = {
          'SrcLang': selected_lang
        }
        if (prevMtLang !== undefined) {
          data.PrevMtLang = prevMtLang
        }
        addLog('MtOff', data)
      }
      prevMtLang = mtLang;
    }
  }
  if (text_to_detect_list.length > 0) {
    detectLanguageCounts(text_to_detect_list, processLangToCounts)
  } else {
    processLangToCounts({})
  }  
}, 1000)

var max_percent_scrolled = 0
setInterval(function() {
  max_percent_scrolled = Math.max(max_percent_scrolled, amountscrolled())
}, 100)


var is_active = false;
function markAsActive() {
  is_active = true;
}

document.addEventListener('mousemove', markAsActive);
document.addEventListener('mousedown', markAsActive);
document.addEventListener('mouseup', markAsActive);
document.addEventListener('keydown', markAsActive);
document.addEventListener('keyup', markAsActive);
document.addEventListener('scroll', markAsActive);
document.addEventListener('wheel', markAsActive);
document.addEventListener('touchstart', markAsActive);
document.addEventListener('touchmove', markAsActive);
document.addEventListener('touchend', markAsActive);

function incrd(d, k) {
  if (d[k] === undefined) {
    d[k] = 1;
  } else {
    d[k] += 1;
  }
}

// categories:
// unfocused and idle
// unfocesed and active
// focused and idle
// focused and active
var time_unfocused = 0;
var lang_to_time_unfocidle = {};
var lang_to_time_unfocactive = {};
var lang_to_time_focidle = {};
var lang_to_time_focactive = {};
setInterval(function() {
  var curLang = selectedLang;
  if (mtLang !== undefined) {
    curLang = mtLang + '=E|' + selectedLang;
  }
  var was_active = is_active;
  is_active = false;
  var current_scroll = amountscrolled()
  max_percent_scrolled = Math.max(max_percent_scrolled, current_scroll)
  if (was_active) {
    if (document.hasFocus()) {
      incrd(lang_to_time_focactive, curLang);
    } else {
      incrd(lang_to_time_unfocactive, curLang);
    }
  } else {
    if (document.hasFocus()) {
      incrd(lang_to_time_focidle, curLang);
    } else {
      incrd(lang_to_time_unfocidle, curLang);
    }
  }
  if (!was_active) {
    return;
  }
  var data = {
    MaxScroll: max_percent_scrolled,
    Scroll: current_scroll,
    Lang: selectedLang,
  }
  if (Object.keys(lang_to_time_unfocidle).length > 0) {
    data.UnfocIdle = lang_to_time_unfocidle;
  }
  if (Object.keys(lang_to_time_unfocactive).length > 0) {
    data.UnfocActive = lang_to_time_unfocactive;
  }
  if (Object.keys(lang_to_time_focidle).length > 0) {
    data.FocIdle = lang_to_time_focidle;
  }
  if (Object.keys(lang_to_time_focactive).length > 0) {
    data.FocActive = lang_to_time_focactive;
  }
  if (mtLang !== undefined) {
    data.MtLang = mtLang
  }
  addLog('AddTime', data)
}, 1000)

var backend_host = 'liltstat.com';
if (window.location.hostname === 'localhost') {
  backend_host = 'localhost:3000';
}

function sendData(rows, data, callback, timeLimit) {
  var haveRunCallback = false;
  var cbname = 'cb' + Math.floor(Math.random() * 2147483647)
  var script_tag = document.createElement('script');
  script_tag.setAttribute('id', cbname);
  script_tag.setAttribute('src', window.location.protocol + '//' + backend_host + '/addlog?callback=' + cbname + '&rows=' + encodeURIComponent(JSON.stringify(rows)) + '&data=' + encodeURIComponent(JSON.stringify(data)));
  window[cbname] = function(res) {
    //console.log('callback! ' + cbname)
    //console.log(res)
    delete window[cbname]
    document.querySelector('#' + cbname).remove();
    if (!haveRunCallback) {
      haveRunCallback = true;
      callback(res);
    }
  }
  if (timeLimit !== undefined) {
    setTimeout(function() {
      if (!haveRunCallback) {
        haveRunCallback = true;
        callback();
      }
    }, timeLimit);
  }
  document.head.appendChild(script_tag)
}

// function callback(res) {
//   console.log('callback!')
//   console.log(res)
// }

function setNumStars(num_stars, is_highlight) {
  for (var i = 0; i < 5; ++i) {
    var star = document.querySelector('#star' + i);
    if (i < num_stars) {
      star.innerText = '★';
      if (is_highlight) {
        star.style.color = 'yellow';
      } else {
        star.style.color = 'white';
      }
    } else {
      star.innerText = '☆';
      star.style.color = 'white';
    }
  }
}

var already_rated = false;
var num_stars_highlighted = 0;

runOnceTrue(function() {
  var num_available = 0;
  for (var i = 0; i < 5; ++i) {
    var star = document.querySelector('#star' + i);
    if (star) {
      num_available++;
    }
  }
  return num_available === 5;
}, function() {
  var blackstar = '★';
  var whitestar = '☆';
  document.querySelector('#stars').addEventListener('mousedown', function() {
    already_rated = true;
    setNumStars(num_stars_highlighted, true);
    addLog('Rated', {
      'Stars': num_stars_highlighted,
    });
  });
  document.querySelector('#stars').addEventListener('mouseleave', function() {
    if (!already_rated) {
      setNumStars(0, false);
      num_stars_highlighted = 0;
    }
  });
  for (var i = 0; i < 5; ++i) {
    var star = document.querySelector('#star' + i);
    (function(star, i) {
      star.addEventListener('mouseover', function() {
        if (!already_rated) {
          setNumStars(i + 1, false);
        }
        num_stars_highlighted = i + 1;
      });
      star.addEventListener('mousedown', function() {
        already_rated = true;
        setNumStars(i + 1, true);
      });
    })(star, i);
  }
});

addLog('Init', initdata);
}

