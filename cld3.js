(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
window.cld3 = require('cld3-asm');

console.log('cld-3 is now imported!');

function detectlang(text) {
  return window.langdetector.findLanguage(text);
}
window.detectlang = detectlang;

(async function() {
  const cldmodule = await window.cld3.loadModule()
  window.langdetector = cldmodule.create(0, 1000);
})();

},{"cld3-asm":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./util/logger");
const wrapCldInterface_1 = require("./wrapCldInterface");
// size of pointer to calculate pointer position.
const PTR_SIZE = 4;
/**
 * @internal
 * Creates a factory function for mounting files into wasm filesystem
 * and creating language identifier instance.
 *
 * @param {CldAsmModule} asmModule wasm / asm module loaded into memory.
 *
 * @returns {CldFactory} Factory function manages lifecycle of cld3 language identifier.
 */
exports.cldLoader = (asmModule) => {
    const { cwrap, _free, allocateUTF8, _malloc, getValue, UTF8ToString, setValue } = asmModule;
    const cldInterface = wrapCldInterface_1.wrapCldInterface(cwrap);
    /**
     * Naive auto-dispose interface to call cld interface with string params.
     *
     */
    const usingParamPtr = (...args) => {
        const params = [...args];
        const fn = params.pop();
        const paramsPtr = params.map((param) => allocateUTF8(param));
        const ret = fn(...paramsPtr);
        paramsPtr.forEach(paramPtr => _free(paramPtr));
        return ret;
    };
    // grab constant values from cld3 library
    const unknownIdentifier = UTF8ToString(cldInterface.getUnknownIdentifier());
    const minBytesDefault = cldInterface.getMinNumBytesDefault();
    const maxBytesDefault = cldInterface.getMaxNumBytesDefault();
    const maxBytesInput = cldInterface.getMaxNumBytesInput();
    const languageResultStructSize = cldInterface.sizeLanguageResult();
    logger_1.log(`cldLoader: cld3 wasm initialized with default values`, {
        unknownIdentifier,
        minBytesDefault,
        maxBytesDefault,
        maxBytesInput,
        languageResultStructSize
    });
    // both identifier should match all time, check when initialize binary
    if (unknownIdentifier !== "und" /* UNKNOWN */) {
        throw new Error(`cld3 binary unknownIdentifier constant does not match to LanguageCode enum`);
    }
    /**
     * Wrapper function to read SpanInfo** array from pointer.
     * After interop, pointer will be freed.
     */
    const volatileReadSpanInfoArray = (arrayPtr, size) => {
        const ret = Array.from(new Array(size)).map((_, idx) => {
            const spanInfoPtr = getValue(arrayPtr + PTR_SIZE * idx, '*');
            const range = {
                start_index: getValue(spanInfoPtr + PTR_SIZE * 0, 'i8'),
                end_index: getValue(spanInfoPtr + PTR_SIZE * 1, 'i8'),
                probability: getValue(spanInfoPtr + PTR_SIZE * 2, 'float')
            };
            //free each individual SpanInfo* struct
            _free(spanInfoPtr);
            return range;
        });
        //free SpanInfo** array
        _free(arrayPtr);
        return ret;
    };
    /**
     * Wrapper function to read LanguageResult struct from pointer.
     * After interop, pointer will be freed.
     *
     * @param structPtr
     */
    const volatileReadResultStruct = (structPtr) => {
        // get value of first field of LanguageResult struct (char*)
        const languageStringPtr = getValue(structPtr + PTR_SIZE * 0, '*');
        // get ptr to array of byte range with its size
        const byteRangesSize = getValue(structPtr + PTR_SIZE * 4, 'i8');
        const byteRangesArrayPtr = getValue(structPtr + PTR_SIZE * 5, '*');
        // be careful to match order of properties to match pointer to struct field.
        const ret = {
            language: UTF8ToString(languageStringPtr),
            probability: getValue(structPtr + PTR_SIZE * 1, 'float'),
            is_reliable: !!getValue(structPtr + PTR_SIZE * 2, 'i8'),
            proportion: getValue(structPtr + PTR_SIZE * 3, 'float'),
            byte_ranges: volatileReadSpanInfoArray(byteRangesArrayPtr, byteRangesSize)
        };
        //free char* for language string
        _free(languageStringPtr);
        //free struct
        _free(structPtr);
        return ret;
    };
    return {
        create: (minBytes = minBytesDefault, maxBytes = maxBytesDefault) => {
            const cldPtr = cldInterface.create(minBytes, maxBytes);
            return {
                findLanguage: (text) => {
                    // `findLanguage` requires caller must allocate memory for return value.
                    const resultPtr = _malloc(languageResultStructSize);
                    usingParamPtr(text, textPtr => cldInterface.findLanguage(cldPtr, textPtr, resultPtr));
                    return volatileReadResultStruct(resultPtr);
                },
                findMostFrequentLanguages: (text, numLangs) => {
                    // `findMostFrequentLanguages` requires caller must allocate memory for return value.
                    const languageListPtr = _malloc(numLangs * PTR_SIZE);
                    // For convinience, we'll store allocated pointer to each empty LanguageResult for return value
                    const resultStructsPtr = [];
                    //allocate memory in js. `findTopNMostFreqLangs` always returns vector with given num_langs, allows predictable memory allocation.
                    for (let idx = 0; idx < numLangs; idx++) {
                        const resultPtr = _malloc(languageResultStructSize);
                        resultStructsPtr.push(resultPtr);
                        // fill in array with allocated struct ptr
                        setValue(languageListPtr + idx * PTR_SIZE, resultPtr, '*');
                    }
                    const languageCount = usingParamPtr(text, textPtr => cldInterface.findTopNMostFreqLangs(cldPtr, textPtr, numLangs, languageListPtr));
                    // if `numLangs` exceeds number of languages detected rest of array will be filled with default result with unknown language identifier
                    const ret = resultStructsPtr
                        .map(ptr => volatileReadResultStruct(ptr))
                        .filter(x => x.language !== unknownIdentifier);
                    // each LanguageResult struct is freed via `volatileReadResultStruct` already. delete allocated memory for array itself.
                    _free(languageListPtr);
                    return languageCount > 0 ? ret : [];
                },
                dispose: () => cldInterface.destroy(cldPtr)
            };
        }
    };
};

},{"./util/logger":8,"./wrapCldInterface":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loadModule_1 = require("./loadModule");
exports.loadModule = loadModule_1.loadModule;
var logger_1 = require("./util/logger");
exports.log = logger_1.log;
exports.enableLogger = logger_1.enableLogger;
var languageCode_1 = require("./languageCode");
exports.LanguageCode = languageCode_1.LanguageCode;

},{"./languageCode":5,"./loadModule":7,"./util/logger":8}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Lanaguage code detected via NNetLanguageIdentifier
 * https://github.com/google/cld3/blob/87dae6b75537d5f64a6dcf97a9e1d411620f5cd1/src/task_context_params.cc#L43
 */
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["EO"] = "eo";
    LanguageCode["CO"] = "co";
    LanguageCode["EU"] = "eu";
    LanguageCode["TA"] = "ta";
    LanguageCode["DE"] = "de";
    LanguageCode["MT"] = "mt";
    LanguageCode["PS"] = "ps";
    LanguageCode["TE"] = "te";
    LanguageCode["SU"] = "su";
    LanguageCode["UZ"] = "uz";
    LanguageCode["ZH_LATN"] = "zh-Latn";
    LanguageCode["NE"] = "ne";
    LanguageCode["NL"] = "nl";
    LanguageCode["SW"] = "sw";
    LanguageCode["SQ"] = "sq";
    LanguageCode["HML"] = "hmn";
    LanguageCode["JA"] = "ja";
    LanguageCode["NO"] = "no";
    LanguageCode["MN"] = "mn";
    LanguageCode["SO"] = "so";
    LanguageCode["KO"] = "ko";
    LanguageCode["KK"] = "kk";
    LanguageCode["SL"] = "sl";
    LanguageCode["IG"] = "ig";
    LanguageCode["MR"] = "mr";
    LanguageCode["TH"] = "th";
    LanguageCode["ZU"] = "zu";
    LanguageCode["ML"] = "ml";
    LanguageCode["HR"] = "hr";
    LanguageCode["BS"] = "bs";
    LanguageCode["LO"] = "lo";
    LanguageCode["SD"] = "sd";
    LanguageCode["CY"] = "cy";
    LanguageCode["HY"] = "hy";
    LanguageCode["UK"] = "uk";
    LanguageCode["PT"] = "pt";
    LanguageCode["LV"] = "lv";
    LanguageCode["IW"] = "iw";
    LanguageCode["CS"] = "cs";
    LanguageCode["VI"] = "vi";
    LanguageCode["JV"] = "jv";
    LanguageCode["BE"] = "be";
    LanguageCode["KM"] = "km";
    LanguageCode["MK"] = "mk";
    LanguageCode["TR"] = "tr";
    LanguageCode["FY"] = "fy";
    LanguageCode["AM"] = "am";
    LanguageCode["ZH"] = "zh";
    LanguageCode["DA"] = "da";
    LanguageCode["SV"] = "sv";
    LanguageCode["FI"] = "fi";
    LanguageCode["HT"] = "ht";
    LanguageCode["AF"] = "af";
    LanguageCode["LA"] = "la";
    LanguageCode["ID"] = "id";
    LanguageCode["FIL"] = "fil";
    LanguageCode["SM"] = "sm";
    LanguageCode["CA"] = "ca";
    LanguageCode["EL"] = "el";
    LanguageCode["KA"] = "ka";
    LanguageCode["SR"] = "sr";
    LanguageCode["IT"] = "it";
    LanguageCode["SK"] = "sk";
    LanguageCode["RU"] = "ru";
    LanguageCode["RU_LATN"] = "ru-Latn";
    LanguageCode["BG"] = "bg";
    LanguageCode["NY"] = "ny";
    LanguageCode["FA"] = "fa";
    LanguageCode["HAW"] = "haw";
    LanguageCode["GL"] = "gl";
    LanguageCode["ET"] = "et";
    LanguageCode["MS"] = "ms";
    LanguageCode["GD"] = "gd";
    LanguageCode["BG_LATN"] = "bg-Latn";
    LanguageCode["HA"] = "ha";
    LanguageCode["IS"] = "is";
    LanguageCode["UR"] = "ur";
    LanguageCode["MI"] = "mi";
    LanguageCode["HI"] = "hi";
    LanguageCode["BN"] = "bn";
    LanguageCode["HI_LATN"] = "hi-Latn";
    LanguageCode["FR"] = "fr";
    LanguageCode["YI"] = "yi";
    LanguageCode["HU"] = "hu";
    LanguageCode["XH"] = "xh";
    LanguageCode["MY"] = "my";
    LanguageCode["TG"] = "tg";
    LanguageCode["RO"] = "ro";
    LanguageCode["AR"] = "ar";
    LanguageCode["LB"] = "lb";
    LanguageCode["EL_LATN"] = "el-Latn";
    LanguageCode["ST"] = "st";
    LanguageCode["CEB"] = "ceb";
    LanguageCode["KN"] = "kn";
    LanguageCode["AZ"] = "az";
    LanguageCode["SI"] = "si";
    LanguageCode["KY"] = "ky";
    LanguageCode["MG"] = "mg";
    LanguageCode["EN"] = "en";
    LanguageCode["GU"] = "gu";
    LanguageCode["ES"] = "es";
    LanguageCode["PL"] = "pl";
    LanguageCode["JA_LATN"] = "ja-Latn";
    LanguageCode["GA"] = "ga";
    LanguageCode["LT"] = "lt";
    LanguageCode["SN"] = "sn";
    LanguageCode["YO"] = "yo";
    LanguageCode["PA"] = "pa";
    LanguageCode["KU"] = "ku";
    LanguageCode["UNKNOWN"] = "und";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],6:[function(require,module,exports){
(function (process){

var Module = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=function(status,toThrow){throw toThrow};Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(Module["ENVIRONMENT"]){throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)")}var scriptDirectory="";

function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}

if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}if(!(typeof window==="object"||typeof importScripts==="function"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");Module["read"]=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=function(title){document.title=title}}else{throw new Error("environment detection error")}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;assert(typeof Module["memoryInitializerPrefixURL"]==="undefined","Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["pthreadMainPrefixURL"]==="undefined","Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["cdInitializerPrefixURL"]==="undefined","Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["filePackagePrefixURL"]==="undefined","Module.filePackagePrefixURL option was removed, use Module.locateFile instead");var STACK_ALIGN=16;stackSave=stackRestore=stackAlloc=function(){abort("cannot use the stack before compiled code is ready to run, and has provided stack access")};function dynamicAlloc(size){assert(DYNAMICTOP_PTR);var ret=HEAP32[DYNAMICTOP_PTR>>2];var end=ret+size+15&-16;if(end<=_emscripten_get_heap_size()){HEAP32[DYNAMICTOP_PTR>>2]=end}else{return 0}return ret}function getNativeTypeSize(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return 4}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0,"getNativeTypeSize invalid bits "+bits+", type "+type);return bits/8}else{return 0}}}}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}var asm2wasmImports={"f64-rem":function(x,y){return x%y},"debugger":function(){debugger}};var jsCallStartIndex=1;var functionPointers=new Array(0);function convertJsFunctionToWasm(func,sig){var typeSection=[1,0,1,96];var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={"i":127,"j":126,"f":125,"d":124};typeSection.push(sigParam.length);for(var i=0;i<sigParam.length;++i){typeSection.push(typeCodes[sigParam[i]])}if(sigRet=="v"){typeSection.push(0)}else{typeSection=typeSection.concat([1,typeCodes[sigRet]])}typeSection[1]=typeSection.length-2;var bytes=new Uint8Array([0,97,115,109,1,0,0,0].concat(typeSection,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));var module=new WebAssembly.Module(bytes);var instance=new WebAssembly.Instance(module,{e:{f:func}});var wrappedFunc=instance.exports.f;return wrappedFunc}var funcWrappers={};function dynCall(sig,ptr,args){if(args&&args.length){assert(args.length==sig.length-1);assert("dynCall_"+sig in Module,"bad function pointer type - no table for sig '"+sig+"'");return Module["dynCall_"+sig].apply(null,[ptr].concat(args))}else{assert(sig.length==1);assert("dynCall_"+sig in Module,"bad function pointer type - no table for sig '"+sig+"'");return Module["dynCall_"+sig].call(null,ptr)}}var tempRet0=0;var setTempRet0=function(value){tempRet0=value};var getTempRet0=function(){return tempRet0};if(typeof WebAssembly!=="object"){abort("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.")}function getValue(ptr,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];default:abort("invalid type for getValue: "+type)}return null}var wasmMemory;var wasmTable;var ABORT=false;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;assert(returnType!=="array",'Return type should not be "array".');if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}var ALLOC_NONE=3;var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(u8Array[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=u8Array[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{if((u0&248)!=240)warnOnce("Invalid UTF-8 leading byte 0x"+u0.toString(16)+" encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!");u0=(u0&7)<<18|u1<<12|u2<<6|u8Array[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;if(u>=2097152)warnOnce("Invalid Unicode code point 0x"+u.toString(16)+" encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).");outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){assert(typeof maxBytesToWrite=="number","stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function writeArrayToMemory(array,buffer){assert(array.length>=0,"writeArrayToMemory array must have a length (should be an array or typed array)");HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){assert(str.charCodeAt(i)===str.charCodeAt(i)&255);HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}function demangle(func){warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");return func}function demangleAll(text){var regex=/__Z[\w\d_]+/g;return text.replace(regex,function(x){var y=demangle(x);return x===y?x:y+" ["+x+"]"})}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){var js=jsStackTrace();if(Module["extraStackTrace"])js+="\n"+Module["extraStackTrace"]();return demangleAll(js)}var WASM_PAGE_SIZE=65536;var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var STACK_BASE=446048,STACK_MAX=5688928,DYNAMIC_BASE=5688928,DYNAMICTOP_PTR=446016;assert(STACK_BASE%16===0,"stack must start aligned");assert(DYNAMIC_BASE%16===0,"heap must start aligned");var TOTAL_STACK=5242880;if(Module["TOTAL_STACK"])assert(TOTAL_STACK===Module["TOTAL_STACK"],"the stack size can no longer be determined at runtime");var INITIAL_TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(INITIAL_TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+INITIAL_TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&Int32Array.prototype.subarray!==undefined&&Int32Array.prototype.set!==undefined,"JS engine does not provide full typed array support");if(Module["buffer"]){buffer=Module["buffer"];assert(buffer.byteLength===INITIAL_TOTAL_MEMORY,"provided buffer should be "+INITIAL_TOTAL_MEMORY+" bytes, but it is "+buffer.byteLength)}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){assert(INITIAL_TOTAL_MEMORY%WASM_PAGE_SIZE===0);wasmMemory=new WebAssembly.Memory({"initial":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE,"maximum":INITIAL_TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=wasmMemory.buffer}else{buffer=new ArrayBuffer(INITIAL_TOTAL_MEMORY)}assert(buffer.byteLength===INITIAL_TOTAL_MEMORY)}updateGlobalBufferViews();HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;function writeStackCookie(){assert((STACK_MAX&3)==0);HEAPU32[(STACK_MAX>>2)-1]=34821223;HEAPU32[(STACK_MAX>>2)-2]=2310721022}function checkStackCookie(){if(HEAPU32[(STACK_MAX>>2)-1]!=34821223||HEAPU32[(STACK_MAX>>2)-2]!=2310721022){abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x"+HEAPU32[(STACK_MAX>>2)-2].toString(16)+" "+HEAPU32[(STACK_MAX>>2)-1].toString(16))}if(HEAP32[0]!==1668509029)abort("Runtime error: The application has corrupted its heap memory area (address zero)!")}function abortStackOverflow(allocSize){abort("Stack overflow! Attempted to allocate "+allocSize+" bytes on the stack, but stack has only "+(STACK_MAX-stackSave()+allocSize)+" bytes available!")}HEAP32[0]=1668509029;HEAP16[1]=25459;if(HEAPU8[2]!==115||HEAPU8[3]!==99)throw"Runtime error: expected the system to be little-endian!";function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){checkStackCookie();if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){checkStackCookie();callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){checkStackCookie();runtimeExited=true}function postRun(){checkStackCookie();if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}assert(Math.imul,"This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.fround,"This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.clz32,"This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.trunc,"This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");var Math_abs=Math.abs;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_min=Math.min;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;var runDependencyTracking={};function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(id){assert(!runDependencyTracking[id]);runDependencyTracking[id]=1;if(runDependencyWatcher===null&&typeof setInterval!=="undefined"){runDependencyWatcher=setInterval(function(){if(ABORT){clearInterval(runDependencyWatcher);runDependencyWatcher=null;return}var shown=false;for(var dep in runDependencyTracking){if(!shown){shown=true;err("still waiting on run dependencies:")}err("dependency: "+dep)}if(shown){err("(end of list)")}},1e4)}}else{err("warning: run dependency added without ID")}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(id){assert(runDependencyTracking[id]);delete runDependencyTracking[id]}else{err("warning: run dependency removed without ID")}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var FS={error:function(){abort("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1")},init:function(){FS.error()},createDataFile:function(){FS.error()},createPreloadedFile:function(){FS.error()},createLazyFile:function(){FS.error()},open:function(){FS.error()},mkdev:function(){FS.error()},registerDevice:function(){FS.error()},analyzePath:function(){FS.error()},loadFilesFromDB:function(){FS.error()},ErrnoError:function ErrnoError(){FS.error()}};Module["FS_createDataFile"]=FS.createDataFile;Module["FS_createPreloadedFile"]=FS.createPreloadedFile;var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}

var wasmBinaryFile="cld3.wasm";

if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}

function getBinary(){
  try {
    if(Module["wasmBinary"]){
      return new Uint8Array(Module["wasmBinary"])
    }
    var binary=tryParseAsDataURI(wasmBinaryFile);
    if (binary) {
      return binary
    }
    if (Module["readBinary"]) {
      return Module["readBinary"](wasmBinaryFile)
    } else {
      throw "both async and sync fetching of the wasm failed"
    }
  } catch (err) {
    abort(err)
  }
}

function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return new Promise(function(resolve,reject){resolve(getBinary())})}
function createWasm(env){var info={"env":env,"global":{"NaN":NaN,Infinity:Infinity},"global.Math":Math,"asm2wasm":asm2wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}var trueModule=Module;function receiveInstantiatedSource(output){assert(Module===trueModule,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");trueModule=null;receiveInstance(output["instance"])}function instantiateArrayBuffer(receiver){getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)})}else{instantiateArrayBuffer(receiveInstantiatedSource)}return{}}

Module["asm"]=function(global,env,providedBuffer){env["memory"]=wasmMemory;env["table"]=wasmTable=new WebAssembly.Table({"initial":465,"maximum":465,"element":"anyfunc"});env["__memory_base"]=1024;env["__table_base"]=0;var exports=createWasm(env);assert(exports,"binaryen setup failed (no wasm support?)");return exports};__ATINIT__.push({func:function(){__GLOBAL__sub_I_status_cc()}});var tempDoublePtr=446032;assert(tempDoublePtr%8==0);function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function ___cxa_allocate_exception(size){return _malloc(size)}function __ZSt18uncaught_exceptionv(){return!!__ZSt18uncaught_exceptionv.uncaught_exception}function ___cxa_free_exception(ptr){try{return _free(ptr)}catch(e){err("exception during cxa_free_exception: "+e)}}var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:function(adjusted){if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;for(var key in EXCEPTIONS.infos){var ptr=+key;var adj=EXCEPTIONS.infos[ptr].adjusted;var len=adj.length;for(var i=0;i<len;i++){if(adj[i]===adjusted){return ptr}}}return adjusted},addRef:function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount++},decRef:function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];assert(info.refcount>0);info.refcount--;if(info.refcount===0&&!info.rethrown){if(info.destructor){Module["dynCall_vi"](info.destructor,ptr)}delete EXCEPTIONS.infos[ptr];___cxa_free_exception(ptr)}},clearRef:function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount=0}};function ___cxa_begin_catch(ptr){var info=EXCEPTIONS.infos[ptr];if(info&&!info.caught){info.caught=true;__ZSt18uncaught_exceptionv.uncaught_exception--}if(info)info.rethrown=false;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));return ptr}function ___cxa_pure_virtual(){ABORT=true;throw"Pure virtual function called!"}function ___resumeException(ptr){if(!EXCEPTIONS.last){EXCEPTIONS.last=ptr}throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___cxa_find_matching_catch(){var thrown=EXCEPTIONS.last;if(!thrown){return(setTempRet0(0),0)|0}var info=EXCEPTIONS.infos[thrown];var throwntype=info.type;if(!throwntype){return(setTempRet0(0),thrown)|0}var typeArray=Array.prototype.slice.call(arguments);var pointer=Module["___cxa_is_pointer_type"](throwntype);if(!___cxa_find_matching_catch.buffer)___cxa_find_matching_catch.buffer=_malloc(4);HEAP32[___cxa_find_matching_catch.buffer>>2]=thrown;thrown=___cxa_find_matching_catch.buffer;for(var i=0;i<typeArray.length;i++){if(typeArray[i]&&Module["___cxa_can_catch"](typeArray[i],throwntype,thrown)){thrown=HEAP32[thrown>>2];info.adjusted.push(thrown);return(setTempRet0(typeArray[i]),thrown)|0}}thrown=HEAP32[thrown>>2];return(setTempRet0(throwntype),thrown)|0}function ___cxa_throw(ptr,type,destructor){EXCEPTIONS.infos[ptr]={ptr:ptr,adjusted:[ptr],type:type,destructor:destructor,refcount:0,caught:false,rethrown:false};EXCEPTIONS.last=ptr;if(!("uncaught_exception"in __ZSt18uncaught_exceptionv)){__ZSt18uncaught_exceptionv.uncaught_exception=1}else{__ZSt18uncaught_exceptionv.uncaught_exception++}throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___gxx_personality_v0(){}function ___lock(){}var PATH={splitPath:function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:function(path){if(path==="/")return"/";var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},extname:function(path){return PATH.splitPath(path)[3]},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:function(l,r){return PATH.normalize(l+"/"+r)}};var SYSCALLS={buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];assert(buffer);if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}},varargs:0,get:function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(){var ret=UTF8ToString(SYSCALLS.get());return ret},get64:function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low},getZero:function(){assert(SYSCALLS.get()===0)}};function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();abort("it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM");return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function flush_NO_FILESYSTEM(){var fflush=Module["_fflush"];if(fflush)fflush(0);var buffers=SYSCALLS.buffers;if(buffers[1].length)SYSCALLS.printChar(1,10);if(buffers[2].length)SYSCALLS.printChar(2,10)}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(stream,HEAPU8[ptr+j])}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();abort("it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM");return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___unlock(){}function _abort(){Module["abort"]()}function _emscripten_get_heap_size(){return HEAP8.length}function abortOnCannotGrowMemory(requestedSize){abort("Cannot enlarge memory arrays to size "+requestedSize+" bytes (OOM). Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+HEAP8.length+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}function _emscripten_resize_heap(requestedSize){abortOnCannotGrowMemory(requestedSize)}function _llvm_trap(){abort("trap!")}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest)}function _pthread_cond_wait(){return 0}function _pthread_equal(x,y){return x==y}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;else err("failed to set errno from JS");return value}var ASSERTIONS=true;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}function nullFunc_i(x){err("Invalid function pointer called with signature 'i'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_ii(x){err("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_iii(x){err("Invalid function pointer called with signature 'iii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_iiii(x){err("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_ji(x){err("Invalid function pointer called with signature 'ji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_jiiii(x){err("Invalid function pointer called with signature 'jiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_jiji(x){err("Invalid function pointer called with signature 'jiji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_v(x){err("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_vi(x){err("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_vii(x){err("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viii(x){err("Invalid function pointer called with signature 'viii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viiii(x){err("Invalid function pointer called with signature 'viiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viiiii(x){err("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viiiiii(x){err("Invalid function pointer called with signature 'viiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viij(x){err("Invalid function pointer called with signature 'viij'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}function nullFunc_viji(x){err("Invalid function pointer called with signature 'viji'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");err("Build with ASSERTIONS=2 for more info.");abort(x)}var asmGlobalArg={};var asmLibraryArg={"abort":abort,"setTempRet0":setTempRet0,"getTempRet0":getTempRet0,"abortStackOverflow":abortStackOverflow,"nullFunc_i":nullFunc_i,"nullFunc_ii":nullFunc_ii,"nullFunc_iii":nullFunc_iii,"nullFunc_iiii":nullFunc_iiii,"nullFunc_ji":nullFunc_ji,"nullFunc_jiiii":nullFunc_jiiii,"nullFunc_jiji":nullFunc_jiji,"nullFunc_v":nullFunc_v,"nullFunc_vi":nullFunc_vi,"nullFunc_vii":nullFunc_vii,"nullFunc_viii":nullFunc_viii,"nullFunc_viiii":nullFunc_viiii,"nullFunc_viiiii":nullFunc_viiiii,"nullFunc_viiiiii":nullFunc_viiiiii,"nullFunc_viij":nullFunc_viij,"nullFunc_viji":nullFunc_viji,"__ZSt18uncaught_exceptionv":__ZSt18uncaught_exceptionv,"___assert_fail":___assert_fail,"___cxa_allocate_exception":___cxa_allocate_exception,"___cxa_begin_catch":___cxa_begin_catch,"___cxa_find_matching_catch":___cxa_find_matching_catch,"___cxa_free_exception":___cxa_free_exception,"___cxa_pure_virtual":___cxa_pure_virtual,"___cxa_throw":___cxa_throw,"___gxx_personality_v0":___gxx_personality_v0,"___lock":___lock,"___resumeException":___resumeException,"___setErrNo":___setErrNo,"___syscall140":___syscall140,"___syscall146":___syscall146,"___syscall54":___syscall54,"___syscall6":___syscall6,"___unlock":___unlock,"_abort":_abort,"_emscripten_get_heap_size":_emscripten_get_heap_size,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_emscripten_resize_heap":_emscripten_resize_heap,"_llvm_trap":_llvm_trap,"_pthread_cond_wait":_pthread_cond_wait,"_pthread_equal":_pthread_equal,"abortOnCannotGrowMemory":abortOnCannotGrowMemory,"flush_NO_FILESYSTEM":flush_NO_FILESYSTEM,"tempDoublePtr":tempDoublePtr,"DYNAMICTOP_PTR":DYNAMICTOP_PTR};var asm=Module["asm"](asmGlobalArg,asmLibraryArg,buffer);var real__Cld_create=asm["_Cld_create"];asm["_Cld_create"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__Cld_create.apply(null,arguments)};var real__Cld_destroy=asm["_Cld_destroy"];asm["_Cld_destroy"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__Cld_destroy.apply(null,arguments)};var real__Cld_findLanguage=asm["_Cld_findLanguage"];asm["_Cld_findLanguage"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__Cld_findLanguage.apply(null,arguments)};var real__Cld_findTopNMostFreqLangs=asm["_Cld_findTopNMostFreqLangs"];asm["_Cld_findTopNMostFreqLangs"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__Cld_findTopNMostFreqLangs.apply(null,arguments)};var real___GLOBAL__sub_I_status_cc=asm["__GLOBAL__sub_I_status_cc"];asm["__GLOBAL__sub_I_status_cc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real___GLOBAL__sub_I_status_cc.apply(null,arguments)};var real____cxa_can_catch=asm["___cxa_can_catch"];asm["___cxa_can_catch"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real____cxa_can_catch.apply(null,arguments)};var real____cxa_is_pointer_type=asm["___cxa_is_pointer_type"];asm["___cxa_is_pointer_type"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real____cxa_is_pointer_type.apply(null,arguments)};var real____errno_location=asm["___errno_location"];asm["___errno_location"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real____errno_location.apply(null,arguments)};var real__fflush=asm["_fflush"];asm["_fflush"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__fflush.apply(null,arguments)};var real__free=asm["_free"];asm["_free"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__free.apply(null,arguments)};var real__get_MaxNumBytesDefault=asm["_get_MaxNumBytesDefault"];asm["_get_MaxNumBytesDefault"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__get_MaxNumBytesDefault.apply(null,arguments)};var real__get_MaxNumBytesInput=asm["_get_MaxNumBytesInput"];asm["_get_MaxNumBytesInput"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__get_MaxNumBytesInput.apply(null,arguments)};var real__get_MinNumBytesDefault=asm["_get_MinNumBytesDefault"];asm["_get_MinNumBytesDefault"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__get_MinNumBytesDefault.apply(null,arguments)};var real__get_SizeLanguageResult=asm["_get_SizeLanguageResult"];asm["_get_SizeLanguageResult"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__get_SizeLanguageResult.apply(null,arguments)};var real__get_UnknownIdentifier=asm["_get_UnknownIdentifier"];asm["_get_UnknownIdentifier"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__get_UnknownIdentifier.apply(null,arguments)};var real__malloc=asm["_malloc"];asm["_malloc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__malloc.apply(null,arguments)};var real__memmove=asm["_memmove"];asm["_memmove"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__memmove.apply(null,arguments)};var real__pthread_cond_broadcast=asm["_pthread_cond_broadcast"];asm["_pthread_cond_broadcast"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__pthread_cond_broadcast.apply(null,arguments)};var real__sbrk=asm["_sbrk"];asm["_sbrk"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real__sbrk.apply(null,arguments)};var real_establishStackSpace=asm["establishStackSpace"];asm["establishStackSpace"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real_establishStackSpace.apply(null,arguments)};var real_stackAlloc=asm["stackAlloc"];asm["stackAlloc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real_stackAlloc.apply(null,arguments)};var real_stackRestore=asm["stackRestore"];asm["stackRestore"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real_stackRestore.apply(null,arguments)};var real_stackSave=asm["stackSave"];asm["stackSave"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return real_stackSave.apply(null,arguments)};Module["asm"]=asm;var _Cld_create=Module["_Cld_create"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_Cld_create"].apply(null,arguments)};var _Cld_destroy=Module["_Cld_destroy"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_Cld_destroy"].apply(null,arguments)};var _Cld_findLanguage=Module["_Cld_findLanguage"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_Cld_findLanguage"].apply(null,arguments)};var _Cld_findTopNMostFreqLangs=Module["_Cld_findTopNMostFreqLangs"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_Cld_findTopNMostFreqLangs"].apply(null,arguments)};var __GLOBAL__sub_I_status_cc=Module["__GLOBAL__sub_I_status_cc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["__GLOBAL__sub_I_status_cc"].apply(null,arguments)};var ___cxa_can_catch=Module["___cxa_can_catch"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["___cxa_can_catch"].apply(null,arguments)};var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["___cxa_is_pointer_type"].apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["___errno_location"].apply(null,arguments)};var _fflush=Module["_fflush"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_fflush"].apply(null,arguments)};var _free=Module["_free"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_free"].apply(null,arguments)};var _get_MaxNumBytesDefault=Module["_get_MaxNumBytesDefault"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_get_MaxNumBytesDefault"].apply(null,arguments)};var _get_MaxNumBytesInput=Module["_get_MaxNumBytesInput"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_get_MaxNumBytesInput"].apply(null,arguments)};var _get_MinNumBytesDefault=Module["_get_MinNumBytesDefault"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_get_MinNumBytesDefault"].apply(null,arguments)};var _get_SizeLanguageResult=Module["_get_SizeLanguageResult"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_get_SizeLanguageResult"].apply(null,arguments)};var _get_UnknownIdentifier=Module["_get_UnknownIdentifier"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_get_UnknownIdentifier"].apply(null,arguments)};var _malloc=Module["_malloc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_malloc"].apply(null,arguments)};var _memcpy=Module["_memcpy"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_memcpy"].apply(null,arguments)};var _memmove=Module["_memmove"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_memmove"].apply(null,arguments)};var _memset=Module["_memset"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_memset"].apply(null,arguments)};var _pthread_cond_broadcast=Module["_pthread_cond_broadcast"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_pthread_cond_broadcast"].apply(null,arguments)};var _sbrk=Module["_sbrk"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["_sbrk"].apply(null,arguments)};var establishStackSpace=Module["establishStackSpace"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["establishStackSpace"].apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["stackAlloc"].apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["stackRestore"].apply(null,arguments)};var stackSave=Module["stackSave"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["stackSave"].apply(null,arguments)};var dynCall_i=Module["dynCall_i"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_i"].apply(null,arguments)};var dynCall_ii=Module["dynCall_ii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_ii"].apply(null,arguments)};var dynCall_iii=Module["dynCall_iii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_iii"].apply(null,arguments)};var dynCall_iiii=Module["dynCall_iiii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_iiii"].apply(null,arguments)};var dynCall_ji=Module["dynCall_ji"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_ji"].apply(null,arguments)};var dynCall_jiiii=Module["dynCall_jiiii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_jiiii"].apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_jiji"].apply(null,arguments)};var dynCall_v=Module["dynCall_v"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_v"].apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_vi"].apply(null,arguments)};var dynCall_vii=Module["dynCall_vii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_vii"].apply(null,arguments)};var dynCall_viii=Module["dynCall_viii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viii"].apply(null,arguments)};var dynCall_viiii=Module["dynCall_viiii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viiii"].apply(null,arguments)};var dynCall_viiiii=Module["dynCall_viiiii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viiiii"].apply(null,arguments)};var dynCall_viiiiii=Module["dynCall_viiiiii"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viiiiii"].apply(null,arguments)};var dynCall_viij=Module["dynCall_viij"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viij"].apply(null,arguments)};var dynCall_viji=Module["dynCall_viji"]=function(){assert(runtimeInitialized,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)");assert(!runtimeExited,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");return Module["asm"]["dynCall_viji"].apply(null,arguments)};Module["asm"]=asm;if(!Module["intArrayFromString"])Module["intArrayFromString"]=function(){abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["intArrayToString"])Module["intArrayToString"]=function(){abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["ccall"])Module["ccall"]=function(){abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["cwrap"]=cwrap;Module["setValue"]=setValue;Module["getValue"]=getValue;if(!Module["allocate"])Module["allocate"]=function(){abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getMemory"])Module["getMemory"]=function(){abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["AsciiToString"])Module["AsciiToString"]=function(){abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stringToAscii"])Module["stringToAscii"]=function(){abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["UTF8ArrayToString"])Module["UTF8ArrayToString"]=function(){abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["UTF8ToString"]=UTF8ToString;if(!Module["stringToUTF8Array"])Module["stringToUTF8Array"]=function(){abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["stringToUTF8"]=stringToUTF8;if(!Module["lengthBytesUTF8"])Module["lengthBytesUTF8"]=function(){abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["UTF16ToString"])Module["UTF16ToString"]=function(){abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stringToUTF16"])Module["stringToUTF16"]=function(){abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["lengthBytesUTF16"])Module["lengthBytesUTF16"]=function(){abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["UTF32ToString"])Module["UTF32ToString"]=function(){abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stringToUTF32"])Module["stringToUTF32"]=function(){abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["lengthBytesUTF32"])Module["lengthBytesUTF32"]=function(){abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["allocateUTF8"]=allocateUTF8;if(!Module["stackTrace"])Module["stackTrace"]=function(){abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addOnPreRun"])Module["addOnPreRun"]=function(){abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addOnInit"])Module["addOnInit"]=function(){abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addOnPreMain"])Module["addOnPreMain"]=function(){abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addOnExit"])Module["addOnExit"]=function(){abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addOnPostRun"])Module["addOnPostRun"]=function(){abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["writeStringToMemory"])Module["writeStringToMemory"]=function(){abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["writeArrayToMemory"])Module["writeArrayToMemory"]=function(){abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["writeAsciiToMemory"])Module["writeAsciiToMemory"]=function(){abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addRunDependency"])Module["addRunDependency"]=function(){abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["removeRunDependency"])Module["removeRunDependency"]=function(){abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["ENV"])Module["ENV"]=function(){abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["FS"])Module["FS"]=function(){abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["FS_createFolder"])Module["FS_createFolder"]=function(){abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createPath"])Module["FS_createPath"]=function(){abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createDataFile"])Module["FS_createDataFile"]=function(){abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createPreloadedFile"])Module["FS_createPreloadedFile"]=function(){abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createLazyFile"])Module["FS_createLazyFile"]=function(){abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createLink"])Module["FS_createLink"]=function(){abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_createDevice"])Module["FS_createDevice"]=function(){abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["FS_unlink"])Module["FS_unlink"]=function(){abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")};if(!Module["GL"])Module["GL"]=function(){abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["dynamicAlloc"])Module["dynamicAlloc"]=function(){abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["warnOnce"])Module["warnOnce"]=function(){abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["loadDynamicLibrary"])Module["loadDynamicLibrary"]=function(){abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["loadWebAssemblyModule"])Module["loadWebAssemblyModule"]=function(){abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getLEB"])Module["getLEB"]=function(){abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getFunctionTables"])Module["getFunctionTables"]=function(){abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["alignFunctionTables"])Module["alignFunctionTables"]=function(){abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["registerFunctions"])Module["registerFunctions"]=function(){abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["addFunction"])Module["addFunction"]=function(){abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["removeFunction"])Module["removeFunction"]=function(){abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getFuncWrapper"])Module["getFuncWrapper"]=function(){abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["prettyPrint"])Module["prettyPrint"]=function(){abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["makeBigInt"])Module["makeBigInt"]=function(){abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["dynCall"])Module["dynCall"]=function(){abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getCompilerSetting"])Module["getCompilerSetting"]=function(){abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stackSave"])Module["stackSave"]=function(){abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stackRestore"])Module["stackRestore"]=function(){abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["stackAlloc"])Module["stackAlloc"]=function(){abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["establishStackSpace"])Module["establishStackSpace"]=function(){abort("'establishStackSpace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["print"])Module["print"]=function(){abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["printErr"])Module["printErr"]=function(){abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["getTempRet0"])Module["getTempRet0"]=function(){abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["setTempRet0"])Module["setTempRet0"]=function(){abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["Pointer_stringify"])Module["Pointer_stringify"]=function(){abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["writeStackCookie"])Module["writeStackCookie"]=function(){abort("'writeStackCookie' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["checkStackCookie"])Module["checkStackCookie"]=function(){abort("'checkStackCookie' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["abortStackOverflow"])Module["abortStackOverflow"]=function(){abort("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["intArrayFromBase64"])Module["intArrayFromBase64"]=function(){abort("'intArrayFromBase64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["tryParseAsDataURI"])Module["tryParseAsDataURI"]=function(){abort("'tryParseAsDataURI' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Module["ALLOC_NORMAL"])Object.defineProperty(Module,"ALLOC_NORMAL",{get:function(){abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});if(!Module["ALLOC_STACK"])Object.defineProperty(Module,"ALLOC_STACK",{get:function(){abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});if(!Module["ALLOC_DYNAMIC"])Object.defineProperty(Module,"ALLOC_DYNAMIC",{get:function(){abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});if(!Module["ALLOC_NONE"])Object.defineProperty(Module,"ALLOC_NONE",{get:function(){abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}});Module["then"]=function(func){if(Module["calledRun"]){func(Module)}else{var old=Module["onRuntimeInitialized"];Module["onRuntimeInitialized"]=function(){if(old)old();func(Module)}}return Module};function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}writeStackCookie();preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();assert(!Module["_main"],'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}checkStackCookie()}Module["run"]=run;function checkUnflushedContent(){var print=out;var printErr=err;var has=false;out=err=function(x){has=true};try{var flush=flush_NO_FILESYSTEM;if(flush)flush(0)}catch(e){}out=print;err=printErr;if(has){warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.");warnOnce("(this may also be due to not including full filesystem support - try building with -s FORCE_FILESYSTEM=1)")}}var abortDecorators=[];function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;var extra="";var output="abort("+what+") at "+stackTrace()+extra;if(abortDecorators){abortDecorators.forEach(function(decorator){output=decorator(output,what)})}throw output}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}Module["noExitRuntime"]=true;run();


  return Module
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Module;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return Module; });
    else if (typeof exports === 'object')
      exports["Module"] = Module;
    
}).call(this,require('_process'))
},{"_process":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emscripten_wasm_loader_1 = require("emscripten-wasm-loader");
const cldLoader_1 = require("./cldLoader");
const logger_1 = require("./util/logger");
//imports MODULARIZED emscripten preamble
const runtime = require("./lib/node/cld3");
/**
 * Load, initialize wasm binary to use actual cld wasm instances.
 *
 * @param [InitOptions] Options to initialize cld3 wasm binary.
 * @param {number} [InitOptions.timeout] - timeout to wait wasm binary compilation & load.
 * @param {string | object} [InitOptions.locateBinary] - custom resolution logic for wasm binary. (not supported)
 * It could be either remote endpoint url, or loader-returned object for bundler. Check examples/browser_* for references.
 *
 * @returns {() => Promise<CldFactory>} Function to load module
 */
const loadModule = async (initOptions = {}) => {
    const { timeout } = initOptions;
    logger_1.log(`loadModule: loading cld3 wasm binary`, { initOptions });
    const moduleLoader = await emscripten_wasm_loader_1.getModuleLoader((runtime) => cldLoader_1.cldLoader(runtime), runtime, undefined, { timeout });
    return moduleLoader();
};
exports.loadModule = loadModule;

},{"./cldLoader":3,"./lib/node/cld3":6,"./util/logger":8,"emscripten-wasm-loader":13}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emscripten_wasm_loader_1 = require("emscripten-wasm-loader");
/**
 * Default log instance falls back to noop if not specified.
 */
let logInstance = () => {
    /* noop */
};
const log = (...args) => logInstance(...args);
exports.log = log;
/**
 * Enables logging internal behavior of cld3-asm.
 * @param logger function to log.
 */
const enableLogger = (logger) => {
    const scopedLogger = (scope) => (message, ...optionalParams) => {
        logger(`${scope}::${message}`, ...optionalParams);
    };
    logInstance = scopedLogger(`cld3`);
    emscripten_wasm_loader_1.enableLogger(scopedLogger(`cld3Loader`));
};
exports.enableLogger = enableLogger;

},{"emscripten-wasm-loader":13}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @internal
 *
 * Wrap cld3 exported interfaces via cwrap for resuable mannter.
 */
