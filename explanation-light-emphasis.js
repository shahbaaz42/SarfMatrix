// Learner-facing refinement for the eight generated Light Emphasis forms.
(function lightEmphasisLabels(){
  "use strict";
  const LIGHT_ROWS=new Set([0,2,3,6,8,9,12,13]);
  const PREFIX=[
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",null,
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",
    "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)",null,null,
    "This is the Muḍāriʿ prefix for the second person – masculine (حرف المضارعة للمخاطب المذكر)",null,
    "This is the Muḍāriʿ prefix for the second person – masculine (حرف المضارعة للمخاطب المذكر)",
    "This is the Muḍāriʿ prefix for the second person – feminine (حرف المضارعة للمخاطبة المؤنثة)",null,null,
    "This is the Muḍāriʿ prefix for the first person – singular (حرف المضارعة للمتكلم المفرد)",
    "This is the Muḍāriʿ prefix for the first person – plural (حرف المضارعة للمتكلمين)"
  ];
  const LIGHT_NUN="This is the light-emphasis nūn (نون التوكيد الخفيفة)";
  const EMPHATIC_LAM="This is the emphatic lām (لام التوكيد)";
  function selected(){return document.querySelector("#explanation-section")?.value==="section02"&&document.querySelector("#explanation-field")?.value==="lightEmphatic";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setLabel(label,text){if(!label||!text)return;if(label.textContent!==text)label.textContent=text;if(label.dir!=="ltr")label.dir="ltr";}
  function setText(title,cls,text){const b=block(title);if(!b)return;const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();let p=b.querySelector("."+cls);if(!p){p=document.createElement("p");p.className=cls;p.dir="ltr";b.append(p);}if(p.textContent!==text)p.textContent=text;if(p.dir!=="ltr")p.dir="ltr";}
  function apply(){if(!selected())return;const r=row();if(!LIGHT_ROWS.has(r))return;
    for(const card of document.querySelectorAll("#explanation-output .structure-run")){
      const label=card.querySelector(".structure-run__label");if(!label)continue;const t=label.textContent||"";
      if(/Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(t))setLabel(label,PREFIX[r]);
      else if(/^Particle$/i.test(t.trim())||/emphatic lām/i.test(t))setLabel(label,EMPHATIC_LAM);
      else if(/Light-emphasis\s+ن|نون التوكيد الخفيفة/i.test(t))setLabel(label,LIGHT_NUN);
    }
    let rule="The light-emphasis nūn (نون التوكيد الخفيفة) is attached to the Muḍāriʿ form after the emphatic lām (لام التوكيد).";
    let derivation="The selected Muḍāriʿ form is prepared for emphasis, then the light-emphasis nūn (نون التوكيد الخفيفة) is attached.";
    if(r===2||r===8){rule="With the masculine plural form, the ordinary indicative ending is reshaped before the light-emphasis nūn (نون التوكيد الخفيفة) is attached; the final nūn is the light-emphasis nūn, not the indicative nūn of the Five Verbs.";derivation="The ordinary masculine-plural Muḍāriʿ ending changes for emphasis, then نون التوكيد الخفيفة is attached.";}
    else if(r===9){rule="With the feminine singular addressee form, the ordinary indicative ending is reshaped before the light-emphasis nūn (نون التوكيد الخفيفة) is attached; the final nūn is نون التوكيد الخفيفة.";derivation="The feminine-address Muḍāriʿ ending changes for emphasis, then نون التوكيد الخفيفة is attached.";}
    setText("Rules","light-rule",rule);setText("Derivation","light-derivation",derivation);
  }
  function init(){const panel=document.querySelector("#explanation-panel");if(!panel)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{apply();busy=false;});}).observe(panel,{childList:true,subtree:true});for(const id of ["#explanation-section","#explanation-field","#explanation-row"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));apply();}
  if(typeof document!=="undefined")init();
})();

