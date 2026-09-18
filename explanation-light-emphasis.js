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
    5:[/Nūn al-niswah|نون النسوة|feminine plural subject marker/i,"This is the feminine plural subject marker (نون النسوة)"],
    7:[/Dual alif/i,"This is the masculine dual addressee subject marker (ألف الاثنين)"],
    8:[/Plural wāw/i,"This is the masculine plural addressee subject marker (واو الجماعة)"],
    9:[/Feminine-address yāʾ/i,"This is the feminine singular addressee subject marker (ياء المخاطبة)"],
    10:[/Dual alif/i,"This is the feminine dual addressee subject marker (ألف الاثنين)"],
    11:[/Nūn al-niswah|نون النسوة|feminine plural addressee subject marker/i,"This is the feminine plural addressee subject marker (نون النسوة)"]
  });
  const LAM_AL_AMR="This is lām al-amr, the jussive command particle (لام الأمر الجازمة)";
  const HAMZAT_WASL="This is hamzat al-waṣl used to begin the direct imperative (همزة الوصل في فعل الأمر)";
  const THIRD_RADICAL="Third root radical (لام الكلمة)";
  function selected(){return document.querySelector("#explanation-section")?.value==="section03"&&document.querySelector("#explanation-field")?.value==="imperative";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setLabel(label,text){if(!label||!text)return;if(label.textContent!==text)label.textContent=text;if(label.dir!=="ltr")label.dir="ltr";}
  function setText(title,cls,text){const b=block(title);if(!b)return;const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();let p=b.querySelector("."+cls);if(!p){p=document.createElement("p");p.className=cls;p.dir="ltr";b.append(p);}if(p.textContent!==text)p.textContent=text;if(p.dir!=="ltr")p.dir="ltr";}
  function bare(text){return String(text||"").normalize("NFD").replace(/\p{M}/gu,"").trim();}
  function arabicUnits(text){const units=[];for(const c of Array.from(String(text||""))){if(/\p{M}/u.test(c)&&units.length)units[units.length-1]+=c;else if(c.trim())units.push(c);}return units.filter(unit=>/\p{Script=Arabic}/u.test(unit));}
  function cloneStructureCard(source,arabic,labelText){const card=source.cloneNode(true);card.dataset.imperativeSemanticSplit="true";const a=card.querySelector(".structure-run__arabic");const l=card.querySelector(".structure-run__label");if(a)a.textContent=arabic;if(l)setLabel(l,labelText);return card;}
  function splitNiswaFinalRadical(r){
    if(!NUN_NISWA_ROWS.has(r))return;
    const cards=[...document.querySelectorAll("#explanation-output .structure-run")];
    if(cards.some(card=>card.dataset.imperativeSemanticSplit==="true"))return;
    const niswaIndex=cards.findLastIndex(card=>bare(card.querySelector(".structure-run__arabic")?.textContent||"")==="ن");
    if(niswaIndex<=0)return;
    const candidate=cards[niswaIndex-1];
    const label=candidate.querySelector(".structure-run__label")?.textContent||"";
    const units=arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent||"");
    if(units.length!==2||!/Second root radical|عين الكلمة/i.test(label))return;
    const second=cloneStructureCard(candidate,units[0],label);
    const third=cloneStructureCard(candidate,units[1],THIRD_RADICAL);
    candidate.replaceWith(second,third);
  }
  function relabelStructure(r){
    splitNiswaFinalRadical(r);
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
        derivation="Start from the second-person Muḍāriʿ, remove its Muḍāriʿ prefix, supply the direct-imperative onset required by the Bāb, and apply the jussive-based ending pattern.";
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

// Learner-facing audit for the heavy-emphasis command family in Section 03.
(function heavyImperativeLabels(){
  "use strict";
  const SECOND_PERSON_ROWS=new Set([6,7,8,9,10,11]);
  const DUAL_ROWS=new Set([1,4,7,10]);
  const NUN_NISWA_ROWS=new Set([5,11]);
  const MASC_PLURAL_ROWS=new Set([2,8]);
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
  const DUAL_LABELS=Object.freeze({
    1:"This is the masculine dual subject marker (ألف الاثنين)",
    4:"This is the feminine dual subject marker (ألف الاثنين)",
    7:"This is the masculine dual addressee subject marker (ألف الاثنين)",
    10:"This is the feminine dual addressee subject marker (ألف الاثنين)"
  });
  const HEAVY_NUN="This is the heavy-emphasis nūn (نون التوكيد الثقيلة)";
  const LAM_AL_AMR="This is lām al-amr, the jussive command particle (لام الأمر الجازمة)";
  const HAMZAT_WASL="This is hamzat al-waṣl used to begin the direct imperative (همزة الوصل في فعل الأمر)";
  const SEPARATING_ALIF="This is the separating alif (الألف الفاصلة)";
  function selected(){return document.querySelector("#explanation-section")?.value==="section03"&&document.querySelector("#explanation-field")?.value==="heavyImperative";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setLabel(label,text){if(!label||!text)return;if(label.textContent!==text)label.textContent=text;if(label.dir!=="ltr")label.dir="ltr";}
  function setText(title,cls,text){const b=block(title);if(!b)return;const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();let p=b.querySelector("."+cls);if(!p){p=document.createElement("p");p.className=cls;p.dir="ltr";b.append(p);}if(p.textContent!==text)p.textContent=text;if(p.dir!=="ltr")p.dir="ltr";}
  function bare(text){return String(text||"").normalize("NFD").replace(/\p{M}/gu,"").trim();}
  function arabicUnits(text){const units=[];for(const c of Array.from(String(text||""))){if(/\p{M}/u.test(c)&&units.length)units[units.length-1]+=c;else if(c.trim())units.push(c);}return units.filter(unit=>/\p{Script=Arabic}/u.test(unit));}
  function cloneStructureCard(source,arabic,labelText){const card=source.cloneNode(true);card.dataset.heavyImperativeSemanticSplit="true";const a=card.querySelector(".structure-run__arabic");const l=card.querySelector(".structure-run__label");if(a)a.textContent=arabic;if(l)setLabel(l,labelText);return card;}
  function splitDualHeavyEnding(r){
    if(!DUAL_ROWS.has(r))return;
    const cards=[...document.querySelectorAll("#explanation-output .structure-run")];
    const candidate=cards.find(card=>{
      const label=card.querySelector(".structure-run__label")?.textContent||"";
      const units=arabicUnits(card.querySelector(".structure-run__arabic")?.textContent||"");
      return /Heavy-emphasis\s+ن|نون التوكيد الثقيلة/i.test(label)&&units.length===2&&bare(units[0])==="ا"&&bare(units[1])==="ن";
    });
    if(!candidate)return;
    const units=arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent||"");
    candidate.replaceWith(cloneStructureCard(candidate,units[0],DUAL_LABELS[r]),cloneStructureCard(candidate,units[1],HEAVY_NUN));
  }
  function relabelStructure(r){
    splitDualHeavyEnding(r);
    const direct=SECOND_PERSON_ROWS.has(r);
    const cards=[...document.querySelectorAll("#explanation-output .structure-run")];
    for(const card of cards){
      const label=card.querySelector(".structure-run__label");if(!label)continue;
      const text=label.textContent||"";
      const arabic=card.querySelector(".structure-run__arabic")?.textContent||"";
      if(/Heavy-emphasis\s+ن|نون التوكيد الثقيلة/i.test(text))setLabel(label,HEAVY_NUN);
      else if(NUN_NISWA_ROWS.has(r)&&/Feminine plural\s+ن|نون النسوة/i.test(text))setLabel(label,r===11?"This is the feminine plural addressee subject marker (نون النسوة)":"This is the feminine plural subject marker (نون النسوة)");
      else if(NUN_NISWA_ROWS.has(r)&&/Separating\s+ا|الألف الفاصلة/i.test(text))setLabel(label,SEPARATING_ALIF);
      else if(!direct&&/Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(text))setLabel(label,PREFIX[r]);
      else if(!direct&&(/^Particle$/i.test(text.trim())||/lām al-amr|لام الأمر/i.test(text))&&bare(arabic).startsWith("ل"))setLabel(label,LAM_AL_AMR);
    }
    if(direct&&MUJARRAD_BABS.has(document.querySelector("#bab")?.value||"")){
      const card=cards.find(c=>{const l=c.querySelector(".structure-run__label")?.textContent||"";const a=bare(c.querySelector(".structure-run__arabic")?.textContent||"");return a.startsWith("ا")&&!/Root radical/i.test(l)&&!/subject marker|addressee subject marker|heavy-emphasis/i.test(l);});
      if(card)setLabel(card.querySelector(".structure-run__label"),HAMZAT_WASL);
    }
  }
  function applyRule(r){
    const direct=SECOND_PERSON_ROWS.has(r);
    const mode=direct?"This is a direct imperative (فعل الأمر) strengthened by the heavy-emphasis nūn (نون التوكيد الثقيلة).":"This command is expressed with lām al-amr (لام الأمر) and strengthened by the heavy-emphasis nūn (نون التوكيد الثقيلة).";
    let rule=mode;
    let derivation=direct?"Form the second-person direct imperative, then attach the heavy-emphasis nūn (نون التوكيد الثقيلة).":"Prefix lām al-amr (لام الأمر) to the corresponding Muḍāriʿ command form, then attach the heavy-emphasis nūn (نون التوكيد الثقيلة).";
    if(DUAL_ROWS.has(r)){
      rule=`${mode} The dual alif (ألف الاثنين) is retained as its own grammatical component before the heavy-emphasis nūn.`;
      derivation=direct?"Form the direct imperative, retain the dual alif (ألف الاثنين), then attach نون التوكيد الثقيلة.":"Prefix lām al-amr (لام الأمر), retain the dual alif (ألف الاثنين), then attach نون التوكيد الثقيلة.";
    }else if(MASC_PLURAL_ROWS.has(r)){
      rule=`${mode} In the masculine plural form, the ending is reshaped for emphasis; the final nūn is نون التوكيد الثقيلة, not the indicative nūn of the Five Verbs.`;
      derivation=direct?"Form the masculine-plural direct imperative, reshape its ending for emphasis, then attach نون التوكيد الثقيلة.":"Prefix lām al-amr (لام الأمر), reshape the masculine-plural ending for emphasis, then attach نون التوكيد الثقيلة.";
    }else if(r===9){
      rule=`${mode} In the feminine singular addressee form, the ending is reshaped for emphasis and the final nūn is نون التوكيد الثقيلة.`;
      derivation="Form the feminine singular direct imperative, reshape its ending for emphasis, then attach نون التوكيد الثقيلة.";
    }else if(NUN_NISWA_ROWS.has(r)){
      rule=`${mode} Nūn al-niswah (نون النسوة) remains the feminine-plural subject marker, and a separating alif (الألف الفاصلة) stands between it and نون التوكيد الثقيلة.`;
      derivation=direct?"Form the feminine-plural direct imperative, retain نون النسوة, insert الألف الفاصلة, then attach نون التوكيد الثقيلة.":"Prefix lām al-amr (لام الأمر), retain نون النسوة, insert الألف الفاصلة, then attach نون التوكيد الثقيلة.";
    }
    setText("Rules","heavy-imperative-rule",rule);setText("Derivation","heavy-imperative-derivation",derivation);
  }
  function apply(){if(!selected())return;const r=row();if(r===null)return;relabelStructure(r);applyRule(r);}
  function init(){const panel=document.querySelector("#explanation-panel");if(!panel)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{apply();busy=false;});}).observe(panel,{childList:true,subtree:true});for(const id of ["#explanation-section","#explanation-field","#explanation-row","#bab"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));apply();}
  if(typeof document!=="undefined")init();
})();