exports.wrapCldInterface = (cwrap) => ({
    /**
     * get size of struct for interop.
     *
     * int get_SizeLanguageResult()
     */
    sizeLanguageResult: cwrap('get_SizeLanguageResult', 'number'),
    /**
     * Return unknown language identifier
     *
     * const char* get_UnknownIdentifier()
     */
    getUnknownIdentifier: cwrap('get_UnknownIdentifier', 'number'),
    /**
     * Min number of bytes needed to make a prediction if the default constructoris called.
     *
     * int get_MinNumBytesDefault()
     */
    getMinNumBytesDefault: cwrap('get_MinNumBytesDefault', 'number'),
    /**
     * Max number of bytes to consider to make a prediction if the default constructor is called.
     *
     * int get_MaxNumBytesDefault()
     */
    getMaxNumBytesDefault: cwrap('get_MaxNumBytesDefault', 'number'),
    /**
     * Max number of input bytes to process.
     *
     * int get_MaxNumBytesInput()
     */
    getMaxNumBytesInput: cwrap('get_MaxNumBytesInput', 'number'),
    /**
     * CldHandle* Cld_create(int min_num_bytes, int max_num_bytes)
     */
    create: cwrap('Cld_create', 'number', ['number', 'number']),
    /**
     * void Cld_destroy(CldHandle* pCld)
     */
    destroy: cwrap('Cld_destroy', null, ['number']),
    /**
     * void Cld_findLanguage(CldHandle* pCld, const char* text, LanguageResult* out_result)
     */
    findLanguage: cwrap('Cld_findLanguage', null, [
        'number',
        'number',
        'number'
    ]),
    /**
     * int Cld_findTopNMostFreqLangs(CldHandle* pCld, const char* text, int num_langs, LanguageResult** out_results)
     */
    findTopNMostFreqLangs: cwrap('Cld_findTopNMostFreqLangs', 'number', ['number', 'number', 'number', 'number'])
});

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./util/logger");
/**
 * @internal
 * Build Record<string, any> object to be injected when creates runtime for asm module.
 * Modularized asm module generated via MODULARIZE=1 accepts object as its creation function allow to attach
 * properties. Using those, this function construct few essential convinient functions like awaitable runtime init.
 *
 * Note some init like exporting in-memory FS functions can't be achieved via module object but should rely on
 * preprocessor (https://github.com/kwonoj/docker-hunspell-wasm/blob/eba7781311b31028eefb8eb3e2457d11f294e076/preprocessor.js#L14-L27)
 * to access function-scope variables inside.
 *
 * @param {Record<string, any>} value pre-constructed value to be used, or empty object {}.
 * @param {string} [binaryEndpoint] Provides endpoint to server to download binary module.
 * This value is for browser only - on node.js, should rely on emscripten's default resolution.
 *
 * @returns {Record<string, any>} Augmented object with prefilled interfaces.
 */
