/* Guidance and review prompts shared by website, standalone edition and VS Code. */
(function(root) {
  'use strict';
  const kind = n => n.kind || 'component';
  const steps = [
    {id:'purpose',title:'Start with a question',goal:'Decide who will use this model and which decision it should support.',instruction:'Use Model question to name your solution and write its purpose. Try: “How do customer requests move from a portal to an approved record, and who is accountable?”',tip:'Keep the first model small: one service, its main dependencies and one business process.',actions:[['purpose','Model question']]},
    {id:'boundary',title:'Draw the boundaries',goal:'Represent the main systems or platforms before their internal detail.',instruction:'At the overview, add a component called “Customer request service”. Add any external system it depends on as a separate top-level component. Choose a type that describes its role.',tip:'A box is a record in your model. Its name should describe something real; a product icon identifies the technology.',actions:[['root','Add a top-level component']]},
    {id:'detail',title:'Add the detail inside',goal:'Show what the main service contains.',instruction:'Select your service, choose Explore inside, then add a portal, an automation and a data store. In the component editor, Inside / parent controls containment. Use the breadcrumb to return; + on a block expands it without leaving the view.',tip:'Start with two or three levels. A layer such as Data is a classification, rather than a parent container.',actions:[['inside','Explore selected component'],['child','Add a component inside']]},
    {id:'links',title:'Connect exact endpoints',goal:'Explain what each dependency means and which direction it runs.',instruction:'Create a relationship from the portal to the data store, for example “reads / writes”. You can select a source and target at any level. Add a short label such as “Create request”. Select a grouped diagram link to inspect the original endpoints.',tip:'Containment does not create a dependency. Model the connection explicitly even when both endpoints are inside the same box.',actions:[['relationship','Add a relationship']]},
    {id:'layers',title:'Define the application layers',goal:'Classify components independently of their nesting.',instruction:'Define Presentation, Business logic, Data and Integration in Application layers. Edit each component and select its primary layer, then switch the perspective to Application layers. Additional layers are optional.',tip:'A component appears once in a layer view. Its primary layer controls placement, or its first matching layer when filtered.',actions:[['layers','Define layers'],['edit-selected','Assign selected component'],['show-layers','Open layer view']]},
    {id:'business',title:'Connect the business and people',goal:'Show which process the technology supports and who participates.',instruction:'Add “Handle a request” as a Process. Use Child to add “Submit” and “Review” steps. Add stakeholders such as Requester and Service owner. In Business mappings, link components to the steps they support and stakeholders to their RACI responsibilities.',tip:'R = Responsible, A = Accountable, C = Consulted, I = Informed. Assignments on a whole process are recorded separately from assignments on its steps.',actions:[['process','Add process'],['stakeholder','Add stakeholder'],['mappings','Map the connections']]},
    {id:'views',title:'Save views for different audiences',goal:'Use the same model to answer different questions.',instruction:'Save a solution overview. Then choose Stakeholder responsibilities or Business traceability, set Scope to a process or step, and save another view. Use View filters to control relationship types and external context.',tip:'Saved views retain focus, filters, expanded blocks, positions and zoom. Edits to a component appear in every view that references it.',actions:[['save-view','Save current view'],['show-traceability','Open traceability view'],['scope','Set process scope']]},
    {id:'review',title:'Review and share',goal:'Check the model and create a useful handover.',instruction:'Open Review model to find missing descriptions, owners, layer assignments and process mappings. Select a few focused views, set their order in Manage views, and export one Word or PowerPoint pack. Export JSON or YAML as the editable model backup.',tip:'PowerPoint uses editable shapes and connectors. Word contains scalable diagram images with editable report tables. Re-import JSON/YAML to continue modelling.',actions:[['review','Review model'],['export-json','Back up JSON'],['office','Export view pack']]}
  ];
  const glossary = [
    ['Component','A system, platform, application, service, data store or other technical building block. Any component can contain more detail.'],
    ['Containment / parent','The structure of the solution: what sits inside what. Change Inside / parent in the entity editor to move a component.'],
    ['Application layer','A responsibility such as Presentation, Business logic, Data or Integration. Membership is independent of containment.'],
    ['Relationship','A directed connection between two exact entity IDs. Its meaning comes from the relationship type and optional label.'],
    ['Perspective','A projection of the same records: solution, processes, stakeholders, layers, traceability or all entities.'],
    ['Saved view','A named perspective with scope, filters, layout and zoom. Saving a view does not duplicate model records.'],
    ['External context','A dependency outside the focused boundary, or a supporting component beside a business-process view.'],
    ['Grouped link','One visible line representing several exact relationships after endpoints are collapsed. Select it to see the underlying connections.'],
    ['Business process','An activity or set of steps that delivers a business outcome. Add nested steps and sequence links as needed.'],
    ['Stakeholder','A person, team, organisation or role involved in a process. Use participation mappings to record RACI responsibilities.'],
    ['Traceability','A view joining business processes, supporting components and participating stakeholders for a selected scope.'],
    ['Model backup','JSON or YAML contains the editable records, IDs and saved views. SVG, Word and PowerPoint are presentation outputs.']
  ];
  function progress(model) {
    const components=model.nodes.filter(n=>kind(n)==='component'), processes=model.nodes.filter(n=>kind(n)==='process'), stakeholders=model.nodes.filter(n=>kind(n)==='stakeholder');
    const semantic=new Map(model.relationshipTypes.map(t=>[t.id,t.semantic]));
    return [!!model.description?.trim(),components.some(n=>n.parentId===null),components.some(n=>n.parentId!==null),model.edges.some(e=>!semantic.get(e.typeId)),!!model.layers?.length&&components.some(n=>n.layerIds?.length),processes.length>0&&stakeholders.length>0&&model.edges.some(e=>semantic.get(e.typeId)==='supports')&&model.edges.some(e=>semantic.get(e.typeId)==='participation'),new Set((model.namedViews||[]).map(v=>v.perspective||'solution')).size>=2,model.nodes.length>0&&(model.namedViews||[]).length>0];
  }
  function review(model) {
    const issues=[], types=new Map(model.relationshipTypes.map(t=>[t.id,t])), components=model.nodes.filter(n=>kind(n)==='component');
    const add=(code,title,detail,nodeId=null)=>issues.push({code,title,detail,nodeId});
    if (!model.description?.trim()) add('purpose','State the model question','Name the decision, audience and boundaries this model should support.');
    for(const n of model.nodes) {
      if(!n.description?.trim()) add('description','Add a description',n.name,n.id);
      if(kind(n)==='component'&&!Object.entries(n.properties||{}).some(([k,v])=>['owner','service owner','technical owner'].includes(k.toLowerCase())&&v.trim())) add('owner','Record a component owner',n.name,n.id);
      if(kind(n)==='component'&&model.layers?.length&&!n.layerIds?.length) add('layer','Assign an application layer',n.name,n.id);
      if(kind(n)==='process'&&!model.nodes.some(child=>child.parentId===n.id&&kind(child)==='process')) {
        if(!model.edges.some(e=>e.target===n.id&&types.get(e.typeId)?.semantic==='supports')) add('support','Check technology support for this step',n.name,n.id);
        if(!model.edges.some(e=>e.target===n.id&&types.get(e.typeId)?.semantic==='participation'&&e.role==='A')) add('accountable','Check accountability for this step',n.name,n.id);
      }
      if(!model.edges.some(e=>e.source===n.id||e.target===n.id)&&!model.nodes.some(c=>c.parentId===n.id)) add('isolated','Check this unconnected entity',n.name,n.id);
    }
    const groups=new Map();
    for(const n of model.nodes) { const key=JSON.stringify([n.parentId,kind(n),n.name.trim().toLowerCase()]);if(groups.has(key)) add('duplicate','Disambiguate sibling names',n.name,n.id);else groups.set(key,n.id); }
    return {issues,counts:{entities:model.nodes.length,components:components.length,relationships:model.edges.length,views:(model.namedViews||[]).length},summary:'Review prompts highlight missing context and mappings. Decide which are relevant to the scope of your model.'};
  }
  function example(M,D) {
    const m=M.empty('Customer request service — first model');m.description='Explain how a request reaches an approved record, which systems support the process, and who is accountable.';
    const language=D.ensureLanguage(M,m);
    m.layers=[['presentation','Presentation','User-facing screens and channels.','#059669'],['logic','Business logic','Rules and orchestration.','#b45309'],['data','Data','Business records and documents.','#0284c7'],['integration','Integration','APIs and external connections.','#9333ea']].map(([id,name,description,color])=>({id,name,description,color}));
    const node=(id,name,typeId,parentId,description,iconId='',layerIds=[])=>({id,name,typeId,parentId,description,iconId,layerIds,properties:{Owner:'Service team'}});
    m.nodes=[node('service','Customer request service','system',null,'The boundary for the service being designed.','generic-cloud'),node('portal','Request portal','component','service','Collects requests from customers.','power-pages',['presentation']),node('triage','Triage automation','component','service','Validates requests and starts review.','power-automate',['logic']),node('records','Request records','data','service','Stores request status and outcomes.','dataverse',['data']),node('api','Document API','component',null,'Creates documents for the request service.','azure-functions',['integration']),node('archive','Document storage','data',null,'Stores generated documents.','aws-s3',['data'])];
    for(const [id,name,parentId] of [['handling','Handle a request',null],['submit','Submit request','handling'],['review','Review request','handling']]) m.nodes.push({...node(id,name,language.processType,parentId,'A step in the request handling process.'),kind:'process'});
    for(const [id,name] of [['requester','Requester'],['owner','Service owner']]) m.nodes.push({...node(id,name,language.stakeholderType,null,'A business role involved in request handling.'),kind:'stakeholder'});
    const edge=(id,source,target,typeId,label='',role='')=>({id,source,target,typeId,label,role,description:''});
    m.edges=[edge('portal-records','portal','records','depends','Create and read requests'),edge('portal-triage','portal','triage','depends','Start triage'),edge('triage-api','triage','api','depends','Generate document'),edge('api-archive','api','archive','depends','Store document'),edge('sequence','submit','review',language.sequence),edge('support-submit','portal','submit',language.supports),edge('support-review','triage','review',language.supports),edge('support-records','records','review',language.supports),edge('requester-role','requester','submit',language.participation,'','R'),edge('owner-submit','owner','submit',language.participation,'','A'),edge('owner-review','owner','review',language.participation,'','A')];
    m.namedViews=[['overview','Solution overview','solution',null,[],null],['inside','Inside the service','solution','service',[],null],['process','Request process','process',null,['handling'],null],['people','Stakeholder responsibilities','stakeholder',null,['handling'],null],['layers','Application layers','layers',null,[],null],['trace','Review step traceability','traceability',null,[],'review']].map(([id,name,perspective,focus,expanded,processId])=>({id,name,description:'Worked first-model example.',perspective,focus,expanded,processId,layerIds:null,relationshipTypeIds:null,showExternal:true,positions:{}}));
    return M.validate(m);
  }
  const api={steps,glossary,progress,review,example};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;else root.ModellerGuidance=api;
})(globalThis);
