/**
 * Kotonoha pedagogical assessment foundation (v1).
 * JLPT-inspired internal assessment, NOT official JLPT scoring/certification.
 * Pure, offline-safe functions; no network, AI, browser or storage dependency.
 */
export const PEDAGOGY_SCHEMA_VERSION = 1;
export const LEVEL_ORDER = Object.freeze(['N5', 'N4', 'N3', 'N2', 'N1']);
export const CORE_SKILLS = Object.freeze(['vocabulary', 'grammar', 'reading', 'listening']);
export const CONTENT_STATES = Object.freeze(['draft', 'review', 'approved', 'retired']);

export const SOURCE_POLICY = Object.freeze({
  original: { label: 'Conteúdo autoral Kotonoha', importable: true },
  jmdict: { label: 'JMdict / EDRDG', importable: true, attributionRequired: true, shareAlike: true },
  kanjidic: { label: 'KANJIDIC / EDRDG', importable: true, attributionRequired: true, shareAlike: true },
  kanjivg: { label: 'KanjiVG', importable: true, attributionRequired: true, shareAlike: true },
  tatoeba: { label: 'Tatoeba', importable: false, note: 'Licença individual de frases/áudios exige verificação por item.' },
  jlpt: { label: 'JLPT oficial', importable: false, note: 'Usar como referência; não copiar provas/áudio sem autorização.' },
});

const plainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const slug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9:-]{2,95}$/.test(value);
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const unique = items => new Set(items).size === items.length;

/** Item contract: approved material has traceable provenance, author and an independent reviewer. */
export function validateItem(item) {
  const errors = [];
  if (!plainObject(item)) return ['item must be an object'];
  if (!slug(item.id)) errors.push('invalid id');
  if (!LEVEL_ORDER.includes(item.level)) errors.push('invalid level');
  if (!CORE_SKILLS.includes(item.skill)) errors.push('invalid skill');
  if (!slug(item.competencyId)) errors.push('invalid competencyId');
  if (!CONTENT_STATES.includes(item.status)) errors.push('invalid status');
  if (typeof item.prompt !== 'string' || !item.prompt.trim() || item.prompt.length > 3000) errors.push('invalid prompt');
  if (!Array.isArray(item.choices) || item.choices.length !== 4 || !item.choices.every(choice => typeof choice === 'string' && choice.trim()) || !unique(item.choices)) errors.push('four distinct choices required');
  if (!Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex > 3) errors.push('invalid answerIndex');
  if (typeof item.explanation !== 'string' || !item.explanation.trim()) errors.push('missing explanation');
  if (!plainObject(item.provenance) || !SOURCE_POLICY[item.provenance.sourceId]) errors.push('unknown source');
  if (item.skill === 'listening' && (!plainObject(item.audio) || typeof item.audio.path !== 'string' || !item.audio.path.startsWith('/audio/') || !item.audio.license)) errors.push('listening requires local licensed audio');
  if (item.status === 'approved') {
    if (!plainObject(item.review) || !item.review.reviewer || !validDate(item.review.reviewedAt) || item.review.reviewer === item.review.author) errors.push('independent editorial review required');
    if (!item.provenance?.license || !item.provenance?.attribution) errors.push('license and attribution required');
    if (item.provenance && SOURCE_POLICY[item.provenance.sourceId]?.importable === false) errors.push('source cannot be directly imported');
  }
  return errors;
}

/** A draft is NEVER silently promoted into a real test, even when structurally correct. */
export function eligibleItems(items, level) {
  return (Array.isArray(items) ? items : []).filter(item => item.level === level && item.status === 'approved' && validateItem(item).length === 0);
}