const constructModule = (value, binaryRemoteEndpoint) => {
    const ret = {
        ...value,
        __asm_module_isInitialized__: false,
        onRuntimeInitialized: null,
        initializeRuntime: null
    };
    if (!!binaryRemoteEndpoint) {
        logger_1.log(`constructModule: binaryRemoteEndpoint found, override locateFile function`);
        ret.locateFile = (fileName) => `${binaryRemoteEndpoint}/${fileName}`;
    }
    //export initializeRuntime interface for awaitable runtime initialization
    ret.initializeRuntime = (timeout = 3000) => {
        if (ret.__asm_module_isInitialized__) {
            return Promise.resolve(true);
        }
        return new Promise((resolve, _reject) => {
            const timeoutId = setTimeout(() => resolve(false), timeout);
            //trap out preamble `abort()` function to avoid too verbose exception details
            //but only for initialization phase. Other errors will be thrown by postamble.js.
            ret.onAbort = (reason) => {
                if (!ret.__asm_module_isInitialized__) {
                    clearTimeout(timeoutId);
                    logger_1.log(`initializeRuntime: failed to initialize module`, reason);
                    throw reason instanceof Error ? reason : new Error(reason);
                }
            };
            ret.onRuntimeInitialized = () => {
                clearTimeout(timeoutId);
                ret.__asm_module_isInitialized__ = true;
                logger_1.log(`initializeRuntime: successfully initialized module`);
                resolve(true);
            };
        });
    };
    return ret;
};
exports.constructModule = constructModule;

},{"./util/logger":20}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ENVIRONMENT;
(function (ENVIRONMENT) {
    ENVIRONMENT["NODE"] = "NODE";
    ENVIRONMENT["WEB"] = "WEB";
})(ENVIRONMENT = exports.ENVIRONMENT || (exports.ENVIRONMENT = {}));

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constructModule_1 = require("./constructModule");
const logger_1 = require("./util/logger");
/**
 * Creates loader function to load and initialize wasm module.
 *
 * @param {(runtime: R) => T} factoryLoader Factory to create actual instance of implementation using loaded & initialized wasm runtime.
 *
 * @param {runtimeModuleType} runtimeModule Actual runtime to initialize.
 * It is wasm runtime loaded via plain `require` but compiled with MODULARIZED=1 preamble with SINGLE_FILE option
 * which should be function to accept asm module object to override.
 *
 * @param {Record<string, any>} [module] Record<string, any> object to be injected into wasm runtime for override/set additional value in asm module.
 *
 * @param {ModuleInitOption} [initOptions] Configuration used to initialize the module
 *
 * @returns {moduleLoaderType<T>} Loader function
 */
