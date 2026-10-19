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
    (function(e, t) {
      typeof exports == `object` && typeof module2 < `u` ? t(exports) : typeof define == `function` && define.amd ? define([`exports`], t) : (e = typeof globalThis < `u` ? globalThis : e || self, t(e.jsyaml = {}));
    })(exports, function(e) {
      Object.defineProperty(e, Symbol.toStringTag, { value: `Module` });
      var t = /* @__PURE__ */ Symbol(`NOT_RESOLVED`);
      function n(e2, t2) {
        var n2, r2, i2, a2, o2;
        return { tagName: e2, nodeKind: `scalar`, implicit: (n2 = t2.implicit) != null && n2, matchByTagPrefix: (r2 = t2.matchByTagPrefix) != null && r2, implicitFirstChars: (i2 = t2.implicitFirstChars) == null ? null : i2, resolve: t2.resolve, identify: t2.identify, represent: (a2 = t2.represent) == null ? ((e3) => String(e3)) : a2, representTagName: (o2 = t2.representTagName) == null ? (() => e2) : o2 };
      }
      function r(e2, t2) {
        var n2, r2, i2, a2;
        let o2 = t2.finalize === void 0;
        return { tagName: e2, nodeKind: `sequence`, implicit: false, matchByTagPrefix: (n2 = t2.matchByTagPrefix) != null && n2, create: t2.create, addItem: t2.addItem, finalize: (r2 = t2.finalize) == null ? ((e3) => e3) : r2, carrierIsResult: o2, identify: t2.identify, represent: (i2 = t2.represent) == null ? ((e3) => e3) : i2, representTagName: (a2 = t2.representTagName) == null ? (() => e2) : a2 };
      }
      function i(e2, t2) {
        var n2, r2, i2, a2;
        let o2 = t2.finalize === void 0;
        return { tagName: e2, nodeKind: `mapping`, implicit: false, matchByTagPrefix: (n2 = t2.matchByTagPrefix) != null && n2, create: t2.create, addPair: t2.addPair, has: t2.has, keys: t2.keys, get: t2.get, finalize: (r2 = t2.finalize) == null ? ((e3) => e3) : r2, carrierIsResult: o2, identify: t2.identify, represent: (i2 = t2.represent) == null ? ((e3) => e3) : i2, representTagName: (a2 = t2.representTagName) == null ? (() => e2) : a2 };
      }
      var a = n(`tag:yaml.org,2002:str`, { resolve: (e2) => e2, identify: (e2) => typeof e2 == `string` }), o = [``, `~`, `null`, `Null`, `NULL`], s = n(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [``, `~`, `n`, `N`], resolve: (e2) => o.indexOf(e2) === -1 ? t : null, identify: (e2) => e2 === null, represent: () => `null` }), c = n(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [`n`], resolve: (e2, n2) => e2 === `null` || n2 && e2 === `` ? null : t, identify: (e2) => e2 === null, represent: () => `null` }), l = [``, `~`, `null`, `Null`, `NULL`], u = n(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [``, `~`, `n`, `N`], resolve: (e2) => l.indexOf(e2) === -1 ? t : null, identify: (e2) => e2 === null, represent: () => `null` }), d = [`true`, `True`, `TRUE`], f = [`false`, `False`, `FALSE`], p = n(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`t`, `T`, `f`, `F`], resolve: (e2) => d.indexOf(e2) !== -1 || f.indexOf(e2) === -1 && t, identify: (e2) => Object.prototype.toString.call(e2) === `[object Boolean]`, represent: (e2) => e2 ? `true` : `false` }), m = [`true`], h = [`false`], ee = n(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`t`, `f`], resolve: (e2) => m.indexOf(e2) !== -1 || h.indexOf(e2) === -1 && t, identify: (e2) => Object.prototype.toString.call(e2) === `[object Boolean]`, represent: (e2) => e2 ? `true` : `false` }), te = [`true`, `True`, `TRUE`, `y`, `Y`, `yes`, `Yes`, `YES`, `on`, `On`, `ON`], ne = [`false`, `False`, `FALSE`, `n`, `N`, `no`, `No`, `NO`, `off`, `Off`, `OFF`], re = n(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`y`, `Y`, `n`, `N`, `t`, `T`, `f`, `F`, `o`, `O`], resolve: (e2) => te.indexOf(e2) !== -1 || ne.indexOf(e2) === -1 && t, identify: (e2) => Object.prototype.toString.call(e2) === `[object Boolean]`, represent: (e2) => e2 ? `true` : `false` }), ie = RegExp(`^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$`), ae = RegExp(`^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$`);
      function oe(e2) {
        let t2 = e2, n2 = 1;
        return (t2[0] === `-` || t2[0] === `+`) && (t2[0] === `-` && (n2 = -1), t2 = t2.slice(1)), t2.startsWith(`0b`) ? n2 * parseInt(t2.slice(2), 2) : t2.startsWith(`0o`) ? n2 * parseInt(t2.slice(2), 8) : t2.startsWith(`0x`) ? n2 * parseInt(t2.slice(2), 16) : n2 * parseInt(t2, 10);
      }
      function se(e2, n2) {
        if (n2) {
          if (!ae.test(e2)) return t;
        } else if (!ie.test(e2)) return t;
        let r2 = oe(e2);
        return Number.isFinite(r2) ? r2 : t;
      }
      var ce = n(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, `+`, ...`0123456789`], resolve: se, identify: (e2) => Number.isInteger(e2) && !Object.is(e2, -0) && e2.toString(10).indexOf(`e`) < 0, represent: (e2) => e2.toString(10) }), le = RegExp(`^-?(?:0|[1-9][0-9]*)$`), ue = RegExp(`^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$`);
      function de(e2) {
        let t2 = e2, n2 = 1;
        return (t2[0] === `-` || t2[0] === `+`) && (t2[0] === `-` && (n2 = -1), t2 = t2.slice(1)), t2.startsWith(`0b`) ? n2 * parseInt(t2.slice(2), 2) : t2.startsWith(`0o`) ? n2 * parseInt(t2.slice(2), 8) : t2.startsWith(`0x`) ? n2 * parseInt(t2.slice(2), 16) : n2 * parseInt(t2, 10);
      }
      function fe(e2, n2) {
        if (n2) {
          if (!ue.test(e2)) return t;
        } else if (!le.test(e2)) return t;
        let r2 = de(e2);
        return Number.isFinite(r2) ? r2 : t;
      }
      var pe = n(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, ...`0123456789`], resolve: fe, identify: (e2) => Number.isInteger(e2) && !Object.is(e2, -0) && e2.toString(10).indexOf(`e`) < 0, represent: (e2) => e2.toString(10) }), me = RegExp(`^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$`);
      function he(e2) {
        let t2 = e2.replace(/_/g, ``), n2 = 1;
        if ((t2[0] === `-` || t2[0] === `+`) && (t2[0] === `-` && (n2 = -1), t2 = t2.slice(1)), t2.startsWith(`0b`)) return n2 * parseInt(t2.slice(2), 2);
        if (t2.startsWith(`0x`)) return n2 * parseInt(t2.slice(2), 16);
        if (t2.includes(`:`)) {
          let e3 = 0;
          for (let n3 of t2.split(`:`)) e3 = e3 * 60 + Number(n3);
          return n2 * e3;
        }
        return t2 !== `0` && t2[0] === `0` ? n2 * parseInt(t2, 8) : n2 * parseInt(t2, 10);
      }
      function ge(e2) {
        if (!me.test(e2)) return t;
        let n2 = he(e2);
        return Number.isFinite(n2) ? n2 : t;
      }
      var _e = n(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, `+`, ...`0123456789`], resolve: ge, identify: (e2) => Number.isInteger(e2) && !Object.is(e2, -0) && e2.toString(10).indexOf(`e`) < 0, represent: (e2) => e2.toString(10) }), ve = RegExp(`^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`), ye = RegExp(`^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
      function be(e2) {
        if (!ve.test(e2)) return t;
        let n2 = e2.toLowerCase(), r2 = n2[0] === `-` ? -1 : 1;
        if (`+-`.includes(n2[0]) && (n2 = n2.slice(1)), n2 === `.inf`) return r2 === 1 ? 1 / 0 : -1 / 0;
        if (n2 === `.nan`) return NaN;
        let i2 = r2 * parseFloat(n2);
        return Number.isFinite(i2) || ye.test(e2) ? i2 : t;
      }
      function xe(e2) {
        if (isNaN(e2)) return `.nan`;
        if (e2 === 1 / 0) return `.inf`;
        if (e2 === -1 / 0) return `-.inf`;
        if (Object.is(e2, -0)) return `-0.0`;
        let t2 = e2.toString(10);
        return /^[-+]?[0-9]+e/.test(t2) ? t2.replace(`e`, `.e`) : t2;
      }
      var Se = n(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, `+`, `.`, ...`0123456789`], resolve: be, identify: (e2) => typeof e2 == `number` && (!Number.isInteger(e2) || Object.is(e2, -0) || e2.toString(10).indexOf(`e`) >= 0), represent: xe }), Ce = RegExp(`^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$`), we = RegExp(`^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
      function Te(e2, n2) {
        if (n2) {
          if (!we.test(e2)) return t;
          let n3 = e2.toLowerCase(), r3 = n3[0] === `-` ? -1 : 1;
          if (`+-`.includes(n3[0]) && (n3 = n3.slice(1)), n3 === `.inf`) return r3 === 1 ? 1 / 0 : -1 / 0;
          if (n3 === `.nan`) return NaN;
          let i2 = r3 * parseFloat(n3);
          return Number.isFinite(i2) ? i2 : t;
        }
        if (!Ce.test(e2)) return t;
        let r2 = Number(e2);
        return Number.isFinite(r2) ? r2 : t;
      }
      function Ee(e2) {
        if (isNaN(e2)) return `.nan`;
        if (e2 === 1 / 0) return `.inf`;
        if (e2 === -1 / 0) return `-.inf`;
        if (Object.is(e2, -0)) return `-0.0`;
        let t2 = e2.toString(10);
        return /^[-+]?[0-9]+e/.test(t2) ? t2.replace(`e`, `.e`) : t2;
      }
      var De = n(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, ...`0123456789`], resolve: Te, identify: (e2) => typeof e2 == `number` && (!Number.isInteger(e2) || Object.is(e2, -0) || e2.toString(10).indexOf(`e`) >= 0), represent: Ee }), Oe = RegExp(`^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`), ke = RegExp(`^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
      function Ae(e2) {
        if (!Oe.test(e2)) return t;
        let n2 = e2.toLowerCase().replace(/_/g, ``), r2 = n2[0] === `-` ? -1 : 1;
        if (`+-`.includes(n2[0]) && (n2 = n2.slice(1)), n2 === `.inf`) return r2 === 1 ? 1 / 0 : -1 / 0;
        if (n2 === `.nan`) return NaN;
        let i2 = 0;
        if (n2.includes(`:`)) {
          for (let e3 of n2.split(`:`)) i2 = i2 * 60 + Number(e3);
          i2 *= r2;
        } else i2 = r2 * parseFloat(n2);
        return Number.isFinite(i2) || ke.test(e2) ? i2 : t;
      }
      function je(e2) {
        if (isNaN(e2)) return `.nan`;
        if (e2 === 1 / 0) return `.inf`;
        if (e2 === -1 / 0) return `-.inf`;
        if (Object.is(e2, -0)) return `-0.0`;
        let t2 = e2.toString(10);
        return /^[-+]?[0-9]+e/.test(t2) ? t2.replace(`e`, `.e`) : t2;
      }
      var g = n(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, `+`, `.`, ...`0123456789`], resolve: Ae, identify: (e2) => typeof e2 == `number` && (!Number.isInteger(e2) || Object.is(e2, -0) || e2.toString(10).indexOf(`e`) >= 0), represent: je }), Me = n(`tag:yaml.org,2002:merge`, { implicit: true, implicitFirstChars: [`<`], resolve: (e2, n2) => e2 === `<<` || n2 && e2 === `` ? `<<` : t, identify: () => false }), Ne = /^[A-Za-z0-9+/]*={0,2}$/;
      function Pe(e2) {
        let n2 = e2.replace(/\s/g, ``);
        if (n2.length % 4 != 0 || !Ne.test(n2)) return t;
        let r2 = atob(n2), i2 = new Uint8Array(r2.length);
        for (let e3 = 0; e3 < r2.length; e3++) i2[e3] = r2.charCodeAt(e3);
        return i2;
      }
      function Fe(e2) {
        let t2 = ``;
        for (let n2 = 0; n2 < e2.length; n2++) t2 += String.fromCharCode(e2[n2]);
        return btoa(t2);
      }
      var Ie = n(`tag:yaml.org,2002:binary`, { resolve: Pe, identify: (e2) => Object.prototype.toString.call(e2) === `[object Uint8Array]`, represent: Fe }), Le = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`), Re = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);
      function ze(e2, t2, n2, r2 = 0, i2 = 0, a2 = 0, o2 = 0) {
        let s2 = new Date(Date.UTC(e2, t2, n2, r2, i2, a2, o2));
        return s2.setUTCFullYear(e2, t2, n2), s2;
      }
      function Be(e2) {
        let n2 = Le.exec(e2);
        if (n2 === null && (n2 = Re.exec(e2)), n2 === null) return t;
        let r2 = +n2[1], i2 = n2[2] - 1, a2 = +n2[3];
        if (!n2[4]) {
          let e3 = ze(r2, i2, a2);
          return e3.getUTCFullYear() !== r2 || e3.getUTCMonth() !== i2 || e3.getUTCDate() !== a2 ? t : e3;
        }
        let o2 = +n2[4], s2 = +n2[5], c2 = +n2[6], l2 = 0;
        if (o2 > 23 || s2 > 59 || c2 > 59) return t;
        if (n2[7]) {
          let e3 = n2[7].slice(0, 3);
          for (; e3.length < 3; ) e3 += `0`;
          l2 = +e3;
        }
        let u2 = ze(r2, i2, a2, o2, s2, c2, l2);
        if (u2.getUTCFullYear() !== r2 || u2.getUTCMonth() !== i2 || u2.getUTCDate() !== a2) return t;
        if (n2[9]) {
          let e3 = +n2[10], r3 = +(n2[11] || 0);
          if (e3 > 23 || r3 > 59) return t;
          let i3 = (e3 * 60 + r3) * 6e4;
          u2.setTime(u2.getTime() - (n2[9] === `-` ? -i3 : i3));
        }
        return u2;
      }
      var Ve = n(`tag:yaml.org,2002:timestamp`, { implicit: true, implicitFirstChars: [...`0123456789`], resolve: Be, identify: (e2) => e2 instanceof Date, represent: (e2) => e2.toISOString() }), He = r(`tag:yaml.org,2002:seq`, { create: () => [], addItem: (e2, t2) => {
        e2.push(t2);
      }, identify: Array.isArray });
      function _(e2) {
        if (typeof e2 != `object` || !e2 || Array.isArray(e2)) return false;
        let t2 = Object.getPrototypeOf(e2);
        return t2 === null || t2 === Object.prototype;
      }
      function Ue(e2, t2) {
        let n2 = {};
        for (let r2 of t2) e2[r2] !== void 0 && (n2[r2] = e2[r2]);
        return n2;
      }
      var We = r(`tag:yaml.org,2002:omap`, { create: () => ({ list: [], seen: /* @__PURE__ */ new Set() }), addItem: (e2, t2) => {
        let n2;
        if (t2 instanceof Map) {
          if (t2.size !== 1) return `cannot resolve an ordered map item`;
          n2 = t2.keys().next().value;
        } else if (_(t2)) {
          let e3 = Object.keys(t2);
          if (e3.length !== 1) return `cannot resolve an ordered map item`;
          n2 = e3[0];
        } else return `cannot resolve an ordered map item`;
        return e2.seen.has(n2) ? `duplicate key in ordered map` : (e2.seen.add(n2), e2.list.push(t2), ``);
      }, finalize: (e2) => e2.list, identify: () => false }), Ge = r(`tag:yaml.org,2002:pairs`, { create: () => [], addItem: (e2, t2) => {
        if (t2 instanceof Map) return t2.size === 1 ? (e2.push(t2.entries().next().value), ``) : `cannot resolve a pairs item`;
        if (Object.prototype.toString.call(t2) !== `[object Object]`) return `cannot resolve a pairs item`;
        let n2 = t2, r2 = Object.keys(n2);
        return r2.length === 1 ? (e2.push([r2[0], n2[r2[0]]]), ``) : `cannot resolve a pairs item`;
      }, identify: () => false }), Ke = i(`tag:yaml.org,2002:map`, { create: () => ({}), identify: _, represent: (e2) => {
        let t2 = /* @__PURE__ */ new Map();
        for (let n2 of Object.keys(e2)) t2.set(n2, e2[n2]);
        return t2;
      }, addPair: (e2, t2, n2) => {
        if (typeof t2 == `object` && t2) return `object-based map does not support complex keys`;
        let r2 = String(t2);
        return r2 === `__proto__` ? Object.defineProperty(e2, r2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[r2] = n2, ``;
      }, has: (e2, t2) => typeof t2 == `object` && t2 ? false : Object.prototype.hasOwnProperty.call(e2, String(t2)), keys: (e2) => Object.keys(e2), get: (e2, t2) => {
        let n2 = String(t2);
        return Object.prototype.hasOwnProperty.call(e2, n2) ? e2[n2] : null;
      } }), qe = i(`tag:yaml.org,2002:set`, { create: () => /* @__PURE__ */ new Set(), identify: (e2) => e2 instanceof Set, represent: (e2) => {
        let t2 = /* @__PURE__ */ new Map();
        for (let n2 of e2) t2.set(n2, null);
        return t2;
      }, addPair: (e2, t2, n2) => n2 === null ? (e2.add(t2), ``) : `cannot resolve a set item`, has: (e2, t2) => e2.has(t2), keys: (e2) => e2.keys(), get: () => null });
      function v(e2) {
        "@babel/helpers - typeof";
        return v = typeof Symbol == `function` && typeof Symbol.iterator == `symbol` ? function(e3) {
          return typeof e3;
        } : function(e3) {
          return e3 && typeof Symbol == `function` && e3.constructor === Symbol && e3 !== Symbol.prototype ? `symbol` : typeof e3;
        }, v(e2);
      }
      function Je(e2, t2) {
        if (v(e2) != `object` || !e2) return e2;
        var n2 = e2[Symbol.toPrimitive];
        if (n2 !== void 0) {
          var r2 = n2.call(e2, t2 || `default`);
          if (v(r2) != `object`) return r2;
          throw TypeError(`@@toPrimitive must return a primitive value.`);
        }
        return (t2 === `string` ? String : Number)(e2);
      }
      function Ye(e2) {
        var t2 = Je(e2, `string`);
        return v(t2) == `symbol` ? t2 : t2 + ``;
      }
      function y(e2, t2, n2) {
        return (t2 = Ye(t2)) in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t2] = n2, e2;
      }
      function Xe(e2, t2) {
        var n2 = Object.keys(e2);
        if (Object.getOwnPropertySymbols) {
          var r2 = Object.getOwnPropertySymbols(e2);
          t2 && (r2 = r2.filter(function(t3) {
            return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
          })), n2.push.apply(n2, r2);
        }
        return n2;
      }
      function b(e2) {
        for (var t2 = 1; t2 < arguments.length; t2++) {
          var n2 = arguments[t2] == null ? {} : arguments[t2];
          t2 % 2 ? Xe(Object(n2), true).forEach(function(t3) {
            y(e2, t3, n2[t3]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(n2)) : Xe(Object(n2)).forEach(function(t3) {
            Object.defineProperty(e2, t3, Object.getOwnPropertyDescriptor(n2, t3));
          });
        }
        return e2;
      }
      function Ze() {
        return { scalar: /* @__PURE__ */ Object.create(null), sequence: /* @__PURE__ */ Object.create(null), mapping: /* @__PURE__ */ Object.create(null) };
      }
      function Qe() {
        return { scalar: [], sequence: [], mapping: [] };
      }
      function $e(e2) {
        let t2 = [];
        for (let n2 of e2) {
          let e3 = t2.length;
          for (let r2 = 0; r2 < t2.length; r2++) {
            let i2 = t2[r2];
            if (i2.nodeKind === n2.nodeKind && i2.tagName === n2.tagName && i2.matchByTagPrefix === n2.matchByTagPrefix) {
              e3 = r2;
              break;
            }
          }
          t2[e3] = n2;
        }
        return t2;
      }
      var x = class e2 {
        constructor(e3) {
          y(this, `tags`, void 0), y(this, `implicitScalarTags`, void 0), y(this, `implicitScalarByFirstChar`, void 0), y(this, `implicitScalarAnyFirstChar`, void 0), y(this, `defaultScalarTag`, void 0), y(this, `defaultSequenceTag`, void 0), y(this, `defaultMappingTag`, void 0), y(this, `exact`, void 0), y(this, `prefix`, void 0);
          let t2 = $e(e3), n2 = [], r2 = Ze(), i2 = Qe();
          for (let e4 of t2) {
            if (e4.nodeKind === `scalar` && e4.implicit) {
              if (e4.matchByTagPrefix) throw Error(`Implicit scalar tags cannot match by tag prefix`);
              n2.push(e4);
            }
            switch (e4.nodeKind) {
              case `scalar`:
                e4.matchByTagPrefix ? i2.scalar.push(e4) : r2.scalar[e4.tagName] = e4;
                break;
              case `sequence`:
                e4.matchByTagPrefix ? i2.sequence.push(e4) : r2.sequence[e4.tagName] = e4;
                break;
              case `mapping`:
                e4.matchByTagPrefix ? i2.mapping.push(e4) : r2.mapping[e4.tagName] = e4;
            }
          }
          let a2 = n2.filter((e4) => e4.implicitFirstChars === null), o2 = /* @__PURE__ */ new Set();
          for (let e4 of n2) if (e4.implicitFirstChars !== null) for (let t3 of e4.implicitFirstChars) o2.add(t3);
          let s2 = /* @__PURE__ */ new Map();
          for (let e4 of o2) s2.set(e4, n2.filter((t3) => t3.implicitFirstChars === null || t3.implicitFirstChars.indexOf(e4) !== -1));
          let c2 = r2.scalar[`tag:yaml.org,2002:str`];
          if (!c2) throw Error(`schema does not define the default scalar tag (tag:yaml.org,2002:str)`);
          this.tags = t2, this.implicitScalarTags = n2, this.implicitScalarByFirstChar = s2, this.implicitScalarAnyFirstChar = a2, this.defaultScalarTag = c2, this.defaultSequenceTag = r2.sequence[`tag:yaml.org,2002:seq`], this.defaultMappingTag = r2.mapping[`tag:yaml.org,2002:map`], this.exact = r2, this.prefix = i2;
        }
        lookupScalarTag(e3) {
          let t2 = this.exact.scalar[e3];
          if (t2) return t2;
          for (let t3 of this.prefix.scalar) if (e3.startsWith(t3.tagName)) return t3;
        }
        lookupSequenceTag(e3) {
          let t2 = this.exact.sequence[e3];
          if (t2) return t2;
          for (let t3 of this.prefix.sequence) if (e3.startsWith(t3.tagName)) return t3;
        }
        lookupMappingTag(e3) {
          let t2 = this.exact.mapping[e3];
          if (t2) return t2;
          for (let t3 of this.prefix.mapping) if (e3.startsWith(t3.tagName)) return t3;
        }
        resolveImplicitScalarTag(e3) {
          var n2;
          let r2 = (n2 = this.implicitScalarByFirstChar.get(e3.charAt(0))) == null ? this.implicitScalarAnyFirstChar : n2;
          for (let n3 of r2) {
            let r3 = n3.resolve(e3, false, n3.tagName);
            if (r3 !== t) return { value: r3, tag: n3 };
          }
          let i2 = this.defaultScalarTag;
          return { value: i2.resolve(e3, false, i2.tagName), tag: i2 };
        }
        withTags(...t2) {
          let n2 = [];
          for (let e3 of t2) n2 = n2.concat(e3);
          return new e2([...this.tags, ...n2]);
        }
      }, et = new x([a, He, Ke]), tt = new x([...et.tags, c, ee, pe, De]), nt = new x([...et.tags, s, p, ce, Se]), rt = new x([...et.tags, u, re, _e, g, Ve, Me, Ie, We, Ge, qe]), it = rt.withTags(b(b({}, _e), {}, { resolve: (e2, n2, r2) => {
        let i2 = _e.resolve(e2, n2, r2);
        return i2 === t ? ce.resolve(e2, n2, r2) : i2;
      } }), b(b({}, g), {}, { resolve: (e2, n2, r2) => {
        let i2 = g.resolve(e2, n2, r2);
        return i2 === t ? Se.resolve(e2, n2, r2) : i2;
      } })), at = i(`tag:yaml.org,2002:map`, { create: () => /* @__PURE__ */ new Map(), addPair: (e2, t2, n2) => (e2.set(t2, n2), ``), has: (e2, t2) => e2.has(t2), keys: (e2) => e2.keys(), get: (e2, t2) => e2.get(t2), identify: (e2) => e2 instanceof Map || _(e2), represent: (e2) => {
        if (e2 instanceof Map) return e2;
        let t2 = /* @__PURE__ */ new Map(), n2 = e2;
        for (let e3 of Object.keys(n2)) t2.set(e3, n2[e3]);
        return t2;
      } });
      function ot(e2) {
        if (Array.isArray(e2)) {
          let t2 = Array.prototype.slice.call(e2);
          for (let e3 = 0; e3 < t2.length; e3++) {
            if (Array.isArray(t2[e3])) return null;
            typeof t2[e3] == `object` && Object.prototype.toString.call(t2[e3]) === `[object Object]` && (t2[e3] = `[object Object]`);
          }
          return String(t2);
        }
        return typeof e2 == `object` && Object.prototype.toString.call(e2) === `[object Object]` ? `[object Object]` : String(e2);
      }
      var st = i(`tag:yaml.org,2002:map`, { create: () => ({}), identify: _, represent: (e2) => {
        let t2 = /* @__PURE__ */ new Map();
        for (let n2 of Object.keys(e2)) t2.set(n2, e2[n2]);
        return t2;
      }, addPair: (e2, t2, n2) => {
        let r2 = ot(t2);
        return r2 === null ? `nested arrays are not supported inside keys` : (r2 === `__proto__` ? Object.defineProperty(e2, r2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[r2] = n2, ``);
      }, has: (e2, t2) => {
        let n2 = ot(t2);
        return n2 !== null && Object.prototype.hasOwnProperty.call(e2, n2);
      }, keys: (e2) => Object.keys(e2), get: (e2, t2) => {
        let n2 = String(t2);
        return Object.prototype.hasOwnProperty.call(e2, n2) ? e2[n2] : null;
      } }), ct = { maxLength: 79, indent: 1, linesBefore: 3, linesAfter: 2 };
      function lt(e2, t2, n2, r2, i2) {
        let a2 = ``, o2 = ``, s2 = Math.floor(i2 / 2) - 1;
        return r2 - t2 > s2 && (a2 = ` ... `, t2 = r2 - s2 + a2.length), n2 - r2 > s2 && (o2 = ` ...`, n2 = r2 + s2 - o2.length), { str: a2 + e2.slice(t2, n2).replace(/\t/g, `\u2192`) + o2, pos: r2 - t2 + a2.length };
      }
      function ut(e2, t2) {
        return ` `.repeat(Math.max(t2 - e2.length, 0)) + e2;
      }
      function dt(e2, t2) {
        if (!e2.buffer) return null;
        let n2 = b(b({}, ct), t2), r2 = /\r?\n|\r|\0/g, i2 = [0], a2 = [], o2, s2 = -1;
        for (; o2 = r2.exec(e2.buffer); ) a2.push(o2.index), i2.push(o2.index + o2[0].length), e2.position <= o2.index && s2 < 0 && (s2 = i2.length - 2);
        s2 < 0 && (s2 = i2.length - 1);
        let c2 = ``, l2 = Math.min(e2.line + n2.linesAfter, a2.length).toString().length, u2 = n2.maxLength - (n2.indent + l2 + 3);
        for (let t3 = 1; t3 <= n2.linesBefore && !(s2 - t3 < 0); t3++) {
          let r3 = lt(e2.buffer, i2[s2 - t3], a2[s2 - t3], e2.position - (i2[s2] - i2[s2 - t3]), u2);
          c2 = `${` `.repeat(n2.indent)}${ut((e2.line - t3 + 1).toString(), l2)} | ${r3.str}
${c2}`;
        }
        let d2 = lt(e2.buffer, i2[s2], a2[s2], e2.position, u2);
        c2 += `${` `.repeat(n2.indent)}${ut((e2.line + 1).toString(), l2)} | ${d2.str}
`, c2 += `${`-`.repeat(n2.indent + l2 + 3 + d2.pos)}^
`;
        for (let t3 = 1; t3 <= n2.linesAfter && !(s2 + t3 >= a2.length); t3++) {
          let r3 = lt(e2.buffer, i2[s2 + t3], a2[s2 + t3], e2.position - (i2[s2] - i2[s2 + t3]), u2);
          c2 += `${` `.repeat(n2.indent)}${ut((e2.line + t3 + 1).toString(), l2)} | ${r3.str}
`;
        }
        return c2.replace(/\n$/, ``);
      }
      function ft(e2, t2) {
        let n2 = ``;
        return e2.mark ? (e2.mark.name && (n2 += `in "${e2.mark.name}" `), n2 += `(${e2.mark.line + 1}:${e2.mark.column + 1})`, !t2 && e2.mark.snippet && (n2 += `

${e2.mark.snippet}`), `${e2.reason} ${n2}`) : e2.reason;
      }
      var S = class e2 extends Error {
        constructor(e3, t2) {
          super(), y(this, `reason`, void 0), y(this, `mark`, void 0), this.name = `YAMLException`, this.reason = e3, this.mark = t2, this.message = ft(this, false), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        }
        toString(e3) {
          return `${this.name}: ${ft(this, e3)}`;
        }
        static throwAt(t2, n2, r2, i2 = ``) {
          let a2 = 0, o2 = 0;
          for (let e3 = 0; e3 < n2; e3++) {
            let n3 = t2.charCodeAt(e3);
            n3 === 10 ? (a2++, o2 = e3 + 1) : n3 === 13 && (a2++, t2.charCodeAt(e3 + 1) === 10 && e3++, o2 = e3 + 1);
          }
          let s2 = { name: i2, buffer: t2, position: n2, line: a2, column: n2 - o2 };
          throw s2.snippet = dt(s2), new e2(r2, s2);
        }
      }, C = { DOCUMENT: 1, SEQUENCE: 2, MAPPING: 3, SCALAR: 4, ALIAS: 5, POP: 6 }, w = { PLAIN: 1, SINGLE_QUOTED: 2, DOUBLE_QUOTED: 3, LITERAL_BLOCK: 4, FOLDED_BLOCK: 5 }, T = { BLOCK: 1, FLOW: 2 }, E = { CLIP: 1, STRIP: 2, KEEP: 3 }, pt = -1;
      function mt(e2) {
        switch (e2) {
          case 48:
            return `\0`;
          case 97:
            return `\x07`;
          case 98:
            return `\b`;
          case 116:
            return `	`;
          case 9:
            return `	`;
          case 110:
            return `
`;
          case 118:
            return `\v`;
          case 102:
            return `\f`;
          case 114:
            return `\r`;
          case 101:
            return `\x1B`;
          case 32:
            return ` `;
          case 34:
            return `"`;
          case 47:
            return `/`;
          case 92:
            return `\\`;
          case 78:
            return `\x85`;
          case 95:
            return `\xA0`;
          case 76:
            return `\u2028`;
          case 80:
            return `\u2029`;
          default:
            return ``;
        }
      }
      var ht = Array(256), gt = Array(256);
      for (let e2 = 0; e2 < 256; e2++) ht[e2] = +!!mt(e2), gt[e2] = mt(e2);
      function _t(e2) {
        return e2 <= 65535 ? String.fromCharCode(e2) : String.fromCharCode((e2 - 65536 >> 10) + 55296, (e2 - 65536 & 1023) + 56320);
      }
      function vt(e2) {
        return e2 >= 48 && e2 <= 57 ? e2 - 48 : (e2 | 32) - 97 + 10;
      }
      function yt(e2) {
        return e2 === 120 ? 2 : e2 === 117 ? 4 : 8;
      }
      function D(e2, t2, n2) {
        let r2 = 0;
        for (; t2 < n2; ) {
          let n3 = e2.charCodeAt(t2);
          if (n3 === 10) r2++, t2++;
          else if (n3 === 13) r2++, t2++, e2.charCodeAt(t2) === 10 && t2++;
          else if (n3 === 32 || n3 === 9) t2++;
          else break;
        }
        return { position: t2, breaks: r2 };
      }
      function bt(e2) {
        return e2 === 1 ? ` ` : `
`.repeat(e2 - 1);
      }
      function xt(e2, t2, n2) {
        let r2 = ``, i2 = t2, a2 = t2, o2 = t2;
        for (; i2 < n2; ) {
          let t3 = e2.charCodeAt(i2);
          if (t3 === 10 || t3 === 13) {
            r2 += e2.slice(a2, o2);
            let t4 = D(e2, i2, n2);
            r2 += bt(t4.breaks), i2 = a2 = o2 = t4.position;
          } else i2++, t3 !== 32 && t3 !== 9 && (o2 = i2);
        }
        return r2 + e2.slice(a2, o2);
      }
      function St(e2, t2, n2) {
        let r2 = ``, i2 = t2, a2 = t2, o2 = t2;
        for (; i2 < n2; ) {
          let t3 = e2.charCodeAt(i2);
          if (t3 === 39) r2 += e2.slice(a2, i2) + `'`, i2 += 2, a2 = o2 = i2;
          else if (t3 === 10 || t3 === 13) {
            r2 += e2.slice(a2, o2);
            let t4 = D(e2, i2, n2);
            r2 += bt(t4.breaks), i2 = a2 = o2 = t4.position;
          } else i2++, t3 !== 32 && t3 !== 9 && (o2 = i2);
        }
        return r2 + e2.slice(a2, n2);
      }
      function Ct(e2, t2, n2) {
        let r2 = ``, i2 = t2, a2 = t2, o2 = t2;
        for (; i2 < n2; ) {
          let t3 = e2.charCodeAt(i2);
          if (t3 === 92) {
            r2 += e2.slice(a2, i2), i2++;
            let t4 = e2.charCodeAt(i2);
            if (t4 === 10 || t4 === 13) i2 = D(e2, i2, n2).position;
            else if (t4 < 256 && ht[t4]) r2 += gt[t4], i2++;
            else {
              let n3 = yt(t4), a3 = 0;
              for (; n3 > 0; n3--) {
                i2++;
                let t5 = vt(e2.charCodeAt(i2));
                a3 = (a3 << 4) + t5;
              }
              r2 += _t(a3), i2++;
            }
            a2 = o2 = i2;
          } else if (t3 === 10 || t3 === 13) {
            r2 += e2.slice(a2, o2);
            let t4 = D(e2, i2, n2);
            r2 += bt(t4.breaks), i2 = a2 = o2 = t4.position;
          } else i2++, t3 !== 32 && t3 !== 9 && (o2 = i2);
        }
        return r2 + e2.slice(a2, n2);
      }
      function wt(e2, t2, n2, r2, i2, a2) {
        let o2 = r2 < 0 ? 0 : r2, s2 = e2.slice(t2, n2).replace(/\r\n?/g, `
`), c2 = s2 === `` ? [] : (s2.endsWith(`
`) ? s2.slice(0, -1) : s2).split(`
`), l2 = ``, u2 = false, d2 = 0, f2 = false;
        for (let e3 of c2) {
          let t3 = 0;
          for (; t3 < o2 && e3.charCodeAt(t3) === 32; ) t3++;
          if (r2 < 0 || t3 >= e3.length) {
            d2++;
            continue;
          }
          let n3 = e3.slice(o2), i3 = n3.charCodeAt(0);
          a2 ? i3 === 32 || i3 === 9 ? (f2 = true, l2 += `
`.repeat(u2 ? 1 + d2 : d2)) : f2 ? (f2 = false, l2 += `
`.repeat(d2 + 1)) : d2 === 0 ? u2 && (l2 += ` `) : l2 += `
`.repeat(d2) : l2 += `
`.repeat(u2 ? 1 + d2 : d2), l2 += n3, u2 = true, d2 = 0;
        }
        return i2 === E.KEEP ? l2 += `
`.repeat(u2 ? 1 + d2 : d2) : i2 !== E.STRIP && u2 && (l2 += `
`), l2;
      }
      function Tt(e2, t2) {
        if (t2.valueStart === pt) return ``;
        let { valueStart: n2, valueEnd: r2 } = t2;
        if (t2.fast) return e2.slice(n2, r2);
        switch (t2.style) {
          case w.SINGLE_QUOTED:
            return St(e2, n2, r2);
          case w.DOUBLE_QUOTED:
            return Ct(e2, n2, r2);
          case w.LITERAL_BLOCK:
            return wt(e2, n2, r2, t2.indent, t2.chomping, false);
          case w.FOLDED_BLOCK:
            return wt(e2, n2, r2, t2.indent, t2.chomping, true);
          default:
            return xt(e2, n2, r2);
        }
      }
      var Et = Object.assign(/* @__PURE__ */ Object.create(null), { "!": `!`, "!!": `tag:yaml.org,2002:` }), Dt = `-#;/?:@&=+$_.~*'()`, Ot = Dt + `!,[]`, kt = `0123456789ABCDEF`;
      function O(e2) {
        return `%` + kt[e2 >> 4] + kt[e2 & 15];
      }
      function At(e2, t2) {
        let n2 = t2 ? Dt : Ot, r2 = ``;
        for (let t3 = 0; t3 < e2.length; t3++) {
          let i2 = e2.charCodeAt(t3);
          i2 >= 48 && i2 <= 57 || i2 >= 65 && i2 <= 90 || i2 >= 97 && i2 <= 122 || n2.includes(e2[t3]) ? r2 += e2[t3] : (i2 >= 55296 && i2 <= 56319 && (i2 = 65536 + ((i2 & 1023) << 10) + (e2.charCodeAt(++t3) & 1023)), r2 += i2 < 128 ? O(i2) : i2 < 2048 ? O(192 | i2 >> 6) + O(128 | i2 & 63) : i2 < 65536 ? O(224 | i2 >> 12) + O(128 | i2 >> 6 & 63) + O(128 | i2 & 63) : O(240 | i2 >> 18) + O(128 | i2 >> 12 & 63) + O(128 | i2 >> 6 & 63) + O(128 | i2 & 63));
        }
        return r2;
      }
      function jt(e2) {
        let t2 = ``, n2 = 0;
        for (; n2 < e2.length; ) {
          if (e2.charCodeAt(n2) !== 37) {
            t2 += e2[n2++];
            continue;
          }
          let r2 = parseInt(e2.slice(n2 + 1, n2 + 3), 16);
          if (n2 += 3, r2 >= 192) {
            let t3 = r2 < 224 ? 1 : r2 < 240 ? 2 : 3;
            for (r2 &= (1 << 6 - t3) - 1; t3-- > 0; ) r2 = r2 << 6 | parseInt(e2.slice(n2 + 1, n2 + 3), 16) & 63, n2 += 3;
          }
          r2 < 65536 ? t2 += String.fromCharCode(r2) : (r2 -= 65536, t2 += String.fromCharCode(55296 | r2 >> 10, 56320 | r2 & 1023));
        }
        return t2;
      }
      function Mt(e2, t2) {
        var n2, r2;
        if (e2.startsWith(`!<`) && e2.endsWith(`>`)) return jt(e2.slice(2, -1));
        let i2 = e2.indexOf(`!`, 1), a2 = i2 === -1 ? `!` : e2.slice(0, i2 + 1);
        return jt((n2 = (r2 = t2 == null ? void 0 : t2[a2]) == null ? Et[a2] : r2) == null ? a2 : n2) + jt(e2.slice(a2.length));
      }
      function Nt(e2) {
        let t2 = e2;
        return t2.charCodeAt(0) === 33 ? (t2 = t2.slice(1), `!${At(t2, true)}`) : t2.slice(0, 18) === `tag:yaml.org,2002:` ? `!!${At(t2.slice(18), true)}` : `!<${At(t2, false)}>`;
      }
      var k = -1, Pt = `tag:yaml.org,2002:merge`, Ft = { filename: ``, schema: nt, json: false, maxTotalMergeKeys: 1e4, maxAliases: -1 };
      function It(e2) {
        return `tagStart` in e2 && e2.tagStart !== k ? e2.tagStart : `anchorStart` in e2 && e2.anchorStart !== k ? e2.anchorStart : `valueStart` in e2 && e2.valueStart !== k ? e2.valueStart : `start` in e2 ? e2.start : 0;
      }
      function A(e2, t2) {
        S.throwAt(e2.source, e2.position, t2, e2.filename);
      }
      function Lt(e2, t2, n2, r2) {
        try {
          return n2.finalize(r2);
        } catch (n3) {
          if (n3 instanceof S) throw n3;
          S.throwAt(e2.source, t2, n3 instanceof Error ? n3.message : String(n3), e2.filename);
        }
      }
      function Rt(e2, n2) {
        let r2 = Tt(e2.source, n2), i2 = n2.tagStart === k ? `` : e2.source.slice(n2.tagStart, n2.tagEnd), a2 = e2.schema.defaultScalarTag;
        if (i2 !== ``) {
          var o2;
          if (i2 === `!`) return { value: r2, tag: a2 };
          let n3 = Mt(i2, e2.tagHandlers), s2 = e2.schema.lookupScalarTag(n3);
          if (s2) {
            let i3 = s2.resolve(r2, true, n3);
            return i3 === t && A(e2, `cannot resolve a node with !<${n3}> explicit tag`), { value: i3, tag: s2 };
          }
          let c2 = (o2 = e2.schema.lookupMappingTag(n3)) == null ? e2.schema.lookupSequenceTag(n3) : o2;
          if (c2) {
            r2 !== `` && A(e2, `cannot resolve a node with !<${n3}> explicit tag`);
            let t2 = c2.create(n3);
            return { value: c2.carrierIsResult ? t2 : Lt(e2, e2.position, c2, t2), tag: c2 };
          }
          A(e2, `unknown scalar tag !<${n3}>`);
        }
        return n2.style === w.PLAIN ? e2.schema.resolveImplicitScalarTag(r2) : { value: a2.resolve(r2, false, a2.tagName), tag: a2 };
      }
      function zt(e2, t2, n2) {
        let r2 = t2.tagStart === k ? `` : e2.source.slice(t2.tagStart, t2.tagEnd);
        return r2 === `` || r2 === `!` ? n2 : Mt(r2, e2.tagHandlers);
      }
      function Bt(e2) {
        return e2.nodeKind === `mapping`;
      }
      function Vt(e2) {
        e2.totalMergeKeys++, e2.maxTotalMergeKeys !== -1 && e2.totalMergeKeys > e2.maxTotalMergeKeys && A(e2, `merge keys exceeded maxTotalMergeKeys (${e2.maxTotalMergeKeys})`);
      }
      function Ht(e2, t2, n2, r2) {
        Vt(e2);
        for (let i2 of r2.keys(n2)) {
          if (Vt(e2), t2.tag.has(t2.value, i2)) continue;
          let a2 = t2.tag.addPair(t2.value, i2, r2.get(n2, i2));
          a2 && A(e2, a2), t2.overridable != null || (t2.overridable = /* @__PURE__ */ new Set()), t2.overridable.add(i2);
        }
      }
      function Ut(e2, t2, n2, r2) {
        if (e2.position = t2.keyPosition, Bt(r2)) Ht(e2, t2, n2, r2);
        else if (r2.nodeKind === `sequence` && Array.isArray(n2)) {
          n2.length > 100 && A(e2, `abnormal merge sequence size`);
          for (let r3 of n2) {
            let n3 = e2.nodeTags.get(r3);
            n3 || A(e2, `cannot merge mappings; the provided source object is unacceptable`), Ht(e2, t2, r3, n3);
          }
        } else A(e2, `cannot merge mappings; the provided source object is unacceptable`);
      }
      function Wt(e2, t2, n2, r2, i2) {
        var a2, o2;
        if (e2.position = t2.keyPosition, t2.keyIsMerge) {
          Ut(e2, t2, r2, i2);
          return;
        }
        !e2.json && t2.tag.has(t2.value, n2) && !((a2 = t2.overridable) != null && a2.has(n2)) && A(e2, `duplicated mapping key`);
        let s2 = t2.tag.addPair(t2.value, n2, r2);
        s2 && A(e2, s2), (o2 = t2.overridable) == null || o2.delete(n2);
      }
      function Gt(e2, t2, n2) {
        let r2 = e2.frames[e2.frames.length - 1];
        if (r2.kind === `document`) r2.value = t2, r2.hasValue = true;
        else if (r2.kind === `sequence`) {
          Bt(n2) && e2.nodeTags.set(t2, n2);
          let i2 = r2.tag.addItem(r2.value, t2, r2.index++);
          i2 && A(e2, i2);
        } else if (r2.hasKey) {
          let i2 = r2.key;
          r2.key = void 0, r2.hasKey = false, Wt(e2, r2, i2, t2, n2);
        } else r2.key = t2, r2.keyPosition = e2.position, r2.hasKey = true, r2.keyIsMerge = n2.tagName === Pt;
      }
      function Kt(e2, t2, n2, r2, i2) {
        if (t2.anchorStart !== k) {
          let a2 = { value: n2, tag: r2, isValueFinal: i2 };
          return e2.anchors.set(e2.source.slice(t2.anchorStart, t2.anchorEnd), a2), a2;
        }
        return null;
      }
      function qt(e2, t2) {
        let n2 = b(b(b({}, Ft), t2), {}, { events: e2, documents: [], eventIndex: 0, position: 0, frames: [], anchors: /* @__PURE__ */ new Map(), nodeTags: /* @__PURE__ */ new Map(), tagHandlers: /* @__PURE__ */ Object.create(null), totalMergeKeys: 0, aliasCount: 0 });
        for (; n2.eventIndex < n2.events.length; ) {
          let e3 = n2.events[n2.eventIndex++];
          switch (n2.position = It(e3), e3.type) {
            case C.DOCUMENT:
              n2.anchors = /* @__PURE__ */ new Map(), n2.nodeTags = /* @__PURE__ */ new Map(), n2.aliasCount = 0, n2.tagHandlers = /* @__PURE__ */ Object.create(null);
              for (let t3 of e3.directives) t3.kind === `tag` && (n2.tagHandlers[t3.handle] = t3.prefix);
              n2.frames.push({ kind: `document`, position: n2.position, value: void 0, hasValue: false });
              break;
            case C.SCALAR: {
              let { value: t3, tag: r2 } = Rt(n2, e3);
              Kt(n2, e3, t3, r2, true), Gt(n2, t3, r2);
              break;
            }
            case C.SEQUENCE: {
              let t3 = zt(n2, e3, `tag:yaml.org,2002:seq`), r2 = n2.schema.lookupSequenceTag(t3);
              r2 || A(n2, `unknown sequence tag !<${t3}>`);
              let i2 = r2.create(t3), a2 = Kt(n2, e3, i2, r2, r2.carrierIsResult);
              n2.frames.push({ kind: `sequence`, position: n2.position, value: i2, tag: r2, anchor: a2, index: 0 });
              break;
            }
            case C.MAPPING: {
              let t3 = zt(n2, e3, `tag:yaml.org,2002:map`), r2 = n2.schema.lookupMappingTag(t3);
              r2 || A(n2, `unknown mapping tag !<${t3}>`);
              let i2 = r2.create(t3), a2 = Kt(n2, e3, i2, r2, r2.carrierIsResult);
              n2.frames.push({ kind: `mapping`, position: n2.position, value: i2, tag: r2, anchor: a2, key: void 0, keyPosition: n2.position, hasKey: false, keyIsMerge: false, overridable: null });
              break;
            }
            case C.ALIAS: {
              n2.maxAliases !== -1 && ++n2.aliasCount > n2.maxAliases && A(n2, `aliases exceeded maxAliases (${n2.maxAliases})`);
              let t3 = n2.source.slice(e3.anchorStart, e3.anchorEnd), r2 = n2.anchors.get(t3);
              r2 || A(n2, `unidentified alias "${t3}"`), r2.isValueFinal || A(n2, `recursive alias "${t3}" is not supported for tag ${r2.tag.tagName} because it uses finalize()`), Gt(n2, r2.value, r2.tag);
              break;
            }
            case C.POP: {
              let e4 = n2.frames.pop();
              if (e4.kind === `mapping` && e4.hasKey && (n2.position = e4.keyPosition, A(n2, `incomplete mapping pair in event stream`)), e4.kind === `document`) n2.documents.push(e4.value);
              else {
                let t3 = e4.tag.carrierIsResult ? e4.value : Lt(n2, e4.position, e4.tag, e4.value);
                e4.anchor && (e4.anchor.value = t3, e4.anchor.isValueFinal = true), Gt(n2, t3, e4.tag);
              }
              break;
            }
          }
        }
        return n2.documents;
      }
      var j = -1, Jt = Object.prototype.hasOwnProperty, M = 1, Yt = 2, Xt = 3, N = 4, Zt = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Qt = /[,\[\]{}]/, $t = /^(?:!|!!|![0-9A-Za-z-]+!)$/, en = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`, tn = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`, nn = RegExp(`^(?:${en})*$`), rn = RegExp(`^(?:${tn})+$`), an = RegExp(`^(?:!(?:${en})*|${tn}(?:${en})*)$`), on = { filename: ``, maxDepth: 100 };
      function sn(e2, t2, n2) {
        e2.events.push({ type: C.DOCUMENT, explicitStart: t2, explicitEnd: n2, directives: e2.directives });
      }
      function cn(e2, t2, n2, r2, i2, a2, o2) {
        e2.events.push({ type: C.SEQUENCE, start: t2, anchorStart: n2, anchorEnd: r2, tagStart: i2, tagEnd: a2, style: o2 });
      }
      function ln(e2, t2, n2, r2, i2, a2, o2) {
        e2.events.push({ type: C.MAPPING, start: t2, anchorStart: n2, anchorEnd: r2, tagStart: i2, tagEnd: a2, style: o2 });
      }
      function un(e2, t2) {
        e2.events.splice(t2.eventsLength, 0, { type: C.MAPPING, start: t2.position, anchorStart: j, anchorEnd: j, tagStart: j, tagEnd: j, style: T.FLOW });
      }
      function P(e2, t2, n2, r2, i2, a2, o2, s2, c2 = E.CLIP, l2 = -1, u2 = false) {
        e2.events.push({ type: C.SCALAR, valueStart: t2, valueEnd: n2, anchorStart: r2, anchorEnd: i2, tagStart: a2, tagEnd: o2, style: s2, chomping: c2, indent: l2, fast: u2 });
      }
      function dn(e2, t2, n2) {
        e2.events.push({ type: C.ALIAS, anchorStart: t2, anchorEnd: n2 });
      }
      function F(e2) {
        e2.events.push({ type: C.POP });
      }
      function I(e2) {
        P(e2, j, j, j, j, j, j, w.PLAIN);
      }
      function fn() {
        return { anchorStart: j, anchorEnd: j, tagStart: j, tagEnd: j };
      }
      function L(e2) {
        return { position: e2.position, line: e2.line, lineStart: e2.lineStart, lineIndent: e2.lineIndent, firstTabInLine: e2.firstTabInLine, eventsLength: e2.events.length };
      }
      function R(e2, t2) {
        e2.position = t2.position, e2.line = t2.line, e2.lineStart = t2.lineStart, e2.lineIndent = t2.lineIndent, e2.firstTabInLine = t2.firstTabInLine, e2.events.length = t2.eventsLength;
      }
      function z(e2, t2) {
        S.throwAt(e2.input.slice(0, e2.length), e2.position, t2, e2.filename);
      }
      function B(e2) {
        return e2 === 10 || e2 === 13;
      }
      function V(e2) {
        return e2 === 9 || e2 === 32;
      }
      function H(e2) {
        return V(e2) || B(e2);
      }
      function U(e2) {
        return e2 === 0 || H(e2);
      }
      function W(e2) {
        return e2 === 44 || e2 === 91 || e2 === 93 || e2 === 123 || e2 === 125;
      }
      function pn(e2) {
        return e2 >= 48 && e2 <= 57 ? e2 - 48 : -1;
      }
      function mn(e2) {
        if (e2 >= 48 && e2 <= 57) return e2 - 48;
        let t2 = e2 | 32;
        return t2 >= 97 && t2 <= 102 ? t2 - 97 + 10 : -1;
      }
      function hn(e2) {
        return e2 === 120 ? 2 : e2 === 117 ? 4 : e2 === 85 ? 8 : 0;
      }
      function gn(e2) {
        return e2 === 48 || e2 === 97 || e2 === 98 || e2 === 116 || e2 === 9 || e2 === 110 || e2 === 118 || e2 === 102 || e2 === 114 || e2 === 101 || e2 === 32 || e2 === 34 || e2 === 47 || e2 === 92 || e2 === 78 || e2 === 95 || e2 === 76 || e2 === 80;
      }
      function _n(e2) {
        e2.input.charCodeAt(e2.position) === 10 ? e2.position++ : (e2.position++, e2.input.charCodeAt(e2.position) === 10 && e2.position++), e2.line++, e2.lineStart = e2.position, e2.lineIndent = 0, e2.firstTabInLine = -1;
      }
      function G(e2, t2) {
        let n2 = 0, r2 = e2.input.charCodeAt(e2.position), i2 = e2.position === e2.lineStart || H(e2.input.charCodeAt(e2.position - 1));
        for (; r2 !== 0; ) {
          for (; V(r2); ) i2 = true, r2 === 9 && e2.firstTabInLine === -1 && (e2.firstTabInLine = e2.position), r2 = e2.input.charCodeAt(++e2.position);
          if (t2 && i2 && r2 === 35) do
            r2 = e2.input.charCodeAt(++e2.position);
          while (!B(r2) && r2 !== 0);
          if (!B(r2)) break;
          for (_n(e2), n2++, i2 = true, r2 = e2.input.charCodeAt(e2.position); r2 === 32; ) e2.lineIndent++, r2 = e2.input.charCodeAt(++e2.position);
        }
        return n2;
      }
      function K(e2, t2 = e2.position) {
        let n2 = e2.input.charCodeAt(t2);
        if ((n2 === 45 || n2 === 46) && n2 === e2.input.charCodeAt(t2 + 1) && n2 === e2.input.charCodeAt(t2 + 2)) {
          let n3 = e2.input.charCodeAt(t2 + 3);
          return n3 === 0 || H(n3);
        }
        return false;
      }
      function vn(e2) {
        e2.position === e2.lineStart && e2.input.charCodeAt(e2.position) === 65279 && (e2.position++, e2.lineStart = e2.position);
      }
      function yn(e2) {
        if (e2.position !== e2.lineStart) return false;
        if (K(e2)) return true;
        if (e2.input.charCodeAt(e2.position) !== 65279) return false;
        let t2 = L(e2);
        vn(e2), G(e2, true);
        let n2 = e2.input.charCodeAt(e2.position), r2 = e2.position === e2.lineStart && (n2 === 37 || n2 === 45 && K(e2));
        return R(e2, t2), r2;
      }
      function bn(e2) {
        let t2 = e2.input.charCodeAt(e2.position);
        for (; t2 !== 0 && !B(t2); ) t2 = e2.input.charCodeAt(++e2.position);
      }
      function xn(e2, t2, n2) {
        let r2 = Zt.exec(e2.input.slice(t2, n2));
        r2 !== null && (e2.position = t2 + r2.index + r2[0].length - 1, z(e2, `the stream contains non-printable characters`));
      }
      function Sn(e2, t2, n2) {
        if (e2.input.charCodeAt(e2.position) !== 33) return false;
        t2.tagStart !== j && z(e2, `duplication of a tag property`);
        let r2 = e2.position, i2 = false, a2 = false, o2 = `!`, s2 = e2.input.charCodeAt(++e2.position);
        s2 === 60 ? (i2 = true, s2 = e2.input.charCodeAt(++e2.position)) : s2 === 33 && (a2 = true, o2 = `!!`, s2 = e2.input.charCodeAt(++e2.position));
        let c2 = e2.position, l2;
        if (i2) {
          for (; s2 !== 0 && s2 !== 62; ) s2 = e2.input.charCodeAt(++e2.position);
          s2 !== 62 && z(e2, `unexpected end of the stream within a verbatim tag`), l2 = e2.input.slice(c2, e2.position), e2.position++;
        } else {
          for (; s2 !== 0 && !H(s2) && !(n2 && W(s2)); ) s2 === 33 && (a2 ? z(e2, `tag suffix cannot contain exclamation marks`) : (o2 = e2.input.slice(c2 - 1, e2.position + 1), $t.test(o2) || z(e2, `named tag handle cannot contain such characters`), a2 = true, c2 = e2.position + 1)), s2 = e2.input.charCodeAt(++e2.position);
          l2 = e2.input.slice(c2, e2.position), Qt.test(l2) && z(e2, `tag suffix cannot contain flow indicator characters`);
        }
        return l2 && !(i2 ? nn.test(l2) : rn.test(l2)) && z(e2, `tag name cannot contain such characters: ${l2}`), !i2 && o2 !== `!` && o2 !== `!!` && !Jt.call(e2.tagHandlers, o2) && z(e2, `undeclared tag handle "${o2}"`), t2.tagStart = r2, t2.tagEnd = e2.position, true;
      }
      function Cn(e2, t2) {
        if (e2.input.charCodeAt(e2.position) !== 38) return false;
        t2.anchorStart !== j && z(e2, `duplication of an anchor property`), e2.position++;
        let n2 = e2.position;
        for (; e2.input.charCodeAt(e2.position) !== 0 && !H(e2.input.charCodeAt(e2.position)) && !W(e2.input.charCodeAt(e2.position)); ) e2.position++;
        return e2.position === n2 && z(e2, `name of an anchor node must contain at least one character`), t2.anchorStart = n2, t2.anchorEnd = e2.position, true;
      }
      function wn(e2, t2) {
        if (e2.input.charCodeAt(e2.position) !== 42) return false;
        (t2.anchorStart !== j || t2.tagStart !== j) && z(e2, `alias node should not have any properties`), e2.position++;
        let n2 = e2.position;
        for (; e2.input.charCodeAt(e2.position) !== 0 && !H(e2.input.charCodeAt(e2.position)) && !W(e2.input.charCodeAt(e2.position)); ) e2.position++;
        return e2.position === n2 && z(e2, `name of an alias node must contain at least one character`), dn(e2, n2, e2.position), true;
      }
      function Tn(e2, t2) {
        G(e2, false), e2.lineIndent < t2 && z(e2, `deficient indentation`);
      }
      function En(e2, t2, n2) {
        if (e2.input.charCodeAt(e2.position) !== 39) return false;
        e2.position++;
        let r2 = e2.position, i2 = true;
        for (; e2.input.charCodeAt(e2.position) !== 0; ) {
          let a2 = e2.input.charCodeAt(e2.position);
          if (a2 === 39) {
            if (e2.input.charCodeAt(e2.position + 1) === 39) {
              i2 = false, e2.position += 2;
              continue;
            }
            let t3 = e2.position;
            return e2.position++, P(e2, r2, t3, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, w.SINGLE_QUOTED, E.CLIP, -1, i2), true;
          }
          B(a2) ? (i2 = false, Tn(e2, t2)) : e2.position === e2.lineStart && K(e2) ? z(e2, `unexpected end of the document within a single quoted scalar`) : a2 !== 9 && a2 < 32 ? z(e2, `expected valid JSON character`) : e2.position++;
        }
        z(e2, `unexpected end of the stream within a single quoted scalar`);
      }
      function Dn(e2, t2, n2) {
        if (e2.input.charCodeAt(e2.position) !== 34) return false;
        e2.position++;
        let r2 = e2.position, i2 = true;
        for (; e2.input.charCodeAt(e2.position) !== 0; ) {
          let a2 = e2.input.charCodeAt(e2.position);
          if (a2 === 34) {
            let t3 = e2.position;
            return e2.position++, P(e2, r2, t3, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, w.DOUBLE_QUOTED, E.CLIP, -1, i2), true;
          }
          if (a2 === 92) {
            i2 = false;
            let n3 = e2.input.charCodeAt(++e2.position);
            if (B(n3)) Tn(e2, t2);
            else if (gn(n3)) e2.position++;
            else {
              let t3 = hn(n3);
              for (t3 === 0 && z(e2, `unknown escape sequence`); t3-- > 0; ) e2.position++, mn(e2.input.charCodeAt(e2.position)) < 0 && z(e2, `expected hexadecimal character`);
              e2.position++;
            }
          } else B(a2) ? (i2 = false, Tn(e2, t2)) : e2.position === e2.lineStart && K(e2) ? z(e2, `unexpected end of the document within a double quoted scalar`) : a2 !== 9 && a2 < 32 ? z(e2, `expected valid JSON character`) : e2.position++;
        }
        z(e2, `unexpected end of the stream within a double quoted scalar`);
      }
      function On(e2, t2, n2) {
        let r2 = e2.input.charCodeAt(e2.position), i2 = E.CLIP, a2 = -1, o2 = false;
        if (r2 !== 124 && r2 !== 62) return false;
        let s2 = r2 === 124 ? w.LITERAL_BLOCK : w.FOLDED_BLOCK;
        for (e2.position++; e2.input.charCodeAt(e2.position) !== 0; ) {
          let n3 = e2.input.charCodeAt(e2.position), r3 = pn(n3);
          if (n3 === 43 || n3 === 45) i2 !== E.CLIP && z(e2, `repeat of a chomping mode identifier`), i2 = n3 === 43 ? E.KEEP : E.STRIP, e2.position++;
          else if (r3 >= 0) r3 === 0 && z(e2, `bad explicit indentation width of a block scalar; it cannot be less than one`), o2 && z(e2, `repeat of an indentation width identifier`), a2 = t2 + r3 - 1, o2 = true, e2.position++;
          else break;
        }
        let c2 = false;
        for (; V(e2.input.charCodeAt(e2.position)); ) c2 = true, e2.position++;
        c2 && e2.input.charCodeAt(e2.position) === 35 && bn(e2), B(e2.input.charCodeAt(e2.position)) ? _n(e2) : e2.input.charCodeAt(e2.position) !== 0 && z(e2, `a line break is expected`);
        let l2 = o2 ? a2 : -1, u2 = 0, d2 = e2.position, f2 = e2.position;
        for (; e2.input.charCodeAt(e2.position) !== 0; ) {
          let n3 = e2.position, r3 = 0;
          for (; e2.input.charCodeAt(n3 + r3) === 32; ) r3++;
          let i3 = e2.input.charCodeAt(n3 + r3);
          if (i3 === 0) {
            l2 >= 0 ? r3 > l2 && (f2 = n3 + r3) : r3 > 0 && (f2 = n3 + r3);
            break;
          }
          if (yn(e2)) break;
          if (!o2 && l2 === -1 && B(i3) && (u2 = Math.max(u2, r3)), !o2 && l2 === -1 && !B(i3) && (i3 === 9 && r3 < t2 && (e2.position = n3 + r3, z(e2, `tab characters must not be used in indentation`)), r3 >= t2 && r3 < u2 && (e2.position = n3 + r3, z(e2, `bad indentation of a mapping entry`))), l2 === -1 && i3 !== 0 && !B(i3) && r3 < t2) {
            e2.lineIndent = r3, e2.position = n3 + r3;
            break;
          }
          !o2 && i3 !== 0 && !B(i3) && l2 === -1 && (l2 = r3);
          let a3 = l2 === -1 ? t2 + 1 : l2;
          if (i3 !== 0 && !B(i3) && r3 < a3) {
            e2.lineIndent = r3, e2.position = n3 + r3;
            break;
          }
          bn(e2), f2 = e2.position, B(e2.input.charCodeAt(e2.position)) && (_n(e2), f2 = e2.position);
        }
        return xn(e2, d2, f2), P(e2, d2, f2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, s2, i2, l2), true;
      }
      function kn(e2, t2) {
        let n2 = e2.input.charCodeAt(e2.position), r2 = t2 === M;
        if (n2 === 0 || H(n2) || n2 === 35 || n2 === 38 || n2 === 42 || n2 === 33 || n2 === 124 || n2 === 62 || n2 === 39 || n2 === 34 || n2 === 37 || n2 === 64 || n2 === 96 || W(n2)) return false;
        if (n2 === 63 || n2 === 45) {
          let t3 = e2.input.charCodeAt(e2.position + 1);
          if (U(t3) || r2 && W(t3)) return false;
        }
        return true;
      }
      function An(e2, t2, n2, r2) {
        if (!kn(e2, n2)) return false;
        let i2 = e2.position, a2 = e2.position, o2 = e2.input.charCodeAt(e2.position), s2 = n2 === M, c2 = false;
        for (; o2 !== 0 && !yn(e2); ) {
          if (o2 === 58) {
            let t3 = e2.input.charCodeAt(e2.position + 1);
            if (U(t3) || s2 && W(t3)) break;
          } else if (o2 === 35) {
            if (H(e2.input.charCodeAt(e2.position - 1))) break;
          } else if (s2 && W(o2)) break;
          else if (B(o2)) {
            let n3 = e2.position, r3 = e2.line, i3 = e2.lineStart, a3 = e2.lineIndent;
            if (G(e2, false), e2.lineIndent >= t2) {
              c2 = true, o2 = e2.input.charCodeAt(e2.position);
              continue;
            }
            e2.position = n3, e2.line = r3, e2.lineStart = i3, e2.lineIndent = a3;
            break;
          }
          V(o2) || (a2 = e2.position + 1), o2 = e2.input.charCodeAt(++e2.position);
        }
        return a2 !== i2 && (xn(e2, i2, a2), P(e2, i2, a2, r2.anchorStart, r2.anchorEnd, r2.tagStart, r2.tagEnd, w.PLAIN, E.CLIP, -1, !c2), true);
      }
      function q(e2, t2) {
        let n2 = e2.line;
        G(e2, true), (e2.line > n2 && e2.lineIndent < t2 || e2.firstTabInLine !== -1 && e2.lineIndent < t2) && z(e2, `deficient indentation`);
      }
      function jn(e2, t2, n2) {
        let r2 = e2.input.charCodeAt(e2.position), i2 = r2 === 123, a2 = e2.position, o2 = true;
        if (r2 !== 91 && r2 !== 123) return false;
        let s2 = i2 ? 125 : 93;
        for (i2 ? ln(e2, a2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, T.FLOW) : cn(e2, a2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, T.FLOW), e2.position++; e2.input.charCodeAt(e2.position) !== 0; ) {
          q(e2, t2);
          let n3 = e2.input.charCodeAt(e2.position);
          if (n3 === s2) return e2.position++, F(e2), true;
          o2 ? n3 === 44 && z(e2, `expected the node content, but found ','`) : z(e2, `missed comma between flow collection entries`);
          let r3 = false, a3 = false;
          n3 === 63 && H(e2.input.charCodeAt(e2.position + 1)) && (r3 = a3 = true, e2.position += 1, q(e2, t2));
          let c2 = e2.line, l2 = L(e2), u2 = J(e2, t2, M, false, true);
          q(e2, t2), n3 = e2.input.charCodeAt(e2.position), (i2 || a3 || e2.line === c2) && n3 === 58 ? (r3 = true, e2.position++, q(e2, t2), i2 || un(e2, l2), u2 || I(e2), J(e2, t2, M, false, true) || I(e2), q(e2, t2), i2 || F(e2)) : i2 && r3 ? (u2 || I(e2), I(e2)) : i2 ? I(e2) : r3 && (un(e2, l2), u2 || I(e2), I(e2), F(e2)), n3 = e2.input.charCodeAt(e2.position), n3 === 44 ? (o2 = true, e2.position++) : o2 = false;
        }
        z(e2, `unexpected end of the stream within a flow collection`);
      }
      function Mn(e2, t2, n2) {
        if (e2.firstTabInLine !== -1 || e2.input.charCodeAt(e2.position) !== 45 || !U(e2.input.charCodeAt(e2.position + 1))) return false;
        for (cn(e2, e2.position, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, T.BLOCK); e2.input.charCodeAt(e2.position) === 45 && U(e2.input.charCodeAt(e2.position + 1)); ) {
          e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, z(e2, `tab characters must not be used in indentation`));
          let n3 = e2.line;
          e2.position++;
          let r2 = G(e2, true) > 0;
          if (e2.firstTabInLine !== -1 && e2.input.charCodeAt(e2.position) === 45 && U(e2.input.charCodeAt(e2.position + 1)) && z(e2, `bad indentation of a sequence entry`), r2 && e2.lineIndent <= t2 ? I(e2) : J(e2, t2, Xt, false, true), G(e2, true), e2.lineIndent < t2 || e2.position >= e2.length) break;
          e2.lineIndent > t2 && z(e2, `bad indentation of a sequence entry`), e2.line === n3 && e2.input.charCodeAt(e2.position) === 45 && U(e2.input.charCodeAt(e2.position + 1)) && z(e2, `bad indentation of a sequence entry`);
        }
        return F(e2), true;
      }
      function Nn(e2, t2, n2, r2) {
        let i2 = false, a2 = false, o2 = false, s2 = false;
        if (e2.firstTabInLine !== -1) return false;
        let c2 = e2.input.charCodeAt(e2.position);
        for (; c2 !== 0; ) {
          !i2 && e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, z(e2, `tab characters must not be used in indentation`));
          let l2 = e2.input.charCodeAt(e2.position + 1), u2 = e2.line;
          if ((c2 === 63 || c2 === 58) && U(l2)) o2 || (ln(e2, e2.position, r2.anchorStart, r2.anchorEnd, r2.tagStart, r2.tagEnd, T.BLOCK), o2 = true), c2 === 63 ? (i2 && I(e2), a2 = true, i2 = true) : (i2 || (I(e2), a2 = true), i2 = false), e2.position += 1, s2 = true;
          else {
            i2 && (I(e2), i2 = false);
            let t3 = L(e2);
            if (!J(e2, n2, Yt, false, true)) break;
            if (e2.line === u2) {
              for (c2 = e2.input.charCodeAt(e2.position); V(c2); ) c2 = e2.input.charCodeAt(++e2.position);
              if (c2 === 58) c2 = e2.input.charCodeAt(++e2.position), U(c2) || z(e2, `a whitespace character is expected after the key-value separator within a block mapping`), o2 || (e2.events.splice(t3.eventsLength, 0, { type: C.MAPPING, start: t3.position, anchorStart: r2.anchorStart, anchorEnd: r2.anchorEnd, tagStart: r2.tagStart, tagEnd: r2.tagEnd, style: T.BLOCK }), o2 = true), a2 = true, i2 = false, s2 = false;
              else if (a2) z(e2, `expected ':' after a mapping key`);
              else return r2.anchorStart !== j || r2.tagStart !== j ? (R(e2, t3), false) : true;
            } else if (a2) z(e2, `can not read a block mapping entry; a multiline key may not be an implicit key`);
            else return r2.anchorStart !== j || r2.tagStart !== j ? (R(e2, t3), false) : true;
          }
          if (J(e2, t2, N, true, s2) && (s2 = false), i2 || s2 && (I(e2), s2 = false), G(e2, true), c2 = e2.input.charCodeAt(e2.position), (e2.line === u2 || e2.lineIndent > t2) && c2 !== 0) z(e2, `bad indentation of a mapping entry`);
          else if (e2.lineIndent < t2) break;
        }
        return a2 ? (i2 && I(e2), o2 && F(e2), true) : false;
      }
      function J(e2, t2, n2, r2, i2, a2 = true) {
        e2.depth >= e2.maxDepth && z(e2, `nesting exceeded maxDepth (${e2.maxDepth})`), e2.depth++;
        let o2 = 1, s2 = false, c2 = false, l2 = null, u2 = fn(), d2 = n2 === N || n2 === Xt, f2 = d2, p2 = d2;
        if (r2 && G(e2, true) && (s2 = true, o2 = e2.lineIndent > t2 ? 1 : e2.lineIndent === t2 ? 0 : -1), o2 === 1) for (; ; ) {
          let r3 = e2.input.charCodeAt(e2.position), i3 = L(e2);
          if (s2 && o2 !== 1 && (r3 === 33 || r3 === 38)) break;
          if (s2 && p2 && (u2.tagStart !== j || u2.anchorStart !== j) && (r3 === 33 || r3 === 38)) {
            var m2;
            let n3 = L(e2), r4 = t2 + 1;
            if (Nn(e2, e2.position - e2.lineStart, r4, u2) && ((m2 = e2.events[n3.eventsLength]) == null ? void 0 : m2.type) === C.MAPPING) return e2.depth--, true;
            R(e2, n3);
          }
          if (s2 && (r3 === 33 && u2.tagStart !== j || r3 === 38 && u2.anchorStart !== j) || !Sn(e2, u2, n2 === M) && !Cn(e2, u2)) break;
          l2 === null && (l2 = i3), G(e2, true) ? (s2 = true, f2 = p2, o2 = e2.lineIndent > t2 ? 1 : e2.lineIndent === t2 ? 0 : -1) : f2 = false;
        }
        if (f2 && (f2 = s2 || i2), o2 === 1 || n2 === N) {
          let r3 = n2 === M || n2 === Yt ? t2 : t2 + 1, i3 = e2.position - e2.lineStart;
          if (o2 === 1) {
            if (f2 && (Mn(e2, i3, u2) || Nn(e2, i3, r3, u2)) || jn(e2, r3, u2)) c2 = true;
            else {
              let t3 = e2.input.charCodeAt(e2.position);
              if (l2 !== null && a2 && p2 && !f2 && t3 !== 124 && t3 !== 62) {
                var h2;
                let t4 = L(e2), n3 = l2.position - l2.lineStart;
                R(e2, l2), Nn(e2, n3, r3, fn()) && ((h2 = e2.events[t4.eventsLength]) == null ? void 0 : h2.type) === C.MAPPING ? c2 = true : R(e2, t4);
              }
              !c2 && (d2 && On(e2, r3, u2) || En(e2, r3, u2) || Dn(e2, r3, u2) || wn(e2, u2) || An(e2, r3, n2, u2)) && (c2 = true);
            }
          } else o2 === 0 && (c2 = f2 && Mn(e2, i3, u2));
        }
        return d2 = d2 && !c2, !c2 && (u2.anchorStart !== j || u2.tagStart !== j || d2) && (P(e2, j, j, u2.anchorStart, u2.anchorEnd, u2.tagStart, u2.tagEnd, w.PLAIN), c2 = true), e2.depth--, c2 || u2.anchorStart !== j || u2.tagStart !== j;
      }
      function Pn(e2) {
        if (e2.lineIndent > 0 || e2.input.charCodeAt(e2.position) !== 37) return false;
        e2.position++;
        let t2 = e2.position;
        for (; e2.input.charCodeAt(e2.position) !== 0 && !H(e2.input.charCodeAt(e2.position)); ) e2.position++;
        let n2 = e2.input.slice(t2, e2.position), r2 = [];
        for (n2.length === 0 && z(e2, `directive name must not be less than one character in length`); e2.input.charCodeAt(e2.position) !== 0 && !B(e2.input.charCodeAt(e2.position)); ) {
          for (; V(e2.input.charCodeAt(e2.position)); ) e2.position++;
          if (e2.input.charCodeAt(e2.position) === 35 || B(e2.input.charCodeAt(e2.position)) || e2.input.charCodeAt(e2.position) === 0) break;
          let t3 = e2.position;
          for (; e2.input.charCodeAt(e2.position) !== 0 && !H(e2.input.charCodeAt(e2.position)); ) e2.position++;
          r2.push(e2.input.slice(t3, e2.position));
        }
        if (B(e2.input.charCodeAt(e2.position)) && _n(e2), n2 === `YAML`) {
          e2.directives.some((e3) => e3.kind === `yaml`) && z(e2, `duplication of %YAML directive`), r2.length !== 1 && z(e2, `YAML directive accepts exactly one argument`);
          let t3 = /^([0-9]+)\.([0-9]+)$/.exec(r2[0]);
          t3 === null && z(e2, `ill-formed argument of the YAML directive`), parseInt(t3[1], 10) !== 1 && z(e2, `unacceptable YAML version of the document`), e2.directives.push({ kind: `yaml`, version: r2[0] });
        } else if (n2 === `TAG`) {
          r2.length !== 2 && z(e2, `TAG directive accepts exactly two arguments`);
          let [t3, n3] = r2;
          $t.test(t3) || z(e2, `ill-formed tag handle (first argument) of the TAG directive`), Jt.call(e2.tagHandlers, t3) && z(e2, `there is a previously declared suffix for "${t3}" tag handle`), an.test(n3) || z(e2, `ill-formed tag prefix (second argument) of the TAG directive`), e2.tagHandlers[t3] = n3, e2.directives.push({ kind: `tag`, handle: t3, prefix: n3 });
        }
        return true;
      }
      function Fn(e2) {
        e2.directives = [], e2.tagHandlers = /* @__PURE__ */ Object.create(null);
        let t2 = false;
        for (G(e2, true); Pn(e2); ) t2 = true, G(e2, true);
        let n2 = false, r2 = false, i2 = true;
        if (e2.lineIndent === 0 && e2.input.charCodeAt(e2.position) === 45 && e2.input.charCodeAt(e2.position + 1) === 45 && e2.input.charCodeAt(e2.position + 2) === 45 && U(e2.input.charCodeAt(e2.position + 3))) {
          n2 = true;
          let t3 = e2.line;
          e2.position += 3, G(e2, true), i2 = e2.line > t3;
        } else t2 && z(e2, `directives end mark is expected`);
        let a2 = e2.events.length;
        if (!n2 && e2.position === e2.lineStart && e2.input.charCodeAt(e2.position) === 46 && K(e2)) {
          e2.position += 3, G(e2, true);
          return;
        }
        if (sn(e2, n2, false), J(e2, e2.lineIndent - 1, N, false, i2, i2) || I(e2), G(e2, true), e2.position === e2.lineStart && K(e2) && (r2 = e2.input.charCodeAt(e2.position) === 46, r2)) {
          let t3 = e2.line;
          e2.position += 3, G(e2, true), e2.line === t3 && e2.position < e2.length && z(e2, `end of the stream or a document separator is expected`);
        }
        let o2 = e2.events[a2];
        (o2 == null ? void 0 : o2.type) === C.DOCUMENT && (o2.explicitEnd = r2), F(e2), !r2 && e2.position < e2.length && !yn(e2) && z(e2, `end of the stream or a document separator is expected`);
      }
      function In(e2, t2) {
        let n2 = e2.length, r2 = b(b(b({}, on), t2), {}, { input: `${e2}\0`, length: n2, position: 0, line: 0, lineStart: 0, lineIndent: 0, firstTabInLine: -1, depth: 0, directives: [], tagHandlers: /* @__PURE__ */ Object.create(null), events: [] }), i2 = e2.indexOf(`\0`);
        for (i2 !== -1 && S.throwAt(e2, i2, `null byte is not allowed in input`, r2.filename); r2.position < r2.length && (vn(r2), G(r2, true), !(r2.position >= r2.length)); ) {
          let e3 = r2.position;
          Fn(r2), r2.position === e3 && z(r2, `can not read a document`);
        }
        return r2.events;
      }
      var Ln = b(b({}, on), Ft);
      function Rn(e2, t2 = {}) {
        let n2 = b(b({}, Ln), t2), r2 = String(e2), i2 = Object.keys(on), a2 = Object.keys(Ft);
        return qt(In(r2, Ue(n2, i2)), b(b({}, Ue(n2, a2)), {}, { source: r2 }));
      }
      function zn(e2, t2, n2) {
        let r2 = null;
        typeof t2 == `function` ? r2 = t2 : typeof t2 == `object` && t2 && (n2 = t2);
        let i2 = Rn(e2, n2);
        if (r2 === null) return i2;
        for (let e3 of i2) r2(e3);
      }
      function Bn(e2, t2) {
        let n2 = Rn(e2, t2);
        if (n2.length === 0) throw new S(`expected a document, but the input is empty`);
        if (n2.length === 1) return n2[0];
        throw new S(`expected a single document in the stream, but found more`);
      }
      var Y = /* @__PURE__ */ Symbol(`INVALID`);
      function Vn(e2) {
        let t2 = new Set([e2.defaultScalarTag, e2.defaultSequenceTag, e2.defaultMappingTag].filter((e3) => e3 !== void 0)), n2 = e2.implicitScalarTags, r2 = e2.tags.filter((e3) => !(e3.nodeKind === `scalar` && e3.implicit) && !t2.has(e3)), i2 = e2.tags.filter((e3) => t2.has(e3));
        return [...n2.map((e3) => ({ tag: e3, implicitTag: true })), ...r2.map((e3) => ({ tag: e3, implicitTag: false })), ...i2.map((e3) => ({ tag: e3, implicitTag: true }))];
      }
      function Hn(e2, t2) {
        for (let n2 = 0, r2 = e2.representTypes.length; n2 < r2; n2 += 1) {
          let { tag: r3, implicitTag: i2 } = e2.representTypes[n2];
          if (r3.identify(t2)) {
            let e3;
            return e3 = r3.matchByTagPrefix ? r3.representTagName(t2) : r3.tagName, { tag: r3, tagName: e3, implicitTag: i2 };
          }
        }
        return null;
      }
      function X(e2, t2) {
        if (!e2.noRefs && typeof t2 == `object` && t2) {
          let n3 = e2.refs.get(t2);
          if (n3) return n3.anchor === void 0 && (n3.anchor = `ref_${e2.refCounter++}`), { kind: `alias`, anchor: n3.anchor };
        }
        let n2 = Hn(e2, t2);
        if (!n2) {
          if (t2 === void 0 || e2.skipInvalid) return Y;
          throw new S(`unacceptable kind of an object to dump ${Object.prototype.toString.call(t2)}`);
        }
        let { tag: r2, tagName: i2, implicitTag: a2 } = n2, o2 = a2 ? i2 : Nt(i2);
        if (r2.nodeKind === `scalar`) return { kind: `scalar`, tag: o2, tagged: !a2, style: w.PLAIN, value: r2.represent(t2) };
        if (r2.nodeKind === `sequence`) {
          let n3 = r2.represent(t2), i3 = { kind: `sequence`, tag: o2, tagged: !a2, style: T.BLOCK, items: [] };
          e2.noRefs || e2.refs.set(t2, i3);
          for (let t3 = 0, r3 = n3.length; t3 < r3; t3 += 1) {
            let r4 = X(e2, n3[t3]);
            r4 === Y && n3[t3] === void 0 && (r4 = X(e2, null)), r4 !== Y && i3.items.push(r4);
          }
          return i3;
        }
        let s2 = r2.represent(t2), c2 = { kind: `mapping`, tag: o2, tagged: !a2, style: T.BLOCK, items: [] };
        e2.noRefs || e2.refs.set(t2, c2);
        for (let [t3, n3] of s2) {
          let r3 = X(e2, t3);
          if (r3 === Y) continue;
          let i3 = X(e2, n3);
          i3 !== Y && c2.items.push({ key: r3, value: i3 });
        }
        return c2;
      }
      function Un(e2, t2, n2 = {}) {
        var r2, i2;
        let a2 = X({ representTypes: Vn(t2), noRefs: (r2 = n2.noRefs) != null && r2, skipInvalid: (i2 = n2.skipInvalid) != null && i2, refs: /* @__PURE__ */ new Map(), refCounter: 0 }, e2);
        return [{ contents: a2 === Y ? null : a2, directives: [] }];
      }
      var Wn = /* @__PURE__ */ Symbol(`visit:break`), Gn = /* @__PURE__ */ Symbol(`visit:skip`);
      function Kn(e2, t2, n2) {
        let r2 = t2(e2, n2);
        if (r2 === Wn) return true;
        if (r2 === Gn) return false;
        let i2 = n2.depth + 1;
        switch (e2.kind) {
          case `sequence`:
            for (let n3 of e2.items) if (Kn(n3, t2, { depth: i2, parent: e2, isKey: false })) return true;
            break;
          case `mapping`:
            for (let { key: n3, value: r3 } of e2.items) if (Kn(n3, t2, { depth: i2, parent: e2, isKey: true }) || Kn(r3, t2, { depth: i2, parent: e2, isKey: false })) return true;
        }
        return false;
      }
      function qn(e2, t2) {
        for (let n2 of e2) if (n2.contents && Kn(n2.contents, t2, { depth: 0, parent: null, isKey: false })) return;
      }
      function Jn(e2, t2) {
        return !!(e2 & 1 << t2);
      }
      var Yn = { applyQuoteFlowKeysOption: Zn, doubleQuoteForInvisibles: Qn, doubleQuoteWhitespaceOnly: $n, applyForceQuotesOption: er, tryLongOrMultilineAsBlock: tr, quoteInvalidPlain: nr, fallbackToDoubleQuoted: rr };
      function Xn(e2) {
        return e2.presenterOptions.quoteStyle === `single` && Jn(e2.allowedStylesMask, w.SINGLE_QUOTED) ? w.SINGLE_QUOTED : w.DOUBLE_QUOTED;
      }
      function Zn(e2) {
        e2.presenterOptions.quoteFlowKeys && e2.isKey && e2.flowOnly && e2.style === w.PLAIN && (e2.style = w.DOUBLE_QUOTED);
      }
      function Qn(e2) {
        e2.style === w.PLAIN && /[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e2.node.value) && (e2.style = w.DOUBLE_QUOTED);
      }
      function $n(e2) {
        e2.style === w.PLAIN && /^\s+$/.test(e2.node.value) && (e2.style = w.DOUBLE_QUOTED);
      }
      function er(e2) {
        e2.presenterOptions.forceQuotes && (e2.isKey || e2.style !== w.PLAIN || e2.node.tag === e2.presenterOptions.schema.defaultScalarTag.tagName && (e2.style = e2.node.value.includes(`
`) ? w.DOUBLE_QUOTED : Xn(e2)));
      }
      function tr(e2) {
        if (e2.style !== w.PLAIN || e2.isKey) return;
        let t2 = e2.node.value, n2 = t2.indexOf(`
`) !== -1;
        if (!Jn(e2.allowedStylesMask, w.LITERAL_BLOCK)) {
          n2 && (e2.style = w.DOUBLE_QUOTED);
          return;
        }
        let r2 = e2.presenterOptions.lineWidth;
        if (r2 === -1) {
          n2 && (e2.style = w.LITERAL_BLOCK);
          return;
        }
        let i2 = Math.max(Math.min(r2, 40), r2 - e2.shiftOfContent), a2 = 0, o2 = false;
        for (; a2 <= t2.length; ) {
          let e3 = t2.length, n3 = t2.indexOf(`
`, a2);
          n3 !== -1 && (e3 = n3);
          let r3 = t2.slice(a2, e3);
          if (r3.length > i2 && r3[0] !== ` ` && / [^ \t]/.test(r3) && (o2 = true), n3 === -1) break;
          a2 = n3 + 1;
        }
        o2 ? e2.style = w.FOLDED_BLOCK : n2 && (e2.style = w.LITERAL_BLOCK);
      }
      function nr(e2) {
        e2.style === w.PLAIN && !Jn(e2.allowedStylesMask, w.PLAIN) && (e2.style = Xn(e2));
      }
      function rr(e2) {
        Jn(e2.allowedStylesMask, e2.style) || (e2.style = w.DOUBLE_QUOTED);
      }
      function Z(e2, t2) {
        return e2 | 1 << t2;
      }
      var ir = `[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}]`, ar = `[\\n\\r]`, or = `\\uFEFF`, sr = `[ \\t]`, cr = `(?:(?!(?:${ar}|${or}))${ir})`, lr = `(?:(?!${sr})${cr})`, ur = `[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]`, dr = `[-?:,\\[\\]{}#&*!|>'"%@\`]`, fr = `[,\\[\\]{}]`, pr = lr, mr = `(?:(?!${fr})${lr})`, hr = `(?:(?:(?!${dr})${lr})|[?:-](?=${pr}))`, gr = `(?:(?:(?!${dr})${lr})|[?:-](?=${mr}))`, _r = `(?:(?:(?![:#])${pr})|:(?=${pr}))#*`, vr = `(?:(?:(?![:#])${mr})|:(?=${mr}))#*`, yr = `(?:${sr}*${_r})*`, br = `(?:${sr}*${vr})*`, xr = `${hr}#*${yr}`, Sr = `${gr}#*${br}`, Cr = xr, wr = Sr, Tr = `\\n+${_r}${yr}`, Er = `\\n+${vr}${br}`, Dr = `${xr}(?:${Tr})*`, Or = `${Sr}(?:${Er})*`, kr = RegExp(`^(?:${Dr})$`, `u`), Ar = RegExp(`^(?:${Or})$`, `u`), jr = RegExp(`^(?:${Cr})$`, `u`), Mr = RegExp(`^(?:${wr})$`, `u`), Nr = RegExp(`^(?:${ur})*$`, `u`), Pr = RegExp(`^(?:${ur}|\\n)*$`, `u`), Fr = RegExp(`^(?:${cr}|\\n)*$`, `u`), Ir = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/, Lr = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;
      function Rr(e2) {
        let t2 = e2.node.value;
        if (t2 !== ``) {
          if (!(e2.isKey ? e2.flowOnly ? Mr : jr : e2.flowOnly ? Ar : kr).test(t2) || e2.shiftOfFirstLine === 0 && Ir.test(t2)) return false;
          if (e2.shiftOfContent === 0) {
            let e3 = t2.indexOf(`
`);
            if (e3 !== -1) {
              let n3 = t2.slice(e3 + 1);
              if (Lr.test(n3)) return false;
            }
          }
        }
        let n2 = e2.presenterOptions.schema.resolveImplicitScalarTag(t2).tag.tagName;
        return !(!e2.node.tagged && n2 !== e2.node.tag || !e2.node.tagged && t2 === `=` && n2 === e2.presenterOptions.schema.defaultScalarTag.tagName);
      }
      function zr(e2) {
        let t2 = e2.node.value;
        if (!(e2.isKey ? Nr : Pr).test(t2) || /[ \t]\n|\n[ \t]/.test(t2)) return false;
        if (!e2.isKey && e2.shiftOfContent === 0) {
          let e3 = t2.indexOf(`
`);
          if (e3 !== -1 && Lr.test(t2.slice(e3 + 1))) return false;
        }
        return true;
      }
      function Br(e2) {
        if (e2.flowOnly || !Fr.test(e2.node.value)) return false;
        let t2 = e2.shiftOfContent - e2.shiftOfParent;
        return !(t2 < 1 || t2 > 9 && /^\n* /.test(e2.node.value) || e2.shiftOfContent === 0 && Lr.test(e2.node.value));
      }
      function Vr(e2) {
        let t2 = Z(0, w.DOUBLE_QUOTED);
        Rr(e2) && (t2 = Z(t2, w.PLAIN)), zr(e2) && (t2 = Z(t2, w.SINGLE_QUOTED)), Br(e2) && (t2 = Z(Z(t2, w.LITERAL_BLOCK), w.FOLDED_BLOCK)), e2.allowedStylesMask = t2;
      }
      function Hr(e2) {
        switch (e2.style) {
          case w.PLAIN:
            return Ur(e2);
          case w.SINGLE_QUOTED:
            return Wr(e2);
          case w.LITERAL_BLOCK:
            return Gr(e2);
          case w.FOLDED_BLOCK:
            return Kr(e2);
          case w.DOUBLE_QUOTED:
            return qr(e2);
        }
      }
      function Ur(e2) {
        return Jr(e2.node.value, e2.shiftOfContent);
      }
      function Wr(e2) {
        return `'${Jr(e2.node.value, e2.shiftOfContent).replace(/'/g, `''`)}'`;
      }
      function Gr(e2) {
        let t2 = e2.node.value;
        return `|` + Zr(t2, e2.shiftOfParent, e2.shiftOfContent) + Qr(Yr(t2, e2.shiftOfContent));
      }
      function Kr(e2) {
        let t2 = e2.node.value, n2 = e2.presenterOptions.lineWidth, r2 = 1 / 0;
        return n2 !== -1 && (r2 = Math.max(Math.min(n2, 40), n2 - e2.shiftOfContent)), `>` + Zr(t2, e2.shiftOfParent, e2.shiftOfContent) + Qr(Yr(ti(t2, r2), e2.shiftOfContent));
      }
      function qr(e2) {
        return `"${ii(e2.node.value)}"`;
      }
      function Jr(e2, t2) {
        let n2 = e2.indexOf(`
`);
        if (n2 === -1) return e2;
        let r2 = ` `.repeat(t2), i2 = e2.slice(0, n2), a2 = /(\n+)([^\n]*)/g;
        a2.lastIndex = n2;
        let o2;
        for (; o2 = a2.exec(e2); ) {
          let e3 = o2[1].length, t3 = o2[2];
          i2 += `
`.repeat(e3 + 1) + r2 + t3;
        }
        return i2;
      }
      function Yr(e2, t2) {
        let n2 = ` `.repeat(t2), r2 = 0, i2 = ``, a2 = e2.length;
        for (; r2 < a2; ) {
          let t3, o2 = e2.indexOf(`
`, r2);
          o2 === -1 ? (t3 = e2.slice(r2), r2 = a2) : (t3 = e2.slice(r2, o2 + 1), r2 = o2 + 1), t3.length && t3 !== `
` && (i2 += n2), i2 += t3;
        }
        return i2;
      }
      function Xr(e2) {
        return /^\n* /.test(e2);
      }
      function Zr(e2, t2, n2) {
        let r2 = Xr(e2) ? String(n2 - t2) : ``, i2 = e2[e2.length - 1] === `
`;
        return `${r2}${i2 && (e2[e2.length - 2] === `
` || e2 === `
`) ? `+` : i2 ? `` : `-`}
`;
      }
      function Qr(e2) {
        return e2[e2.length - 1] === `
` ? e2.slice(0, -1) : e2;
      }
      function $r(e2) {
        return e2 === ` ` || e2 === `	`;
      }
      function ei(e2, t2) {
        if (e2 === `` || $r(e2[0])) return e2;
        let n2 = / [^ \t]/g, r2, i2 = 0, a2, o2 = 0, s2 = 0, c2 = ``;
        for (; r2 = n2.exec(e2); ) s2 = r2.index, s2 - i2 > t2 && (a2 = o2 > i2 ? o2 : s2, c2 += `
${e2.slice(i2, a2)}`, i2 = a2 + 1), o2 = s2;
        return c2 += `
`, e2.length - i2 > t2 && o2 > i2 ? c2 += `${e2.slice(i2, o2)}
${e2.slice(o2 + 1)}` : c2 += e2.slice(i2), c2.slice(1);
      }
      function ti(e2, t2) {
        let n2 = /(\n+)([^\n]*)/g, r2 = e2.indexOf(`
`);
        r2 === -1 && (r2 = e2.length), n2.lastIndex = r2;
        let i2 = ei(e2.slice(0, r2), t2), a2 = e2[0] === `
` || $r(e2[0]), o2, s2;
        for (; s2 = n2.exec(e2); ) {
          let e3 = s2[1], n3 = s2[2];
          o2 = n3 !== `` && $r(n3[0]), i2 += e3 + (!a2 && !o2 && n3 !== `` ? `
` : ``) + ei(n3, t2), a2 = o2;
        }
        return i2;
      }
      var ni = /["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;
      function ri(e2) {
        switch (e2) {
          case `\0`:
            return `\\0`;
          case `\x07`:
            return `\\a`;
          case `\b`:
            return `\\b`;
          case `	`:
            return `\\t`;
          case `
`:
            return `\\n`;
          case `\v`:
            return `\\v`;
          case `\f`:
            return `\\f`;
          case `\r`:
            return `\\r`;
          case `\x1B`:
            return `\\e`;
          case `"`:
            return `\\"`;
          case `\\`:
            return `\\\\`;
          case `\x85`:
            return `\\N`;
          case `\xA0`:
            return `\\_`;
          case `\u2028`:
            return `\\L`;
          case `\u2029`:
            return `\\P`;
        }
        let t2 = e2.charCodeAt(0), n2 = t2.toString(16).toUpperCase();
        return t2 <= 255 ? `\\x${`0`.repeat(2 - n2.length)}${n2}` : `\\u${`0`.repeat(4 - n2.length)}${n2}`;
      }
      function ii(e2) {
        return e2.replace(ni, ri);
      }
      var ai = 10, oi = { indent: 2, seqNoIndent: false, seqInlineFirst: true, lineWidth: 80, flowBracketPadding: false, flowSkipCommaSpace: false, flowSkipColonSpace: false, quoteFlowKeys: false, quoteStyle: `single`, forceQuotes: false, scalarStyleRules: Object.keys(Yn).map((e2) => Reflect.get(Yn, e2)), tagBeforeAnchor: false };
      function si(e2) {
        return e2.tagged ? e2.tag : Nt(e2.tag);
      }
      function ci(e2) {
        let t2 = b(b({}, oi), e2);
        return t2.flowSkipColonSpace && (t2.quoteFlowKeys = true), b(b({}, t2), {}, { defaultScalarTagName: t2.schema.defaultScalarTag.tagName, openEnded: false });
      }
      function li(e2, t2) {
        return `
${` `.repeat(e2.indent * t2)}`;
      }
      function ui(e2, t2, n2, r2, i2, a2) {
        return { node: t2, parent: n2, level: r2, isKey: i2, flowOnly: a2, shiftOfParent: r2 === 0 ? -1 : e2.indent * (r2 - 1), shiftOfContent: e2.indent * Math.max(1, r2), shiftOfFirstLine: r2 === 0 ? 0 : e2.indent * r2, presenterOptions: e2, allowedStylesMask: 0, style: t2.style };
      }
      function di(e2, t2, n2) {
        let r2 = ``;
        for (let i3 = 0, a2 = n2.items.length; i3 < a2; i3 += 1) {
          let a3 = Q(e2, t2, n2.items[i3], n2, {}).text;
          i3 > 0 && (r2 += `,${e2.flowSkipCommaSpace ? `` : ` `}`), r2 += a3;
        }
        let i2 = e2.flowBracketPadding && n2.items.length > 0 ? ` ` : ``;
        return `[${i2}${r2}${i2}]`;
      }
      function fi(e2, t2, n2, r2) {
        let i2 = ``;
        for (let a2 = 0, o2 = n2.items.length; a2 < o2; a2 += 1) {
          let o3 = Q(e2, t2 + 1, n2.items[a2], n2, { block: true, compact: e2.seqInlineFirst, isblockseq: true }).text;
          (!r2 || i2 !== ``) && (i2 += li(e2, t2)), o3 === `` || ai === o3.charCodeAt(0) ? i2 += `-` : i2 += `- `, i2 += o3;
        }
        return i2;
      }
      function pi(e2, t2, n2) {
        let r2 = ``;
        for (let { key: i3, value: a2 } of n2.items) {
          let o2 = ``;
          r2 !== `` && (o2 += `,${e2.flowSkipCommaSpace ? `` : ` `}`);
          let s2 = Q(e2, t2, i3, n2, { iskey: true }), c2 = s2.text, l2 = Q(e2, t2, a2, n2, {}).text, u2 = e2.flowSkipColonSpace || l2 === `` ? `` : ` `, d2 = i3.kind === `scalar` && s2.noBody && (i3.tagged || i3.anchor !== void 0), f2 = i3.kind === `alias` || d2 ? ` ` : ``;
          o2 += `${c2}${f2}:${u2}${l2}`, r2 += o2;
        }
        let i2 = e2.flowBracketPadding && r2 !== `` ? ` ` : ``;
        return `{${i2}${r2}${i2}}`;
      }
      function mi(e2, t2, n2, r2) {
        let i2 = ``;
        for (let a2 = 0, o2 = n2.items.length; a2 < o2; a2 += 1) {
          let o3 = ``;
          (!r2 || i2 !== ``) && (o3 += li(e2, t2));
          let { key: s2, value: c2 } = n2.items[a2], l2 = (s2.kind === `mapping` || s2.kind === `sequence`) && s2.style === T.BLOCK && s2.items.length !== 0 || s2.kind === `scalar` && (s2.style === w.LITERAL_BLOCK || s2.style === w.FOLDED_BLOCK), u2 = l2 ? Q(e2, t2 + 1, s2, n2, { block: true, compact: true, isblockseq: !hi(e2, s2, t2 + 1) }) : Q(e2, t2 + 1, s2, n2, { block: true, compact: true, iskey: true }), d2 = u2.text, f2 = s2.kind === `scalar` && s2.value.indexOf(`
`) !== -1, p2 = d2.length > 1024 && /^[\s\S]{1025}/u.test(d2), m2 = l2 || f2 || p2;
          m2 && (d2 && ai === d2.charCodeAt(0) ? o3 += `?` : o3 += `? `), o3 += d2, m2 && (o3 += li(e2, t2));
          let h2 = Q(e2, t2 + 1, c2, n2, { block: true, compact: m2, isblockseq: m2 && !hi(e2, c2, t2 + 1) }).text, ee2 = s2.kind === `scalar` && u2.noBody && (s2.tagged || s2.anchor !== void 0), te2 = !m2 && (s2.kind === `alias` || ee2) ? ` ` : ``;
          h2 === `` || ai === h2.charCodeAt(0) ? o3 += `${te2}:` : o3 += `${te2}: `, o3 += h2, i2 += o3;
        }
        return i2;
      }
      function hi(e2, t2, n2) {
        return t2.kind === `alias` || t2.tagged || t2.anchor !== void 0 || e2.indent < 2 && n2 > 0;
      }
      function Q(e2, t2, n2, r2, i2) {
        var a2;
        if (n2.kind === `alias`) return e2.openEnded = false, { text: `*${n2.anchor}`, noBody: false };
        let { block: o2 = false, iskey: s2 = false, isblockseq: c2 = false } = i2, l2 = (a2 = i2.compact) != null && a2, u2 = n2.anchor !== void 0;
        hi(e2, n2, t2) && (l2 = false);
        let d2, f2 = n2.tagged, p2 = o2 && (n2.kind === `mapping` || n2.kind === `sequence`) && n2.style === T.BLOCK && n2.items.length !== 0;
        if (n2.kind === `mapping`) d2 = p2 ? mi(e2, t2, n2, l2) : pi(e2, t2, n2);
        else if (n2.kind === `sequence`) d2 = p2 ? e2.seqNoIndent && !c2 && t2 > 0 ? fi(e2, t2 - 1, n2, l2) : fi(e2, t2, n2, l2) : di(e2, t2, n2);
        else {
          let i3 = ui(e2, n2, r2, t2, s2, !o2);
          Vr(i3);
          for (let t3 of e2.scalarStyleRules) t3(i3);
          d2 = Hr(i3), e2.openEnded = (i3.style === w.LITERAL_BLOCK || i3.style === w.FOLDED_BLOCK) && (n2.value === `
` || n2.value.endsWith(`

`)), f2 = n2.tagged || d2 === `` && i3.flowOnly && (r2 == null ? void 0 : r2.kind) === `sequence` && !u2 || i3.style !== w.PLAIN && n2.tag !== e2.defaultScalarTagName;
        }
        (n2.kind === `mapping` || n2.kind === `sequence`) && !p2 && (e2.openEnded = false), p2 && l2 && t2 > 0 && e2.indent > 2 && (d2 = `${` `.repeat(e2.indent - 2)}${d2}`);
        let m2 = d2 === ``, h2 = d2;
        if (f2 || u2) {
          let t3 = [], r3 = f2 ? si(n2) : null, i3 = u2 ? `&${n2.anchor}` : null;
          e2.tagBeforeAnchor ? (r3 !== null && t3.push(r3), i3 !== null && t3.push(i3)) : (i3 !== null && t3.push(i3), r3 !== null && t3.push(r3));
          let a3 = d2 === `` || d2.charCodeAt(0) === ai ? `` : ` `;
          h2 = `${t3.join(` `)}${a3}${d2}`;
        }
        return { text: h2, noBody: m2 };
      }
      function gi(e2) {
        return (e2.kind === `sequence` || e2.kind === `mapping`) && e2.style === T.BLOCK && e2.items.length !== 0 && !e2.tagged && e2.anchor === void 0;
      }
      function _i(e2) {
        let t2 = ``;
        for (let n2 of e2.directives) {
          if (n2.kind === `yaml`) {
            t2 += `%YAML ${n2.version}
`;
            continue;
          }
          let { handle: e3, prefix: r2 } = n2;
          t2 += `%TAG ${e3} ${r2}
`;
        }
        return t2;
      }
      function vi(e2, t2) {
        let n2 = ci(t2), r2 = ``, i2 = false;
        for (let t3 = 0; t3 < e2.length; t3 += 1) {
          let a2 = e2[t3];
          n2.openEnded = false;
          let o2 = _i(a2), s2 = o2 !== ``, c2 = a2.explicitStart || s2 || t3 > 0 && !i2;
          if (r2 += o2, a2.contents === null) c2 && (r2 += `---
`);
          else if (c2) {
            let e3 = Q(n2, 0, a2.contents, null, { block: true, compact: true }).text, t4 = e3 === `` ? `` : s2 || gi(a2.contents) ? `
` : ` `;
            r2 += `---${t4}${e3}
`;
          } else r2 += Q(n2, 0, a2.contents, null, { block: true, compact: true }).text + `
`;
          i2 = a2.explicitEnd || n2.openEnded, i2 && (r2 += `...
`);
        }
        return r2;
      }
      var yi = b(b({}, oi), {}, { schema: it, skipInvalid: false, noRefs: false, flowLevel: -1, sortKeys: false, transform: () => {
      } });
      function bi(e2, t2) {
        let n2 = String(e2), r2 = String(t2);
        return n2 < r2 ? -1 : +(n2 > r2);
      }
      function xi(e2, t2 = {}) {
        let n2 = b(b({}, yi), t2), r2 = Un(e2, n2.schema, { noRefs: n2.noRefs, skipInvalid: n2.skipInvalid });
        if (n2.flowLevel >= 0 && qn(r2, (e3, t3) => {
          if (!(t3.depth < n2.flowLevel)) return (e3.kind === `sequence` || e3.kind === `mapping`) && (e3.style = T.FLOW), Gn;
        }), n2.sortKeys) {
          let e3 = n2.sortKeys === true ? bi : n2.sortKeys;
          qn(r2, (t3) => {
            t3.kind === `mapping` && t3.items.sort((t4, n3) => e3(t4.key.kind === `scalar` ? t4.key.value : ``, n3.key.kind === `scalar` ? n3.key.value : ``));
          });
        }
        return n2.transform(r2), vi(r2, b(b({}, Ue(n2, Object.keys(oi))), {}, { schema: n2.schema }));
      }
      var $ = -1;
      function Si(e2) {
        return `tagStart` in e2 && e2.tagStart !== $ ? e2.tagStart : `anchorStart` in e2 && e2.anchorStart !== $ ? e2.anchorStart : `valueStart` in e2 && e2.valueStart !== $ ? e2.valueStart : `start` in e2 ? e2.start : 0;
      }
      function Ci(e2, t2) {
        return t2.tagStart === $ ? `` : e2.source.slice(t2.tagStart, t2.tagEnd);
      }
      function wi(e2, t2) {
        return t2.anchorStart === $ ? void 0 : e2.source.slice(t2.anchorStart, t2.anchorEnd);
      }
      function Ti(e2, t2) {
        let n2 = Tt(e2.source, t2), r2 = Ci(e2, t2), i2, a2 = false;
        return r2 === `` ? i2 = t2.style === w.PLAIN ? e2.schema.resolveImplicitScalarTag(n2).tag.tagName : e2.schema.defaultScalarTag.tagName : (a2 = true, i2 = r2), { kind: `scalar`, tag: i2, tagged: a2, style: t2.style, anchor: wi(e2, t2), value: n2 };
      }
      function Ei(e2, t2, n2) {
        let r2 = Ci(e2, t2), i2, a2 = false;
        return r2 === `` ? i2 = n2 : (i2 = r2, a2 = true), { tag: i2, tagged: a2, style: t2.style, anchor: wi(e2, t2) };
      }
      function Di(e2, t2) {
        let n2 = e2.frames[e2.frames.length - 1];
        n2.kind === `document` ? n2.doc.contents = t2 : n2.kind === `sequence` ? n2.node.items.push(t2) : n2.key ? (n2.node.items.push({ key: n2.key, value: t2 }), n2.key = null) : n2.key = t2;
      }
      function Oi(e2, t2) {
        let n2 = { source: t2.source, schema: t2.schema, eventIndex: 0, position: 0, frames: [], documents: [] };
        for (; n2.eventIndex < e2.length; ) {
          let t3 = e2[n2.eventIndex++];
          switch (n2.position = Si(t3), t3.type) {
            case C.DOCUMENT: {
              let e3 = { contents: null, explicitStart: t3.explicitStart, explicitEnd: t3.explicitEnd, directives: t3.directives };
              n2.frames.push({ kind: `document`, doc: e3 });
              break;
            }
            case C.SCALAR:
              Di(n2, Ti(n2, t3));
              break;
            case C.SEQUENCE: {
              let { tag: e3, tagged: r2, style: i2, anchor: a2 } = Ei(n2, t3, `tag:yaml.org,2002:seq`), o2 = { kind: `sequence`, tag: e3, tagged: r2, style: i2, anchor: a2, items: [] };
              n2.frames.push({ kind: `sequence`, node: o2 });
              break;
            }
            case C.MAPPING: {
              let { tag: e3, tagged: r2, style: i2, anchor: a2 } = Ei(n2, t3, `tag:yaml.org,2002:map`), o2 = { kind: `mapping`, tag: e3, tagged: r2, style: i2, anchor: a2, items: [] };
              n2.frames.push({ kind: `mapping`, node: o2, key: null });
              break;
            }
            case C.ALIAS:
              Di(n2, { kind: `alias`, anchor: n2.source.slice(t3.anchorStart, t3.anchorEnd) });
              break;
            case C.POP: {
              let e3 = n2.frames.pop();
              if (e3.kind === `mapping` && e3.key) throw Error(`incomplete mapping pair in event stream`);
              e3.kind === `document` ? n2.documents.push(e3.doc) : Di(n2, e3.node);
              break;
            }
          }
        }
        return n2.documents;
      }
      var ki = C.DOCUMENT, Ai = C.SEQUENCE, ji = C.MAPPING, Mi = C.SCALAR, Ni = C.ALIAS, Pi = C.POP, Fi = w.PLAIN, Ii = w.SINGLE_QUOTED, Li = w.DOUBLE_QUOTED, Ri = w.LITERAL_BLOCK, zi = w.FOLDED_BLOCK, Bi = T.BLOCK, Vi = T.FLOW, Hi = E.CLIP, Ui = E.STRIP, Wi = E.KEEP;
      e.CHOMPING_CLIP = Hi, e.CHOMPING_KEEP = Wi, e.CHOMPING_MODE = E, e.CHOMPING_STRIP = Ui, e.COLLECTION_STYLE = T, e.COLLECTION_STYLE_BLOCK = Bi, e.COLLECTION_STYLE_FLOW = Vi, e.CORE_SCHEMA = nt, e.DEFAULT_SCALAR_STYLE_RULES = Yn, e.DUMP_SCHEMA = it, e.EVENT_ALIAS = Ni, e.EVENT_DOCUMENT = ki, e.EVENT_ID = C, e.EVENT_MAPPING = ji, e.EVENT_POP = Pi, e.EVENT_SCALAR = Mi, e.EVENT_SEQUENCE = Ai, e.FAILSAFE_SCHEMA = et, e.JSON_SCHEMA = tt, e.NOT_RESOLVED = t, e.SCALAR_STYLE = w, e.SCALAR_STYLE_DOUBLE_QUOTED = Li, e.SCALAR_STYLE_FOLDED_BLOCK = zi, e.SCALAR_STYLE_LITERAL_BLOCK = Ri, e.SCALAR_STYLE_PLAIN = Fi, e.SCALAR_STYLE_SINGLE_QUOTED = Ii, e.Schema = x, e.VISIT_BREAK = Wn, e.VISIT_SKIP = Gn, e.YAML11_SCHEMA = rt, e.YAMLException = S, e.binaryTag = Ie, e.boolCoreTag = p, e.boolJsonTag = ee, e.boolYaml11Tag = re, e.constructFromEvents = qt, e.defineMappingTag = i, e.defineScalarTag = n, e.defineSequenceTag = r, e.dump = xi, e.eventsToAst = Oi, e.floatCoreTag = Se, e.floatJsonTag = De, e.floatYaml11Tag = g, e.getScalarValue = Tt, e.intCoreTag = ce, e.intJsonTag = pe, e.intYaml11Tag = _e, e.jsToAst = Un, e.legacyMapTag = st, e.load = Bn, e.loadAll = zn, e.mapTag = Ke, e.mergeTag = Me, e.nullCoreTag = s, e.nullJsonTag = c, e.nullYaml11Tag = u, e.omapTag = We, e.pairsTag = Ge, e.parseEvents = In, e.present = vi, e.realMapTag = at, e.seqTag = He, e.setTag = qe, e.strTag = a, e.timestampTag = Ve, e.visit = qn;
    });
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
