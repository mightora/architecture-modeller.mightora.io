"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .generated/platform.cjs
var require_platform = __commonJS({
  ".generated/platform.cjs"(exports, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      LocalModelLibrary: () => LocalModelLibrary,
      MAX_BYTES: () => MAX_BYTES2,
      SCHEMA_VERSION: () => SCHEMA_VERSION,
      align: () => align,
      canonical: () => canonical3,
      compareModels: () => compareModels2,
      decisionMarkdown: () => decisionMarkdown,
      duplicate: () => duplicate,
      exportPresets: () => exportPresets,
      guard: () => guard2,
      impact: () => impact2,
      insertPattern: () => insertPattern,
      invariant: () => invariant,
      migrate: () => migrate,
      orthogonal: () => orthogonal,
      pattern: () => pattern,
      patternNames: () => patternNames,
      perspectives: () => perspectives,
      property: () => property2,
      reportSections: () => reportSections,
      rules: () => rules2,
      safeId: () => safeId,
      safeLink: () => safeLink2,
      snap: () => snap,
      template: () => template,
      templateNames: () => templateNames,
      text: () => text,
      uid: () => uid2,
      validateArchitecture: () => validateArchitecture2,
      validateExtensions: () => validateExtensions
    });
    module2.exports = __toCommonJS2(index_exports);
    var SCHEMA_VERSION = 2;
    var MAX_BYTES2 = 5 * 1024 * 1024;
    var perspectives = ["solution", "application", "data", "infrastructure", "security", "process", "stakeholder", "integration", "deployment", "custom", "layers", "traceability", "all"];
    var reserved = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
    function invariant(value, message) {
      if (!value) throw new Error(message);
    }
    function safeId(value) {
      return typeof value === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(value) && !reserved.has(value);
    }
    function text(value, max = 4e3) {
      invariant(typeof value === "string" && value.length <= max, `Expected text of at most ${max} characters.`);
    }
    function guard2(input) {
      const stack = /* @__PURE__ */ new Set();
      let count = 0;
      const visit = (value, depth) => {
        invariant(++count < 5e5 && depth < 110, "Model is too complex or deeply nested.");
        if (!value || typeof value !== "object") return;
        invariant(!stack.has(value), "Cyclic data is not supported.");
        stack.add(value);
        for (const [key, child] of Object.entries(value)) {
          invariant(!reserved.has(key), "Reserved model property name.");
          visit(child, depth + 1);
        }
        stack.delete(value);
      };
      visit(input, 0);
      invariant(new TextEncoder().encode(JSON.stringify(input)).length <= MAX_BYTES2, "Import a model smaller than 5 MB.");
    }
    function migrate(input) {
      guard2(input);
      invariant(input && typeof input === "object" && !Array.isArray(input), "Expected an architecture model.");
      const version = input.schemaVersion;
      invariant(version === 1 || version === 2, "Unsupported schema version. Supported versions: 1 and 2.");
      const model = JSON.parse(JSON.stringify(input));
      model.schemaVersion = SCHEMA_VERSION;
      return model;
    }
    function safeLink2(target) {
      if (target.length > 2e3 || /[\u0000-\u0020\\]/.test(target)) return false;
      if (/^https?:\/\//i.test(target)) {
        try {
          const u = new URL(target);
          return !!u.hostname && !u.username && !u.password;
        } catch {
          return false;
        }
      }
      return !/[:?#%]/.test(target) && !target.startsWith("/") && target.split("/").every((p) => !!p && p !== "." && p !== "..");
    }
    function validateExtensions(model) {
      if (model.id !== void 0) invariant(safeId(model.id), "Invalid model ID.");
      const ids = new Set(model.nodes.map((n) => n.id)), typeIds = new Set(model.types.map((t) => t.id));
      const records = (record, limit = 80) => {
        if (record === void 0) return;
        invariant(record && typeof record === "object" && !Array.isArray(record) && Object.keys(record).length <= limit, "Invalid documentation record.");
        for (const [key, value] of Object.entries(record)) {
          text(key, 80);
          text(value, 12e3);
        }
      };
      records(model.documentation);
      records(model.metadata, 20);
      invariant(!model.decisions || Array.isArray(model.decisions) && model.decisions.length <= 500, "Use up to 500 decisions.");
      const decisionIds = /* @__PURE__ */ new Set();
      for (const d of model.decisions || []) {
        invariant(safeId(d.id) && !decisionIds.has(d.id), "ADR IDs must be safe and unique.");
        decisionIds.add(d.id);
        for (const key of ["title", "context", "decision", "alternatives", "consequences"]) text(d[key], key === "title" ? 160 : 12e3);
        invariant(d.title.trim() && ["proposed", "accepted", "deprecated", "superseded"].includes(d.status) && /^\d{4}-\d{2}-\d{2}$/.test(d.date), "ADR needs a title, valid status and ISO date.");
        invariant(Array.isArray(d.componentIds) && d.componentIds.length <= 3e3 && d.componentIds.every((id) => ids.has(id)), "ADR references an unknown component.");
      }
      for (const n of model.nodes) {
        records(n.documentation);
        if (n.decisionIds) invariant(Array.isArray(n.decisionIds) && n.decisionIds.every((id) => decisionIds.has(id)), "Component references an unknown ADR.");
        if (n.viewpoints) invariant(Array.isArray(n.viewpoints) && n.viewpoints.every((p) => perspectives.includes(p)), "Unknown component viewpoint.");
        if (n.activityType) invariant(["activity", "decision", "start", "end"].includes(n.activityType), "Unknown process activity type.");
        if (n.swimlane !== void 0) text(n.swimlane, 100);
        if (n.sourceLinks) {
          invariant(Array.isArray(n.sourceLinks) && n.sourceLinks.length <= 40, "Use at most 40 source links.");
          for (const link of n.sourceLinks) {
            text(link.label, 160);
            invariant(typeof link.target === "string" && safeLink2(link.target), "Use a safe HTTP(S) link or workspace-relative file path.");
            invariant(["repository", "file", "api", "infrastructure", "pipeline", "documentation", "adr"].includes(link.kind), "Unknown source link category.");
            if (link.line !== void 0) invariant(Number.isInteger(link.line) && link.line > 0 && link.line < 1e6, "Invalid source line.");
          }
        }
      }
      for (const e of model.edges) records(e.documentation);
      for (const v of model.namedViews || []) {
        for (const field of ["includedIds", "hiddenIds"]) if (v[field] != null) invariant(Array.isArray(v[field]) && v[field].every((id) => ids.has(id)), "View references a deleted component.");
        if (v.typeIds != null) invariant(Array.isArray(v.typeIds) && v.typeIds.every((id) => typeIds.has(id)), "View references an unknown component type.");
        if (v.routing) invariant(["curved", "orthogonal", "straight"].includes(v.routing), "Unknown connector routing.");
        if (v.swimlanes !== void 0) invariant(typeof v.swimlanes === "boolean", "Invalid swimlane option.");
        if (v.routes) for (const [id, points] of Object.entries(v.routes)) invariant(model.edges.some((e) => e.id === id) && Array.isArray(points) && points.length <= 20 && points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) < 1e5 && Math.abs(p.y) < 1e5), "Invalid manual connector route.");
      }
      if (model.policy) {
        invariant(typeof model.policy === "object" && !Array.isArray(model.policy), "Invalid governance policy.");
        for (const [key, c] of Object.entries(model.policy.rules || {})) {
          invariant(safeId(key) && c && typeof c === "object", "Invalid rule configuration.");
          if (c.enabled !== void 0) invariant(typeof c.enabled === "boolean", "Invalid rule switch.");
          if (c.severity) invariant(["error", "warning", "information"].includes(c.severity), "Invalid rule severity.");
        }
        if (model.policy.approvedTechnologies) {
          invariant(Array.isArray(model.policy.approvedTechnologies) && model.policy.approvedTechnologies.length <= 1e3, "Invalid technology catalogue.");
          model.policy.approvedTechnologies.forEach((t) => text(t, 160));
        }
        if (model.policy.prohibitedDependencies) invariant(Array.isArray(model.policy.prohibitedDependencies) && model.policy.prohibitedDependencies.length <= 100 && model.policy.prohibitedDependencies.every((p) => typeIds.has(p.sourceType) && typeIds.has(p.targetType)), "Prohibited dependency references an unknown type.");
        if (model.policy.breaking) for (const value of Object.values(model.policy.breaking)) invariant(typeof value === "boolean", "Invalid breaking change policy.");
      }
    }
    function canonical3(model) {
      const sorted = (value) => Array.isArray(value) ? value.map(sorted) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sorted(v)])) : value;
      const copy = JSON.parse(JSON.stringify(model));
      for (const key of ["nodes", "edges", "types", "relationshipTypes", "decisions"]) copy[key]?.sort((a, b) => a.id.localeCompare(b.id));
      return JSON.stringify(sorted(copy), null, 2) + "\n";
    }
    var rules2 = [
      ["owner", "Application ownership", "warning", "Document the business owner."],
      ["criticality", "Criticality", "warning", "Set Criticality for important systems."],
      ["classification", "Data classification", "warning", "Document Classification for data and sensitive components."],
      ["authentication", "External integration authentication", "error", "Record Authentication on the integration."],
      ["support", "Production support", "warning", "Record Support owner for production components."],
      ["decision", "Architecture decisions", "information", "Link an ADR to critical components."],
      ["process-support", "Business process support", "warning", "Map at least one supporting component to this process."],
      ["references", "Entity references", "error", "Repair or remove the invalid reference."],
      ["dependency-policy", "Prohibited dependencies", "error", "Review the prohibited dependency or update the policy."],
      ["technology", "Approved technology", "warning", "Use an approved technology or agree a policy exception."]
    ];
    function property2(n, field) {
      const pair = Object.entries({ ...n.properties, ...n.documentation }).find(([key]) => key.toLowerCase() === field.toLowerCase());
      return pair?.[1]?.trim() || "";
    }
    function validateArchitecture2(model) {
      const results = [], nodes = new Map(model.nodes.map((n) => [n.id, n])), types = new Map(model.types.map((t) => [t.id, t])), rels = new Map(model.relationshipTypes.map((t) => [t.id, t]));
      const add = (rule, entityId, message) => {
        const def = rules2.find((r) => r[0] === rule);
        if (!def || model.policy?.rules?.[rule]?.enabled === false) return;
        results.push({ rule, entityId, message, severity: model.policy?.rules?.[rule]?.severity || def[2], remediation: def[3] });
      };
      const supported = new Set(model.edges.filter((e) => rels.get(e.typeId)?.semantic === "supports").map((e) => e.target));
      const seen = /* @__PURE__ */ new Set();
      for (const n of model.nodes) {
        if (seen.has(n.id)) add("references", n.id, "Duplicate component ID.");
        seen.add(n.id);
        const type = types.get(n.typeId), criticality = property2(n, "Criticality"), important = /critical|high|tier.?1/i.test(criticality), cls = property2(n, "Classification");
        if (!type || n.parentId && !nodes.has(n.parentId)) add("references", n.id, "Unknown type or deleted parent.");
        if ((n.kind || "component") === "component") {
          if (!property2(n, "Owner") && /application|app|system|platform/i.test((type?.name || "") + " " + n.typeId)) add("owner", n.id, `${n.name} has no documented owner.`);
          if (!criticality && /system|platform/i.test(type?.name || "")) add("criticality", n.id, `${n.name} has no criticality rating.`);
          if (!cls && (/data|database|store/i.test(type?.name || "") || /sensitive|personal|secret/i.test(property2(n, "Data")))) add("classification", n.id, `${n.name} has no data classification.`);
          if (/prod/i.test(property2(n, "Environment")) && !property2(n, "Support owner")) add("support", n.id, `${n.name} has no production support owner.`);
          if (important && !(n.decisionIds?.length || model.decisions?.some((d) => d.componentIds.includes(n.id)))) add("decision", n.id, `${n.name} has no linked architecture decision.`);
          const tech = property2(n, "Technology");
          if (tech && model.policy?.approvedTechnologies?.length && !model.policy.approvedTechnologies.some((t) => t.toLowerCase() === tech.toLowerCase())) add("technology", n.id, `${tech} is outside the approved technology catalogue.`);
        }
        if (n.kind === "process" && (important || !criticality) && !supported.has(n.id)) add("process-support", n.id, `${n.name} has no explicitly supporting system.`);
        for (const id of n.decisionIds || []) if (!model.decisions?.some((d) => d.id === id)) add("references", n.id, "Unknown linked ADR.");
      }
      const edgeIds = /* @__PURE__ */ new Set();
      for (const e of model.edges) {
        if (edgeIds.has(e.id) || !nodes.has(e.source) || !nodes.has(e.target) || !rels.has(e.typeId)) add("references", e.id, "Duplicate integration ID, missing endpoint or relationship type.");
        edgeIds.add(e.id);
        const source = nodes.get(e.source), target = nodes.get(e.target);
        if (!source || !target) continue;
        const props = { ...source.properties, ...source.documentation, ...target.properties, ...target.documentation, ...e.documentation };
        const external = /external/i.test(property2(source, "Boundary") + " " + property2(target, "Boundary")) || Object.entries(e.documentation || {}).some(([k, v]) => k.toLowerCase() === "external" && /true|yes/i.test(v));
        if (external && !Object.entries(props).some(([k, v]) => k.toLowerCase() === "authentication" && v.trim())) add("authentication", e.id, `${source.name} to ${target.name} crosses an external boundary without authentication.`);
        if (model.policy?.prohibitedDependencies?.some((p) => source.typeId === p.sourceType && target.typeId === p.targetType)) add("dependency-policy", e.id, `${source.name} to ${target.name} violates the configured dependency policy.`);
      }
      return results;
    }
    function uid2(prefix = "n") {
      return prefix + "_" + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + "_" + Math.random().toString(36).slice(2));
    }
    function impact2(model, componentId) {
      const adjacency = /* @__PURE__ */ new Map();
      for (const e of model.edges) {
        for (const [a, b] of [[e.source, e.target], [e.target, e.source]]) {
          if (!adjacency.has(a)) adjacency.set(a, /* @__PURE__ */ new Set());
          adjacency.get(a).add(b);
        }
      }
      const reached = /* @__PURE__ */ new Set([componentId]), queue = [componentId];
      for (let i = 0; i < queue.length; i++) for (const next of adjacency.get(queue[i]) || []) if (!reached.has(next)) {
        reached.add(next);
        queue.push(next);
      }
      const group = (kind) => model.nodes.filter((n) => reached.has(n.id) && (n.kind || "component") === kind).map((n) => n.id);
      return { components: group("component"), processes: group("process"), stakeholders: group("stakeholder") };
    }
    var serial2 = (v) => JSON.stringify(v, (_k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x);
    function compareModels2(before, after) {
      const changes = [], affected = /* @__PURE__ */ new Set();
      const scan = (collection, a, b) => {
        const prev = new Map(a.map((x) => [x.id, x])), next = new Map(b.map((x) => [x.id, x]));
        for (const id of /* @__PURE__ */ new Set([...prev.keys(), ...next.keys()])) {
          const old = prev.get(id), now = next.get(id);
          if (serial2(old) === serial2(now)) continue;
          const fields = Object.keys({ ...old, ...now }).filter((k) => serial2(old?.[k]) !== serial2(now?.[k]));
          const policy = after.policy?.breaking;
          changes.push({ collection, id, name: String(now?.name || old?.name || now?.title || old?.title || id), kind: !old ? "added" : !now ? "removed" : "modified", fields, breaking: !now && !!policy?.removals || collection === "components" && !!old && !!now && (!!policy?.technologyChanges && property2(old, "Technology") !== property2(now, "Technology") || !!policy?.classificationChanges && property2(old, "Classification") !== property2(now, "Classification")) });
          if (collection === "components") affected.add(id);
          if (collection === "relationships") for (const item of [old, now]) {
            if (item?.source) affected.add(String(item.source));
            if (item?.target) affected.add(String(item.target));
          }
        }
      };
      scan("components", before.nodes, after.nodes);
      scan("relationships", before.edges, after.edges);
      scan("decisions", before.decisions || [], after.decisions || []);
      scan("componentTypes", before.types, after.types);
      scan("relationshipTypes", before.relationshipTypes, after.relationshipTypes);
      scan("layers", before.layers || [], after.layers || []);
      const semanticView = (m) => (m.namedViews || []).map(({ positions: _p, camera: _c, routes: _r, expanded: _x, routing: _rt, swimlanes: _sw, ...v }) => ({ ...v, id: v.id }));
      scan("views", semanticView(before), semanticView(after));
      const { views: _bv, namedViews: _bn, nodes: _bno, edges: _be, types: _bt, relationshipTypes: _br, decisions: _bd, layers: _bl, schemaVersion: _bs, ...bMeta } = before;
      const { views: _av, namedViews: _an, nodes: _ano, edges: _ae, types: _at, relationshipTypes: _ar, decisions: _ad, layers: _al, schemaVersion: _as, ...aMeta } = after;
      if (serial2(bMeta) !== serial2(aMeta)) changes.push({ collection: "model", id: after.id || "model", name: after.name, kind: "modified", fields: Object.keys({ ...bMeta, ...aMeta }).filter((k) => serial2(bMeta[k]) !== serial2(aMeta[k])), breaking: false });
      const processes = /* @__PURE__ */ new Set(), stakeholders = /* @__PURE__ */ new Set();
      for (const id of affected) for (const model of [before, after]) {
        const result = impact2(model, id);
        result.processes.forEach((p) => processes.add(p));
        result.stakeholders.forEach((s) => stakeholders.add(s));
      }
      return { changes, layoutOnly: changes.length === 0 && canonical3(before) !== canonical3(after), affectedProcesses: [...processes], affectedStakeholders: [...stakeholders] };
    }
    function decisionMarkdown(d) {
      return `# ${d.id} ${d.title}

Status: ${d.status}

Date: ${d.date}

## Context

${d.context}

## Decision

${d.decision}

## Alternatives

${d.alternatives}

## Consequences

${d.consequences}

## Related components

${d.componentIds.map((id) => "- " + id).join("\n")}
`;
    }
    function duplicate(model, selected, parentId, makeId = uid2) {
      const next = JSON.parse(JSON.stringify(model)), ids = new Set(selected);
      let added = true;
      while (added) {
        added = false;
        for (const n of model.nodes) if (n.parentId && ids.has(n.parentId) && !ids.has(n.id)) {
          ids.add(n.id);
          added = true;
        }
      }
      const mapping = new Map([...ids].map((id) => [id, makeId("n")]));
      for (const n of model.nodes.filter((n2) => ids.has(n2.id))) next.nodes.push({ ...JSON.parse(JSON.stringify(n)), id: mapping.get(n.id), name: n.name + " copy", parentId: n.parentId && mapping.has(n.parentId) ? mapping.get(n.parentId) : parentId });
      for (const e of model.edges.filter((e2) => ids.has(e2.source) && ids.has(e2.target))) next.edges.push({ ...e, id: makeId("e"), source: mapping.get(e.source), target: mapping.get(e.target) });
      return next;
    }
    var templateNames = {
      web: "Simple web application",
      threeTier: "Three-tier application",
      powerPlatform: "Power Platform solution",
      azure: "Azure-integrated business application",
      events: "Event-driven architecture",
      microservices: "Microservices architecture",
      hybrid: "Hybrid-cloud integration",
      transformation: "Business-process transformation",
      landscape: "Enterprise application landscape"
    };
    var products = {
      web: ["Web application", "API service", "Customer database"],
      threeTier: ["Presentation tier", "Application tier", "Data tier"],
      powerPlatform: ["Power Apps", "Power Automate", "Dataverse", "Microsoft Entra ID"],
      azure: ["Power Pages", "Azure API Management", "Azure Functions", "Azure SQL", "Microsoft Entra ID"],
      events: ["Order API", "Message broker", "Fulfilment worker", "Event store"],
      microservices: ["API gateway", "Orders service", "Inventory service", "Orders database", "Inventory database"],
      hybrid: ["On-premises application", "Integration gateway", "Cloud API", "Cloud database"],
      transformation: ["Customer portal", "Case management", "Document store", "Automation service"],
      landscape: ["Customer relationship management", "Finance system", "Human resources", "Reporting platform"]
    };
    function template(key) {
      const types = [{ id: "app", name: "Application", color: "#059669", shape: "rounded", fields: ["Owner", "Technology", "Criticality"] }, { id: "service", name: "Service", color: "#6366f1", shape: "rounded", fields: ["Owner", "Technology"] }, { id: "data", name: "Data store", color: "#0284c7", shape: "database", fields: ["Classification"] }, { id: "business-process", name: "Business process", color: "#b45309", shape: "rounded", fields: ["Owner", "Criticality"] }, { id: "business-stakeholder", name: "Stakeholder", color: "#9333ea", shape: "rounded", fields: ["Organisation", "Role"] }];
      const nodes = products[key].map((name, i) => ({ id: "c" + i, name, typeId: /database|store|sql|dataverse|data tier/i.test(name) ? "data" : i ? "service" : "app", parentId: null, kind: "component", description: `${name} in the ${templateNames[key].toLowerCase()} example. Review and replace this illustrative design.`, properties: { Owner: "Example delivery team", Technology: name, Criticality: "Medium" }, viewpoints: /database|store|sql|dataverse|data tier/i.test(name) ? ["data", "application"] : ["application", "integration"], documentation: { Purpose: "Illustrative component; adapt to your solution.", Environment: "Production", "Support owner": "Example operations team", Classification: /database|store|sql|dataverse/i.test(name) ? "Internal" : "Public" } }));
      nodes.push({ id: "process", name: "Deliver customer service", typeId: "business-process", parentId: null, kind: "process", description: "An example end-to-end business process.", properties: { Owner: "Service owner", Criticality: "High" }, documentation: { Inputs: "Customer request", Outputs: "Completed service", Capability: "Customer service", Risks: "Unclear hand-offs" }, swimlane: "Service team" });
      nodes.push({ id: "step", name: "Review request", typeId: "business-process", parentId: "process", kind: "process", description: "Review and decide whether to proceed.", properties: { Owner: "Service team" }, activityType: "decision", swimlane: "Service team" });
      nodes.push({ id: "owner", name: "Service owner", typeId: "business-stakeholder", parentId: null, kind: "stakeholder", properties: { Organisation: "Example organisation", Role: "Accountable service owner" }, documentation: { Responsibility: "Service outcomes", "Ownership classification": "Business owner" } });
      const relationships = [{ id: "calls", name: "calls", color: "#059669", style: "solid", sourceTypes: [], targetTypes: [] }, { id: "supports", name: "supports", color: "#0284c7", style: "dashed", sourceTypes: [], targetTypes: [], semantic: "supports" }, { id: "participation", name: "participates in", color: "#9333ea", style: "solid", sourceTypes: [], targetTypes: [], semantic: "participation" }, { id: "sequence", name: "followed by", color: "#b45309", style: "solid", sourceTypes: [], targetTypes: [], semantic: "sequence" }];
      const edges = nodes.filter((n) => n.id.startsWith("c")).slice(1).map((n, i) => ({ id: "e" + i, source: "c" + i, target: n.id, typeId: "calls", label: key === "events" ? "asynchronous message" : "HTTPS", documentation: { Protocol: "HTTPS", Authentication: "OAuth 2.0", Communication: key === "events" ? "Asynchronous" : "Synchronous" } }));
      edges.push({ id: "support", source: "c0", target: "process", typeId: "supports" }, { id: "responsibility", source: "owner", target: "process", typeId: "participation", role: "A" });
      const namedViews = ["solution", "application", "data", "infrastructure", "security", "process", "stakeholder", "integration", "deployment", "traceability"].map((p) => ({ id: "view-" + p, name: p[0].toUpperCase() + p.slice(1) + " architecture", perspective: p, description: "Editable example view. Add classifications and filters to refine the scope.", focus: null, expanded: p === "process" || p === "traceability" ? ["process"] : [], positions: {}, showExternal: true, relationshipTypeIds: null }));
      return { schemaVersion: 2, id: uid2("model"), name: templateNames[key], description: "An illustrative architecture with shared technical, process and stakeholder viewpoints. Replace example ownership and assumptions before using it for a decision.", types, relationshipTypes: relationships, nodes, edges, views: {}, namedViews, decisions: [], documentation: { "Executive summary": "The example links the service to its supporting applications and accountable stakeholder.", "Scope and objectives": "Capture the main dependencies and business responsibilities.", "Architecture principles": "Keep ownership explicit and minimise coupling.", "Assumptions": "Illustrative design only.", "Next steps": "Confirm requirements, security controls and operational ownership." } };
    }
    var patternNames = ["API gateway", "Event-driven integration", "Identity and authentication", "Data ingestion", "Power Platform integration", "Three-tier web application", "Messaging architecture", "Secure external access"];
    function pattern(index) {
      const keys = ["microservices", "events", "azure", "hybrid", "powerPlatform", "threeTier", "events", "azure"];
      const model = template(keys[index] || "web");
      model.nodes = model.nodes.filter((n) => (n.kind || "component") === "component");
      const ids = new Set(model.nodes.map((n) => n.id));
      model.edges = model.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
      model.namedViews = [];
      return { name: patternNames[index] || "Custom pattern", description: "Editable starting point with explicit directed dependencies.", intendedUse: "Adapt to the solution requirements.", constraints: "Review security, resilience and licensing before adoption.", reference: "https://learn.microsoft.com/azure/architecture/patterns/", model };
    }
    function insertPattern(target, source, parentId = null) {
      const next = JSON.parse(JSON.stringify(target)), mapping = new Map(source.nodes.map((n) => [n.id, uid2("n")])), types = /* @__PURE__ */ new Map(), rels = /* @__PURE__ */ new Map();
      for (const type of source.types) {
        const equal = next.types.find((t) => JSON.stringify({ ...t, id: "" }) === JSON.stringify({ ...type, id: "" }));
        const id = equal?.id || uid2("type");
        types.set(type.id, id);
        if (!equal) next.types.push({ ...type, id });
      }
      for (const rel of source.relationshipTypes) {
        const mapped = { ...rel, sourceTypes: rel.sourceTypes.map((id2) => types.get(id2)), targetTypes: rel.targetTypes.map((id2) => types.get(id2)) };
        const equal = next.relationshipTypes.find((t) => JSON.stringify({ ...t, id: "" }) === JSON.stringify({ ...mapped, id: "" }));
        const id = equal?.id || uid2("rel");
        rels.set(rel.id, id);
        if (!equal) next.relationshipTypes.push({ ...mapped, id });
      }
      next.nodes.push(...source.nodes.map((n) => ({ ...JSON.parse(JSON.stringify(n)), id: mapping.get(n.id), typeId: types.get(n.typeId), parentId: n.parentId ? mapping.get(n.parentId) : parentId, layerIds: [], decisionIds: [] })));
      next.edges.push(...source.edges.map((e) => ({ ...e, id: uid2("e"), source: mapping.get(e.source), target: mapping.get(e.target), typeId: rels.get(e.typeId) })));
      return next;
    }
    var snap = (value, enabled = true) => enabled ? Math.round(value / 20) * 20 : value;
    function align(positions, ids, mode) {
      const next = JSON.parse(JSON.stringify(positions)), items = ids.filter((id) => next[id]);
      if (items.length < 2) return next;
      const axis = mode === "left" || mode === "horizontal" ? "x" : "y", sorted = items.sort((a, b) => next[a][axis] - next[b][axis]), first = next[sorted[0]][axis], last = next[sorted.at(-1)][axis];
      sorted.forEach((id, i) => {
        next[id][axis] = mode === "left" || mode === "top" ? first : first + (last - first) * i / (sorted.length - 1);
      });
      return next;
    }
    function orthogonal(a, b, via) {
      return via?.length ? [a, ...via, b] : [a, { x: (a.x + b.x) / 2, y: a.y }, { x: (a.x + b.x) / 2, y: b.y }, b];
    }
    var LocalModelLibrary = class {
      db;
      open() {
        return this.db ||= new Promise((resolve, reject) => {
          const request = indexedDB.open("mightora-architecture-library", 1);
          request.onupgradeneeded = () => request.result.createObjectStore("models", { keyPath: "id" });
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error || new Error("Local library unavailable."));
        });
      }
      async request(mode, action) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
          const tx = db.transaction("models", mode), r = action(tx.objectStore("models"));
          let result;
          r.onsuccess = () => {
            result = r.result;
          };
          tx.oncomplete = () => resolve(result);
          tx.onabort = () => reject(tx.error || new Error("Local save failed."));
          tx.onerror = () => reject(tx.error);
        });
      }
      async list() {
        return this.request("readonly", (s) => s.getAll());
      }
      async get(id) {
        return this.request("readonly", (s) => s.get(id));
      }
      async save(model, id) {
        const previous = await this.get(id), now = (/* @__PURE__ */ new Date()).toISOString(), text2 = canonical3(model), revisions = previous?.revisions || [];
        if (previous && canonical3(previous.model) !== text2) revisions.unshift({ date: previous.updated, text: canonical3(previous.model) });
        await this.request("readwrite", (s) => s.put({ id, name: model.name, updated: now, model, revisions: revisions.slice(0, 5) }));
      }
      async remove(id) {
        await this.request("readwrite", (s) => s.delete(id));
      }
    };
    var exportPresets = ["Executive Overview", "Technical Solution Design", "Enterprise Architecture Review", "Security Architecture Review", "Stakeholder Presentation", "Full Architecture Pack"];
    function reportSections(model, views, options = {}) {
      const nodes = new Map(model.nodes.map((n) => [n.id, n])), name = (id) => nodes.get(id)?.name || id, kind = (n) => n.kind || "component";
      const section = (title, paragraphs) => ({ title, paragraphs: paragraphs.filter(Boolean) });
      const result = [];
      result.push(section("Executive summary", [model.documentation?.["Executive summary"] || model.description || "", `${model.nodes.length} entities and ${model.edges.length} relationships are recorded. ${views.length} viewpoints are included.`]));
      for (const title of ["Solution overview", "Scope and objectives", "Architecture principles", "Risks", "Assumptions", "Constraints", "Next steps"]) if (model.documentation?.[title] || options.assessment) result.push(section(title, [model.documentation?.[title] || "Not documented. Confirm this information during the architecture review."]));
      const metadata = (n) => [n.description, ...Object.entries({ ...n.properties, ...n.documentation }).filter(([, v]) => !!v).map(([k, v]) => `${k}: ${v}`), ...(n.sourceLinks || []).map((l) => `${l.kind}: ${l.label} (${l.target}${l.line ? " line " + l.line : ""})`), n.decisionIds?.length ? "ADRs: " + n.decisionIds.join(", ") : ""].filter(Boolean).join("\n");
      result.push({ title: "Component catalogue", rows: [["Component and identity", "Type", "Documentation"], ...model.nodes.map((n) => [`${n.name}
${n.id}`, model.types.find((t) => t.id === n.typeId)?.name || n.typeId, metadata(n)])] });
      const processes = model.nodes.filter((n) => kind(n) === "process");
      if (processes.length) result.push({ title: "Business process architecture", rows: [["Process", "Owner and details", "Supporting systems and stakeholders"], ...processes.map((n) => [n.name, metadata(n), model.edges.filter((e) => e.target === n.id).map((e) => `${name(e.source)}: ${e.role || model.relationshipTypes.find((t) => t.id === e.typeId)?.name || ""}`).join("\n")])] });
      const stakeholders = model.nodes.filter((n) => kind(n) === "stakeholder");
      if (stakeholders.length) result.push({ title: "Stakeholder mapping", rows: [["Stakeholder", "Responsibility", "Related processes and systems"], ...stakeholders.map((n) => [n.name, metadata(n), model.edges.filter((e) => e.source === n.id || e.target === n.id).map((e) => `${name(e.source === n.id ? e.target : e.source)}${e.role ? " (" + e.role + ")" : ""}`).join("\n")])] });
      const technologies = [...new Set(model.nodes.map((n) => property2(n, "Technology")).filter(Boolean))];
      if (technologies.length) result.push({ title: "Technology inventory", rows: [["Technology", "Components"], ...technologies.map((t) => [t, model.nodes.filter((n) => property2(n, "Technology") === t).map((n) => n.name).join(", ")])] });
      if (model.edges.length) result.push({ title: "Dependencies and integrations", rows: [["Source", "Relationship and details", "Destination"], ...model.edges.map((e) => [name(e.source), [model.relationshipTypes.find((t) => t.id === e.typeId)?.name, e.label, e.description, e.role, ...Object.entries(e.documentation || {}).map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join("\n"), name(e.target)])] });
      for (const d of model.decisions || []) result.push(section("Architecture decision " + d.id, [`Status: ${d.status}  Date: ${d.date}`, `Context
${d.context}`, `Decision
${d.decision}`, `Alternatives
${d.alternatives}`, `Consequences
${d.consequences}`, `Related components: ${d.componentIds.map(name).join(", ")}`]));
      if (!model.decisions?.length && options.assessment) result.push(section("Architecture decisions", ["No decisions documented."]));
      const issues = validateArchitecture2(model);
      result.push({ title: "Governance validation results", rows: [["Severity and rule", "Entity", "Finding and suggested action"], ...issues.map((i) => [i.severity + " / " + i.rule, name(i.entityId || ""), i.message + "\n" + i.remediation])], paragraphs: issues.length ? [] : ["No findings under the configured policy. This is not a security certification."] });
      if (options.report) {
        const r = options.report;
        result.push({ title: "Architecture change and impact report", paragraphs: [r.layoutOnly ? "Only diagram layout changed." : `${r.changes.length} semantic changes.`, `Affected processes: ${r.affectedProcesses.map(name).join(", ") || "None identified"}`, `Affected stakeholders: ${r.affectedStakeholders.map(name).join(", ") || "None identified"}`], rows: [["Change", "Entity", "Changed fields"], ...r.changes.map((c) => [c.kind + (c.breaking ? " (breaking by policy)" : ""), c.name, c.fields.join(", ")])] });
      }
      result.push(section("Glossary", ["Component: a shared logical architecture entity.", "Viewpoint: a filtered projection of shared entities.", "ADR: Architecture Decision Record.", "RACI: Responsible, Accountable, Consulted, Informed.", "Word diagrams are embedded vector images with PNG fallbacks. PowerPoint diagram shapes and connectors are editable; product icons remain images."]));
      const preset = options.preset || "Full Architecture Pack";
      const allowed = preset === "Security Architecture Review" ? ["Executive summary", "Risks", "Assumptions", "Constraints", "Component catalogue", "Dependencies and integrations", "Governance validation results", "Glossary"] : preset === "Enterprise Architecture Review" ? ["Executive summary", "Scope and objectives", "Architecture principles", "Business process architecture", "Stakeholder mapping", "Technology inventory", "Dependencies and integrations", "Governance validation results", "Risks", "Next steps"] : preset === "Executive Overview" ? ["Executive summary", "Solution overview", "Scope and objectives", "Risks", "Next steps", "Governance validation results"] : preset === "Stakeholder Presentation" ? ["Executive summary", "Business process architecture", "Stakeholder mapping", "Next steps"] : null;
      return result.filter((s) => (!allowed || allowed.includes(s.title) || s.title.startsWith("Architecture decision")) && (!options.sections || options.sections.includes(s.title)));
    }
  }
});