const getModuleLoader = (factoryLoader, runtimeModule, module, { timeout, binaryRemoteEndpoint } = {}) => async () => {
    const constructedModule = constructModule_1.constructModule(module || {}, binaryRemoteEndpoint);
    logger_1.log(`loadModule: constructed module object for runtime`);
    try {
        const asmModule = runtimeModule(constructedModule);
        const result = await asmModule.initializeRuntime(timeout);
        if (!result) {
            logger_1.log(`loadModule: failed to initialize runtime in time`);
            throw new Error(`Timeout to initialize runtime`);
        }
        logger_1.log(`loadModule: initialized wasm binary Runtime`);
        return factoryLoader(asmModule);
    }
    catch (e) {
        logger_1.log(`loadModule: failed to initialize wasm binary runtime`);
        throw e;
    }
};
exports.getModuleLoader = getModuleLoader;

},{"./constructModule":10,"./util/logger":20}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
exports.ENVIRONMENT = environment_1.ENVIRONMENT;
var getModuleLoader_1 = require("./getModuleLoader");
exports.getModuleLoader = getModuleLoader_1.getModuleLoader;
var logger_1 = require("./util/logger");
exports.enableLogger = logger_1.enableLogger;
exports.log = logger_1.log;
var isNode_1 = require("./util/isNode");
exports.isNode = isNode_1.isNode;
var isWasmEnabled_1 = require("./util/isWasmEnabled");
exports.isWasmEnabled = isWasmEnabled_1.isWasmEnabled;
var isMounted_1 = require("./path/isMounted");
exports.isMounted = isMounted_1.isMounted;
var mkdirTree_1 = require("./path/mkdirTree");
exports.mkdirTree = mkdirTree_1.mkdirTree;
var mountBuffer_1 = require("./path/mountBuffer");
exports.mountBuffer = mountBuffer_1.mountBuffer;
var mountDirectory_1 = require("./path/mountDirectory");
exports.mountDirectory = mountDirectory_1.mountDirectory;
var unmount_1 = require("./path/unmount");
exports.unmount = unmount_1.unmount;

},{"./environment":11,"./getModuleLoader":12,"./path/isMounted":14,"./path/mkdirTree":15,"./path/mountBuffer":16,"./path/mountDirectory":16,"./path/unmount":17,"./util/isNode":18,"./util/isWasmEnabled":19,"./util/logger":20}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../util/logger");
/**
 * Check if given mount path is already mounted
 *
 * @param {FS} FS wasm module filesystem
 * @param {string} mountPath path to wasm filesystem
 * @param {dir | file} type type of mountPath
 *
 * @returns {boolean} true if mounted, false otherwise or error occurred
 */