function shuffleDeterministically(list, seed) {
  let state = (Number.isInteger(seed) ? seed : 1) >>> 0;
  if (!state) state = 1;
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * This is an INTERNAL preliminary blueprint; it is not an official JLPT exam blueprint.
 * Never issue a passing outcome unless all four skill pools are sufficiently covered.
 */
export function assessmentBlueprint(level, perSkill = 3) {
  if (!LEVEL_ORDER.includes(level)) throw new Error('Unsupported level');
  if (!Number.isInteger(perSkill) || perSkill < 2 || perSkill > 30) throw new Error('Invalid perSkill');
  return { level, required: Object.fromEntries(CORE_SKILLS.map(skill => [skill, perSkill])), minTotalFraction: 0.8, minSkillFraction: 0.6, kind: 'internal-placement-or-promotion', version: 1 };
}

/** Select only editor-approved items. Fail closed if any skill lacks coverage. */
export function buildAssessment(items, blueprint, options = {}) {
  if (!plainObject(blueprint) || !LEVEL_ORDER.includes(blueprint.level) || !plainObject(blueprint.required)) throw new Error('Invalid blueprint');
  const excluded = new Set(Array.isArray(options.excludeIds) ? options.excludeIds : []);
  const pool = eligibleItems(items, blueprint.level).filter(item => !excluded.has(item.id));
  const chosen = [];
  const shortages = {};
  for (const [skill, required] of Object.entries(blueprint.required)) {
    if (!CORE_SKILLS.includes(skill) || !Number.isInteger(required) || required < 1) throw new Error('Invalid skill quota');
    const candidates = shuffleDeterministically(pool.filter(item => item.skill === skill), (options.seed ?? 17) + CORE_SKILLS.indexOf(skill) * 7919);
    if (candidates.length < required) shortages[skill] = required - candidates.length;
    else chosen.push(...candidates.slice(0, required));
  }
  if (Object.keys(shortages).length) return { status: 'insufficient_bank', level: blueprint.level, shortages, questions: [], blueprint };
  return { status: 'ready', level: blueprint.level, shortages: {}, questions: shuffleDeterministically(chosen, options.seed ?? 17), blueprint };
}

/** Answers indexed by item.id; missing answers cannot pass an assessment. */
export function gradeAssessment(assessment, answers) {
  if (!assessment || assessment.status !== 'ready' || !Array.isArray(assessment.questions) || !assessment.questions.length) return { status: 'not_gradable' };
  if (!plainObject(answers) || assessment.questions.some(q => !Number.isInteger(answers[q.id]) || answers[q.id] < 0 || answers[q.id] > 3)) return { status: 'incomplete' };
  const bySkill = {};
  for (const skill of Object.keys(assessment.blueprint.required)) {
    const subset = assessment.questions.filter(q => q.skill === skill);
    const correct = subset.filter(q => answers[q.id] === q.answerIndex).length;
    bySkill[skill] = { correct, total: subset.length, fraction: subset.length ? correct / subset.length : 0 };
  }
  const correct = assessment.questions.filter(q => answers[q.id] === q.answerIndex).length;
  const fraction = correct / assessment.questions.length;
  const passed = fraction >= assessment.blueprint.minTotalFraction && Object.values(bySkill).every(x => x.total && x.fraction >= assessment.blueprint.minSkillFraction);
  return { status: passed ? 'passed' : 'needs_review', passed, correct, total: assessment.questions.length, fraction, bySkill, kind: 'kotonoha-internal', level: assessment.level };
}

/** Detect level placement with sequential, actually-graded internal exams. Never claim an official JLPT result. */
export function recommendPlacement(results = {}) {
  let verifiedThrough = null;
  for (const level of LEVEL_ORDER) {
    const result = results[level];
    if (!plainObject(result) || result.status !== 'passed' || result.kind !== 'kotonoha-internal' || result.level !== level || !result.bySkill || CORE_SKILLS.some(skill => !(result.bySkill[skill]?.total > 0))) break;
    verifiedThrough = level;
  }
  const next = LEVEL_ORDER[LEVEL_ORDER.indexOf(verifiedThrough) + 1] || 'N1';
  return { recommendedLevel: verifiedThrough ? next : 'N5', verifiedThrough, status: verifiedThrough ? 'provisionally-placed' : 'not-placed', officialJlptCertification: false };
}

/** Backups remain local and the prior kotonoha.v1 state is never overwritten here. */
export function createPedagogyState() { return { schemaVersion: PEDAGOGY_SCHEMA_VERSION, evidence: [], assessmentHistory: [], placement: null }; }
export function normalizePedagogyState(raw) {
  const base = createPedagogyState();
  if (!plainObject(raw)) return base;
  if (raw.schemaVersion !== PEDAGOGY_SCHEMA_VERSION) throw new Error('Unsupported pedagogy backup version');
  return {
    ...base,
    evidence: Array.isArray(raw.evidence) ? raw.evidence.filter(e => plainObject(e) && slug(e.itemId) && slug(e.competencyId) && CORE_SKILLS.includes(e.skill) && typeof e.correct === 'boolean').slice(-5000) : [],
    assessmentHistory: Array.isArray(raw.assessmentHistory) ? raw.assessmentHistory.filter(e => plainObject(e) && LEVEL_ORDER.includes(e.level) && ['passed', 'needs_review'].includes(e.status) && e.kind === 'kotonoha-internal').slice(-250) : [],
    placement: plainObject(raw.placement) && LEVEL_ORDER.includes(raw.placement.recommendedLevel) ? { recommendedLevel: raw.placement.recommendedLevel, verifiedThrough: LEVEL_ORDER.includes(raw.placement.verifiedThrough) ? raw.placement.verifiedThrough : null, officialJlptCertification: false } : null,
  };
}

/** Exposure ≠ mastery: record one unique item as evidence, not as level approval. */
export function competencyEvidence(history, competencyId) {
  const records = (Array.isArray(history) ? history : []).filter(e => e.competencyId === competencyId && slug(e.itemId) && typeof e.correct === 'boolean');
  const byItem = new Map(records.map(e => [e.itemId, e]));
  const uniqueResponses = [...byItem.values()];
  return { attempts: records.length, distinctItems: uniqueResponses.length, recentAccuracy: uniqueResponses.length ? uniqueResponses.filter(e => e.correct).length / uniqueResponses.length : null, masteryCertified: false };
}