// assets/icon-catalog.json
var require_icon_catalog = __commonJS({
  "assets/icon-catalog.json"(exports, module2) {
    module2.exports = [
      {
        id: "power-bi",
        name: "Power BI",
        collection: "Microsoft Power BI (archived)",
        termsUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl: "https://github.com/microsoft/PowerBI-Icons",
        sourceMember: "Power-BI.svg",
        sha256: "03c49401348f56f55a59b2daee8164636caf8ec4b0e5985f3f366dbc0ca94f48"
      },
      {
        id: "power-apps",
        name: "Power Apps",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/PowerApps_scalable.svg",
        sha256: "c357907ad0a2d24a6d8c82b23fe4d2aaa4a4524076991f74770fc043a4cc455a"
      },
      {
        id: "power-automate",
        name: "Power Automate",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/PowerAutomate_scalable.svg",
        sha256: "2025db7bb3feec49d75681934b8561fb958cf11bdf0e2acf6e2b28db5c755e8d"
      },
      {
        id: "dataverse",
        name: "Dataverse",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/Dataverse_scalable.svg",
        sha256: "df71c0111148d116515a02c5cb07483caad2bcb779664fa16fd837a4709504ab"
      },
      {
        id: "power-pages",
        name: "Power Pages",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/PowerPages_scalable.svg",
        sha256: "7fdc8facba1b64c4e30fbed3d331ecab78746d0d29c29bae593b18788e870631"
      },
      {
        id: "power-platform",
        name: "Power Platform",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/PowerPlatform_scalable.svg",
        sha256: "c58871d6adac53a51512341e65055d0ec12f29948a001666c11dc7b5bb5fe142"
      },
      {
        id: "copilot-studio",
        name: "Microsoft Copilot Studio",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "CopilotStudio_scalable.svg",
        sha256: "c614fa6b9b7d33048c6c4efcdd508e5b7818d296cbd1cd7d8848bb2dd1be4fd0"
      },
      {
        id: "ai-builder",
        name: "AI Builder",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Power Platform/AIBuilder_scalable.svg",
        sha256: "09354060aae6bfd903f3ff8246e90fce8514f4c56c603e676931fd99d338cfa8"
      },
      {
        id: "microsoft-agent-365",
        name: "Microsoft Agent 365",
        collection: "Microsoft Power Platform",
        termsUrl: "https://learn.microsoft.com/en-us/power-platform/guidance/icons",
        sourceUrl: "https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip",
        sourceMember: "Agent365_scalable.svg",
        sha256: "7d7988f5d29d3d3b425bdbb1ebacdd32d74a3e0819a177ed389a99ed73cb0ed9"
      },
      {
        id: "azure-functions",
        name: "Azure Functions",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/compute/10029-icon-service-Function-Apps.svg",
        sha256: "1a6c9c108d5f63f7b78bc6fbc464059acd2eaa8c1d111e9bcd28a8b2cdf470b9"
      },
      {
        id: "azure-app-service",
        name: "Azure App Service",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/app services/10035-icon-service-App-Services.svg",
        sha256: "529d83fc80637a96b6d27f6cfac7536e1c5f9b1b67f58aef4e2e3d6f47fd4925"
      },
      {
        id: "azure-sql",
        name: "Azure SQL Database",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/databases/10130-icon-service-SQL-Database.svg",
        sha256: "a26124a2b188ccf910520c935c726f7364e0f5935d7a4319ebcab9c80a40e475"
      },
      {
        id: "azure-storage",
        name: "Azure Storage account",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/storage/10086-icon-service-Storage-Accounts.svg",
        sha256: "7190d3bb14ce30ce74bd0af873915830fe821e8c5f6ef6f3149e6f7cfb2aa4f7"
      },
      {
        id: "azure-key-vault",
        name: "Azure Key Vault",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/security/10245-icon-service-Key-Vaults.svg",
        sha256: "712b426f54f0fc50d0816dc79df709daa7ac5f93ccaf4e9b3527f627f6e9ad97"
      },
      {
        id: "azure-vnet",
        name: "Azure Virtual Network",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/networking/10061-icon-service-Virtual-Networks.svg",
        sha256: "64a5e75ecef2f9f69067faa2eb131266cb8f2858706f8ab74bfea5ad0d98b14d"
      },
      {
        id: "azure-logic-apps",
        name: "Azure Logic Apps",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/integration/02631-icon-service-Logic-Apps.svg",
        sha256: "3390e6337469e29d755a4077b64efcf0b0269ee871113417fd4458269351b438"
      },
      {
        id: "azure-api-management",
        name: "Azure API Management",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/devops/10042-icon-service-API-Management-Services.svg",
        sha256: "cf794288575f2f7b080c50aa8319d42b02a2f2ae5351e4712c574353fc801f9a"
      },
      {
        id: "azure-service-bus",
        name: "Azure Service Bus",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/integration/10836-icon-service-Azure-Service-Bus.svg",
        sha256: "eaf42cb87aedf608f60d40b601eb86491daaa71b8eab40a935e8e7fa2e62a2cf"
      },
      {
        id: "azure-aks",
        name: "Azure Kubernetes Service",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/compute/10023-icon-service-Kubernetes-Services.svg",
        sha256: "81954a481503057498d543a51863b2eb4673284e109662cdc421051d11dba25c"
      },
      {
        id: "azure-app-insights",
        name: "Azure Application Insights",
        collection: "Microsoft Azure",
        termsUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
        sourceUrl: "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip",
        sourceMember: "Azure_Public_Service_Icons/Icons/devops/00012-icon-service-Application-Insights.svg",
        sha256: "36c73dea8b1598fbfff84890a2b409600f1339eec8c1bf1a896439e9da8f9dca"
      },
      {
        id: "aws-lambda",
        name: "AWS Lambda",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Compute/64/Arch_AWS-Lambda_64.svg",
        sha256: "5818c80cd8e7d08891a2492c7694f472ca914fb3a99d9ef8e597db0b37ad7f13"
      },
      {
        id: "aws-ec2",
        name: "Amazon EC2",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Compute/64/Arch_Amazon-EC2_64.svg",
        sha256: "5a7a0cef7a9f44ccdd544564ce9076abec3024090be0d6454504c49d149ce9ec"
      },
      {
        id: "aws-s3",
        name: "Amazon S3",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg",
        sha256: "b92c5101cc6565dd12df37655802279f8fba0c719279f62f93106d26750b36c6"
      },
      {
        id: "aws-rds",
        name: "Amazon RDS",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Databases/64/Arch_Amazon-RDS_64.svg",
        sha256: "1b24caf4baf274a12164053f05bf0cba331f4d5e30fdd4164000702c1ec192a6"
      },
      {
        id: "aws-dynamodb",
        name: "Amazon DynamoDB",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Databases/64/Arch_Amazon-DynamoDB_64.svg",
        sha256: "ed169f049cc24c954cfbe3d14695d5b022558c45e5605936a565d1347c14b664"
      },
      {
        id: "aws-api-gateway",
        name: "Amazon API Gateway",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/64/Arch_Amazon-API-Gateway_64.svg",
        sha256: "a91afd652b8d3412179d0257a818165149224d521e4e1906ee8ea0cd28666a31"
      },
      {
        id: "aws-sqs",
        name: "Amazon SQS",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Application-Integration/64/Arch_Amazon-Simple-Queue-Service_64.svg",
        sha256: "bbab2545dccba2e11aff74e42c7f8078a9051b14b16114e539da1c4b09bdbdcd"
      },
      {
        id: "aws-sns",
        name: "Amazon SNS",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Application-Integration/64/Arch_Amazon-Simple-Notification-Service_64.svg",
        sha256: "f0781cd57174dd2ddfe2d2033566c73f5c0bf8192610eec5194e7a7756187dfe"
      },
      {
        id: "aws-cloudfront",
        name: "Amazon CloudFront",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg",
        sha256: "664919982792a69058077eaf39240afd320bbcbd082d36a9148184ec32708cd5"
      },
      {
        id: "aws-eks",
        name: "Amazon EKS",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Containers/64/Arch_Amazon-Elastic-Kubernetes-Service_64.svg",
        sha256: "abda372bab3e7e0e873edf2b078972625b2cff255d8626fbf955546e71bdf9cb"
      },
      {
        id: "aws-cognito",
        name: "Amazon Cognito",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Security-Identity/64/Arch_Amazon-Cognito_64.svg",
        sha256: "cf9c55baa325d5d07aea0054115b1b24d68c1d7e046a4f8a360ccdefbba507e9"
      },
      {
        id: "aws-iam",
        name: "AWS Identity and Access Management",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Security-Identity/64/Arch_AWS-Identity-and-Access-Management_64.svg",
        sha256: "3135793557c065d0481a3985ccc0574b36278d56a2e2c5d59107d0d28f51b827"
      },
      {
        id: "aws-step-functions",
        name: "AWS Step Functions",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Application-Integration/64/Arch_AWS-Step-Functions_64.svg",
        sha256: "19da6b2ef57df3a441b122b33def713b9715e95f74b5033d98e81629babe7ba5"
      },
      {
        id: "aws-vpc",
        name: "Amazon VPC",
        collection: "AWS",
        termsUrl: "https://aws.amazon.com/architecture/icons/",
        sourceUrl: "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
        sourceMember: "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.svg",
        sha256: "4a2c292527ce28a95d9038ab7e6be818751ffef0a91aabb5de2e61045150a98d"
      },
      {
        id: "generic-user",
        name: "User",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/user.svg",
        sourceMember: null,
        sha256: "eae3b3b2400031ddd5ec869327d127a96014e5f63aa6e06658dd5d4e90661aa8"
      },
      {
        id: "generic-users",
        name: "Users",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/users.svg",
        sourceMember: null,
        sha256: "eeed488a1ec95ba730dd69996536fb65061d6ea273afb2429ae47e65eebf401c"
      },
      {
        id: "generic-cloud",
        name: "Cloud",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cloud.svg",
        sourceMember: null,
        sha256: "28a34022ed00177eb1f218eea5d2b7af30d09b529187fe32219e4dd8ea2b9740"
      },
      {
        id: "generic-database",
        name: "Database",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/database.svg",
        sourceMember: null,
        sha256: "471eb14bc8d144896a82dfc4aa9daf350f769f0896f4bef33e50aabdbb51130d"
      },
      {
        id: "generic-server",
        name: "Server",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/server.svg",
        sourceMember: null,
        sha256: "f7bea54b609dc488f3b848995014041846b2443fd2a880653e9e583d7a034f61"
      },
      {
        id: "generic-network",
        name: "Network",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/network.svg",
        sourceMember: null,
        sha256: "626be730feea1e5ea7539fbf78b4a3fcb927ce5d7dc43364f2216908672ac792"
      },
      {
        id: "generic-workflow",
        name: "Workflow",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/workflow.svg",
        sourceMember: null,
        sha256: "ae99ea8f56a2835a2cca35b2fbb57643ab73443610970dba23e24bd9df75cfec"
      },
      {
        id: "generic-shield",
        name: "Shield",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg",
        sourceMember: null,
        sha256: "be32f6a86df7cbe43a83c439dd8849e5bcf5145e484d23420c20d8b98a78e82b"
      },
      {
        id: "generic-box",
        name: "Box",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/box.svg",
        sourceMember: null,
        sha256: "511862693d914d2bf1947c9ccc513595f2a256541f5dd4f6f9ac8383cd41ac4f"
      },
      {
        id: "generic-layers",
        name: "Layers",
        collection: "General architecture (Lucide)",
        termsUrl: "https://lucide.dev/license",
        sourceUrl: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg",
        sourceMember: null,
        sha256: "ce16d0a955e3581cda17f6b2fd5c5bc2034b405f9cecc31c8ebb8495b4afc1bb"
      }
    ];
  }
});