const isMounted = (FS, mountPath, type) => {
    try {
        const stat = FS.stat(mountPath);
        const typeFunction = type === 'dir' ? FS.isDir : FS.isFile;
        if (!!stat && typeFunction(stat.mode)) {
            logger_1.log(`isMounted: ${mountPath} is mounted`);
            return true;
        }
    }
    catch (e) {
        if (e.code !== 'ENOENT') {
            logger_1.log(`isMounted check failed`, e);
        }
    }
    return false;
};
exports.isMounted = isMounted;

},{"../util/logger":20}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `mkdir -p` implementation for wasm FS.mkdir interface.
 * dirPath param should be unixified.
 */
const mkdirTree = (FS, dirPath) => {
    const mkdir = (path) => {
        try {
            FS.mkdir(path);
        }
        catch (e) {
            //throw if not ERRNO_CODES.EEXIST
            if (e.errno != 17) {
                throw e;
            }
        }
    };
    dirPath
        .split('/')
        .filter(x => !!x)
        .reduce((acc, value) => {
        acc.push(`${acc.length > 0 ? acc[acc.length - 1] : ''}/${value}`);
        return acc;
    }, [])
        .forEach(mkdir);
};
exports.mkdirTree = mkdirTree;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid = require("nanoid");
const logger_1 = require("../util/logger");
const isMounted_1 = require("./isMounted");
/**
 * Creates a function to mount contents of file into wasm internal memory filesystem
 * to allow wasm can access.
 *
 * @param {FS} FS wasm module filesystem
 * @param {string} memPathId root path in memory filesystem to mount given arrayBuffer.
 * This prefix path is generated automatically each time wasm module is loaded.
 *
 * @return {(contents: ArrayBufferView, fileName?: string) => string} function to mount buffer under memory filesystem.
 * If filename is not provided, it'll be generated automatically. This function checks existing file mounted via filename,
 * does not validate contents of buffer to find out already mounted one.
 */
