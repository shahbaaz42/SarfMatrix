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
