// Learner-facing terminology and morphology labels.
(function exposeLearnerLabels(globalScope) {
  "use strict";

  const SECTION_LABELS = Object.freeze({
    section01: "Section 01 — Indicative & passive (القسم 01 — المرفوع والمجهول)",
    section02: "Section 02 — Jussive, subjunctive & emphasis (القسم 02 — المجزوم والمنصوب والتوكيد)",
    section03: "Section 03 — Commands (القسم 03 — فعل الأمر)",
    section04: "Section 04 — Derived forms (القسم 04 — المشتقات)",
  });
  const FORM_LABELS = Object.freeze({
    past: "Active past (الفعل الماضي المعلوم)", present: "Active present (الفعل المضارع المعلوم)",
    passivePast: "Passive past (الفعل الماضي المجهول)", passivePresent: "Passive present (الفعل المضارع المجهول)",
    majzumPresent: "Jussive present (الفعل المضارع المجزوم)", mansubPresent: "Subjunctive present (الفعل المضارع المنصوب)",
    heavyEmphatic: "Heavy emphasis (المضارع المؤكد بالنون الثقيلة)", lightEmphatic: "Light emphasis (المضارع المؤكد بالنون الخفيفة)",
    imperative: "Imperative (فعل الأمر)", heavyImperative: "Heavy-emphasis imperative (فعل الأمر بنون التوكيد الثقيلة)",
    lightImperative: "Light-emphasis imperative (فعل الأمر بنون التوكيد الخفيفة)", masdar: "Verbal noun / Maṣdar (المصدر)",
    activeParticiple: "Active participle (اسم الفاعل)", passiveParticiple: "Passive participle (اسم المفعول)",
    elative: "Elative (اسم التفضيل)", zarf: "Adverb of time/place (اسم الظرف)",
  });
  const NOMINAL_COMPONENT_PREFIX = /^(?:ا|و|ي|ن|ت|ة|ات)\s+of\b/i;
  const ARABIC_MARK = /\p{M}/u;
  const THUBUT_NUN = "This is the retained nūn of the Five Verbs in the indicative (ثبوت النون في الأفعال الخمسة)";
  const HEAVY_NUN = "This is the heavy-emphasis nūn (نون التوكيد الثقيلة)";
  const P3M = "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)";
  const P3F = "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)";
  const P2M = "This is the Muḍāriʿ prefix for the second person – masculine (حرف المضارعة للمخاطب المذكر)";
  const P2F = "This is the Muḍāriʿ prefix for the second person – feminine (حرف المضارعة للمخاطبة المؤنثة)";
  const P1S = "This is the Muḍāriʿ prefix for the first person – singular (حرف المضارعة للمتكلم المفرد)";
  const P1P = "This is the Muḍāriʿ prefix for the first person – plural (حرف المضارعة للمتكلمين)";

  const ACTIVE_PAST_ENDINGS = Object.freeze({
    1:[{letters:1,label:"This is the masculine dual subject marker (ألف الاثنين للمثنى المذكر الغائب)"}],
    2:[{letters:2,label:"This is the masculine plural subject marker (واو الجماعة لجمع المذكر الغائب)"}],
    3:[{letters:1,label:"This is the feminine singular marker (تاء التأنيث الساكنة للمفردة المؤنثة الغائبة)"}],
    4:[{letters:1,label:"This is the feminine marker (تاء التأنيث)"},{letters:1,label:"This is the feminine dual subject marker (ألف الاثنين للمثنى المؤنث الغائب)"}],
    5:[{letters:1,label:"This is the feminine plural subject marker (نون النسوة لجمع المؤنث الغائب)"}],
    6:[{letters:1,label:"This is the masculine singular addressee subject ending with fatḥah (تاء الفاعل للمخاطب المفرد المذكر)"}],
    7:[{letters:1,label:"This is ت of the masculine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)"},{letters:1,label:"This is م of the masculine dual addressee ending (أنتما)"},{letters:1,label:"This is ا of the masculine dual addressee ending (أنتما)"}],
    8:[{letters:1,label:"This is ت of the masculine plural addressee subject ending (تاء الفاعل لجمع المذكر المخاطب)"},{letters:1,label:"This is م of the masculine plural addressee ending (أنتم)"}],
    9:[{letters:1,label:"This is the feminine singular addressee subject ending with kasrah (تاء الفاعل للمخاطبة المفردة المؤنثة)"}],
    10:[{letters:1,label:"This is ت of the feminine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)"},{letters:1,label:"This is م of the feminine dual addressee ending (أنتما)"},{letters:1,label:"This is ا of the feminine dual addressee ending (أنتما)"}],
    11:[{letters:1,label:"This is ت of the feminine plural addressee subject ending (تاء الفاعل لجمع المؤنث المخاطب)"},{letters:1,label:"This is ن of the feminine plural addressee ending (أنتنّ)"}],
    12:[{letters:1,label:"This is the first-person singular subject ending with ḍammah (تاء الفاعل للمتكلم المفرد)"}],
    13:[{letters:2,label:"This is the first-person plural subject ending (نا الفاعلين للمتكلمين)"}],
  });
  const PRESENT_LAYOUTS = Object.freeze([
    {prefix:P3M,ending:null},{prefix:P3M,ending:[{letters:1,label:"This is ا of the masculine dual subject (ألف الاثنين)"},{letters:1,label:THUBUT_NUN}]},
    {prefix:P3M,ending:[{letters:1,label:"This is و of the masculine plural subject (واو الجماعة)"},{letters:1,label:THUBUT_NUN}]},{prefix:P3F,ending:null},
    {prefix:P3F,ending:[{letters:1,label:"This is ا of the feminine dual subject (ألف الاثنين)"},{letters:1,label:THUBUT_NUN}]},{prefix:P3F,ending:[{letters:1,label:"This is the feminine plural subject marker (نون النسوة)"}]},
    {prefix:P2M,ending:null},{prefix:P2M,ending:[{letters:1,label:"This is ا of the masculine dual addressee subject (ألف الاثنين)"},{letters:1,label:THUBUT_NUN}]},
    {prefix:P2M,ending:[{letters:1,label:"This is و of the masculine plural addressee subject (واو الجماعة)"},{letters:1,label:THUBUT_NUN}]},{prefix:P2F,ending:[{letters:1,label:"This is ي of the feminine singular addressee subject (ياء المخاطبة)"},{letters:1,label:THUBUT_NUN}]},
    {prefix:P2F,ending:[{letters:1,label:"This is ا of the feminine dual addressee subject (ألف الاثنين)"},{letters:1,label:THUBUT_NUN}]},{prefix:P2F,ending:[{letters:1,label:"This is the feminine plural addressee subject marker (نون النسوة)"}]},
    {prefix:P1S,ending:null},{prefix:P1P,ending:null},
  ]);
  function moodLayouts(ruleSimple) { return Object.freeze([
    {prefix:P3M,ending:null,rule:ruleSimple},{prefix:P3M,ending:[{letters:1,label:"This is ا of the masculine dual subject (ألف الاثنين)"}],rule:"deleteNun"},{prefix:P3M,ending:[{letters:2,label:"This is وا of the masculine plural subject (واو الجماعة)"}],rule:"deleteNun"},
    {prefix:P3F,ending:null,rule:ruleSimple},{prefix:P3F,ending:[{letters:1,label:"This is ا of the feminine dual subject (ألف الاثنين)"}],rule:"deleteNun"},{prefix:P3F,ending:[{letters:1,label:"This is the feminine plural subject marker (نون النسوة)"}],rule:"nunNiswa"},
    {prefix:P2M,ending:null,rule:ruleSimple},{prefix:P2M,ending:[{letters:1,label:"This is ا of the masculine dual addressee subject (ألف الاثنين)"}],rule:"deleteNun"},{prefix:P2M,ending:[{letters:2,label:"This is وا of the masculine plural addressee subject (واو الجماعة)"}],rule:"deleteNun"},
    {prefix:P2F,ending:[{letters:1,label:"This is ي of the feminine singular addressee subject (ياء المخاطبة)"}],rule:"deleteNun"},{prefix:P2F,ending:[{letters:1,label:"This is ا of the feminine dual addressee subject (ألف الاثنين)"}],rule:"deleteNun"},{prefix:P2F,ending:[{letters:1,label:"This is the feminine plural addressee subject marker (نون النسوة)"}],rule:"nunNiswa"},
    {prefix:P1S,ending:null,rule:ruleSimple},{prefix:P1P,ending:null,rule:ruleSimple},
  ]); }
  const MAJZUM_LAYOUTS=moodLayouts("sukun"), MANSUB_LAYOUTS=moodLayouts("fathah");
  const HEAVY_LAYOUTS = Object.freeze([
    {prefix:P3M,ending:[{letters:1,label:HEAVY_NUN}],rule:"direct"},
    {prefix:P3M,ending:[{letters:1,label:"This is the masculine dual subject marker (ألف الاثنين)"},{letters:1,label:HEAVY_NUN}],rule:"dual"},
    {prefix:P3M,ending:[{letters:1,label:HEAVY_NUN}],rule:"mascPlural"},
    {prefix:P3F,ending:[{letters:1,label:HEAVY_NUN}],rule:"direct"},
    {prefix:P3F,ending:[{letters:1,label:"This is the feminine dual subject marker (ألف الاثنين)"},{letters:1,label:HEAVY_NUN}],rule:"dual"},
    {prefix:P3F,ending:null,rule:"nunNiswa"},
    {prefix:P2M,ending:[{letters:1,label:HEAVY_NUN}],rule:"direct"},
    {prefix:P2M,ending:[{letters:1,label:"This is the masculine dual addressee subject marker (ألف الاثنين)"},{letters:1,label:HEAVY_NUN}],rule:"dual"},
    {prefix:P2M,ending:[{letters:1,label:HEAVY_NUN}],rule:"mascPlural"},
    {prefix:P2F,ending:[{letters:1,label:HEAVY_NUN}],rule:"femSingular"},
    {prefix:P2F,ending:[{letters:1,label:"This is the feminine dual addressee subject marker (ألف الاثنين)"},{letters:1,label:HEAVY_NUN}],rule:"dual"},
    {prefix:P2F,ending:null,rule:"nunNiswa"},
    {prefix:P1S,ending:[{letters:1,label:HEAVY_NUN}],rule:"direct"},{prefix:P1P,ending:[{letters:1,label:HEAVY_NUN}],rule:"direct"},
  ]);

  function currentBabName(){const s=document.querySelector("#bab");const l=s?.selectedOptions?.[0]?.textContent||"";return (l.split("—")[0]||l).trim();}
  function relabelSelect(s,labels){if(!s)return;for(const o of s.options){const l=labels[o.value];if(l&&o.textContent!==l)o.textContent=l;}}
  function relabelControls(){relabelSelect(document.querySelector("#explanation-section"),SECTION_LABELS);relabelSelect(document.querySelector("#explanation-field"),FORM_LABELS);}
  function arabicUnits(text){const u=[];for(const c of Array.from(String(text||""))){if(ARABIC_MARK.test(c)&&u.length)u[u.length-1]+=c;else u.push(c);}return u.filter(x=>x.trim());}
  function bareArabic(text){return String(text||"").normalize("NFD").replace(/\p{M}/gu,"");}
  function makeStructureCard(source,arabic,labelText){const c=source.cloneNode(true);c.dataset.semanticSplit="true";const a=c.querySelector(".structure-run__arabic"),l=c.querySelector(".structure-run__label");if(a)a.textContent=arabic;if(l){l.textContent=labelText;l.dir="ltr";}return c;}
  function rowIndex(){const v=Number(document.querySelector("#explanation-row")?.value);return Number.isInteger(v)?v:null;}
  function sectionField(section,field){return document.querySelector("#explanation-section")?.value===section&&document.querySelector("#explanation-field")?.value===field;}
  function currentPastLayout(){if(document.querySelector("#explanation-section")?.value!=="section01"||!["past","passivePast"].includes(document.querySelector("#explanation-field")?.value))return null;return ACTIVE_PAST_ENDINGS[rowIndex()]||null;}
  function currentPresentLayout(){if(document.querySelector("#explanation-section")?.value!=="section01"||!["present","passivePresent"].includes(document.querySelector("#explanation-field")?.value))return null;return PRESENT_LAYOUTS[rowIndex()]||null;}
  function currentMajzumLayout(){return sectionField("section02","majzumPresent")?MAJZUM_LAYOUTS[rowIndex()]||null:null;}
  function currentMansubLayout(){return sectionField("section02","mansubPresent")?MANSUB_LAYOUTS[rowIndex()]||null:null;}
  function currentHeavyLayout(){return sectionField("section02","heavyEmphatic")?HEAVY_LAYOUTS[rowIndex()]||null:null;}
  function currentNonpastLayout(){return currentPresentLayout()||currentMajzumLayout()||currentMansubLayout()||currentHeavyLayout();}
  function isLexicalOrDerivationalCard(c){return /root radical|Hamzat al-|باب|Form\s+\d+/i.test(c.querySelector(".structure-run__label")?.textContent||"");}
  function isPastEndingCard(c){return /\p{Script=Arabic}/u.test(c.querySelector(".structure-run__arabic")?.textContent||"")&&!isLexicalOrDerivationalCard(c);}
  function splitReferenceAuditedPastEnding(){const layout=currentPastLayout();if(!layout)return false;const cards=[...document.querySelectorAll("#explanation-output .structure-run")];if(cards.some(c=>c.dataset.semanticSplit==="true"))return false;const n=layout.reduce((s,p)=>s+p.letters,0);const candidate=cards.find(c=>isPastEndingCard(c)&&arabicUnits(c.querySelector(".structure-run__arabic")?.textContent).filter(x=>/\p{Script=Arabic}/u.test(x)).length===n);if(!candidate)return false;const units=arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent).filter(x=>/\p{Script=Arabic}/u.test(x));let off=0;candidate.replaceWith(...layout.map(p=>{const c=makeStructureCard(candidate,units.slice(off,off+p.letters).join(""),p.label);off+=p.letters;return c;}));return true;}
  function relabelAlreadySplitPastEnding(){const layout=currentPastLayout();if(!layout||layout.length<2)return false;const cards=[...document.querySelectorAll("#explanation-output .structure-run")].filter(isPastEndingCard);if(cards.length!==layout.length)return false;let changed=false;cards.forEach((c,i)=>{const l=c.querySelector(".structure-run__label");if(l&&l.textContent!==layout[i].label){l.textContent=layout[i].label;changed=true;}if(l)l.dir="ltr";c.dataset.semanticSplit="true";});return changed;}
  function relabelPresentPrefix(){const layout=currentNonpastLayout();if(!layout)return false;const c=[...document.querySelectorAll("#explanation-output .structure-run")].find(x=>/Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(x.querySelector(".structure-run__label")?.textContent||""));if(!c)return false;const l=c.querySelector(".structure-run__label");c.dataset.presentPrefix="true";if(!l||l.textContent===layout.prefix)return false;l.textContent=layout.prefix;l.dir="ltr";return true;}
  function isPresentEndingCard(c){if(c.dataset.presentPrefix==="true")return false;const l=c.querySelector(".structure-run__label")?.textContent||"",a=c.querySelector(".structure-run__arabic")?.textContent||"";if(!/\p{Script=Arabic}/u.test(a)||/Present-tense prefix|present prefix|Muḍāriʿ prefix|Particle|jussive particle|subjunctive particle|emphatic lām/i.test(l))return false;return !isLexicalOrDerivationalCard(c);}
  function applyPresentEndingLayout(){const layout=currentNonpastLayout();if(!layout?.ending)return false;const cards=[...document.querySelectorAll("#explanation-output .structure-run")].filter(isPresentEndingCard);if(!cards.length)return false;const expected=layout.ending.reduce((s,p)=>s+p.letters,0);if(cards.length===layout.ending.length&&cards.every((c,i)=>arabicUnits(c.querySelector(".structure-run__arabic")?.textContent).filter(x=>/\p{Script=Arabic}/u.test(x)).length===layout.ending[i].letters)){let changed=false;cards.forEach((c,i)=>{const l=c.querySelector(".structure-run__label");if(l&&l.textContent!==layout.ending[i].label){l.textContent=layout.ending[i].label;l.dir="ltr";changed=true;}c.dataset.semanticSplit="true";});return changed;}const candidate=cards.find(c=>arabicUnits(c.querySelector(".structure-run__arabic")?.textContent).filter(x=>/\p{Script=Arabic}/u.test(x)).length===expected);if(!candidate)return false;const units=arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent).filter(x=>/\p{Script=Arabic}/u.test(x));let off=0;candidate.replaceWith(...layout.ending.map(p=>{const c=makeStructureCard(candidate,units.slice(off,off+p.letters).join(""),p.label);off+=p.letters;return c;}));return true;}
  function relabelMoodParticle(){const maj=currentMajzumLayout(),man=currentMansubLayout();if(!maj&&!man)return false;const c=[...document.querySelectorAll("#explanation-output .structure-run")].find(x=>/Particle|jussive particle|subjunctive particle/i.test(x.querySelector(".structure-run__label")?.textContent||""));if(!c)return false;const a=c.querySelector(".structure-run__arabic")?.textContent?.trim()||"",l=c.querySelector(".structure-run__label"),text=maj?`This is the jussive particle ${a} (حرف جزم)`:`This is the subjunctive particle ${a} (حرف نصب)`;if(!l||l.textContent===text)return false;l.textContent=text;l.dir="ltr";return true;}
  function relabelHeavyParticle(){if(!currentHeavyLayout())return false;const c=[...document.querySelectorAll("#explanation-output .structure-run")].find(x=>/^(?:Particle|This is the emphatic lām)/i.test(x.querySelector(".structure-run__label")?.textContent?.trim()||""));if(!c)return false;const l=c.querySelector(".structure-run__label");if(!l||l.textContent==="This is the emphatic lām (لام التوكيد)")return false;l.textContent="This is the emphatic lām (لام التوكيد)";l.dir="ltr";return true;}
  function blockByTitle(title){return [...document.querySelectorAll("#explanation-output .explanation-block")].find(b=>(b.querySelector("h3")?.textContent||"").trim().toLowerCase()===title.toLowerCase())||null;}
  function setBlockText(block,className,text){if(!block)return false;block.querySelector(".explanation-empty")?.remove();let p=block.querySelector(`.${className}`);if(!p){p=document.createElement("p");p.className=className;p.dir="ltr";block.append(p);}if(p.textContent===text)return false;p.textContent=text;return true;}
  function applyMoodRule(){const maj=currentMajzumLayout(),man=currentMansubLayout(),layout=maj||man;if(!layout)return false;let text="";if(maj){if(layout.rule==="deleteNun")text="The verb is majzūm because of the jussive particle. As one of the Five Verbs (الأفعال الخمسة), its jussive sign is deletion of the nūn (علامة جزمه حذف النون).";else if(layout.rule==="nunNiswa")text="The Muḍāriʿ verb is connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون) and is in the syntactic position of jussive (في محل جزم).";else text="The verb is majzūm because of the jussive particle, and its jussive sign is sukūn (علامة جزمه السكون).";}else{if(layout.rule==="deleteNun")text="The verb is manṣūb because of the subjunctive particle. As one of the Five Verbs (الأفعال الخمسة), its subjunctive sign is deletion of the nūn (علامة نصبه حذف النون).";else if(layout.rule==="nunNiswa")text="The Muḍāriʿ verb is connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون) and is in the syntactic position of subjunctive (في محل نصب).";else text="The verb is manṣūb because of the subjunctive particle, and its subjunctive sign is fatḥah (علامة نصبه الفتحة).";}return setBlockText(blockByTitle("Rules"),maj?"majzum-rule":"mansub-rule",text);}
  function applyHeavyRule(){const layout=currentHeavyLayout();if(!layout)return false;let rule="The heavy-emphasis nūn (نون التوكيد الثقيلة) is attached to the Muḍāriʿ form after the emphatic lām (لام التوكيد).";let derivation="The selected Muḍāriʿ form is prepared for emphasis, then the heavy-emphasis nūn (نون التوكيد الثقيلة) is attached.";if(layout.rule==="dual"){rule="In the dual form, the dual alif (ألف الاثنين) is retained as its own grammatical component before the heavy-emphasis nūn (نون التوكيد الثقيلة).";derivation="The dual marker is retained, and the heavy-emphasis nūn is attached after it.";}else if(layout.rule==="mascPlural"){rule="With the masculine plural form, the ordinary indicative ending is reshaped before the heavy-emphasis nūn is attached; the final heavy nūn is not the indicative nūn of the Five Verbs.";derivation="The ordinary masculine-plural Muḍāriʿ ending changes for emphasis, then نون التوكيد الثقيلة is attached.";}else if(layout.rule==="femSingular"){rule="With the feminine singular addressee form, the ordinary indicative ending is reshaped before the heavy-emphasis nūn is attached; the final heavy nūn is نون التوكيد الثقيلة.";derivation="The feminine-address Muḍāriʿ ending changes for emphasis, then نون التوكيد الثقيلة is attached.";}else if(layout.rule==="nunNiswa"){rule="Nūn al-niswah (نون النسوة) remains the feminine-plural subject marker. A separating alif (الألف الفاصلة) stands between it and the heavy-emphasis nūn (نون التوكيد الثقيلة).";derivation="The feminine-plural form retains نون النسوة, then adds الألف الفاصلة before نون التوكيد الثقيلة.";}setBlockText(blockByTitle("Rules"),"heavy-rule",rule);setBlockText(blockByTitle("Derivation"),"heavy-derivation",derivation);return true;}
  function relabelHeavyExistingCards(){if(!currentHeavyLayout())return false;let changed=false;for(const c of document.querySelectorAll("#explanation-output .structure-run")){const l=c.querySelector(".structure-run__label");if(!l)continue;if(/Heavy-emphasis\s+ن|نون التوكيد الثقيلة/i.test(l.textContent)&&l.textContent!==HEAVY_NUN){l.textContent=HEAVY_NUN;l.dir="ltr";changed=true;}else if(/Feminine plural\s+ن|نون النسوة/i.test(l.textContent)&&!/^This is/i.test(l.textContent)){l.textContent=rowIndex()===11?"This is the feminine plural addressee subject marker (نون النسوة)":"This is the feminine plural subject marker (نون النسوة)";l.dir="ltr";changed=true;}else if(/Separating\s+ا|الألف الفاصلة/i.test(l.textContent)&&!/^This is/i.test(l.textContent)){l.textContent="This is the separating alif (الألف الفاصلة)";l.dir="ltr";changed=true;}}return changed;}
  function relabelStructure(){splitReferenceAuditedPastEnding();relabelAlreadySplitPastEnding();relabelPresentPrefix();relabelMoodParticle();relabelHeavyParticle();relabelHeavyExistingCards();applyPresentEndingLayout();applyMoodRule();applyHeavyRule();const bab=currentBabName();if(!bab)return;for(const c of document.querySelectorAll("#explanation-output .structure-run")){const l=c.querySelector(".structure-run__label"),a=c.querySelector(".structure-run__arabic")?.textContent?.trim();if(!l||!a)continue;const t=l.textContent.trim();if(/^Form\s+\d+\b/i.test(t)){l.textContent=`This is ${a} of ${bab}`;l.dir="ltr";}else if(!/^This is\b/i.test(t)&&NOMINAL_COMPONENT_PREFIX.test(t)){l.textContent=`This is ${t}`;l.dir="ltr";}}}
  function apply(){relabelControls();relabelStructure();}
  function initialize(){const panel=document.querySelector("#explanation-panel");if(!panel)return;apply();let applying=false;const observer=new MutationObserver(()=>{if(applying)return;applying=true;queueMicrotask(()=>{apply();applying=false;});});observer.observe(panel,{childList:true,subtree:true});document.querySelector("#bab")?.addEventListener("change",apply);for(const id of ["#explanation-section","#explanation-field","#explanation-row"])document.querySelector(id)?.addEventListener("change",()=>queueMicrotask(apply));}
  const api=Object.freeze({SECTION_LABELS,FORM_LABELS,NOMINAL_COMPONENT_PREFIX,ACTIVE_PAST_ENDINGS,PRESENT_LAYOUTS,MAJZUM_LAYOUTS,MANSUB_LAYOUTS,HEAVY_LAYOUTS,arabicUnits,bareArabic,splitReferenceAuditedPastEnding,relabelAlreadySplitPastEnding,relabelPresentPrefix,applyPresentEndingLayout,apply});
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else{globalScope.SarfExplanationLearnerLabels=api;if(typeof document!=="undefined")initialize();}
})(typeof globalThis==="undefined"?this:globalThis);