const mountBuffer = (FS, memPathId) => (contents, fileName) => {
    const file = fileName || nanoid(45);
    const mountedFilePath = `${memPathId}/${file}`;
    if (isMounted_1.isMounted(FS, mountedFilePath, 'file')) {
        logger_1.log(`mountTypedArrayFile: file is already mounted, return it`);
    }
    else {
        FS.writeFile(mountedFilePath, contents, { encoding: 'binary' });
    }
    return mountedFilePath;
};
exports.mountBuffer = mountBuffer;
/**
 * Stub function to support `browser` field in package.json. Do not use.
 *
 * @internal
 */
const mountDirectory = () => {
    throw new Error('not supported');
};
exports.mountDirectory = mountDirectory;

},{"../util/logger":20,"./isMounted":14,"nanoid":22}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../util/logger");
const isMounted_1 = require("./isMounted");
/**
 * Creates a function to unmount file or directory in wasm internal memory filesystem
 * If given mounted path prefix is pointing internal buffer file mounted via `mountBuffer`,
 * it'll be removed. Otherwise it'll be unmounted and remove internal directory.
 *
 * @param {FS} FS wasm module filesystem
 * @param {string} memPathId root path in memory filesystem to determine given unmount path is physical directory or buffer.
 * This prefix path is generated automatically each time wasm module is loaded.
 *
 * @return {(mountedPath: string) => void} function to unmount given path under memory filesystem.
 */
