// Precision grammar layer for Section 03 heavy-emphasis commands.
(function heavyImperativeGrammarPrecision(){
  "use strict";
  const SECOND_PERSON_ROWS=new Set([6,7,8,9,10,11]);
  const DUAL_ROWS=new Set([1,4,7,10]);
  const MASC_PLURAL_ROWS=new Set([2,8]);
  const NUN_NISWA_ROWS=new Set([5,11]);
  const DIRECTLY_EMPHASIZED_NONSECOND_ROWS=new Set([0,3,12,13]);

  function selected(){return document.querySelector("#explanation-section")?.value==="section03"&&document.querySelector("#explanation-field")?.value==="heavyImperative";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setPreciseText(title,legacyClass,preciseClass,text){
    const b=block(title);if(!b)return;
    const legacy=b.querySelector("."+legacyClass);if(legacy)legacy.hidden=true;
    const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();
    let p=b.querySelector("."+preciseClass);
    if(!p){p=document.createElement("p");p.className=preciseClass;p.dir="ltr";b.append(p);}
    if(p.textContent!==text)p.textContent=text;
    if(p.dir!=="ltr")p.dir="ltr";
  }

  function explanationFor(r){
    const direct=SECOND_PERSON_ROWS.has(r);

    if(r===6){
      return {
        rule:"This is a direct imperative (فعل الأمر) directly connected to the heavy-emphasis nūn (نون التوكيد الثقيلة), so it is built on fatḥ (مبني على الفتح لاتصاله بنون التوكيد الثقيلة اتصالًا مباشرًا).",
        derivation:"Form the second-person singular direct imperative, change the final radical from sukūn to fatḥ for direct attachment, then attach نون التوكيد الثقيلة."
      };
    }

    if(r===7||r===10){
      return {
        rule:"This is a direct imperative (فعل الأمر). Because its corresponding Muḍāriʿ is one of the Five Verbs (الأفعال الخمسة), it is built on deletion of the nūn (مبني على حذف النون). The dual alif (ألف الاثنين) remains, and the heavy-emphasis nūn follows it with kasrah (نِّ).",
        derivation:"Start from the second-person dual Muḍāriʿ, remove the Muḍāriʿ prefix and the indicative nūn, form the imperative onset, retain ألف الاثنين, then attach نون التوكيد الثقيلة as نِّ."
      };
    }

    if(r===8){
      return {
        rule:"This is a direct imperative (فعل الأمر) built on deletion of the nūn (مبني على حذف النون) because its corresponding Muḍāriʿ is one of the Five Verbs (الأفعال الخمسة). The wāw of the masculine plural subject (واو الجماعة) is deleted to avoid the meeting of two sukūns (حذفت واو الجماعة لالتقاء الساكنين); the preceding ḍammah indicates it, then نون التوكيد الثقيلة is attached.",
        derivation:"Form the masculine-plural direct imperative by deleting the indicative nūn, delete واو الجماعة لالتقاء الساكنين while retaining the preceding ḍammah as its sign, then attach نون التوكيد الثقيلة."
      };
    }

    if(r===9){
      return {
        rule:"This is a direct imperative (فعل الأمر) built on deletion of the nūn (مبني على حذف النون) because its corresponding Muḍāriʿ is one of the Five Verbs (الأفعال الخمسة). The feminine-address yāʾ (ياء المخاطبة) is deleted to avoid the meeting of two sukūns (حذفت ياء المخاطبة لالتقاء الساكنين); the preceding kasrah indicates it, then نون التوكيد الثقيلة is attached.",
        derivation:"Form the feminine-singular direct imperative by deleting the indicative nūn, delete ياء المخاطبة لالتقاء الساكنين while retaining the preceding kasrah as its sign, then attach نون التوكيد الثقيلة."
      };
    }

    if(r===11){
      return {
        rule:"This is a direct imperative (فعل الأمر) connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون). نون النسوة remains the feminine-plural addressee subject marker; a separating alif (الألف الفاصلة) is inserted before نون التوكيد الثقيلة.",
        derivation:"Form the feminine-plural direct imperative on sukūn, retain نون النسوة, insert الألف الفاصلة, then attach نون التوكيد الثقيلة."
      };
    }

    if(DIRECTLY_EMPHASIZED_NONSECOND_ROWS.has(r)){
      return {
        rule:"This command is expressed with lām al-amr (لام الأمر). The Muḍāriʿ is directly connected to the heavy-emphasis nūn (نون التوكيد الثقيلة), so it is built on fatḥ and is in the syntactic position of jussive because of lām al-amr (فعل مضارع مبني على الفتح في محل جزم بلام الأمر).",
        derivation:"Prefix lām al-amr (لام الأمر) to the corresponding Muḍāriʿ, place the final radical on fatḥ for direct attachment, then attach نون التوكيد الثقيلة."
      };
    }

    if(DUAL_ROWS.has(r)){
      return {
        rule:"This command is expressed with lām al-amr (لام الأمر). The Muḍāriʿ is majzūm by lām al-amr; because it is one of the Five Verbs (الأفعال الخمسة), its jussive sign is deletion of the nūn (علامة جزمه حذف النون). The dual alif (ألف الاثنين) remains, and the heavy-emphasis nūn follows it with kasrah (نِّ).",
        derivation:"Prefix lām al-amr, delete the indicative nūn of the dual Muḍāriʿ, retain ألف الاثنين, then attach نون التوكيد الثقيلة as نِّ."
      };
    }

    if(MASC_PLURAL_ROWS.has(r)){
      return {
        rule:"This command is expressed with lām al-amr (لام الأمر). The Muḍāriʿ is majzūm, and as one of the Five Verbs (الأفعال الخمسة) its jussive sign is deletion of the nūn (علامة جزمه حذف النون). واو الجماعة is then deleted to avoid the meeting of two sukūns (حذفت واو الجماعة لالتقاء الساكنين); the preceding ḍammah indicates it, then نون التوكيد الثقيلة is attached.",
        derivation:"Prefix lām al-amr, delete the indicative nūn, delete واو الجماعة لالتقاء الساكنين while retaining the preceding ḍammah as its sign, then attach نون التوكيد الثقيلة."
      };
    }

    if(NUN_NISWA_ROWS.has(r)){
      return {
        rule:"This command is expressed with lām al-amr (لام الأمر). The Muḍāriʿ connected to nūn al-niswah (نون النسوة) is built on sukūn and is in the syntactic position of jussive (مبني على السكون في محل جزم بلام الأمر). نون النسوة remains, then a separating alif (الألف الفاصلة) is inserted before نون التوكيد الثقيلة.",
        derivation:"Prefix lām al-amr, retain the feminine-plural Muḍāriʿ with نون النسوة, insert الألف الفاصلة, then attach نون التوكيد الثقيلة."
      };
    }

    return {
      rule:direct?"This is a direct imperative (فعل الأمر) strengthened by نون التوكيد الثقيلة.":"This command is expressed with lām al-amr (لام الأمر) and strengthened by نون التوكيد الثقيلة.",
      derivation:direct?"Form the direct imperative, then attach نون التوكيد الثقيلة.":"Prefix lām al-amr to the Muḍāriʿ command form, then attach نون التوكيد الثقيلة."
    };
  }

  function apply(){
    if(!selected())return;
    const r=row();if(r===null)return;
    const text=explanationFor(r);
    setPreciseText("Rules","heavy-imperative-rule","heavy-imperative-precise-rule",text.rule);
    setPreciseText("Derivation","heavy-imperative-derivation","heavy-imperative-precise-derivation",text.derivation);
  }

  function init(){
    const panel=document.querySelector("#explanation-panel");if(!panel)return;
    let busy=false;
    new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{apply();busy=false;});}).observe(panel,{childList:true,subtree:true,characterData:true});
    for(const id of ["#explanation-section","#explanation-field","#explanation-row","#bab"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));
    apply();
  }

  if(typeof document!=="undefined")init();
})();