// src/dimensions.js
var require_dimensions = __commonJS({
  "src/dimensions.js"(exports, module2) {
    "use strict";
    (function(root) {
      "use strict";
      const kinds = ["component", "process", "stakeholder"];
      const perspectives = ["solution", "application", "data", "infrastructure", "security", "integration", "deployment", "custom", "process", "stakeholder", "layers", "traceability", "all"];
      const roles = ["R", "A", "C", "I"];
      const kind = (n) => n?.kind || "component";
      const safeId = (id) => typeof id === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(id) && !["__proto__", "constructor", "prototype"].includes(id);
      const check = (value, message) => {
        if (!value) throw new Error(message);
      };
      const text = (v, limit) => typeof v === "string" && v.length <= limit;
      function validate(m) {
        const nodes = new Map(m.nodes.map((n) => [n.id, n])), layers = /* @__PURE__ */ new Map();
        if (m.layers !== void 0) {
          check(Array.isArray(m.layers) && m.layers.length <= 50, "Define up to 50 application layers.");
          for (const l of m.layers) {
            check(l && safeId(l.id) && !layers.has(l.id), "Layer IDs must be safe and unique.");
            check(text(l.name, 100) && l.name.trim() && text(l.description || "", 2e3) && /^#[\da-f]{6}$/i.test(l.color), "Layers need a name, description and six-digit hex colour.");
            layers.set(l.id, l);
          }
        }
        for (const n of m.nodes) {
          check(n.kind === void 0 || kinds.includes(n.kind), "Unknown entity kind. Use component, process or stakeholder.");
          if (n.layerIds !== void 0) check(Array.isArray(n.layerIds) && n.layerIds.length <= 50 && new Set(n.layerIds).size === n.layerIds.length && n.layerIds.every((id) => layers.has(id)) && (kind(n) === "component" || n.layerIds.length === 0), "Only components can reference existing application layers.");
        }
        for (const t of m.relationshipTypes) check(t.semantic === void 0 || ["sequence", "supports", "participation"].includes(t.semantic), "Unknown business relationship meaning.");
        const types = new Map(m.relationshipTypes.map((t) => [t.id, t]));
        for (const e of m.edges) {
          const from = kind(nodes.get(e.source)), to = kind(nodes.get(e.target)), semantic = types.get(e.typeId)?.semantic;
          if (semantic === "sequence") check(from === "process" && to === "process", "Process sequence links must join two processes or steps.");
          if (semantic === "supports") check(from === "component" && to === "process", "Supporting links must go from a component to a process or step.");
          if (semantic === "participation") check(from === "stakeholder" && to === "process", "Stakeholder participation must go from a stakeholder to a process or step.");
          if (e.role !== void 0 && e.role !== "") check(roles.includes(e.role) && from === "stakeholder" && to === "process", "RACI roles belong on stakeholder-to-process relationships.");
        }
        for (const v of m.namedViews || []) {
          check(v.perspective === void 0 || perspectives.includes(v.perspective), "Unknown saved view perspective.");
          check(v.processId == null || nodes.has(v.processId) && kind(nodes.get(v.processId)) === "process", "Saved process filter references an unknown process.");
          check(v.layerIds == null || Array.isArray(v.layerIds) && v.layerIds.length <= 50 && v.layerIds.every((id) => layers.has(id)), "Saved layer filter references an unknown application layer.");
        }
      }
      function ensureLanguage(M, m) {
        const type = (id, name, color, fields) => {
          let t = m.types.find((t2) => t2.id === id);
          if (!t) {
            t = { id: m.types.some((t2) => t2.id === id) ? M.id("type") : id, name, color, shape: "rounded", fields };
            m.types.push(t);
          }
          return t.id;
        };
        const processType = type("business-process", "Business process", "#b45309", ["Outcome"]), stakeholderType = type("business-stakeholder", "Stakeholder", "#9333ea", ["Organisation", "Role"]);
        const relation = (semantic, name, color) => {
          let t = m.relationshipTypes.find((t2) => t2.semantic === semantic);
          if (!t) {
            t = { id: M.id("rel"), name, color, style: "solid", sourceTypes: [], targetTypes: [], semantic };
            m.relationshipTypes.push(t);
          }
          return t.id;
        };
        return { processType, stakeholderType, sequence: relation("sequence", "followed by", "#b45309"), supports: relation("supports", "supports", "#0284c7"), participation: relation("participation", "participates in", "#9333ea") };
      }
      function processBranch(M, model, id) {
        const result = id ? M.descendants(model, id, true) : new Set(model.nodes.filter((n) => kind(n) === "process").map((n) => n.id));
        return new Set([...result].filter((nid) => kind(model.nodes.find((n) => n.id === nid)) === "process"));
      }
      function project(M, model, view) {
        const perspective = view.perspective || "solution", processIds = processBranch(M, model, view.processId), included = /* @__PURE__ */ new Set(), context = /* @__PURE__ */ new Set();
        const processScope = (n) => kind(n) === "process" && processIds.has(n.id);
        for (const n of model.nodes) {
          const k = kind(n);
          let keep = perspective === "all" || ["solution", "application", "data", "infrastructure", "security", "integration", "deployment", "custom", "layers"].includes(perspective) && k === "component" || ["process", "stakeholder", "traceability"].includes(perspective) && processScope(n);
          if (perspective === "stakeholder" && k === "stakeholder" && !view.processId) keep = true;
          if (keep && k === "component" && view.layerIds != null) keep = view.layerIds.length ? (n.layerIds || []).some((id) => view.layerIds.includes(id)) : !(n.layerIds || []).length;
          if (keep && ["application", "data", "infrastructure", "security", "integration", "deployment"].includes(perspective) && n.viewpoints?.length) keep = n.viewpoints.includes(perspective);
          if (keep && view.includedIds != null) keep = view.includedIds.includes(n.id);
          if (keep && view.typeIds != null) keep = view.typeIds.includes(n.typeId);
          if (view.hiddenIds?.includes(n.id)) keep = false;
          if (keep) included.add(n.id);
        }
        const semantic = (e) => model.relationshipTypes.find((t) => t.id === e.typeId)?.semantic;
        for (const e of model.edges) {
          if (!processIds.has(e.target)) continue;
          const source = model.nodes.find((n) => n.id === e.source);
          if (semantic(e) === "participation" && ["stakeholder", "traceability"].includes(perspective)) included.add(e.source);
          if (semantic(e) === "supports" && ["process", "traceability"].includes(perspective) && (perspective === "traceability" || view.showExternal !== false)) {
            if (view.layerIds != null && !(view.layerIds.length ? (source.layerIds || []).some((id) => view.layerIds.includes(id)) : !(source.layerIds || []).length)) continue;
            included.add(e.source);
            if (perspective === "process") context.add(e.source);
          }
        }
        const original = M.index(model).nodes;
        const nodes = model.nodes.filter((n) => included.has(n.id)).map((n) => {
          let p = n.parentId;
          while (p && !included.has(p)) p = original.get(p)?.parentId ?? null;
          return { ...n, parentId: perspective === "layers" || context.has(n.id) ? null : p };
        });
        const edges = model.edges.filter((e) => included.has(e.source) && included.has(e.target) && (view.relationshipTypeIds == null || view.relationshipTypeIds.includes(e.typeId)));
        const focus = included.has(view.focus) && perspective !== "layers" ? view.focus : null;
        const projected = M.project({ ...model, nodes, edges }, focus, (view.expanded || []).filter((id) => !context.has(id)));
        for (const n of projected.nodes) if (context.has(n.id) && !n.isScope) {
          n.external = true;
          n.originalId = n.id;
          n.parentVisible = null;
          n.expanded = false;
        }
        if (view.showExternal === false) {
          const ids = new Set(projected.nodes.filter((n) => !n.external).map((n) => n.id));
          projected.nodes = projected.nodes.filter((n) => ids.has(n.id));
          projected.edges = projected.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
        }
        projected.perspective = perspective;
        return projected;
      }
      function layout(M, model, projection, view, positions = {}) {
        if (view.swimlanes && ["process", "stakeholder", "traceability"].includes(view.perspective)) {
          const lanes = [...new Set(projection.nodes.map((n) => n.swimlane || "Unassigned"))], bands2 = [], nodes2 = [];
          let y2 = 30;
          for (const lane of lanes) {
            const members = projection.nodes.filter((n) => (n.swimlane || "Unassigned") === lane), h = 80 + Math.ceil(members.length / 3) * 170;
            bands2.push({ id: "lane-" + bands2.length, name: lane, description: "Process swimlane", color: "#059669", x: 30, y: y2, w: 1030, h });
            members.forEach((n, i) => nodes2.push({ ...n, x: positions[n.id]?.x ?? 55 + i % 3 * 335, y: positions[n.id]?.y ?? y2 + 65 + Math.floor(i / 3) * 170, w: 252, h: 124, expanded: false, parentVisible: null }));
            y2 += h + 30;
          }
          return { nodes: nodes2, bands: bands2, width: 1100, height: Math.max(470, y2) };
        }
        if ((view.perspective || "solution") !== "layers") return M.layout(projection, positions);
        const layers = [...model.layers || [], { id: null, name: "Unassigned", description: "Components without an application layer", color: "#64748b" }];
        const bands = [], nodes = [];
        let y = 30;
        for (const layer of layers) {
          const members = projection.nodes.filter((n) => {
            const ids = n.layerIds || [];
            return (view.layerIds?.length ? ids.find((id) => view.layerIds.includes(id)) : ids[0] || null) === layer.id;
          });
          if (!members.length) continue;
          const rows = Math.ceil(members.length / 3), height = 70 + rows * 178;
          const placed = members.map((n, i) => ({ ...n, x: positions[n.id]?.x ?? 55 + i % 3 * 335, y: positions[n.id]?.y ?? y + 65 + Math.floor(i / 3) * 178, w: 252, h: 124, expanded: false, parentVisible: null }));
          bands.push({ ...layer, x: 30, y, w: 1030, h: height });
          nodes.push(...placed);
          y += height + 30;
        }
        return { nodes, bands, width: Math.max(1100, ...nodes.map((n) => n.x + n.w + 50)), height: Math.max(470, y) };
      }
      function roleLabel(e) {
        return e.role ? { R: "Responsible", A: "Accountable", C: "Consulted", I: "Informed" }[e.role] + " (" + e.role + ")" : "";
      }
      function mappings(model, processId = null) {
        const processIds = new Set(model.nodes.filter((n) => kind(n) === "process" && (!processId || n.id === processId)).map((n) => n.id)), types = new Map(model.relationshipTypes.map((t) => [t.id, t]));
        return model.edges.filter((e) => processIds.has(e.target) && ["supports", "participation"].includes(types.get(e.typeId)?.semantic)).map((e) => ({ edge: e, semantic: types.get(e.typeId).semantic, source: model.nodes.find((n) => n.id === e.source), process: model.nodes.find((n) => n.id === e.target) }));
      }
      function removeLayer(model, id) {
        const next = JSON.parse(JSON.stringify(model));
        next.layers = (next.layers || []).filter((l) => l.id !== id);
        for (const n of next.nodes) if (n.layerIds) n.layerIds = n.layerIds.filter((l) => l !== id);
        for (const v of next.namedViews || []) {
          if (v.layerIds?.includes(id)) v.layerIds = null;
          if (v.perspective === "layers") {
            v.positions = {};
            delete v.camera;
          }
        }
        return next;
      }
      const api = { kinds, perspectives, roles, kind, validate, ensureLanguage, project, layout, roleLabel, mappings, removeLayer, processBranch };
      if (typeof module2 !== "undefined" && module2.exports) module2.exports = api;
      else root.ModellerDimensions = api;
    })(globalThis);
  }
});

// src/core.js
var require_core = __commonJS({
  "src/core.js"(exports, module2) {
    "use strict";
    (function(root) {
      "use strict";
      const VERSION = 2;
      const P = typeof module2 !== "undefined" && module2.exports ? require_platform() : root.ModellerPlatform;
      const ICON_CATALOG = typeof module2 !== "undefined" && module2.exports ? require_icon_catalog() : root.ModellerIconCatalog;
      const ICON_IDS = ICON_CATALOG.map((icon) => icon.id);
      const LIMITS = Object.freeze({ nodes: 3e3, edges: 1e4, types: 50, depth: 64, bytes: 5 * 1024 * 1024 });
      const forbidden = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
      const copy = (value) => JSON.parse(JSON.stringify(value));
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const validId = (id2) => typeof id2 === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(id2) && !forbidden.has(id2);
      const text = (value, max, label, required = false) => {
        assert(typeof value === "string" && value.length <= max && (!required || value.trim().length > 0), `${label} must be ${required ? "non-empty " : ""}text of up to ${max} characters.`);
      };
      function id(prefix = "n") {
        return `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`}`;
      }
      function index(model) {
        const nodes = new Map(model.nodes.map((n) => [n.id, n]));
        const children = /* @__PURE__ */ new Map([[null, []]]);
        for (const n of model.nodes) {
          if (!children.has(n.parentId)) children.set(n.parentId, []);
          children.get(n.parentId).push(n);
        }
        return { nodes, children, types: new Map(model.types.map((t) => [t.id, t])), relationTypes: new Map(model.relationshipTypes.map((t) => [t.id, t])) };
      }
      function path(model, nodeId) {
        const { nodes } = index(model);
        const result = [];
        let n = nodes.get(nodeId);
        while (n) {
          result.unshift(n.name);
          n = nodes.get(n.parentId);
        }
        return result.join(" / ");
      }
      function descendants(model, nodeId, includeSelf = false) {
        const { children } = index(model);
        const out = new Set(includeSelf && nodeId !== null ? [nodeId] : []);
        const stack = [nodeId];
        while (stack.length) for (const n of children.get(stack.pop()) || []) {
          out.add(n.id);
          stack.push(n.id);
        }
        return out;
      }
      function validate(input) {
        assert(input && typeof input === "object" && !Array.isArray(input), "This file is not an architecture model.");
        const m = P.migrate(input);
        text(m.name, 160, "Model name", true);
        if (m.description !== void 0) text(m.description, 4e3, "Model question and scope");
        assert(Array.isArray(m.types) && m.types.length > 0 && m.types.length <= LIMITS.types, "Include 1\u201350 component types.");
        assert(Array.isArray(m.relationshipTypes) && m.relationshipTypes.length > 0 && m.relationshipTypes.length <= LIMITS.types, "Include 1\u201350 relationship types.");
        assert(Array.isArray(m.nodes) && m.nodes.length <= LIMITS.nodes, "The model supports up to 3,000 components.");
        assert(Array.isArray(m.edges) && m.edges.length <= LIMITS.edges, "The model supports up to 10,000 relationships.");
        for (const [list, label] of [[m.types, "Component type"], [m.relationshipTypes, "Relationship type"], [m.nodes, "Component"], [m.edges, "Relationship"]]) {
          const seen = /* @__PURE__ */ new Set();
          for (const item of list) {
            assert(item && validId(item.id) && !seen.has(item.id), `${label} IDs must be safe and unique.`);
            seen.add(item.id);
          }
        }
        for (const t of m.types) {
          assert(t.iconId === void 0 || t.iconId === "" || ICON_IDS.includes(t.iconId), "Unknown component type icon.");
          text(t.name, 80, "Component type name", true);
          assert(/^#[\da-f]{6}$/i.test(t.color), "Type colours must be six-digit hex colours.");
          assert(["rounded", "square", "database"].includes(t.shape), "Unsupported component shape.");
          assert(Array.isArray(t.fields) && t.fields.length <= 16 && new Set(t.fields).size === t.fields.length, "Use up to 16 unique custom property names.");
          for (const f of t.fields) {
            text(f, 60, "Property name", true);
            assert(!forbidden.has(f), "Reserved property name.");
          }
        }
        const { nodes, types, relationTypes } = index(m);
        for (const t of m.relationshipTypes) {
          text(t.name, 80, "Relationship type name", true);
          assert(/^#[\da-f]{6}$/i.test(t.color) && ["solid", "dashed"].includes(t.style), "Invalid relationship appearance.");
          for (const key of ["sourceTypes", "targetTypes"]) {
            if (t[key] === void 0) t[key] = [];
            assert(Array.isArray(t[key]) && t[key].length <= LIMITS.types && t[key].every((x) => types.has(x)), "Relationship rules reference an unknown component type.");
          }
        }
        for (const n of m.nodes) {
          assert(n.iconId === void 0 || n.iconId === "" || ICON_IDS.includes(n.iconId), "Unknown component icon.");
          text(n.name, 160, "Component name", true);
          text(n.description || "", 4e3, "Description");
          assert(types.has(n.typeId), `Unknown type on ${n.name}.`);
          assert(n.parentId === null || nodes.has(n.parentId) && n.parentId !== n.id, `Invalid parent on ${n.name}.`);
          if (n.properties === void 0) n.properties = {};
          assert(n.properties && typeof n.properties === "object" && !Array.isArray(n.properties), "Component properties must be an object.");
          assert(Object.keys(n.properties).length <= 40, "Use at most 40 properties on a component.");
          for (const [k, v] of Object.entries(n.properties)) {
            text(k, 60, "Property name", true);
            assert(!forbidden.has(k), "Reserved property name.");
            text(v, 2e3, "Property value");
          }
          const seen = /* @__PURE__ */ new Set([n.id]);
          let parent = n.parentId;
          while (parent !== null) {
            assert(!seen.has(parent), "Components cannot contain their own ancestors.");
            seen.add(parent);
            assert(seen.size <= LIMITS.depth, "Nesting is limited to 64 levels.");
            parent = nodes.get(parent).parentId;
          }
        }
        for (const e of m.edges) {
          assert(nodes.has(e.source) && nodes.has(e.target) && e.source !== e.target, "Relationships must join two different existing components.");
          assert(relationTypes.has(e.typeId), "Unknown relationship type.");
          text(e.label || "", 160, "Relationship label");
          text(e.description || "", 4e3, "Relationship notes");
          const t = relationTypes.get(e.typeId);
          assert(!t.sourceTypes.length || t.sourceTypes.includes(nodes.get(e.source).typeId), `The source type is not permitted for \u201C${t.name}\u201D.`);
          assert(!t.targetTypes.length || t.targetTypes.includes(nodes.get(e.target).typeId), `The target type is not permitted for \u201C${t.name}\u201D.`);
        }
        m.views = m.views && typeof m.views === "object" && !Array.isArray(m.views) ? m.views : {};
        const safeViews = {};
        for (const [key, value] of Object.entries(m.views).slice(0, 100)) {
          if (!validId(key) || !value || typeof value !== "object") continue;
          const positions = {};
          for (const [nid, p] of Object.entries(value.positions || {}).slice(0, LIMITS.nodes)) {
            if (nodes.has(nid) && Number.isFinite(p?.x) && Number.isFinite(p?.y) && Math.abs(p.x) <= 1e5 && Math.abs(p.y) <= 1e5) positions[nid] = { x: p.x, y: p.y, ...Number.isFinite(p.w) && p.w >= 180 && p.w <= 1200 ? { w: p.w } : {}, ...Number.isFinite(p.h) && p.h >= 124 && p.h <= 1e3 ? { h: p.h } : {} };
          }
          safeViews[key] = { positions };
        }
        m.views = safeViews;
        if (m.namedViews !== void 0) {
          assert(Array.isArray(m.namedViews) && m.namedViews.length <= 50, "Save up to 50 named views.");
          const seen = /* @__PURE__ */ new Set();
          for (const view of m.namedViews) {
            assert(view && validId(view.id) && !seen.has(view.id), "Saved view IDs must be safe and unique.");
            seen.add(view.id);
            text(view.name, 160, "View name", true);
            text(view.description || "", 2e3, "View description");
            assert(view.focus === null || nodes.has(view.focus), "Saved view focus does not exist.");
            assert(Array.isArray(view.expanded) && view.expanded.length <= LIMITS.nodes && view.expanded.every((id2) => nodes.has(id2)), "Saved expansion references an unknown component.");
            assert(view.relationshipTypeIds == null || Array.isArray(view.relationshipTypeIds) && view.relationshipTypeIds.length <= LIMITS.types && view.relationshipTypeIds.every((id2) => relationTypes.has(id2)), "Saved view references an unknown relationship type.");
            assert(typeof view.showExternal === "boolean", "Saved view external context must be true or false.");
            const positions = {};
            for (const [nid, p] of Object.entries(view.positions || {}).slice(0, LIMITS.nodes)) if (nodes.has(nid) && Number.isFinite(p?.x) && Number.isFinite(p?.y) && Math.abs(p.x) <= 1e5 && Math.abs(p.y) <= 1e5) positions[nid] = { x: p.x, y: p.y, ...Number.isFinite(p.w) && p.w >= 180 && p.w <= 1200 ? { w: p.w } : {}, ...Number.isFinite(p.h) && p.h >= 124 && p.h <= 1e3 ? { h: p.h } : {} };
            view.positions = positions;
            if (view.camera !== void 0) assert(view.camera && ["x", "y", "w", "h"].every((k) => Number.isFinite(view.camera[k]) && Math.abs(view.camera[k]) <= 1e6) && view.camera.w > 0 && view.camera.h > 0, "Invalid saved view camera.");
          }
        }
        const dimensions = typeof module2 !== "undefined" && module2.exports ? require_dimensions() : root.ModellerDimensions;
        dimensions.validate(m);
        P.validateExtensions(m);
        return m;
      }
      function parse2(json) {
        assert(typeof json === "string" && new TextEncoder().encode(json).length <= LIMITS.bytes, "Import a model smaller than 5 MB.");
        return validate(JSON.parse(json));
      }
      function reparent(model, nodeId, parentId) {
        const next = copy(model);
        const n = next.nodes.find((x) => x.id === nodeId);
        assert(n, "Component not found.");
        n.parentId = parentId;
        next.views = {};
        return validate(next);
      }
      function removeNode(model, nodeId) {
        const next = copy(model);
        const removed = descendants(next, nodeId, true);
        next.nodes = next.nodes.filter((n) => !removed.has(n.id));
        next.edges = next.edges.filter((e) => !removed.has(e.source) && !removed.has(e.target));
        next.views = {};
        for (const v of next.namedViews || []) {
          if (removed.has(v.focus)) v.focus = null;
          if (removed.has(v.processId)) v.processId = null;
          v.expanded = v.expanded.filter((id2) => !removed.has(id2));
          v.positions = {};
          delete v.camera;
          for (const key of ["includedIds", "hiddenIds"]) if (v[key]) v[key] = v[key].filter((id2) => !removed.has(id2));
          if (v.routes) {
            for (const id2 of Object.keys(v.routes)) if (!next.edges.some((e) => e.id === id2)) delete v.routes[id2];
          }
        }
        for (const d of next.decisions || []) d.componentIds = d.componentIds.filter((id2) => !removed.has(id2));
        return validate(next);
      }
      function impact2(model, nodeId, direction = "incoming") {
        const adjacency = /* @__PURE__ */ new Map();
        for (const e of model.edges) {
          const from = direction === "incoming" ? e.target : e.source, to = direction === "incoming" ? e.source : e.target;
          if (!adjacency.has(from)) adjacency.set(from, []);
          adjacency.get(from).push(to);
        }
        const reached = /* @__PURE__ */ new Set([nodeId]);
        const queue = [nodeId];
        for (let i = 0; i < queue.length; i++) for (const to of adjacency.get(queue[i]) || []) if (!reached.has(to)) {
          reached.add(to);
          queue.push(to);
        }
        reached.delete(nodeId);
        return reached;
      }
      function project(model, focus = null, expandedIds = []) {
        const { nodes, children } = index(model);
        const expanded = new Set(expandedIds);
        const visible = /* @__PURE__ */ new Map();
        assert(focus === null || nodes.has(focus), "The focused component no longer exists.");
        const inside = focus === null ? new Set(nodes.keys()) : descendants(model, focus, true);
        const add = (nodeId, parentVisible = null) => {
          const n = nodes.get(nodeId);
          const open = expanded.has(nodeId) && (children.get(nodeId) || []).length > 0;
          visible.set(nodeId, { ...n, parentVisible, expanded: open, external: false, isScope: false });
          if (open) for (const child of children.get(nodeId) || []) add(child.id, nodeId);
        };
        if (focus !== null) visible.set(focus, { ...nodes.get(focus), parentVisible: null, expanded: true, external: false, isScope: true });
        for (const n of children.get(focus) || []) add(n.id, focus);
        const representative = (nodeId) => {
          if (inside.has(nodeId)) {
            let cur2 = nodeId;
            while (cur2 !== null) {
              if (visible.has(cur2)) return cur2;
              cur2 = nodes.get(cur2)?.parentId ?? null;
            }
            return null;
          }
          let cur = nodeId;
          while (nodes.get(cur).parentId !== null && !inside.has(nodes.get(cur).parentId)) cur = nodes.get(cur).parentId;
          const extId = `external:${cur}`;
          if (!visible.has(extId)) visible.set(extId, { ...nodes.get(cur), id: extId, originalId: cur, external: true, expanded: false, parentVisible: null });
          return extId;
        };
        const groups = /* @__PURE__ */ new Map();
        const hidden = /* @__PURE__ */ new Map();
        for (const edge of model.edges) {
          if (!inside.has(edge.source) && !inside.has(edge.target)) continue;
          const source = representative(edge.source), target = representative(edge.target);
          if (!source || !target) continue;
          if (source === target) {
            hidden.set(source, (hidden.get(source) || 0) + 1);
            continue;
          }
          const key = JSON.stringify([source, target, edge.typeId]);
          if (!groups.has(key)) groups.set(key, { id: `group-${groups.size}`, source, target, typeId: edge.typeId, edges: [] });
          groups.get(key).edges.push(edge);
        }
        return { nodes: [...visible.values()], edges: [...groups.values()], hidden, focus, inside };
      }
      function layout(projection, saved = {}) {
        const byId = new Map(projection.nodes.map((n) => [n.id, { ...n }]));
        const children = /* @__PURE__ */ new Map();
        for (const n of byId.values()) {
          const p = n.external ? "external" : n.parentVisible;
          if (!children.has(p)) children.set(p, []);
          children.get(p).push(n);
        }
        const measure = (n) => {
          const kids = children.get(n.id) || [];
          if (!n.expanded || !kids.length) {
            n.w = saved[n.id]?.w || 252;
            n.h = saved[n.id]?.h || 124;
            return;
          }
          kids.forEach(measure);
          const cols2 = Math.min(2, kids.length);
          const cellW2 = Math.max(...kids.map((c) => c.w));
          let y2 = 76;
          for (let r = 0; r < Math.ceil(kids.length / cols2); r++) {
            const row = kids.slice(r * cols2, (r + 1) * cols2);
            for (let c = 0; c < row.length; c++) {
              row[c].rx = 26 + c * (cellW2 + 70);
              row[c].ry = y2;
            }
            y2 += Math.max(...row.map((c) => c.h)) + 62;
          }
          n.w = cols2 * cellW2 + (cols2 - 1) * 70 + 52;
          n.h = y2 - 30;
        };
        const roots = children.get(null) || [];
        roots.forEach(measure);
        const cols = Math.min(2, roots.length || 1);
        const cellW = Math.max(252, ...roots.map((n) => n.w));
        let y = 56;
        for (let r = 0; r < Math.ceil(roots.length / cols); r++) {
          const row = roots.slice(r * cols, (r + 1) * cols);
          row.forEach((n, c) => {
            n.rx = 60 + c * (cellW + 160);
            n.ry = y;
          });
          y += Math.max(...row.map((n) => n.h)) + 128;
        }
        const place = (n, px = 0, py = 0) => {
          n.x = saved[n.id]?.x ?? px + (n.rx || 0);
          n.y = saved[n.id]?.y ?? py + (n.ry || 0);
          for (const c of children.get(n.id) || []) place(c, n.x, n.y);
        };
        roots.forEach((n) => place(n));
        const right = Math.max(312, ...roots.map((n) => n.x + n.w));
        const external = children.get("external") || [];
        external.forEach((n, i) => {
          n.x = right + 170;
          n.y = 80 + i * 200;
          n.w = saved[n.id]?.w || 252;
          n.h = saved[n.id]?.h || 124;
        });
        return { nodes: [...byId.values()], width: Math.max(720, ...[...byId.values()].map((n) => n.x + n.w + 80)), height: Math.max(470, ...[...byId.values()].map((n) => n.y + n.h + 80)) };
      }
      function empty(name = "Untitled architecture") {
        return { schemaVersion: VERSION, name, types: [{ id: "system", name: "System", color: "#059669", shape: "rounded", fields: ["Owner", "Lifecycle"] }, { id: "component", name: "Component", color: "#6366f1", shape: "rounded", fields: ["Owner", "Technology"] }, { id: "data", name: "Data store", color: "#0284c7", shape: "database", fields: ["Classification"] }], relationshipTypes: [{ id: "depends", name: "depends on", color: "#059669", style: "solid", sourceTypes: [], targetTypes: [] }], nodes: [], edges: [], views: {} };
      }
      function projectView(model, view) {
        const dimensions = typeof module2 !== "undefined" && module2.exports ? require_dimensions() : root.ModellerDimensions;
        return dimensions.project(api, model, view);
      }
      function layoutView(model, projection, view, positions = {}) {
        const dimensions = typeof module2 !== "undefined" && module2.exports ? require_dimensions() : root.ModellerDimensions;
        return dimensions.layout(api, model, projection, view, positions);
      }
      const api = { VERSION, ICON_IDS, LIMITS, copy, id, index, path, descendants, validate, parse: parse2, reparent, removeNode, impact: impact2, project, projectView, layout, layoutView, empty };
      if (typeof module2 !== "undefined" && module2.exports) module2.exports = api;
      else root.Modeller = api;
    })(globalThis);
  }
});

// assets/js-yaml.min.js
var require_js_yaml_min = __commonJS({
  "assets/js-yaml.min.js"(exports, module2) {
    "use strict";
    !(function(e, t) {
      "object" == typeof exports && "undefined" != typeof module2 ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).jsyaml = {});
    })(exports, (function(e) {
      "use strict";
      function t(e2) {
        return null == e2;
      }
      var n = { isNothing: t, isObject: function(e2) {
        return "object" == typeof e2 && null !== e2;
      }, toArray: function(e2) {
        return Array.isArray(e2) ? e2 : t(e2) ? [] : [e2];
      }, repeat: function(e2, t2) {
        var n2, i2 = "";
        for (n2 = 0; n2 < t2; n2 += 1) i2 += e2;
        return i2;
      }, isNegativeZero: function(e2) {
        return 0 === e2 && Number.NEGATIVE_INFINITY === 1 / e2;
      }, extend: function(e2, t2) {
        var n2, i2, r2, o2;
        if (t2) for (n2 = 0, i2 = (o2 = Object.keys(t2)).length; n2 < i2; n2 += 1) e2[r2 = o2[n2]] = t2[r2];
        return e2;
      } };
      function i(e2, t2) {
        var n2 = "", i2 = e2.reason || "(unknown reason)";
        return e2.mark ? (e2.mark.name && (n2 += 'in "' + e2.mark.name + '" '), n2 += "(" + (e2.mark.line + 1) + ":" + (e2.mark.column + 1) + ")", !t2 && e2.mark.snippet && (n2 += "\n\n" + e2.mark.snippet), i2 + " " + n2) : i2;
      }
      function r(e2, t2) {
        Error.call(this), this.name = "YAMLException", this.reason = e2, this.mark = t2, this.message = i(this, false), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
      }
      r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r.prototype.toString = function(e2) {
        return this.name + ": " + i(this, e2);
      };
      var o = r;
      function a(e2, t2, n2, i2, r2) {
        var o2 = "", a2 = "", l2 = Math.floor(r2 / 2) - 1;
        return i2 - t2 > l2 && (t2 = i2 - l2 + (o2 = " ... ").length), n2 - i2 > l2 && (n2 = i2 + l2 - (a2 = " ...").length), { str: o2 + e2.slice(t2, n2).replace(/\t/g, "\u2192") + a2, pos: i2 - t2 + o2.length };
      }
      function l(e2, t2) {
        return n.repeat(" ", t2 - e2.length) + e2;
      }
      var c = function(e2, t2) {
        if (t2 = Object.create(t2 || null), !e2.buffer) return null;
        t2.maxLength || (t2.maxLength = 79), "number" != typeof t2.indent && (t2.indent = 1), "number" != typeof t2.linesBefore && (t2.linesBefore = 3), "number" != typeof t2.linesAfter && (t2.linesAfter = 2);
        for (var i2, r2 = /\r?\n|\r|\0/g, o2 = [0], c2 = [], s2 = -1; i2 = r2.exec(e2.buffer); ) c2.push(i2.index), o2.push(i2.index + i2[0].length), e2.position <= i2.index && s2 < 0 && (s2 = o2.length - 2);
        s2 < 0 && (s2 = o2.length - 1);
        var u2, p2, f2 = "", d2 = Math.min(e2.line + t2.linesAfter, c2.length).toString().length, h2 = t2.maxLength - (t2.indent + d2 + 3);
        for (u2 = 1; u2 <= t2.linesBefore && !(s2 - u2 < 0); u2++) p2 = a(e2.buffer, o2[s2 - u2], c2[s2 - u2], e2.position - (o2[s2] - o2[s2 - u2]), h2), f2 = n.repeat(" ", t2.indent) + l((e2.line - u2 + 1).toString(), d2) + " | " + p2.str + "\n" + f2;
        for (p2 = a(e2.buffer, o2[s2], c2[s2], e2.position, h2), f2 += n.repeat(" ", t2.indent) + l((e2.line + 1).toString(), d2) + " | " + p2.str + "\n", f2 += n.repeat("-", t2.indent + d2 + 3 + p2.pos) + "^\n", u2 = 1; u2 <= t2.linesAfter && !(s2 + u2 >= c2.length); u2++) p2 = a(e2.buffer, o2[s2 + u2], c2[s2 + u2], e2.position - (o2[s2] - o2[s2 + u2]), h2), f2 += n.repeat(" ", t2.indent) + l((e2.line + u2 + 1).toString(), d2) + " | " + p2.str + "\n";
        return f2.replace(/\n$/, "");
      }, s = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"], u = ["scalar", "sequence", "mapping"];
      var p = function(e2, t2) {
        if (t2 = t2 || {}, Object.keys(t2).forEach((function(t3) {
          if (-1 === s.indexOf(t3)) throw new o('Unknown option "' + t3 + '" is met in definition of "' + e2 + '" YAML type.');
        })), this.options = t2, this.tag = e2, this.kind = t2.kind || null, this.resolve = t2.resolve || function() {
          return true;
        }, this.construct = t2.construct || function(e3) {
          return e3;
        }, this.instanceOf = t2.instanceOf || null, this.predicate = t2.predicate || null, this.represent = t2.represent || null, this.representName = t2.representName || null, this.defaultStyle = t2.defaultStyle || null, this.multi = t2.multi || false, this.styleAliases = (function(e3) {
          var t3 = {};
          return null !== e3 && Object.keys(e3).forEach((function(n2) {
            e3[n2].forEach((function(e4) {
              t3[String(e4)] = n2;
            }));
          })), t3;
        })(t2.styleAliases || null), -1 === u.indexOf(this.kind)) throw new o('Unknown kind "' + this.kind + '" is specified for "' + e2 + '" YAML type.');
      };
      function f(e2, t2) {
        var n2 = [];
        return e2[t2].forEach((function(e3) {
          var t3 = n2.length;
          n2.forEach((function(n3, i2) {
            n3.tag === e3.tag && n3.kind === e3.kind && n3.multi === e3.multi && (t3 = i2);
          })), n2[t3] = e3;
        })), n2;
      }
      function d(e2) {
        return this.extend(e2);
      }
      d.prototype.extend = function(e2) {
        var t2 = [], n2 = [];
        if (e2 instanceof p) n2.push(e2);
        else if (Array.isArray(e2)) n2 = n2.concat(e2);
        else {
          if (!e2 || !Array.isArray(e2.implicit) && !Array.isArray(e2.explicit)) throw new o("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
          e2.implicit && (t2 = t2.concat(e2.implicit)), e2.explicit && (n2 = n2.concat(e2.explicit));
        }
        t2.forEach((function(e3) {
          if (!(e3 instanceof p)) throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.");
          if (e3.loadKind && "scalar" !== e3.loadKind) throw new o("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
          if (e3.multi) throw new o("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
        })), n2.forEach((function(e3) {
          if (!(e3 instanceof p)) throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.");
        }));
        var i2 = Object.create(d.prototype);
        return i2.implicit = (this.implicit || []).concat(t2), i2.explicit = (this.explicit || []).concat(n2), i2.compiledImplicit = f(i2, "implicit"), i2.compiledExplicit = f(i2, "explicit"), i2.compiledTypeMap = (function() {
          var e3, t3, n3 = { scalar: {}, sequence: {}, mapping: {}, fallback: {}, multi: { scalar: [], sequence: [], mapping: [], fallback: [] } };
          function i3(e4) {
            e4.multi ? (n3.multi[e4.kind].push(e4), n3.multi.fallback.push(e4)) : n3[e4.kind][e4.tag] = n3.fallback[e4.tag] = e4;
          }
          for (e3 = 0, t3 = arguments.length; e3 < t3; e3 += 1) arguments[e3].forEach(i3);
          return n3;
        })(i2.compiledImplicit, i2.compiledExplicit), i2;
      };
      var h = d, g = new p("tag:yaml.org,2002:str", { kind: "scalar", construct: function(e2) {
        return null !== e2 ? e2 : "";
      } }), m = new p("tag:yaml.org,2002:seq", { kind: "sequence", construct: function(e2) {
        return null !== e2 ? e2 : [];
      } }), y = new p("tag:yaml.org,2002:map", { kind: "mapping", construct: function(e2) {
        return null !== e2 ? e2 : {};
      } }), b = new h({ explicit: [g, m, y] });
      var A = new p("tag:yaml.org,2002:null", { kind: "scalar", resolve: function(e2) {
        if (null === e2) return true;
        var t2 = e2.length;
        return 1 === t2 && "~" === e2 || 4 === t2 && ("null" === e2 || "Null" === e2 || "NULL" === e2);
      }, construct: function() {
        return null;
      }, predicate: function(e2) {
        return null === e2;
      }, represent: { canonical: function() {
        return "~";
      }, lowercase: function() {
        return "null";
      }, uppercase: function() {
        return "NULL";
      }, camelcase: function() {
        return "Null";
      }, empty: function() {
        return "";
      } }, defaultStyle: "lowercase" });
      var v = new p("tag:yaml.org,2002:bool", { kind: "scalar", resolve: function(e2) {
        if (null === e2) return false;
        var t2 = e2.length;
        return 4 === t2 && ("true" === e2 || "True" === e2 || "TRUE" === e2) || 5 === t2 && ("false" === e2 || "False" === e2 || "FALSE" === e2);
      }, construct: function(e2) {
        return "true" === e2 || "True" === e2 || "TRUE" === e2;
      }, predicate: function(e2) {
        return "[object Boolean]" === Object.prototype.toString.call(e2);
      }, represent: { lowercase: function(e2) {
        return e2 ? "true" : "false";
      }, uppercase: function(e2) {
        return e2 ? "TRUE" : "FALSE";
      }, camelcase: function(e2) {
        return e2 ? "True" : "False";
      } }, defaultStyle: "lowercase" });
      function w(e2) {
        return 48 <= e2 && e2 <= 55;
      }
      function k(e2) {
        return 48 <= e2 && e2 <= 57;
      }
      var C = new p("tag:yaml.org,2002:int", { kind: "scalar", resolve: function(e2) {
        if (null === e2) return false;
        var t2, n2, i2 = e2.length, r2 = 0, o2 = false;
        if (!i2) return false;
        if ("-" !== (t2 = e2[r2]) && "+" !== t2 || (t2 = e2[++r2]), "0" === t2) {
          if (r2 + 1 === i2) return true;
          if ("b" === (t2 = e2[++r2])) {
            for (r2++; r2 < i2; r2++) if ("_" !== (t2 = e2[r2])) {
              if ("0" !== t2 && "1" !== t2) return false;
              o2 = true;
            }
            return o2 && "_" !== t2;
          }
          if ("x" === t2) {
            for (r2++; r2 < i2; r2++) if ("_" !== (t2 = e2[r2])) {
              if (!(48 <= (n2 = e2.charCodeAt(r2)) && n2 <= 57 || 65 <= n2 && n2 <= 70 || 97 <= n2 && n2 <= 102)) return false;
              o2 = true;
            }
            return o2 && "_" !== t2;
          }
          if ("o" === t2) {
            for (r2++; r2 < i2; r2++) if ("_" !== (t2 = e2[r2])) {
              if (!w(e2.charCodeAt(r2))) return false;
              o2 = true;
            }
            return o2 && "_" !== t2;
          }
        }
        if ("_" === t2) return false;
        for (; r2 < i2; r2++) if ("_" !== (t2 = e2[r2])) {
          if (!k(e2.charCodeAt(r2))) return false;
          o2 = true;
        }
        return !(!o2 || "_" === t2);
      }, construct: function(e2) {
        var t2, n2 = e2, i2 = 1;
        if (-1 !== n2.indexOf("_") && (n2 = n2.replace(/_/g, "")), "-" !== (t2 = n2[0]) && "+" !== t2 || ("-" === t2 && (i2 = -1), t2 = (n2 = n2.slice(1))[0]), "0" === n2) return 0;
        if ("0" === t2) {
          if ("b" === n2[1]) return i2 * parseInt(n2.slice(2), 2);
          if ("x" === n2[1]) return i2 * parseInt(n2.slice(2), 16);
          if ("o" === n2[1]) return i2 * parseInt(n2.slice(2), 8);
        }
        return i2 * parseInt(n2, 10);
      }, predicate: function(e2) {
        return "[object Number]" === Object.prototype.toString.call(e2) && e2 % 1 == 0 && !n.isNegativeZero(e2);
      }, represent: { binary: function(e2) {
        return e2 >= 0 ? "0b" + e2.toString(2) : "-0b" + e2.toString(2).slice(1);
      }, octal: function(e2) {
        return e2 >= 0 ? "0o" + e2.toString(8) : "-0o" + e2.toString(8).slice(1);
      }, decimal: function(e2) {
        return e2.toString(10);
      }, hexadecimal: function(e2) {
        return e2 >= 0 ? "0x" + e2.toString(16).toUpperCase() : "-0x" + e2.toString(16).toUpperCase().slice(1);
      } }, defaultStyle: "decimal", styleAliases: { binary: [2, "bin"], octal: [8, "oct"], decimal: [10, "dec"], hexadecimal: [16, "hex"] } }), x = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
      var I = /^[-+]?[0-9]+e/;
      var S = new p("tag:yaml.org,2002:float", { kind: "scalar", resolve: function(e2) {
        return null !== e2 && !(!x.test(e2) || "_" === e2[e2.length - 1]);
      }, construct: function(e2) {
        var t2, n2;
        return n2 = "-" === (t2 = e2.replace(/_/g, "").toLowerCase())[0] ? -1 : 1, "+-".indexOf(t2[0]) >= 0 && (t2 = t2.slice(1)), ".inf" === t2 ? 1 === n2 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : ".nan" === t2 ? NaN : n2 * parseFloat(t2, 10);
      }, predicate: function(e2) {
        return "[object Number]" === Object.prototype.toString.call(e2) && (e2 % 1 != 0 || n.isNegativeZero(e2));
      }, represent: function(e2, t2) {
        var i2;
        if (isNaN(e2)) switch (t2) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
        else if (Number.POSITIVE_INFINITY === e2) switch (t2) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
        else if (Number.NEGATIVE_INFINITY === e2) switch (t2) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
        else if (n.isNegativeZero(e2)) return "-0.0";
        return i2 = e2.toString(10), I.test(i2) ? i2.replace("e", ".e") : i2;
      }, defaultStyle: "lowercase" }), O = b.extend({ implicit: [A, v, C, S] }), j = O, T = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), N = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
      var F = new p("tag:yaml.org,2002:timestamp", { kind: "scalar", resolve: function(e2) {
        return null !== e2 && (null !== T.exec(e2) || null !== N.exec(e2));
      }, construct: function(e2) {
        var t2, n2, i2, r2, o2, a2, l2, c2, s2 = 0, u2 = null;
        if (null === (t2 = T.exec(e2)) && (t2 = N.exec(e2)), null === t2) throw new Error("Date resolve error");
        if (n2 = +t2[1], i2 = +t2[2] - 1, r2 = +t2[3], !t2[4]) return new Date(Date.UTC(n2, i2, r2));
        if (o2 = +t2[4], a2 = +t2[5], l2 = +t2[6], t2[7]) {
          for (s2 = t2[7].slice(0, 3); s2.length < 3; ) s2 += "0";
          s2 = +s2;
        }
        return t2[9] && (u2 = 6e4 * (60 * +t2[10] + +(t2[11] || 0)), "-" === t2[9] && (u2 = -u2)), c2 = new Date(Date.UTC(n2, i2, r2, o2, a2, l2, s2)), u2 && c2.setTime(c2.getTime() - u2), c2;
      }, instanceOf: Date, represent: function(e2) {
        return e2.toISOString();
      } });
      var E = new p("tag:yaml.org,2002:merge", { kind: "scalar", resolve: function(e2) {
        return "<<" === e2 || null === e2;
      } }), M = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
      var L = new p("tag:yaml.org,2002:binary", { kind: "scalar", resolve: function(e2) {
        if (null === e2) return false;
        var t2, n2, i2 = 0, r2 = e2.length, o2 = M;
        for (n2 = 0; n2 < r2; n2++) if (!((t2 = o2.indexOf(e2.charAt(n2))) > 64)) {
          if (t2 < 0) return false;
          i2 += 6;
        }
        return i2 % 8 == 0;
      }, construct: function(e2) {
        var t2, n2, i2 = e2.replace(/[\r\n=]/g, ""), r2 = i2.length, o2 = M, a2 = 0, l2 = [];
        for (t2 = 0; t2 < r2; t2++) t2 % 4 == 0 && t2 && (l2.push(a2 >> 16 & 255), l2.push(a2 >> 8 & 255), l2.push(255 & a2)), a2 = a2 << 6 | o2.indexOf(i2.charAt(t2));
        return 0 === (n2 = r2 % 4 * 6) ? (l2.push(a2 >> 16 & 255), l2.push(a2 >> 8 & 255), l2.push(255 & a2)) : 18 === n2 ? (l2.push(a2 >> 10 & 255), l2.push(a2 >> 2 & 255)) : 12 === n2 && l2.push(a2 >> 4 & 255), new Uint8Array(l2);
      }, predicate: function(e2) {
        return "[object Uint8Array]" === Object.prototype.toString.call(e2);
      }, represent: function(e2) {
        var t2, n2, i2 = "", r2 = 0, o2 = e2.length, a2 = M;
        for (t2 = 0; t2 < o2; t2++) t2 % 3 == 0 && t2 && (i2 += a2[r2 >> 18 & 63], i2 += a2[r2 >> 12 & 63], i2 += a2[r2 >> 6 & 63], i2 += a2[63 & r2]), r2 = (r2 << 8) + e2[t2];
        return 0 === (n2 = o2 % 3) ? (i2 += a2[r2 >> 18 & 63], i2 += a2[r2 >> 12 & 63], i2 += a2[r2 >> 6 & 63], i2 += a2[63 & r2]) : 2 === n2 ? (i2 += a2[r2 >> 10 & 63], i2 += a2[r2 >> 4 & 63], i2 += a2[r2 << 2 & 63], i2 += a2[64]) : 1 === n2 && (i2 += a2[r2 >> 2 & 63], i2 += a2[r2 << 4 & 63], i2 += a2[64], i2 += a2[64]), i2;
      } }), _ = Object.prototype.hasOwnProperty, D = Object.prototype.toString;
      var U = new p("tag:yaml.org,2002:omap", { kind: "sequence", resolve: function(e2) {
        if (null === e2) return true;
        var t2, n2, i2, r2, o2, a2 = [], l2 = e2;
        for (t2 = 0, n2 = l2.length; t2 < n2; t2 += 1) {
          if (i2 = l2[t2], o2 = false, "[object Object]" !== D.call(i2)) return false;
          for (r2 in i2) if (_.call(i2, r2)) {
            if (o2) return false;
            o2 = true;
          }
          if (!o2) return false;
          if (-1 !== a2.indexOf(r2)) return false;
          a2.push(r2);
        }
        return true;
      }, construct: function(e2) {
        return null !== e2 ? e2 : [];
      } }), q = Object.prototype.toString;
      var Y = new p("tag:yaml.org,2002:pairs", { kind: "sequence", resolve: function(e2) {
        if (null === e2) return true;
        var t2, n2, i2, r2, o2, a2 = e2;
        for (o2 = new Array(a2.length), t2 = 0, n2 = a2.length; t2 < n2; t2 += 1) {
          if (i2 = a2[t2], "[object Object]" !== q.call(i2)) return false;
          if (1 !== (r2 = Object.keys(i2)).length) return false;
          o2[t2] = [r2[0], i2[r2[0]]];
        }
        return true;
      }, construct: function(e2) {
        if (null === e2) return [];
        var t2, n2, i2, r2, o2, a2 = e2;
        for (o2 = new Array(a2.length), t2 = 0, n2 = a2.length; t2 < n2; t2 += 1) i2 = a2[t2], r2 = Object.keys(i2), o2[t2] = [r2[0], i2[r2[0]]];
        return o2;
      } }), R = Object.prototype.hasOwnProperty;
      var B = new p("tag:yaml.org,2002:set", { kind: "mapping", resolve: function(e2) {
        if (null === e2) return true;
        var t2, n2 = e2;
        for (t2 in n2) if (R.call(n2, t2) && null !== n2[t2]) return false;
        return true;
      }, construct: function(e2) {
        return null !== e2 ? e2 : {};
      } }), K = j.extend({ implicit: [F, E], explicit: [L, U, Y, B] }), P = Object.prototype.hasOwnProperty, W = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, H = /[\x85\u2028\u2029]/, $ = /[,\[\]\{\}]/, G = /^(?:!|!!|![a-z\-]+!)$/i, V = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
      function Z(e2) {
        return Object.prototype.toString.call(e2);
      }
      function J(e2) {
        return 10 === e2 || 13 === e2;
      }
      function Q(e2) {
        return 9 === e2 || 32 === e2;
      }
      function z(e2) {
        return 9 === e2 || 32 === e2 || 10 === e2 || 13 === e2;
      }
      function X(e2) {
        return 44 === e2 || 91 === e2 || 93 === e2 || 123 === e2 || 125 === e2;
      }
      function ee(e2) {
        var t2;
        return 48 <= e2 && e2 <= 57 ? e2 - 48 : 97 <= (t2 = 32 | e2) && t2 <= 102 ? t2 - 97 + 10 : -1;
      }
      function te(e2) {
        return 48 === e2 ? "\0" : 97 === e2 ? "\x07" : 98 === e2 ? "\b" : 116 === e2 || 9 === e2 ? "	" : 110 === e2 ? "\n" : 118 === e2 ? "\v" : 102 === e2 ? "\f" : 114 === e2 ? "\r" : 101 === e2 ? "\x1B" : 32 === e2 ? " " : 34 === e2 ? '"' : 47 === e2 ? "/" : 92 === e2 ? "\\" : 78 === e2 ? "\x85" : 95 === e2 ? "\xA0" : 76 === e2 ? "\u2028" : 80 === e2 ? "\u2029" : "";
      }
      function ne(e2) {
        return e2 <= 65535 ? String.fromCharCode(e2) : String.fromCharCode(55296 + (e2 - 65536 >> 10), 56320 + (e2 - 65536 & 1023));
      }
      for (var ie = new Array(256), re = new Array(256), oe = 0; oe < 256; oe++) ie[oe] = te(oe) ? 1 : 0, re[oe] = te(oe);
      function ae(e2, t2) {
        this.input = e2, this.filename = t2.filename || null, this.schema = t2.schema || K, this.onWarning = t2.onWarning || null, this.legacy = t2.legacy || false, this.json = t2.json || false, this.listener = t2.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e2.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
      }
      function le(e2, t2) {
        var n2 = { name: e2.filename, buffer: e2.input.slice(0, -1), position: e2.position, line: e2.line, column: e2.position - e2.lineStart };
        return n2.snippet = c(n2), new o(t2, n2);
      }
      function ce(e2, t2) {
        throw le(e2, t2);
      }
      function se(e2, t2) {
        e2.onWarning && e2.onWarning.call(null, le(e2, t2));
      }
      var ue = { YAML: function(e2, t2, n2) {
        var i2, r2, o2;
        null !== e2.version && ce(e2, "duplication of %YAML directive"), 1 !== n2.length && ce(e2, "YAML directive accepts exactly one argument"), null === (i2 = /^([0-9]+)\.([0-9]+)$/.exec(n2[0])) && ce(e2, "ill-formed argument of the YAML directive"), r2 = parseInt(i2[1], 10), o2 = parseInt(i2[2], 10), 1 !== r2 && ce(e2, "unacceptable YAML version of the document"), e2.version = n2[0], e2.checkLineBreaks = o2 < 2, 1 !== o2 && 2 !== o2 && se(e2, "unsupported YAML version of the document");
      }, TAG: function(e2, t2, n2) {
        var i2, r2;
        2 !== n2.length && ce(e2, "TAG directive accepts exactly two arguments"), i2 = n2[0], r2 = n2[1], G.test(i2) || ce(e2, "ill-formed tag handle (first argument) of the TAG directive"), P.call(e2.tagMap, i2) && ce(e2, 'there is a previously declared suffix for "' + i2 + '" tag handle'), V.test(r2) || ce(e2, "ill-formed tag prefix (second argument) of the TAG directive");
        try {
          r2 = decodeURIComponent(r2);
        } catch (t3) {
          ce(e2, "tag prefix is malformed: " + r2);
        }
        e2.tagMap[i2] = r2;
      } };
      function pe(e2, t2, n2, i2) {
        var r2, o2, a2, l2;
        if (t2 < n2) {
          if (l2 = e2.input.slice(t2, n2), i2) for (r2 = 0, o2 = l2.length; r2 < o2; r2 += 1) 9 === (a2 = l2.charCodeAt(r2)) || 32 <= a2 && a2 <= 1114111 || ce(e2, "expected valid JSON character");
          else W.test(l2) && ce(e2, "the stream contains non-printable characters");
          e2.result += l2;
        }
      }
      function fe(e2, t2, i2, r2) {
        var o2, a2, l2, c2;
        for (n.isObject(i2) || ce(e2, "cannot merge mappings; the provided source object is unacceptable"), l2 = 0, c2 = (o2 = Object.keys(i2)).length; l2 < c2; l2 += 1) a2 = o2[l2], P.call(t2, a2) || (t2[a2] = i2[a2], r2[a2] = true);
      }
      function de(e2, t2, n2, i2, r2, o2, a2, l2, c2) {
        var s2, u2;
        if (Array.isArray(r2)) for (s2 = 0, u2 = (r2 = Array.prototype.slice.call(r2)).length; s2 < u2; s2 += 1) Array.isArray(r2[s2]) && ce(e2, "nested arrays are not supported inside keys"), "object" == typeof r2 && "[object Object]" === Z(r2[s2]) && (r2[s2] = "[object Object]");
        if ("object" == typeof r2 && "[object Object]" === Z(r2) && (r2 = "[object Object]"), r2 = String(r2), null === t2 && (t2 = {}), "tag:yaml.org,2002:merge" === i2) if (Array.isArray(o2)) for (s2 = 0, u2 = o2.length; s2 < u2; s2 += 1) fe(e2, t2, o2[s2], n2);
        else fe(e2, t2, o2, n2);
        else e2.json || P.call(n2, r2) || !P.call(t2, r2) || (e2.line = a2 || e2.line, e2.lineStart = l2 || e2.lineStart, e2.position = c2 || e2.position, ce(e2, "duplicated mapping key")), "__proto__" === r2 ? Object.defineProperty(t2, r2, { configurable: true, enumerable: true, writable: true, value: o2 }) : t2[r2] = o2, delete n2[r2];
        return t2;
      }
      function he(e2) {
        var t2;
        10 === (t2 = e2.input.charCodeAt(e2.position)) ? e2.position++ : 13 === t2 ? (e2.position++, 10 === e2.input.charCodeAt(e2.position) && e2.position++) : ce(e2, "a line break is expected"), e2.line += 1, e2.lineStart = e2.position, e2.firstTabInLine = -1;
      }
      function ge(e2, t2, n2) {
        for (var i2 = 0, r2 = e2.input.charCodeAt(e2.position); 0 !== r2; ) {
          for (; Q(r2); ) 9 === r2 && -1 === e2.firstTabInLine && (e2.firstTabInLine = e2.position), r2 = e2.input.charCodeAt(++e2.position);
          if (t2 && 35 === r2) do {
            r2 = e2.input.charCodeAt(++e2.position);
          } while (10 !== r2 && 13 !== r2 && 0 !== r2);
          if (!J(r2)) break;
          for (he(e2), r2 = e2.input.charCodeAt(e2.position), i2++, e2.lineIndent = 0; 32 === r2; ) e2.lineIndent++, r2 = e2.input.charCodeAt(++e2.position);
        }
        return -1 !== n2 && 0 !== i2 && e2.lineIndent < n2 && se(e2, "deficient indentation"), i2;
      }
      function me(e2) {
        var t2, n2 = e2.position;
        return !(45 !== (t2 = e2.input.charCodeAt(n2)) && 46 !== t2 || t2 !== e2.input.charCodeAt(n2 + 1) || t2 !== e2.input.charCodeAt(n2 + 2) || (n2 += 3, 0 !== (t2 = e2.input.charCodeAt(n2)) && !z(t2)));
      }
      function ye(e2, t2) {
        1 === t2 ? e2.result += " " : t2 > 1 && (e2.result += n.repeat("\n", t2 - 1));
      }
      function be(e2, t2) {
        var n2, i2, r2 = e2.tag, o2 = e2.anchor, a2 = [], l2 = false;
        if (-1 !== e2.firstTabInLine) return false;
        for (null !== e2.anchor && (e2.anchorMap[e2.anchor] = a2), i2 = e2.input.charCodeAt(e2.position); 0 !== i2 && (-1 !== e2.firstTabInLine && (e2.position = e2.firstTabInLine, ce(e2, "tab characters must not be used in indentation")), 45 === i2) && z(e2.input.charCodeAt(e2.position + 1)); ) if (l2 = true, e2.position++, ge(e2, true, -1) && e2.lineIndent <= t2) a2.push(null), i2 = e2.input.charCodeAt(e2.position);
        else if (n2 = e2.line, we(e2, t2, 3, false, true), a2.push(e2.result), ge(e2, true, -1), i2 = e2.input.charCodeAt(e2.position), (e2.line === n2 || e2.lineIndent > t2) && 0 !== i2) ce(e2, "bad indentation of a sequence entry");
        else if (e2.lineIndent < t2) break;
        return !!l2 && (e2.tag = r2, e2.anchor = o2, e2.kind = "sequence", e2.result = a2, true);
      }
      function Ae(e2) {
        var t2, n2, i2, r2, o2 = false, a2 = false;
        if (33 !== (r2 = e2.input.charCodeAt(e2.position))) return false;
        if (null !== e2.tag && ce(e2, "duplication of a tag property"), 60 === (r2 = e2.input.charCodeAt(++e2.position)) ? (o2 = true, r2 = e2.input.charCodeAt(++e2.position)) : 33 === r2 ? (a2 = true, n2 = "!!", r2 = e2.input.charCodeAt(++e2.position)) : n2 = "!", t2 = e2.position, o2) {
          do {
            r2 = e2.input.charCodeAt(++e2.position);
          } while (0 !== r2 && 62 !== r2);
          e2.position < e2.length ? (i2 = e2.input.slice(t2, e2.position), r2 = e2.input.charCodeAt(++e2.position)) : ce(e2, "unexpected end of the stream within a verbatim tag");
        } else {
          for (; 0 !== r2 && !z(r2); ) 33 === r2 && (a2 ? ce(e2, "tag suffix cannot contain exclamation marks") : (n2 = e2.input.slice(t2 - 1, e2.position + 1), G.test(n2) || ce(e2, "named tag handle cannot contain such characters"), a2 = true, t2 = e2.position + 1)), r2 = e2.input.charCodeAt(++e2.position);
          i2 = e2.input.slice(t2, e2.position), $.test(i2) && ce(e2, "tag suffix cannot contain flow indicator characters");
        }
        i2 && !V.test(i2) && ce(e2, "tag name cannot contain such characters: " + i2);
        try {
          i2 = decodeURIComponent(i2);
        } catch (t3) {
          ce(e2, "tag name is malformed: " + i2);
        }
        return o2 ? e2.tag = i2 : P.call(e2.tagMap, n2) ? e2.tag = e2.tagMap[n2] + i2 : "!" === n2 ? e2.tag = "!" + i2 : "!!" === n2 ? e2.tag = "tag:yaml.org,2002:" + i2 : ce(e2, 'undeclared tag handle "' + n2 + '"'), true;
      }
      function ve(e2) {
        var t2, n2;
        if (38 !== (n2 = e2.input.charCodeAt(e2.position))) return false;
        for (null !== e2.anchor && ce(e2, "duplication of an anchor property"), n2 = e2.input.charCodeAt(++e2.position), t2 = e2.position; 0 !== n2 && !z(n2) && !X(n2); ) n2 = e2.input.charCodeAt(++e2.position);
        return e2.position === t2 && ce(e2, "name of an anchor node must contain at least one character"), e2.anchor = e2.input.slice(t2, e2.position), true;
      }
      function we(e2, t2, i2, r2, o2) {
        var a2, l2, c2, s2, u2, p2, f2, d2, h2, g2 = 1, m2 = false, y2 = false;
        if (null !== e2.listener && e2.listener("open", e2), e2.tag = null, e2.anchor = null, e2.kind = null, e2.result = null, a2 = l2 = c2 = 4 === i2 || 3 === i2, r2 && ge(e2, true, -1) && (m2 = true, e2.lineIndent > t2 ? g2 = 1 : e2.lineIndent === t2 ? g2 = 0 : e2.lineIndent < t2 && (g2 = -1)), 1 === g2) for (; Ae(e2) || ve(e2); ) ge(e2, true, -1) ? (m2 = true, c2 = a2, e2.lineIndent > t2 ? g2 = 1 : e2.lineIndent === t2 ? g2 = 0 : e2.lineIndent < t2 && (g2 = -1)) : c2 = false;
        if (c2 && (c2 = m2 || o2), 1 !== g2 && 4 !== i2 || (d2 = 1 === i2 || 2 === i2 ? t2 : t2 + 1, h2 = e2.position - e2.lineStart, 1 === g2 ? c2 && (be(e2, h2) || (function(e3, t3, n2) {
          var i3, r3, o3, a3, l3, c3, s3, u3 = e3.tag, p3 = e3.anchor, f3 = {}, d3 = /* @__PURE__ */ Object.create(null), h3 = null, g3 = null, m3 = null, y3 = false, b2 = false;
          if (-1 !== e3.firstTabInLine) return false;
          for (null !== e3.anchor && (e3.anchorMap[e3.anchor] = f3), s3 = e3.input.charCodeAt(e3.position); 0 !== s3; ) {
            if (y3 || -1 === e3.firstTabInLine || (e3.position = e3.firstTabInLine, ce(e3, "tab characters must not be used in indentation")), i3 = e3.input.charCodeAt(e3.position + 1), o3 = e3.line, 63 !== s3 && 58 !== s3 || !z(i3)) {
              if (a3 = e3.line, l3 = e3.lineStart, c3 = e3.position, !we(e3, n2, 2, false, true)) break;
              if (e3.line === o3) {
                for (s3 = e3.input.charCodeAt(e3.position); Q(s3); ) s3 = e3.input.charCodeAt(++e3.position);
                if (58 === s3) z(s3 = e3.input.charCodeAt(++e3.position)) || ce(e3, "a whitespace character is expected after the key-value separator within a block mapping"), y3 && (de(e3, f3, d3, h3, g3, null, a3, l3, c3), h3 = g3 = m3 = null), b2 = true, y3 = false, r3 = false, h3 = e3.tag, g3 = e3.result;
                else {
                  if (!b2) return e3.tag = u3, e3.anchor = p3, true;
                  ce(e3, "can not read an implicit mapping pair; a colon is missed");
                }
              } else {
                if (!b2) return e3.tag = u3, e3.anchor = p3, true;
                ce(e3, "can not read a block mapping entry; a multiline key may not be an implicit key");
              }
            } else 63 === s3 ? (y3 && (de(e3, f3, d3, h3, g3, null, a3, l3, c3), h3 = g3 = m3 = null), b2 = true, y3 = true, r3 = true) : y3 ? (y3 = false, r3 = true) : ce(e3, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e3.position += 1, s3 = i3;
            if ((e3.line === o3 || e3.lineIndent > t3) && (y3 && (a3 = e3.line, l3 = e3.lineStart, c3 = e3.position), we(e3, t3, 4, true, r3) && (y3 ? g3 = e3.result : m3 = e3.result), y3 || (de(e3, f3, d3, h3, g3, m3, a3, l3, c3), h3 = g3 = m3 = null), ge(e3, true, -1), s3 = e3.input.charCodeAt(e3.position)), (e3.line === o3 || e3.lineIndent > t3) && 0 !== s3) ce(e3, "bad indentation of a mapping entry");
            else if (e3.lineIndent < t3) break;
          }
          return y3 && de(e3, f3, d3, h3, g3, null, a3, l3, c3), b2 && (e3.tag = u3, e3.anchor = p3, e3.kind = "mapping", e3.result = f3), b2;
        })(e2, h2, d2)) || (function(e3, t3) {
          var n2, i3, r3, o3, a3, l3, c3, s3, u3, p3, f3, d3, h3 = true, g3 = e3.tag, m3 = e3.anchor, y3 = /* @__PURE__ */ Object.create(null);
          if (91 === (d3 = e3.input.charCodeAt(e3.position))) a3 = 93, s3 = false, o3 = [];
          else {
            if (123 !== d3) return false;
            a3 = 125, s3 = true, o3 = {};
          }
          for (null !== e3.anchor && (e3.anchorMap[e3.anchor] = o3), d3 = e3.input.charCodeAt(++e3.position); 0 !== d3; ) {
            if (ge(e3, true, t3), (d3 = e3.input.charCodeAt(e3.position)) === a3) return e3.position++, e3.tag = g3, e3.anchor = m3, e3.kind = s3 ? "mapping" : "sequence", e3.result = o3, true;
            h3 ? 44 === d3 && ce(e3, "expected the node content, but found ','") : ce(e3, "missed comma between flow collection entries"), f3 = null, l3 = c3 = false, 63 === d3 && z(e3.input.charCodeAt(e3.position + 1)) && (l3 = c3 = true, e3.position++, ge(e3, true, t3)), n2 = e3.line, i3 = e3.lineStart, r3 = e3.position, we(e3, t3, 1, false, true), p3 = e3.tag, u3 = e3.result, ge(e3, true, t3), d3 = e3.input.charCodeAt(e3.position), !c3 && e3.line !== n2 || 58 !== d3 || (l3 = true, d3 = e3.input.charCodeAt(++e3.position), ge(e3, true, t3), we(e3, t3, 1, false, true), f3 = e3.result), s3 ? de(e3, o3, y3, p3, u3, f3, n2, i3, r3) : l3 ? o3.push(de(e3, null, y3, p3, u3, f3, n2, i3, r3)) : o3.push(u3), ge(e3, true, t3), 44 === (d3 = e3.input.charCodeAt(e3.position)) ? (h3 = true, d3 = e3.input.charCodeAt(++e3.position)) : h3 = false;
          }
          ce(e3, "unexpected end of the stream within a flow collection");
        })(e2, d2) ? y2 = true : (l2 && (function(e3, t3) {
          var i3, r3, o3, a3, l3, c3 = 1, s3 = false, u3 = false, p3 = t3, f3 = 0, d3 = false;
          if (124 === (a3 = e3.input.charCodeAt(e3.position))) r3 = false;
          else {
            if (62 !== a3) return false;
            r3 = true;
          }
          for (e3.kind = "scalar", e3.result = ""; 0 !== a3; ) if (43 === (a3 = e3.input.charCodeAt(++e3.position)) || 45 === a3) 1 === c3 ? c3 = 43 === a3 ? 3 : 2 : ce(e3, "repeat of a chomping mode identifier");
          else {
            if (!((o3 = 48 <= (l3 = a3) && l3 <= 57 ? l3 - 48 : -1) >= 0)) break;
            0 === o3 ? ce(e3, "bad explicit indentation width of a block scalar; it cannot be less than one") : u3 ? ce(e3, "repeat of an indentation width identifier") : (p3 = t3 + o3 - 1, u3 = true);
          }
          if (Q(a3)) {
            do {
              a3 = e3.input.charCodeAt(++e3.position);
            } while (Q(a3));
            if (35 === a3) do {
              a3 = e3.input.charCodeAt(++e3.position);
            } while (!J(a3) && 0 !== a3);
          }
          for (; 0 !== a3; ) {
            for (he(e3), e3.lineIndent = 0, a3 = e3.input.charCodeAt(e3.position); (!u3 || e3.lineIndent < p3) && 32 === a3; ) e3.lineIndent++, a3 = e3.input.charCodeAt(++e3.position);
            if (!u3 && e3.lineIndent > p3 && (p3 = e3.lineIndent), J(a3)) f3++;
            else {
              if (e3.lineIndent < p3) {
                3 === c3 ? e3.result += n.repeat("\n", s3 ? 1 + f3 : f3) : 1 === c3 && s3 && (e3.result += "\n");
                break;
              }
              for (r3 ? Q(a3) ? (d3 = true, e3.result += n.repeat("\n", s3 ? 1 + f3 : f3)) : d3 ? (d3 = false, e3.result += n.repeat("\n", f3 + 1)) : 0 === f3 ? s3 && (e3.result += " ") : e3.result += n.repeat("\n", f3) : e3.result += n.repeat("\n", s3 ? 1 + f3 : f3), s3 = true, u3 = true, f3 = 0, i3 = e3.position; !J(a3) && 0 !== a3; ) a3 = e3.input.charCodeAt(++e3.position);
              pe(e3, i3, e3.position, false);
            }
          }
          return true;
        })(e2, d2) || (function(e3, t3) {
          var n2, i3, r3;
          if (39 !== (n2 = e3.input.charCodeAt(e3.position))) return false;
          for (e3.kind = "scalar", e3.result = "", e3.position++, i3 = r3 = e3.position; 0 !== (n2 = e3.input.charCodeAt(e3.position)); ) if (39 === n2) {
            if (pe(e3, i3, e3.position, true), 39 !== (n2 = e3.input.charCodeAt(++e3.position))) return true;
            i3 = e3.position, e3.position++, r3 = e3.position;
          } else J(n2) ? (pe(e3, i3, r3, true), ye(e3, ge(e3, false, t3)), i3 = r3 = e3.position) : e3.position === e3.lineStart && me(e3) ? ce(e3, "unexpected end of the document within a single quoted scalar") : (e3.position++, r3 = e3.position);
          ce(e3, "unexpected end of the stream within a single quoted scalar");
        })(e2, d2) || (function(e3, t3) {
          var n2, i3, r3, o3, a3, l3, c3;
          if (34 !== (l3 = e3.input.charCodeAt(e3.position))) return false;
          for (e3.kind = "scalar", e3.result = "", e3.position++, n2 = i3 = e3.position; 0 !== (l3 = e3.input.charCodeAt(e3.position)); ) {
            if (34 === l3) return pe(e3, n2, e3.position, true), e3.position++, true;
            if (92 === l3) {
              if (pe(e3, n2, e3.position, true), J(l3 = e3.input.charCodeAt(++e3.position))) ge(e3, false, t3);
              else if (l3 < 256 && ie[l3]) e3.result += re[l3], e3.position++;
              else if ((a3 = 120 === (c3 = l3) ? 2 : 117 === c3 ? 4 : 85 === c3 ? 8 : 0) > 0) {
                for (r3 = a3, o3 = 0; r3 > 0; r3--) (a3 = ee(l3 = e3.input.charCodeAt(++e3.position))) >= 0 ? o3 = (o3 << 4) + a3 : ce(e3, "expected hexadecimal character");
                e3.result += ne(o3), e3.position++;
              } else ce(e3, "unknown escape sequence");
              n2 = i3 = e3.position;
            } else J(l3) ? (pe(e3, n2, i3, true), ye(e3, ge(e3, false, t3)), n2 = i3 = e3.position) : e3.position === e3.lineStart && me(e3) ? ce(e3, "unexpected end of the document within a double quoted scalar") : (e3.position++, i3 = e3.position);
          }
          ce(e3, "unexpected end of the stream within a double quoted scalar");
        })(e2, d2) ? y2 = true : !(function(e3) {
          var t3, n2, i3;
          if (42 !== (i3 = e3.input.charCodeAt(e3.position))) return false;
          for (i3 = e3.input.charCodeAt(++e3.position), t3 = e3.position; 0 !== i3 && !z(i3) && !X(i3); ) i3 = e3.input.charCodeAt(++e3.position);
          return e3.position === t3 && ce(e3, "name of an alias node must contain at least one character"), n2 = e3.input.slice(t3, e3.position), P.call(e3.anchorMap, n2) || ce(e3, 'unidentified alias "' + n2 + '"'), e3.result = e3.anchorMap[n2], ge(e3, true, -1), true;
        })(e2) ? (function(e3, t3, n2) {
          var i3, r3, o3, a3, l3, c3, s3, u3, p3 = e3.kind, f3 = e3.result;
          if (z(u3 = e3.input.charCodeAt(e3.position)) || X(u3) || 35 === u3 || 38 === u3 || 42 === u3 || 33 === u3 || 124 === u3 || 62 === u3 || 39 === u3 || 34 === u3 || 37 === u3 || 64 === u3 || 96 === u3) return false;
          if ((63 === u3 || 45 === u3) && (z(i3 = e3.input.charCodeAt(e3.position + 1)) || n2 && X(i3))) return false;
          for (e3.kind = "scalar", e3.result = "", r3 = o3 = e3.position, a3 = false; 0 !== u3; ) {
            if (58 === u3) {
              if (z(i3 = e3.input.charCodeAt(e3.position + 1)) || n2 && X(i3)) break;
            } else if (35 === u3) {
              if (z(e3.input.charCodeAt(e3.position - 1))) break;
            } else {
              if (e3.position === e3.lineStart && me(e3) || n2 && X(u3)) break;
              if (J(u3)) {
                if (l3 = e3.line, c3 = e3.lineStart, s3 = e3.lineIndent, ge(e3, false, -1), e3.lineIndent >= t3) {
                  a3 = true, u3 = e3.input.charCodeAt(e3.position);
                  continue;
                }
                e3.position = o3, e3.line = l3, e3.lineStart = c3, e3.lineIndent = s3;
                break;
              }
            }
            a3 && (pe(e3, r3, o3, false), ye(e3, e3.line - l3), r3 = o3 = e3.position, a3 = false), Q(u3) || (o3 = e3.position + 1), u3 = e3.input.charCodeAt(++e3.position);
          }
          return pe(e3, r3, o3, false), !!e3.result || (e3.kind = p3, e3.result = f3, false);
        })(e2, d2, 1 === i2) && (y2 = true, null === e2.tag && (e2.tag = "?")) : (y2 = true, null === e2.tag && null === e2.anchor || ce(e2, "alias node should not have any properties")), null !== e2.anchor && (e2.anchorMap[e2.anchor] = e2.result)) : 0 === g2 && (y2 = c2 && be(e2, h2))), null === e2.tag) null !== e2.anchor && (e2.anchorMap[e2.anchor] = e2.result);
        else if ("?" === e2.tag) {
          for (null !== e2.result && "scalar" !== e2.kind && ce(e2, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e2.kind + '"'), s2 = 0, u2 = e2.implicitTypes.length; s2 < u2; s2 += 1) if ((f2 = e2.implicitTypes[s2]).resolve(e2.result)) {
            e2.result = f2.construct(e2.result), e2.tag = f2.tag, null !== e2.anchor && (e2.anchorMap[e2.anchor] = e2.result);
            break;
          }
        } else if ("!" !== e2.tag) {
          if (P.call(e2.typeMap[e2.kind || "fallback"], e2.tag)) f2 = e2.typeMap[e2.kind || "fallback"][e2.tag];
          else for (f2 = null, s2 = 0, u2 = (p2 = e2.typeMap.multi[e2.kind || "fallback"]).length; s2 < u2; s2 += 1) if (e2.tag.slice(0, p2[s2].tag.length) === p2[s2].tag) {
            f2 = p2[s2];
            break;
          }
          f2 || ce(e2, "unknown tag !<" + e2.tag + ">"), null !== e2.result && f2.kind !== e2.kind && ce(e2, "unacceptable node kind for !<" + e2.tag + '> tag; it should be "' + f2.kind + '", not "' + e2.kind + '"'), f2.resolve(e2.result, e2.tag) ? (e2.result = f2.construct(e2.result, e2.tag), null !== e2.anchor && (e2.anchorMap[e2.anchor] = e2.result)) : ce(e2, "cannot resolve a node with !<" + e2.tag + "> explicit tag");
        }
        return null !== e2.listener && e2.listener("close", e2), null !== e2.tag || null !== e2.anchor || y2;
      }
      function ke(e2) {
        var t2, n2, i2, r2, o2 = e2.position, a2 = false;
        for (e2.version = null, e2.checkLineBreaks = e2.legacy, e2.tagMap = /* @__PURE__ */ Object.create(null), e2.anchorMap = /* @__PURE__ */ Object.create(null); 0 !== (r2 = e2.input.charCodeAt(e2.position)) && (ge(e2, true, -1), r2 = e2.input.charCodeAt(e2.position), !(e2.lineIndent > 0 || 37 !== r2)); ) {
          for (a2 = true, r2 = e2.input.charCodeAt(++e2.position), t2 = e2.position; 0 !== r2 && !z(r2); ) r2 = e2.input.charCodeAt(++e2.position);
          for (i2 = [], (n2 = e2.input.slice(t2, e2.position)).length < 1 && ce(e2, "directive name must not be less than one character in length"); 0 !== r2; ) {
            for (; Q(r2); ) r2 = e2.input.charCodeAt(++e2.position);
            if (35 === r2) {
              do {
                r2 = e2.input.charCodeAt(++e2.position);
              } while (0 !== r2 && !J(r2));
              break;
            }
            if (J(r2)) break;
            for (t2 = e2.position; 0 !== r2 && !z(r2); ) r2 = e2.input.charCodeAt(++e2.position);
            i2.push(e2.input.slice(t2, e2.position));
          }
          0 !== r2 && he(e2), P.call(ue, n2) ? ue[n2](e2, n2, i2) : se(e2, 'unknown document directive "' + n2 + '"');
        }
        ge(e2, true, -1), 0 === e2.lineIndent && 45 === e2.input.charCodeAt(e2.position) && 45 === e2.input.charCodeAt(e2.position + 1) && 45 === e2.input.charCodeAt(e2.position + 2) ? (e2.position += 3, ge(e2, true, -1)) : a2 && ce(e2, "directives end mark is expected"), we(e2, e2.lineIndent - 1, 4, false, true), ge(e2, true, -1), e2.checkLineBreaks && H.test(e2.input.slice(o2, e2.position)) && se(e2, "non-ASCII line breaks are interpreted as content"), e2.documents.push(e2.result), e2.position === e2.lineStart && me(e2) ? 46 === e2.input.charCodeAt(e2.position) && (e2.position += 3, ge(e2, true, -1)) : e2.position < e2.length - 1 && ce(e2, "end of the stream or a document separator is expected");
      }
      function Ce(e2, t2) {
        t2 = t2 || {}, 0 !== (e2 = String(e2)).length && (10 !== e2.charCodeAt(e2.length - 1) && 13 !== e2.charCodeAt(e2.length - 1) && (e2 += "\n"), 65279 === e2.charCodeAt(0) && (e2 = e2.slice(1)));
        var n2 = new ae(e2, t2), i2 = e2.indexOf("\0");
        for (-1 !== i2 && (n2.position = i2, ce(n2, "null byte is not allowed in input")), n2.input += "\0"; 32 === n2.input.charCodeAt(n2.position); ) n2.lineIndent += 1, n2.position += 1;
        for (; n2.position < n2.length - 1; ) ke(n2);
        return n2.documents;
      }
      var xe = { loadAll: function(e2, t2, n2) {
        null !== t2 && "object" == typeof t2 && void 0 === n2 && (n2 = t2, t2 = null);
        var i2 = Ce(e2, n2);
        if ("function" != typeof t2) return i2;
        for (var r2 = 0, o2 = i2.length; r2 < o2; r2 += 1) t2(i2[r2]);
      }, load: function(e2, t2) {
        var n2 = Ce(e2, t2);
        if (0 !== n2.length) {
          if (1 === n2.length) return n2[0];
          throw new o("expected a single document in the stream, but found more");
        }
      } }, Ie = Object.prototype.toString, Se = Object.prototype.hasOwnProperty, Oe = 65279, je = { 0: "\\0", 7: "\\a", 8: "\\b", 9: "\\t", 10: "\\n", 11: "\\v", 12: "\\f", 13: "\\r", 27: "\\e", 34: '\\"', 92: "\\\\", 133: "\\N", 160: "\\_", 8232: "\\L", 8233: "\\P" }, Te = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"], Ne = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
      function Fe(e2) {
        var t2, i2, r2;
        if (t2 = e2.toString(16).toUpperCase(), e2 <= 255) i2 = "x", r2 = 2;
        else if (e2 <= 65535) i2 = "u", r2 = 4;
        else {
          if (!(e2 <= 4294967295)) throw new o("code point within a string may not be greater than 0xFFFFFFFF");
          i2 = "U", r2 = 8;
        }
        return "\\" + i2 + n.repeat("0", r2 - t2.length) + t2;
      }
      function Ee(e2) {
        this.schema = e2.schema || K, this.indent = Math.max(1, e2.indent || 2), this.noArrayIndent = e2.noArrayIndent || false, this.skipInvalid = e2.skipInvalid || false, this.flowLevel = n.isNothing(e2.flowLevel) ? -1 : e2.flowLevel, this.styleMap = (function(e3, t2) {
          var n2, i2, r2, o2, a2, l2, c2;
          if (null === t2) return {};
          for (n2 = {}, r2 = 0, o2 = (i2 = Object.keys(t2)).length; r2 < o2; r2 += 1) a2 = i2[r2], l2 = String(t2[a2]), "!!" === a2.slice(0, 2) && (a2 = "tag:yaml.org,2002:" + a2.slice(2)), (c2 = e3.compiledTypeMap.fallback[a2]) && Se.call(c2.styleAliases, l2) && (l2 = c2.styleAliases[l2]), n2[a2] = l2;
          return n2;
        })(this.schema, e2.styles || null), this.sortKeys = e2.sortKeys || false, this.lineWidth = e2.lineWidth || 80, this.noRefs = e2.noRefs || false, this.noCompatMode = e2.noCompatMode || false, this.condenseFlow = e2.condenseFlow || false, this.quotingType = '"' === e2.quotingType ? 2 : 1, this.forceQuotes = e2.forceQuotes || false, this.replacer = "function" == typeof e2.replacer ? e2.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
      }
      function Me(e2, t2) {
        for (var i2, r2 = n.repeat(" ", t2), o2 = 0, a2 = -1, l2 = "", c2 = e2.length; o2 < c2; ) -1 === (a2 = e2.indexOf("\n", o2)) ? (i2 = e2.slice(o2), o2 = c2) : (i2 = e2.slice(o2, a2 + 1), o2 = a2 + 1), i2.length && "\n" !== i2 && (l2 += r2), l2 += i2;
        return l2;
      }
      function Le(e2, t2) {
        return "\n" + n.repeat(" ", e2.indent * t2);
      }
      function _e(e2) {
        return 32 === e2 || 9 === e2;
      }
      function De(e2) {
        return 32 <= e2 && e2 <= 126 || 161 <= e2 && e2 <= 55295 && 8232 !== e2 && 8233 !== e2 || 57344 <= e2 && e2 <= 65533 && e2 !== Oe || 65536 <= e2 && e2 <= 1114111;
      }
      function Ue(e2) {
        return De(e2) && e2 !== Oe && 13 !== e2 && 10 !== e2;
      }
      function qe(e2, t2, n2) {
        var i2 = Ue(e2), r2 = i2 && !_e(e2);
        return (n2 ? i2 : i2 && 44 !== e2 && 91 !== e2 && 93 !== e2 && 123 !== e2 && 125 !== e2) && 35 !== e2 && !(58 === t2 && !r2) || Ue(t2) && !_e(t2) && 35 === e2 || 58 === t2 && r2;
      }
      function Ye(e2, t2) {
        var n2, i2 = e2.charCodeAt(t2);
        return i2 >= 55296 && i2 <= 56319 && t2 + 1 < e2.length && (n2 = e2.charCodeAt(t2 + 1)) >= 56320 && n2 <= 57343 ? 1024 * (i2 - 55296) + n2 - 56320 + 65536 : i2;
      }
      function Re(e2) {
        return /^\n* /.test(e2);
      }
      function Be(e2, t2, n2, i2, r2, o2, a2, l2) {
        var c2, s2, u2 = 0, p2 = null, f2 = false, d2 = false, h2 = -1 !== i2, g2 = -1, m2 = De(s2 = Ye(e2, 0)) && s2 !== Oe && !_e(s2) && 45 !== s2 && 63 !== s2 && 58 !== s2 && 44 !== s2 && 91 !== s2 && 93 !== s2 && 123 !== s2 && 125 !== s2 && 35 !== s2 && 38 !== s2 && 42 !== s2 && 33 !== s2 && 124 !== s2 && 61 !== s2 && 62 !== s2 && 39 !== s2 && 34 !== s2 && 37 !== s2 && 64 !== s2 && 96 !== s2 && (function(e3) {
          return !_e(e3) && 58 !== e3;
        })(Ye(e2, e2.length - 1));
        if (t2 || a2) for (c2 = 0; c2 < e2.length; u2 >= 65536 ? c2 += 2 : c2++) {
          if (!De(u2 = Ye(e2, c2))) return 5;
          m2 = m2 && qe(u2, p2, l2), p2 = u2;
        }
        else {
          for (c2 = 0; c2 < e2.length; u2 >= 65536 ? c2 += 2 : c2++) {
            if (10 === (u2 = Ye(e2, c2))) f2 = true, h2 && (d2 = d2 || c2 - g2 - 1 > i2 && " " !== e2[g2 + 1], g2 = c2);
            else if (!De(u2)) return 5;
            m2 = m2 && qe(u2, p2, l2), p2 = u2;
          }
          d2 = d2 || h2 && c2 - g2 - 1 > i2 && " " !== e2[g2 + 1];
        }
        return f2 || d2 ? n2 > 9 && Re(e2) ? 5 : a2 ? 2 === o2 ? 5 : 2 : d2 ? 4 : 3 : !m2 || a2 || r2(e2) ? 2 === o2 ? 5 : 2 : 1;
      }
      function Ke(e2, t2, n2, i2, r2) {
        e2.dump = (function() {
          if (0 === t2.length) return 2 === e2.quotingType ? '""' : "''";
          if (!e2.noCompatMode && (-1 !== Te.indexOf(t2) || Ne.test(t2))) return 2 === e2.quotingType ? '"' + t2 + '"' : "'" + t2 + "'";
          var a2 = e2.indent * Math.max(1, n2), l2 = -1 === e2.lineWidth ? -1 : Math.max(Math.min(e2.lineWidth, 40), e2.lineWidth - a2), c2 = i2 || e2.flowLevel > -1 && n2 >= e2.flowLevel;
          switch (Be(t2, c2, e2.indent, l2, (function(t3) {
            return (function(e3, t4) {
              var n3, i3;
              for (n3 = 0, i3 = e3.implicitTypes.length; n3 < i3; n3 += 1) if (e3.implicitTypes[n3].resolve(t4)) return true;
              return false;
            })(e2, t3);
          }), e2.quotingType, e2.forceQuotes && !i2, r2)) {
            case 1:
              return t2;
            case 2:
              return "'" + t2.replace(/'/g, "''") + "'";
            case 3:
              return "|" + Pe(t2, e2.indent) + We(Me(t2, a2));
            case 4:
              return ">" + Pe(t2, e2.indent) + We(Me((function(e3, t3) {
                var n3, i3, r3 = /(\n+)([^\n]*)/g, o2 = (l3 = e3.indexOf("\n"), l3 = -1 !== l3 ? l3 : e3.length, r3.lastIndex = l3, He(e3.slice(0, l3), t3)), a3 = "\n" === e3[0] || " " === e3[0];
                var l3;
                for (; i3 = r3.exec(e3); ) {
                  var c3 = i3[1], s2 = i3[2];
                  n3 = " " === s2[0], o2 += c3 + (a3 || n3 || "" === s2 ? "" : "\n") + He(s2, t3), a3 = n3;
                }
                return o2;
              })(t2, l2), a2));
            case 5:
              return '"' + (function(e3) {
                for (var t3, n3 = "", i3 = 0, r3 = 0; r3 < e3.length; i3 >= 65536 ? r3 += 2 : r3++) i3 = Ye(e3, r3), !(t3 = je[i3]) && De(i3) ? (n3 += e3[r3], i3 >= 65536 && (n3 += e3[r3 + 1])) : n3 += t3 || Fe(i3);
                return n3;
              })(t2) + '"';
            default:
              throw new o("impossible error: invalid scalar style");
          }
        })();
      }
      function Pe(e2, t2) {
        var n2 = Re(e2) ? String(t2) : "", i2 = "\n" === e2[e2.length - 1];
        return n2 + (i2 && ("\n" === e2[e2.length - 2] || "\n" === e2) ? "+" : i2 ? "" : "-") + "\n";
      }
      function We(e2) {
        return "\n" === e2[e2.length - 1] ? e2.slice(0, -1) : e2;
      }
      function He(e2, t2) {
        if ("" === e2 || " " === e2[0]) return e2;
        for (var n2, i2, r2 = / [^ ]/g, o2 = 0, a2 = 0, l2 = 0, c2 = ""; n2 = r2.exec(e2); ) (l2 = n2.index) - o2 > t2 && (i2 = a2 > o2 ? a2 : l2, c2 += "\n" + e2.slice(o2, i2), o2 = i2 + 1), a2 = l2;
        return c2 += "\n", e2.length - o2 > t2 && a2 > o2 ? c2 += e2.slice(o2, a2) + "\n" + e2.slice(a2 + 1) : c2 += e2.slice(o2), c2.slice(1);
      }
      function $e(e2, t2, n2, i2) {
        var r2, o2, a2, l2 = "", c2 = e2.tag;
        for (r2 = 0, o2 = n2.length; r2 < o2; r2 += 1) a2 = n2[r2], e2.replacer && (a2 = e2.replacer.call(n2, String(r2), a2)), (Ve(e2, t2 + 1, a2, true, true, false, true) || void 0 === a2 && Ve(e2, t2 + 1, null, true, true, false, true)) && (i2 && "" === l2 || (l2 += Le(e2, t2)), e2.dump && 10 === e2.dump.charCodeAt(0) ? l2 += "-" : l2 += "- ", l2 += e2.dump);
        e2.tag = c2, e2.dump = l2 || "[]";
      }
      function Ge(e2, t2, n2) {
        var i2, r2, a2, l2, c2, s2;
        for (a2 = 0, l2 = (r2 = n2 ? e2.explicitTypes : e2.implicitTypes).length; a2 < l2; a2 += 1) if (((c2 = r2[a2]).instanceOf || c2.predicate) && (!c2.instanceOf || "object" == typeof t2 && t2 instanceof c2.instanceOf) && (!c2.predicate || c2.predicate(t2))) {
          if (n2 ? c2.multi && c2.representName ? e2.tag = c2.representName(t2) : e2.tag = c2.tag : e2.tag = "?", c2.represent) {
            if (s2 = e2.styleMap[c2.tag] || c2.defaultStyle, "[object Function]" === Ie.call(c2.represent)) i2 = c2.represent(t2, s2);
            else {
              if (!Se.call(c2.represent, s2)) throw new o("!<" + c2.tag + '> tag resolver accepts not "' + s2 + '" style');
              i2 = c2.represent[s2](t2, s2);
            }
            e2.dump = i2;
          }
          return true;
        }
        return false;
      }
      function Ve(e2, t2, n2, i2, r2, a2, l2) {
        e2.tag = null, e2.dump = n2, Ge(e2, n2, false) || Ge(e2, n2, true);
        var c2, s2 = Ie.call(e2.dump), u2 = i2;
        i2 && (i2 = e2.flowLevel < 0 || e2.flowLevel > t2);
        var p2, f2, d2 = "[object Object]" === s2 || "[object Array]" === s2;
        if (d2 && (f2 = -1 !== (p2 = e2.duplicates.indexOf(n2))), (null !== e2.tag && "?" !== e2.tag || f2 || 2 !== e2.indent && t2 > 0) && (r2 = false), f2 && e2.usedDuplicates[p2]) e2.dump = "*ref_" + p2;
        else {
          if (d2 && f2 && !e2.usedDuplicates[p2] && (e2.usedDuplicates[p2] = true), "[object Object]" === s2) i2 && 0 !== Object.keys(e2.dump).length ? (!(function(e3, t3, n3, i3) {
            var r3, a3, l3, c3, s3, u3, p3 = "", f3 = e3.tag, d3 = Object.keys(n3);
            if (true === e3.sortKeys) d3.sort();
            else if ("function" == typeof e3.sortKeys) d3.sort(e3.sortKeys);
            else if (e3.sortKeys) throw new o("sortKeys must be a boolean or a function");
            for (r3 = 0, a3 = d3.length; r3 < a3; r3 += 1) u3 = "", i3 && "" === p3 || (u3 += Le(e3, t3)), c3 = n3[l3 = d3[r3]], e3.replacer && (c3 = e3.replacer.call(n3, l3, c3)), Ve(e3, t3 + 1, l3, true, true, true) && ((s3 = null !== e3.tag && "?" !== e3.tag || e3.dump && e3.dump.length > 1024) && (e3.dump && 10 === e3.dump.charCodeAt(0) ? u3 += "?" : u3 += "? "), u3 += e3.dump, s3 && (u3 += Le(e3, t3)), Ve(e3, t3 + 1, c3, true, s3) && (e3.dump && 10 === e3.dump.charCodeAt(0) ? u3 += ":" : u3 += ": ", p3 += u3 += e3.dump));
            e3.tag = f3, e3.dump = p3 || "{}";
          })(e2, t2, e2.dump, r2), f2 && (e2.dump = "&ref_" + p2 + e2.dump)) : (!(function(e3, t3, n3) {
            var i3, r3, o2, a3, l3, c3 = "", s3 = e3.tag, u3 = Object.keys(n3);
            for (i3 = 0, r3 = u3.length; i3 < r3; i3 += 1) l3 = "", "" !== c3 && (l3 += ", "), e3.condenseFlow && (l3 += '"'), a3 = n3[o2 = u3[i3]], e3.replacer && (a3 = e3.replacer.call(n3, o2, a3)), Ve(e3, t3, o2, false, false) && (e3.dump.length > 1024 && (l3 += "? "), l3 += e3.dump + (e3.condenseFlow ? '"' : "") + ":" + (e3.condenseFlow ? "" : " "), Ve(e3, t3, a3, false, false) && (c3 += l3 += e3.dump));
            e3.tag = s3, e3.dump = "{" + c3 + "}";
          })(e2, t2, e2.dump), f2 && (e2.dump = "&ref_" + p2 + " " + e2.dump));
          else if ("[object Array]" === s2) i2 && 0 !== e2.dump.length ? (e2.noArrayIndent && !l2 && t2 > 0 ? $e(e2, t2 - 1, e2.dump, r2) : $e(e2, t2, e2.dump, r2), f2 && (e2.dump = "&ref_" + p2 + e2.dump)) : (!(function(e3, t3, n3) {
            var i3, r3, o2, a3 = "", l3 = e3.tag;
            for (i3 = 0, r3 = n3.length; i3 < r3; i3 += 1) o2 = n3[i3], e3.replacer && (o2 = e3.replacer.call(n3, String(i3), o2)), (Ve(e3, t3, o2, false, false) || void 0 === o2 && Ve(e3, t3, null, false, false)) && ("" !== a3 && (a3 += "," + (e3.condenseFlow ? "" : " ")), a3 += e3.dump);
            e3.tag = l3, e3.dump = "[" + a3 + "]";
          })(e2, t2, e2.dump), f2 && (e2.dump = "&ref_" + p2 + " " + e2.dump));
          else {
            if ("[object String]" !== s2) {
              if ("[object Undefined]" === s2) return false;
              if (e2.skipInvalid) return false;
              throw new o("unacceptable kind of an object to dump " + s2);
            }
            "?" !== e2.tag && Ke(e2, e2.dump, t2, a2, u2);
          }
          null !== e2.tag && "?" !== e2.tag && (c2 = encodeURI("!" === e2.tag[0] ? e2.tag.slice(1) : e2.tag).replace(/!/g, "%21"), c2 = "!" === e2.tag[0] ? "!" + c2 : "tag:yaml.org,2002:" === c2.slice(0, 18) ? "!!" + c2.slice(18) : "!<" + c2 + ">", e2.dump = c2 + " " + e2.dump);
        }
        return true;
      }
      function Ze(e2, t2) {
        var n2, i2, r2 = [], o2 = [];
        for (Je(e2, r2, o2), n2 = 0, i2 = o2.length; n2 < i2; n2 += 1) t2.duplicates.push(r2[o2[n2]]);
        t2.usedDuplicates = new Array(i2);
      }
      function Je(e2, t2, n2) {
        var i2, r2, o2;
        if (null !== e2 && "object" == typeof e2) if (-1 !== (r2 = t2.indexOf(e2))) -1 === n2.indexOf(r2) && n2.push(r2);
        else if (t2.push(e2), Array.isArray(e2)) for (r2 = 0, o2 = e2.length; r2 < o2; r2 += 1) Je(e2[r2], t2, n2);
        else for (r2 = 0, o2 = (i2 = Object.keys(e2)).length; r2 < o2; r2 += 1) Je(e2[i2[r2]], t2, n2);
      }
      function Qe(e2, t2) {
        return function() {
          throw new Error("Function yaml." + e2 + " is removed in js-yaml 4. Use yaml." + t2 + " instead, which is now safe by default.");
        };
      }
      var ze = p, Xe = h, et = b, tt = O, nt = j, it = K, rt = xe.load, ot = xe.loadAll, at = { dump: function(e2, t2) {
        var n2 = new Ee(t2 = t2 || {});
        n2.noRefs || Ze(e2, n2);
        var i2 = e2;
        return n2.replacer && (i2 = n2.replacer.call({ "": i2 }, "", i2)), Ve(n2, 0, i2, true, true) ? n2.dump + "\n" : "";
      } }.dump, lt = o, ct = { binary: L, float: S, map: y, null: A, pairs: Y, set: B, timestamp: F, bool: v, int: C, merge: E, omap: U, seq: m, str: g }, st = Qe("safeLoad", "load"), ut = Qe("safeLoadAll", "loadAll"), pt = Qe("safeDump", "dump"), ft = { Type: ze, Schema: Xe, FAILSAFE_SCHEMA: et, JSON_SCHEMA: tt, CORE_SCHEMA: nt, DEFAULT_SCHEMA: it, load: rt, loadAll: ot, dump: at, YAMLException: lt, types: ct, safeLoad: st, safeLoadAll: ut, safeDump: pt };
      e.CORE_SCHEMA = nt, e.DEFAULT_SCHEMA = it, e.FAILSAFE_SCHEMA = et, e.JSON_SCHEMA = tt, e.Schema = Xe, e.Type = ze, e.YAMLException = lt, e.default = ft, e.dump = at, e.load = rt, e.loadAll = ot, e.safeDump = pt, e.safeLoad = st, e.safeLoadAll = ut, e.types = ct, Object.defineProperty(e, "__esModule", { value: true });
    }));
  }
});

// src/formats.js
var require_formats = __commonJS({
  "src/formats.js"(exports, module2) {
    "use strict";
    (function(root) {
      "use strict";
      const M = typeof module2 !== "undefined" && module2.exports ? require_core() : root.Modeller;
      const yaml = typeof module2 !== "undefined" && module2.exports ? require_js_yaml_min() : root.jsyaml;
      function guard2(value) {
        let visits = 0, chars = 0;
        const stack = /* @__PURE__ */ new Set();
        function walk(v, depth) {
          if (++visits > 1e5 || depth > 100) throw new Error("YAML is too deeply nested or contains too many aliases.");
          if (typeof v === "string") {
            chars += v.length;
            if (chars > M.LIMITS.bytes) throw new Error("Expanded model exceeds 5 MB.");
          }
          if (!v || typeof v !== "object") return;
          if (stack.has(v)) throw new Error("Cyclic YAML aliases are not supported.");
          stack.add(v);
          for (const [key, child] of Object.entries(v)) {
            if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Reserved YAML property name.");
            walk(child, depth + 1);
          }
          stack.delete(v);
        }
        walk(value, 0);
        if (new TextEncoder().encode(JSON.stringify(value)).length > M.LIMITS.bytes) throw new Error("Expanded model exceeds 5 MB.");
        return value;
      }
      function parse2(text, extension = "json") {
        if (new TextEncoder().encode(text).length > M.LIMITS.bytes) throw new Error("Import a model smaller than 5 MB.");
        if (["yaml", "yml", "txt"].includes(extension.toLowerCase())) return M.validate(guard2(yaml.load(text, { schema: yaml.JSON_SCHEMA })));
        return M.parse(text);
      }
      function dump(model) {
        return "# Mightora Architecture Modeller \u2014 portable model\n" + yaml.dump(M.validate(model), { schema: yaml.JSON_SCHEMA, noRefs: true, lineWidth: 100, quotingType: '"' });
      }
      const api = { parse: parse2, dump };
      if (typeof module2 !== "undefined" && module2.exports) module2.exports = api;
      else root.ModellerFormats = api;
    })(globalThis);
  }
});

// vscode-extension/src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate,
  webviewHTML: () => webviewHTML
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// packages/schema/index.ts
var MAX_BYTES = 5 * 1024 * 1024;
function safeLink(target) {
  if (target.length > 2e3 || /[\u0000-\u0020\\]/.test(target)) return false;
  if (/^https?:\/\//i.test(target)) {
    try {
      const u = new URL(target);
      return !!u.hostname && !u.username && !u.password;
    } catch {
      return false;
    }
  }
  return !/[:?#%]/.test(target) && !target.startsWith("/") && target.split("/").every((p) => !!p && p !== "." && p !== "..");
}
function canonical(model) {
  const sorted = (value) => Array.isArray(value) ? value.map(sorted) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sorted(v)])) : value;
  const copy = JSON.parse(JSON.stringify(model));
  for (const key of ["nodes", "edges", "types", "relationshipTypes", "decisions"]) copy[key]?.sort((a, b) => a.id.localeCompare(b.id));
  return JSON.stringify(sorted(copy), null, 2) + "\n";
}

// packages/validation/index.ts
var rules = [
  ["owner", "Application ownership", "warning", "Document the business owner."],
  ["criticality", "Criticality", "warning", "Set Criticality for important systems."],
  ["classification", "Data classification", "warning", "Document Classification for data and sensitive components."],
  ["authentication", "External integration authentication", "error", "Record Authentication on the integration."],
  ["support", "Production support", "warning", "Record Support owner for production components."],
  ["decision", "Architecture decisions", "information", "Link an ADR to critical components."],
  ["process-support", "Business process support", "warning", "Map at least one supporting component to this process."],
  ["references", "Entity references", "error", "Repair or remove the invalid reference."],
  ["dependency-policy", "Prohibited dependencies", "error", "Review the prohibited dependency or update the policy."],
  ["technology", "Approved technology", "warning", "Use an approved technology or agree a policy exception."]
];
function property(n, field) {
  const pair = Object.entries({ ...n.properties, ...n.documentation }).find(([key]) => key.toLowerCase() === field.toLowerCase());
  return pair?.[1]?.trim() || "";
}
function validateArchitecture(model) {
  const results = [], nodes = new Map(model.nodes.map((n) => [n.id, n])), types = new Map(model.types.map((t) => [t.id, t])), rels = new Map(model.relationshipTypes.map((t) => [t.id, t]));
  const add = (rule, entityId, message) => {
    const def = rules.find((r) => r[0] === rule);
    if (!def || model.policy?.rules?.[rule]?.enabled === false) return;
    results.push({ rule, entityId, message, severity: model.policy?.rules?.[rule]?.severity || def[2], remediation: def[3] });
  };
  const supported = new Set(model.edges.filter((e) => rels.get(e.typeId)?.semantic === "supports").map((e) => e.target));
  const seen = /* @__PURE__ */ new Set();
  for (const n of model.nodes) {
    if (seen.has(n.id)) add("references", n.id, "Duplicate component ID.");
    seen.add(n.id);
    const type = types.get(n.typeId), criticality = property(n, "Criticality"), important = /critical|high|tier.?1/i.test(criticality), cls = property(n, "Classification");
    if (!type || n.parentId && !nodes.has(n.parentId)) add("references", n.id, "Unknown type or deleted parent.");
    if ((n.kind || "component") === "component") {
      if (!property(n, "Owner") && /application|app|system|platform/i.test((type?.name || "") + " " + n.typeId)) add("owner", n.id, `${n.name} has no documented owner.`);
      if (!criticality && /system|platform/i.test(type?.name || "")) add("criticality", n.id, `${n.name} has no criticality rating.`);
      if (!cls && (/data|database|store/i.test(type?.name || "") || /sensitive|personal|secret/i.test(property(n, "Data")))) add("classification", n.id, `${n.name} has no data classification.`);
      if (/prod/i.test(property(n, "Environment")) && !property(n, "Support owner")) add("support", n.id, `${n.name} has no production support owner.`);
      if (important && !(n.decisionIds?.length || model.decisions?.some((d) => d.componentIds.includes(n.id)))) add("decision", n.id, `${n.name} has no linked architecture decision.`);
      const tech = property(n, "Technology");
      if (tech && model.policy?.approvedTechnologies?.length && !model.policy.approvedTechnologies.some((t) => t.toLowerCase() === tech.toLowerCase())) add("technology", n.id, `${tech} is outside the approved technology catalogue.`);
    }
    if (n.kind === "process" && (important || !criticality) && !supported.has(n.id)) add("process-support", n.id, `${n.name} has no explicitly supporting system.`);
    for (const id of n.decisionIds || []) if (!model.decisions?.some((d) => d.id === id)) add("references", n.id, "Unknown linked ADR.");
  }
  const edgeIds = /* @__PURE__ */ new Set();
  for (const e of model.edges) {
    if (edgeIds.has(e.id) || !nodes.has(e.source) || !nodes.has(e.target) || !rels.has(e.typeId)) add("references", e.id, "Duplicate integration ID, missing endpoint or relationship type.");
    edgeIds.add(e.id);
    const source = nodes.get(e.source), target = nodes.get(e.target);
    if (!source || !target) continue;
    const props = { ...source.properties, ...source.documentation, ...target.properties, ...target.documentation, ...e.documentation };
    const external = /external/i.test(property(source, "Boundary") + " " + property(target, "Boundary")) || Object.entries(e.documentation || {}).some(([k, v]) => k.toLowerCase() === "external" && /true|yes/i.test(v));
    if (external && !Object.entries(props).some(([k, v]) => k.toLowerCase() === "authentication" && v.trim())) add("authentication", e.id, `${source.name} to ${target.name} crosses an external boundary without authentication.`);
    if (model.policy?.prohibitedDependencies?.some((p) => source.typeId === p.sourceType && target.typeId === p.targetType)) add("dependency-policy", e.id, `${source.name} to ${target.name} violates the configured dependency policy.`);
  }
  return results;
}

// packages/core/index.ts
function impact(model, componentId) {
  const adjacency = /* @__PURE__ */ new Map();
  for (const e of model.edges) {
    for (const [a, b] of [[e.source, e.target], [e.target, e.source]]) {
      if (!adjacency.has(a)) adjacency.set(a, /* @__PURE__ */ new Set());
      adjacency.get(a).add(b);
    }
  }
  const reached = /* @__PURE__ */ new Set([componentId]), queue = [componentId];
  for (let i = 0; i < queue.length; i++) for (const next of adjacency.get(queue[i]) || []) if (!reached.has(next)) {
    reached.add(next);
    queue.push(next);
  }
  const group = (kind) => model.nodes.filter((n) => reached.has(n.id) && (n.kind || "component") === kind).map((n) => n.id);
  return { components: group("component"), processes: group("process"), stakeholders: group("stakeholder") };
}
var serial = (v) => JSON.stringify(v, (_k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x);
function compareModels(before, after) {
  const changes = [], affected = /* @__PURE__ */ new Set();
  const scan = (collection, a, b) => {
    const prev = new Map(a.map((x) => [x.id, x])), next = new Map(b.map((x) => [x.id, x]));
    for (const id of /* @__PURE__ */ new Set([...prev.keys(), ...next.keys()])) {
      const old = prev.get(id), now = next.get(id);
      if (serial(old) === serial(now)) continue;
      const fields = Object.keys({ ...old, ...now }).filter((k) => serial(old?.[k]) !== serial(now?.[k]));
      const policy = after.policy?.breaking;
      changes.push({ collection, id, name: String(now?.name || old?.name || now?.title || old?.title || id), kind: !old ? "added" : !now ? "removed" : "modified", fields, breaking: !now && !!policy?.removals || collection === "components" && !!old && !!now && (!!policy?.technologyChanges && property(old, "Technology") !== property(now, "Technology") || !!policy?.classificationChanges && property(old, "Classification") !== property(now, "Classification")) });
      if (collection === "components") affected.add(id);
      if (collection === "relationships") for (const item of [old, now]) {
        if (item?.source) affected.add(String(item.source));
        if (item?.target) affected.add(String(item.target));
      }
    }
  };
  scan("components", before.nodes, after.nodes);
  scan("relationships", before.edges, after.edges);
  scan("decisions", before.decisions || [], after.decisions || []);
  scan("componentTypes", before.types, after.types);
  scan("relationshipTypes", before.relationshipTypes, after.relationshipTypes);
  scan("layers", before.layers || [], after.layers || []);
  const semanticView = (m) => (m.namedViews || []).map(({ positions: _p, camera: _c, routes: _r, expanded: _x, routing: _rt, swimlanes: _sw, ...v }) => ({ ...v, id: v.id }));
  scan("views", semanticView(before), semanticView(after));
  const { views: _bv, namedViews: _bn, nodes: _bno, edges: _be, types: _bt, relationshipTypes: _br, decisions: _bd, layers: _bl, schemaVersion: _bs, ...bMeta } = before;
  const { views: _av, namedViews: _an, nodes: _ano, edges: _ae, types: _at, relationshipTypes: _ar, decisions: _ad, layers: _al, schemaVersion: _as, ...aMeta } = after;
  if (serial(bMeta) !== serial(aMeta)) changes.push({ collection: "model", id: after.id || "model", name: after.name, kind: "modified", fields: Object.keys({ ...bMeta, ...aMeta }).filter((k) => serial(bMeta[k]) !== serial(aMeta[k])), breaking: false });
  const processes = /* @__PURE__ */ new Set(), stakeholders = /* @__PURE__ */ new Set();
  for (const id of affected) for (const model of [before, after]) {
    const result = impact(model, id);
    result.processes.forEach((p) => processes.add(p));
    result.stakeholders.forEach((s) => stakeholders.add(s));
  }
  return { changes, layoutOnly: changes.length === 0 && canonical(before) !== canonical(after), affectedProcesses: [...processes], affectedStakeholders: [...stakeholders] };
}

// vscode-extension/src/extension.ts
var Formats = __toESM(require_formats());
var VIEW = "mightora.architectureModeller";
var MAX_MODEL = 5 * 1024 * 1024;
var MAX_EXPORT = 25 * 1024 * 1024;
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function nonce() {
  return [...crypto.getRandomValues(new Uint8Array(24))].map((n) => n.toString(16).padStart(2, "0")).join("");
}
function format(uri) {
  return /\.ya?ml$/i.test(uri.path) ? "yaml" : "json";
}
function webviewHTML(html) {
  const value = nonce();
  return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${value}'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">`).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (_match, attributes, body) => `<script nonce="${value}"${attributes}>${body}<\/script>`);
}
function activate(context) {
  const sessions = /* @__PURE__ */ new Map();
  let active;
  const diagnostics = vscode.languages?.createDiagnosticCollection?.("mightora-architecture");
  if (diagnostics) context.subscriptions.push(diagnostics);
  const outlineChange = new vscode.EventEmitter();
  context.subscriptions.push(outlineChange);
  function current() {
    if (active) return active;
    vscode.window.showInformationMessage("Open an architecture model in the visual editor first.");
    return void 0;
  }
  function update(session) {
    try {
      session.model = Formats.parse(session.document.getText(), format(session.document.uri));
      const text = session.document.getText(), issues = validateArchitecture(session.model);
      diagnostics?.set(session.document.uri, issues.map((i) => {
        const offset = text.indexOf('"' + i.entityId + '"'), position = session.document.positionAt(Math.max(0, offset)), d = new vscode.Diagnostic(new vscode.Range(position, position), i.message + " " + i.remediation, { error: vscode.DiagnosticSeverity.Error, warning: vscode.DiagnosticSeverity.Warning, information: vscode.DiagnosticSeverity.Information }[i.severity]);
        d.code = i.rule;
        d.source = "Architecture Modeller";
        return d;
      }));
    } catch (error) {
      session.model = void 0;
      if (diagnostics) diagnostics.set(session.document.uri, [new vscode.Diagnostic(new vscode.Range(0, 0, 0, 1), String(error.message), vscode.DiagnosticSeverity.Error)]);
    }
    outlineChange.fire();
  }
  const tree = { onDidChangeTreeData: outlineChange.event, getTreeItem: (id) => {
    const node = active?.model?.nodes.find((n) => n.id === id);
    const item = new vscode.TreeItem(node?.name || id, active?.model?.nodes.some((n) => n.parentId === id) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
    item.description = node?.kind || node?.typeId;
    item.command = { command: "mightora.architecture.reveal", title: "Show architecture component", arguments: [id] };
    return item;
  }, getChildren: (id) => active?.model?.nodes.filter((n) => n.parentId === (id || null)).map((n) => n.id) || [] };
  if (vscode.window.registerTreeDataProvider) context.subscriptions.push(vscode.window.registerTreeDataProvider("mightoraArchitectureOutline", tree));
  const provider = { async resolveCustomTextEditor(document, panel) {
    const session = { document, panel };
    sessions.set(document.uri.toString(), session);
    active = session;
    panel.webview.options = { enableScripts: true, localResourceRoots: [] };
    let disposed = false, writeOrigin = null, authored = null, queue = Promise.resolve();
    const sendDocument = (origin) => panel.webview.postMessage({ type: "document", text: document.getText(), version: document.version, format: format(document.uri), origin });
    const changed = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) {
        void sendDocument(writeOrigin || (authored?.text === document.getText() ? authored.id : null));
        update(session);
      }
    });
    const viewState = panel.onDidChangeViewState?.((event) => {
      if (event.webviewPanel.active) {
        active = session;
        update(session);
      }
    });
    const messages = panel.webview.onDidReceiveMessage((message) => {
      queue = queue.then(async () => {
        if (disposed || !message || typeof message.type !== "string") return;
        if (message.type === "ready") {
          await sendDocument(null);
          return;
        }
        if (message.type === "edit") {
          if (typeof message.text !== "string" || encoder.encode(message.text).length > MAX_MODEL || !Number.isInteger(message.baseVersion) || typeof message.editId !== "string") throw Error("Invalid or oversized model update.");
          if (message.baseVersion !== document.version) {
            await panel.webview.postMessage({ type: "conflict", editId: message.editId });
            return;
          }
          Formats.parse(message.text, format(document.uri));
          if (message.text !== document.getText()) {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), message.text);
            writeOrigin = message.editId;
            authored = { text: message.text, id: message.editId };
            try {
              if (!await vscode.workspace.applyEdit(edit)) throw Error("VS Code did not accept the edit.");
            } finally {
              writeOrigin = null;
            }
          }
          await panel.webview.postMessage({ type: "ack", editId: message.editId, version: document.version });
          return;
        }
        if (message.type === "import" || message.type === "compare") {
          const files = await vscode.window.showOpenDialog({ canSelectMany: false, filters: { "Architecture model": ["json", "yaml", "yml", "txt"] } });
          if (!files?.length) return;
          const bytes = await vscode.workspace.fs.readFile(files[0]);
          if (bytes.length > MAX_MODEL) throw Error("Import a model smaller than 5 MB.");
          const text = decoder.decode(bytes);
          if (message.type === "compare") {
            const before = Formats.parse(text, format(files[0])), after = Formats.parse(document.getText(), format(document.uri));
            await panel.webview.postMessage({ type: "comparison", report: compareModels(before, after) });
          } else await panel.webview.postMessage({ type: "imported", text, name: files[0].path.split("/").pop() });
          return;
        }
        if (message.type === "save") {
          if (message.as) await vscode.commands.executeCommand("workbench.action.files.saveAs");
          else await document.save();
          return;
        }
        if (message.type === "undo" || message.type === "redo") {
          await vscode.commands.executeCommand(message.type);
          return;
        }
        if (message.type === "diagnostics") {
          update(session);
          return;
        }
        if (message.type === "source") {
          const link = message.link;
          if (!link || typeof link.target !== "string" || !safeLink(link.target)) throw Error("Unsafe source link.");
          if (/^https?:\/\//i.test(link.target)) await vscode.env.openExternal(vscode.Uri.parse(link.target));
          else {
            const folder = vscode.workspace.getWorkspaceFolder?.(document.uri) || vscode.workspace.workspaceFolders?.[0];
            if (!folder) throw Error("Open a workspace to resolve source references.");
            const target = vscode.Uri.joinPath(folder.uri, link.target);
            const doc = await vscode.workspace.openTextDocument(target);
            await vscode.window.showTextDocument(doc, { selection: new vscode.Range(Math.max(0, (link.line || 1) - 1), 0, Math.max(0, (link.line || 1) - 1), 0) });
          }
          return;
        }
        if (message.type === "export") {
          if (typeof message.name !== "string" || message.name.length > 160 || !Array.isArray(message.bytes) || message.bytes.length > MAX_EXPORT || !message.bytes.every((n) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 255)) throw Error("Invalid or oversized export.");
          const name = message.name.replace(/[^a-zA-Z0-9._-]/g, "-"), folder = vscode.workspace.workspaceFolders?.[0]?.uri;
          const target = await vscode.window.showSaveDialog({ title: "Save architecture export", ...folder ? { defaultUri: vscode.Uri.joinPath(folder, name) } : {}, saveLabel: "Save export" });
          if (target) {
            await vscode.workspace.fs.writeFile(target, new Uint8Array(message.bytes));
            void vscode.window.showInformationMessage("Architecture export saved.");
          }
          await panel.webview.postMessage({ type: "export-result", requestId: message.editId, saved: !!target });
          return;
        }
      }).catch((error) => {
        void panel.webview.postMessage({ type: "error", message: error.message, editId: message?.editId });
        void vscode.window.showErrorMessage("Architecture Modeller: " + error.message);
      });
    });
    panel.onDidDispose(() => {
      disposed = true;
      changed.dispose();
      messages.dispose();
      viewState?.dispose();
      sessions.delete(document.uri.toString());
      if (active === session) active = void 0;
      diagnostics?.delete(document.uri);
      outlineChange.fire();
    });
    panel.webview.html = webviewHTML(decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri, "media", "editor.html"))));
    update(session);
  } };
  context.subscriptions.push(vscode.window.registerCustomEditorProvider(VIEW, provider, { webviewOptions: { retainContextWhenHidden: true }, supportsMultipleEditorsPerDocument: false }));
  const command = (id, action) => {
    context.subscriptions.push(vscode.commands.registerCommand("mightora.architecture." + id, action));
  };
  command("new", async () => {
    const folder = vscode.workspace.workspaceFolders?.[0]?.uri, target = await vscode.window.showSaveDialog({ title: "New architecture model", ...folder ? { defaultUri: vscode.Uri.joinPath(folder, "untitled.archmodel.json") } : {}, filters: { "Architecture JSON": ["json"] } });
    if (!target) return;
    await vscode.workspace.fs.writeFile(target, await vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri, "media", "starter.architecture.json")));
    await vscode.commands.executeCommand("vscode.openWith", target, VIEW);
  });
  command("open", async (uri) => {
    if (uri && typeof uri === "object" && "scheme" in uri) {
      await vscode.commands.executeCommand("vscode.openWith", uri, VIEW);
      return;
    }
    const files = await vscode.window.showOpenDialog({ canSelectMany: false, filters: { "Architecture model": ["json", "yaml", "yml", "txt"] } });
    if (files?.length) await vscode.commands.executeCommand("vscode.openWith", files[0], VIEW);
  });
  for (const [id, action] of [["validate", "validate"], ["word", "word"], ["powerpoint", "powerpoint"], ["documentation", "office-options"], ["adr", "new-adr"], ["compare", "compare-host"]]) command(id, () => current()?.panel.webview.postMessage({ type: "command", command: action }));
  command("reveal", (id) => current()?.panel.webview.postMessage({ type: "command", command: "locate", id }));
  command("viewpoint", async () => {
    const session = current();
    if (!session) return;
    const items = (session.model?.namedViews || []).map((v) => ({ label: v.name || v.id, id: v.id })), choice = await vscode.window.showQuickPick(items, { title: "Select architecture viewpoint" });
    if (choice) await session.panel.webview.postMessage({ type: "command", command: "viewpoint", id: choice.id });
  });
  command("search", async () => {
    const session = current();
    if (!session) return;
    const choice = await vscode.window.showQuickPick((session.model?.nodes || []).map((n) => ({ label: n.name, description: n.typeId, id: n.id })), { title: "Find an architecture component", matchOnDescription: true });
    if (choice) await session.panel.webview.postMessage({ type: "command", command: "locate", id: choice.id });
  });
}
function deactivate() {
}
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