const unmount = (FS, memPathId) => (mountedPath) => {
    if (isMounted_1.isMounted(FS, mountedPath, 'file') && mountedPath.indexOf(memPathId) > -1) {
        logger_1.log(`unmount: ${mountedPath} is typedArrayFile, unlink from memory`);
        FS.unlink(mountedPath);
        return;
    }
    if (isMounted_1.isMounted(FS, mountedPath, 'dir')) {
        logger_1.log(`unmount: ${mountedPath} is directory, unmount`);
        FS.unmount(mountedPath);
        FS.rmdir(mountedPath);
        return;
    }
};
exports.unmount = unmount;

},{"../util/logger":20,"./isMounted":14}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getroot_1 = require("getroot");
/**
 * Naïvely detect if running environment if node
 * Note this'll return true on Electron's renderer process as well
 */
exports.isNode = () => {
    const proc = getroot_1.root.process;
    if (!!proc && typeof proc === 'object') {
        if (!!proc.versions && typeof proc.versions === 'object') {
            if (typeof proc.versions.node !== 'undefined') {
                return true;
            }
        }
    }
    return false;
};

},{"getroot":21}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getroot_1 = require("getroot");
/**
 * Naïvely check if current runtime supports native web assembly.
 */
exports.isWasmEnabled = () => !!getroot_1.root.WebAssembly && !!getroot_1.root.WebAssembly.compile && !!getroot_1.root.WebAssembly.instantiate;

},{"getroot":21}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default log instance falls back to noop if not specified.
 */
let logInstance = () => {
    /* noop */
};
const log = (...args) => logInstance(...args);
exports.log = log;
/**
 * Enables logging internal behavior of hunspell-asm.
 * @param logger function to log.
 */
const enableLogger = (logger) => (logInstance = logger);
exports.enableLogger = enableLogger;

},{}],21:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('Could not find any global context (window, self, global)');
    }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
(function (process){
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in production bundle
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use `nanoid/non-secure`. ' +
      'For secure ID install `expo-random` locally and use `nanoid/async`.'
    )
  }
  if (typeof self === 'undefined' || (!self.crypto && !self.msCrypto)) {
    throw new Error(
      'Your browser does not have secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

var crypto = self.crypto || self.msCrypto

// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for smaller size.
// -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
var url = '-_'
// Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
var i = 36
while (i--) {
  // 36 is radix. Number.prototype.toString(36) returns number
  // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
  url += i.toString(36)
}
// Loop from 36 to 10 (from Z to A in Base36).
i = 36
while (i-- - 10) {
  url += i.toString(36).toUpperCase()
}

module.exports = function (size) {
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size || 21))
  i = size || 21

  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    id += url[bytes[i] & 63]
  }
  return id
}

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