// Learner-facing audit for the ordinary command family in Section 03.
(function imperativeLabels(){
  "use strict";
  const SECOND_PERSON_ROWS=new Set([6,7,8,9,10,11]);
  const FIVE_VERB_ROWS=new Set([1,2,4,7,8,9,10]);
  const NUN_NISWA_ROWS=new Set([5,11]);
  const MUJARRAD_BABS=new Set(["فَتَحَ-يَفْتَحُ","ضَرَبَ-يَضْرِبُ","نَصَرَ-يَنْصُرُ","سَمِعَ-يَسْمَعُ","كَرُمَ-يَكْرُمُ","حَسِبَ-يَحْسِبُ"]);
  const PREFIX=[
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",
    "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)",
    "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)",
    "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)",
    null,null,null,null,null,null,
    "This is the Muḍāriʿ prefix for the first person – singular (حرف المضارعة للمتكلم المفرد)",
    "This is the Muḍāriʿ prefix for the first person – plural (حرف المضارعة للمتكلمين)"
  ];
  const ENDINGS=Object.freeze({
    1:[/Dual alif/i,"This is the masculine dual subject marker (ألف الاثنين)"],
    2:[/Plural wāw/i,"This is the masculine plural subject marker (واو الجماعة)"],
    4:[/Dual alif/i,"This is the feminine dual subject marker (ألف الاثنين)"],
    5:[/Nūn al-niswah/i,"This is the feminine plural subject marker (نون النسوة)"],
    7:[/Dual alif/i,"This is the masculine dual addressee subject marker (ألف الاثنين)"],
    8:[/Plural wāw/i,"This is the masculine plural addressee subject marker (واو الجماعة)"],
    9:[/Feminine-address yāʾ/i,"This is the feminine singular addressee subject marker (ياء المخاطبة)"],
    10:[/Dual alif/i,"This is the feminine dual addressee subject marker (ألف الاثنين)"],
    11:[/Nūn al-niswah/i,"This is the feminine plural addressee subject marker (نون النسوة)"]
  });
  const LAM_AL_AMR="This is lām al-amr, the jussive command particle (لام الأمر الجازمة)";
  const HAMZAT_WASL="This is hamzat al-waṣl used to begin the direct imperative (همزة الوصل في فعل الأمر)";
  function selected(){return document.querySelector("#explanation-section")?.value==="section03"&&document.querySelector("#explanation-field")?.value==="imperative";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setLabel(label,text){if(!label||!text)return;if(label.textContent!==text)label.textContent=text;if(label.dir!=="ltr")label.dir="ltr";}
  function setText(title,cls,text){const b=block(title);if(!b)return;const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();let p=b.querySelector("."+cls);if(!p){p=document.createElement("p");p.className=cls;p.dir="ltr";b.append(p);}if(p.textContent!==text)p.textContent=text;if(p.dir!=="ltr")p.dir="ltr";}
  function bare(text){return String(text||"").normalize("NFD").replace(/\p{M}/gu,"").trim();}
  function relabelStructure(r){
    const direct=SECOND_PERSON_ROWS.has(r);
    const cards=[...document.querySelectorAll("#explanation-output .structure-run")];
    for(const card of cards){
      const label=card.querySelector(".structure-run__label");if(!label)continue;
      const text=label.textContent||"";
      const arabic=card.querySelector(".structure-run__arabic")?.textContent||"";
      if(!direct&&/Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(text))setLabel(label,PREFIX[r]);
      if(!direct&&(/^Particle$/i.test(text.trim())||/lām al-amr|لام الأمر/i.test(text))&&bare(arabic).startsWith("ل"))setLabel(label,LAM_AL_AMR);
    }
    const ending=ENDINGS[r];
    if(ending){const card=cards.find(c=>ending[0].test(c.querySelector(".structure-run__label")?.textContent||""));if(card)setLabel(card.querySelector(".structure-run__label"),ending[1]);}
    if(direct&&MUJARRAD_BABS.has(document.querySelector("#bab")?.value||"")){
      const card=cards.find(c=>{const l=c.querySelector(".structure-run__label")?.textContent||"";const a=bare(c.querySelector(".structure-run__arabic")?.textContent||"");return a.startsWith("ا")&&!/Root radical/i.test(l)&&!/subject marker|addressee subject marker/i.test(l);});
      if(card)setLabel(card.querySelector(".structure-run__label"),HAMZAT_WASL);
    }
  }
  function applyRule(r){
    const direct=SECOND_PERSON_ROWS.has(r);
    let rule,derivation;
    if(direct){
      if(FIVE_VERB_ROWS.has(r)){
        rule="This is a direct imperative (فعل الأمر). Because its corresponding Muḍāriʿ is one of the Five Verbs (الأفعال الخمسة), the imperative is built on deletion of the nūn (مبني على حذف النون).";
        derivation="Start from the second-person Muḍāriʿ, remove its Muḍāriʿ prefix, supply the direct-imperative onset required by the Bāb, and delete the indicative nūn.";
      }else if(NUN_NISWA_ROWS.has(r)){
        rule="This is a direct imperative (فعل الأمر) connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون).";
        derivation="Start from the second-person Muḍāriʿ, remove its Muḍāriʿ prefix, form the imperative stem, and retain nūn al-niswah (نون النسوة).";
      }else{
        rule="This is a direct imperative (فعل الأمر). It is formed on the jussive pattern of its corresponding Muḍāriʿ (فعل الأمر مبني على ما يُجزم به مضارعه).";
        derivation="Start from the second-person Muḍāriʿ, remove its Muḍāriʿ prefix, supply the imperative onset required by the Bāb, and apply the jussive-based ending pattern.";
      }
    }else{
      if(FIVE_VERB_ROWS.has(r)){
        rule="This command is expressed with lām al-amr (لام الأمر). The following Muḍāriʿ is majzūm; as one of the Five Verbs (الأفعال الخمسة), its jussive sign is deletion of the nūn (علامة جزمه حذف النون).";
        derivation="Prefix lām al-amr (لام الأمر) to the Muḍāriʿ and place the verb in the jussive form by deleting the indicative nūn.";
      }else if(NUN_NISWA_ROWS.has(r)){
        rule="This command is expressed with lām al-amr (لام الأمر). The Muḍāriʿ is connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون) and is in the syntactic position of jussive (في محل جزم).";
        derivation="Prefix lām al-amr (لام الأمر) to the Muḍāriʿ while retaining nūn al-niswah (نون النسوة).";
      }else{
        rule="This command is expressed with lām al-amr (لام الأمر), which makes the following Muḍāriʿ majzūm; its jussive sign here is sukūn (علامة جزمه السكون).";
        derivation="Prefix lām al-amr (لام الأمر) to the Muḍāriʿ and place the verb in the jussive form with sukūn.";
      }
    }
    setText("Rules","imperative-rule",rule);setText("Derivation","imperative-derivation",derivation);
  }
  function apply(){if(!selected())return;const r=row();if(r===null)return;relabelStructure(r);applyRule(r);}
  function init(){const panel=document.querySelector("#explanation-panel");if(!panel)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{apply();busy=false;});}).observe(panel,{childList:true,subtree:true});for(const id of ["#explanation-section","#explanation-field","#explanation-row","#bab"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));apply();}
  if(typeof document!=="undefined")init();
})();
