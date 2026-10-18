(function (root) {
  'use strict';
  const types = [
    { id: 'platform', name: 'Platform', color: '#059669', shape: 'rounded', fields: ['Owner', 'Lifecycle'] },
    { id: 'app', name: 'Application', color: '#7c3aed', shape: 'rounded', fields: ['Owner', 'Technology'] },
    { id: 'automation', name: 'Automation', color: '#d97706', shape: 'square', fields: ['Trigger', 'Owner'] },
    { id: 'data', name: 'Data store', color: '#0284c7', shape: 'database', fields: ['Classification', 'Retention'] },
    { id: 'service', name: 'Service', color: '#4f46e5', shape: 'rounded', fields: ['Owner', 'SLA'] }
  ];
  const relationshipTypes = [
    { id: 'depends', name: 'depends on', color: '#059669', style: 'solid', sourceTypes: [], targetTypes: [] },
    { id: 'calls', name: 'calls', color: '#7c3aed', style: 'solid', sourceTypes: [], targetTypes: [] },
    { id: 'reads', name: 'reads / writes', color: '#0284c7', style: 'solid', sourceTypes: [], targetTypes: [] },
    { id: 'auth', name: 'authenticates with', color: '#64748b', style: 'dashed', sourceTypes: [], targetTypes: [] }
  ];
  const n = (id, name, typeId, parentId = null, description = '', properties = {}) => ({ id, name, typeId, parentId, description, properties });
  const e = (id, source, target, typeId = 'depends', label = '') => ({ id, source, target, typeId, label, description: '' });
  const example = { schemaVersion: 1, name: 'Connected service platform', types, relationshipTypes, views: {}, nodes: [
    n('pp', 'Power Platform', 'platform', null, 'A platform boundary containing applications, data and automation. Open it to explore the model.', { Owner: 'Digital services', Lifecycle: 'Live' }),
    n('azure', 'Azure', 'platform', null, 'Integration services and document storage.', { Owner: 'Cloud team', Lifecycle: 'Live' }),
    n('m365', 'Microsoft 365', 'platform', null, 'Collaboration, documents and notifications.'),
    n('identity', 'Identity & access', 'service', null, 'Shared identity services used across the solution.'),
    n('apps', 'Power Apps', 'app', 'pp', 'The application layer of the platform.'),
    n('dv', 'Dataverse', 'data', 'pp', 'Shared business data with security and business rules.'),
    n('flows', 'Power Automate', 'automation', 'pp', 'Orchestration and approval flows.'),
    n('copilot', 'Copilot Studio', 'app', 'pp', 'A conversational entry point into the service.'),
    n('caseapp', 'Case management app', 'app', 'apps', 'A model-driven application for caseworkers.', { Owner: 'Service operations', Technology: 'Model-driven Power App' }),
    n('portal', 'Customer portal', 'app', 'apps', 'External access to service requests.', { Technology: 'Power Pages' }),
    n('accounts', 'Account table', 'data', 'dv', 'Customer and organisation records.', { Classification: 'Official', Retention: '7 years' }),
    n('cases', 'Case table', 'data', 'dv', 'Case records used by the app and approval flow.'),
    n('approvals', 'Approval flow', 'automation', 'flows', 'Routes cases for review.', { Trigger: 'Case submitted' }),
    n('notify', 'Notification flow', 'automation', 'flows', 'Sends status updates.'),
    n('function', 'Document Function', 'service', 'azure', 'Creates case documents through a secured API.'),
    n('blob', 'Blob storage', 'data', 'azure', 'Generated case documents.'),
    n('teams', 'Teams', 'app', 'm365', 'Approval notifications and conversations.'),
    n('sharepoint', 'SharePoint', 'data', 'm365', 'Team-facing document library.'),
    n('entra', 'Entra ID', 'service', 'identity', 'Staff identity provider.')
  ], edges: [
    e('e1', 'caseapp', 'cases', 'reads'), e('e2', 'portal', 'accounts', 'reads'),
    e('e3', 'approvals', 'cases', 'reads'), e('e4', 'approvals', 'function', 'calls', 'Generate approval pack'),
    e('e5', 'function', 'blob', 'reads'), e('e6', 'notify', 'teams', 'calls', 'Post case update'),
    e('e7', 'function', 'sharepoint', 'reads', 'Publish document'), e('e8', 'caseapp', 'entra', 'auth'),
    e('e9', 'portal', 'entra', 'auth'), e('e10', 'function', 'entra', 'auth'),
    e('e11', 'copilot', 'cases', 'reads'), e('e12', 'cases', 'function', 'depends', 'Document reference'),
    e('e13', 'pp', 'entra', 'auth', 'Platform sign-in'), e('e14', 'approvals', 'notify', 'calls')
  ] };
  const product = { schemaVersion: 1, name: 'Online shop', types, relationshipTypes, views: {}, nodes: [
    n('shop', 'Shopfront', 'platform'), n('backoffice', 'Business operations', 'platform'), n('providers', 'External services', 'platform'),
    n('web', 'Store website', 'app', 'shop'), n('checkout', 'Checkout', 'app', 'shop'), n('catalog', 'Product catalogue', 'data', 'shop'),
    n('orders', 'Order service', 'service', 'backoffice'), n('warehouse', 'Warehouse', 'service', 'backoffice'), n('inventory', 'Stock database', 'data', 'backoffice'),
    n('stripe', 'Payment provider', 'service', 'providers'), n('delivery', 'Delivery provider', 'service', 'providers'),
    n('packing', 'Packing workflow', 'automation', 'warehouse'), n('dispatch', 'Dispatch workflow', 'automation', 'warehouse')
  ], edges: [e('s1', 'web', 'catalog', 'reads'), e('s2', 'checkout', 'stripe', 'calls'), e('s3', 'checkout', 'orders', 'calls'), e('s4', 'orders', 'inventory', 'reads'), e('s5', 'orders', 'packing', 'calls'), e('s6', 'dispatch', 'delivery', 'calls'), e('s7', 'packing', 'dispatch', 'calls')] };
  for (const [id, iconId] of Object.entries({ apps: 'power-apps', flows: 'power-automate', dv: 'dataverse', portal: 'power-pages' })) example.nodes.find(n => n.id === id).iconId = iconId;
  for (const [id,iconId] of Object.entries({copilot:'copilot-studio',function:'azure-functions',blob:'azure-storage'})) example.nodes.find(n=>n.id===id).iconId=iconId;
  const view = (id, name, focus, expanded = [], description = '') => ({ id, name, description, focus, expanded, positions: {}, showExternal: true, relationshipTypeIds: null });
  example.namedViews = [view('overview', 'Architecture overview', null, [], 'The platforms and their cross-boundary dependencies.'), view('power-platform', 'Power Platform', 'pp', [], 'Applications, data and automation with external context.'), view('business-data', 'Dataverse detail', 'dv', [], 'Business tables and their exact cross-level connections.'), view('integrations', 'Azure integration', 'azure', [], 'Document generation, storage and connected platforms.')];
  product.namedViews = [view('shop-overview', 'Shop overview', null), view('operations', 'Business operations', 'backoffice', ['warehouse'])];
  const M = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.Modeller;
  const D = typeof module !== 'undefined' && module.exports ? require('./dimensions.js') : root.ModellerDimensions;
  const business = M.copy(example), language = D.ensureLanguage(M, business);
  business.name = 'Case management — business and solution architecture';
  business.layers = [
    { id:'presentation', name:'Presentation', description:'User interfaces and channels used by people.', color:'#059669' },
    { id:'business-logic', name:'Business logic', description:'Business rules, decisions and workflow orchestration.', color:'#b45309' },
    { id:'data-layer', name:'Data', description:'Persistent business records and documents.', color:'#0284c7' },
    { id:'integration', name:'Integration', description:'APIs and messaging between applications.', color:'#9333ea' },
    { id:'foundation', name:'Platform and identity', description:'Hosting, shared platforms and identity services.', color:'#64748b' }
  ];
  for (const node of business.nodes) node.layerIds = [(['apps','caseapp','portal','copilot','teams'].includes(node.id) ? 'presentation' : ['flows','approvals','notify'].includes(node.id) ? 'business-logic' : ['dv','cases','accounts','blob','sharepoint'].includes(node.id) ? 'data-layer' : node.id === 'function' ? 'integration' : 'foundation')];
  business.nodes.find(n => n.id === 'function').layerIds.push('business-logic');
  const entity = (id,name,kind,parentId=null) => ({ id,name,kind,parentId,typeId:kind === 'process' ? language.processType : language.stakeholderType,description:'',properties:{} });
  business.nodes.push(entity('case-process','Case handling','process'), entity('submit-step','Submit case','process','case-process'), entity('review-step','Review and approve','process','case-process'), entity('notify-step','Notify applicant','process','case-process'), entity('applicant','Applicant','stakeholder'),entity('caseworker','Caseworker','stakeholder'),entity('service-owner','Service owner','stakeholder'));
  const mapping = (source,target,semantic,role='') => ({ id:M.id('business'),source,target,typeId:language[semantic],role,label:'',description:'' });
  business.edges.push(mapping('submit-step','review-step','sequence'), mapping('review-step','notify-step','sequence'),mapping('portal','submit-step','supports'),mapping('caseapp','review-step','supports'),mapping('approvals','review-step','supports'),mapping('notify','notify-step','supports'),mapping('cases','review-step','supports'),mapping('applicant','submit-step','participation','R'),mapping('caseworker','review-step','participation','R'),mapping('service-owner','review-step','participation','A'),mapping('applicant','notify-step','participation','I'));
  for (const [perspective,name,processId] of [['process','Case handling process',null],['stakeholder','Stakeholder responsibilities',null],['layers','Application layers',null],['traceability','Review step traceability','review-step']]) business.namedViews.push({ ...view('business-'+perspective,name,null,perspective === 'process' || perspective === 'stakeholder' ? ['case-process'] : []),perspective,processId,layerIds:null });
  const api = { platform: example, shop: product, business };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ModellerExamples = api;
})(globalThis);