// Learner-facing audit for the eight generated Light-emphasis command forms in Section 03.
(function lightImperativeLabels(){
  "use strict";
  const LIGHT_ROWS=new Set([0,2,3,6,8,9,12,13]);
  const DIRECT_ROWS=new Set([6,8,9]);
  const PREFIX=[
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",null,
    "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)",
    "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)",null,null,null,
    "This is the Muḍāriʿ prefix for the second person – masculine (حرف المضارعة للمخاطب المذكر)",null,
    "This is the Muḍāriʿ prefix for the second person – feminine (حرف المضارعة للمخاطبة المؤنثة)",null,null,
    "This is the Muḍāriʿ prefix for the first person – singular (حرف المضارعة للمتكلم المفرد)",
    "This is the Muḍāriʿ prefix for the first person – plural (حرف المضارعة للمتكلمين)"
  ];
  const LIGHT_NUN="This is the light-emphasis nūn (نون التوكيد الخفيفة)";
  const LAM_AL_AMR="This is lām al-amr, the jussive command particle (لام الأمر الجازمة)";
  const HAMZAT_WASL="This is hamzat al-waṣl used to begin the direct imperative (همزة الوصل في فعل الأمر)";
  const WAW_JAMA="This is the masculine plural subject marker, wāw al-jamāʿah (واو الجماعة)";
  const YA_MUKHATABAH="This is the feminine singular addressee marker, yāʾ al-mukhāṭabah (ياء المخاطبة)";
  function selected(){return document.querySelector("#explanation-section")?.value==="section03"&&document.querySelector("#explanation-field")?.value==="lightImperative";}
  function row(){const n=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(n)?n:null;}
  function block(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase());}
  function setLabel(label,text){if(!label||!text)return;if(label.textContent!==text)label.textContent=text;if(label.dir!=="ltr")label.dir="ltr";}
  function setText(title,cls,text){const b=block(title);if(!b)return;const empty=b.querySelector(".explanation-empty");if(empty)empty.remove();let p=b.querySelector("."+cls);if(!p){p=document.createElement("p");p.className=cls;p.dir="ltr";b.append(p);}if(p.textContent!==text)p.textContent=text;if(p.dir!=="ltr")p.dir="ltr";}
  function relabelStructure(r){
    const direct=DIRECT_ROWS.has(r);
    for(const card of document.querySelectorAll("#explanation-output .structure-run")){
      const label=card.querySelector(".structure-run__label");if(!label)continue;
      const text=label.textContent||"";
      const arabic=card.querySelector(".structure-run__arabic")?.textContent||"";
      if(/Light-emphasis\s+ن|نون التوكيد الخفيفة/i.test(text))setLabel(label,LIGHT_NUN);
      else if(!direct&&/Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(text))setLabel(label,PREFIX[r]);
      else if(!direct&&(/^Particle$/i.test(text.trim())||/lām al-amr|لام الأمر/i.test(text))&&/ل/.test(arabic))setLabel(label,LAM_AL_AMR);
      else if(direct&&r===6&&/Hamzat|Derivational element|همزة الوصل/i.test(text))setLabel(label,HAMZAT_WASL);
      else if(direct&&r===8&&/Plural wāw|واو الجماعة/i.test(text))setLabel(label,WAW_JAMA);
      else if(direct&&r===9&&/Feminine-address yāʾ|ياء المخاطبة/i.test(text))setLabel(label,YA_MUKHATABAH);
    }
  }
  function applyRule(r){
    let rule,derivation;
    if(r===6){
      rule="This is a direct imperative (فعل الأمر) strengthened by the light-emphasis nūn (نون التوكيد الخفيفة). A command attached to a nūn of emphasis is built on fatḥ.";
      derivation="Form the direct imperative with hamzat al-waṣl (همزة الوصل), then attach نون التوكيد الخفيفة.";
    }else if(r===8){
      rule="This is a direct masculine-plural imperative strengthened by نون التوكيد الخفيفة. The wāw of wāw al-jamāʿah is omitted before the nūn to avoid two sukūns, while the preceding ḍammah indicates the plural marker.";
      derivation="Form the masculine-plural imperative, omit wāw al-jamāʿah before the light nūn, retain the ḍammah as its indication, then attach نون التوكيد الخفيفة.";
    }else if(r===9){
      rule="This is a direct feminine-singular imperative strengthened by نون التوكيد الخفيفة. The yāʾ of yāʾ al-mukhāṭabah is omitted before the nūn to avoid two sukūns, while the preceding kasrah indicates the feminine addressee marker.";
      derivation="Form the feminine-singular imperative, omit yāʾ al-mukhāṭabah before the light nūn, retain the kasrah as its indication, then attach نون التوكيد الخفيفة.";
    }else if(r===2){
      rule="This command is expressed with lām al-amr (لام الأمر). The masculine-plural Muḍāriʿ command form omits wāw al-jamāʿah before نون التوكيد الخفيفة to avoid two sukūns; the preceding ḍammah indicates the plural marker.";
      derivation="Prefix lām al-amr to the masculine-plural Muḍāriʿ, form the command construction, omit wāw al-jamāʿah before the light nūn, then attach نون التوكيد الخفيفة.";
    }else{
      rule="This command is expressed with lām al-amr (لام الأمر) and strengthened by the light-emphasis nūn (نون التوكيد الخفيفة), which is attached directly to the Muḍāriʿ form.";
      derivation="Prefix lām al-amr to the corresponding Muḍāriʿ command form, then attach نون التوكيد الخفيفة.";
    }
    setText("Rules","light-imperative-rule",rule);setText("Derivation","light-imperative-derivation",derivation);
  }
  function apply(){if(!selected())return;const r=row();if(r===null||!LIGHT_ROWS.has(r))return;relabelStructure(r);applyRule(r);}
  function init(){const panel=document.querySelector("#explanation-panel");if(!panel)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{apply();busy=false;});}).observe(panel,{childList:true,subtree:true});for(const id of ["#explanation-section","#explanation-field","#explanation-row"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));apply();}
  if(typeof document!=="undefined")init();
})();
