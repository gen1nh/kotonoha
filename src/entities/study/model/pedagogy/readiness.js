/** N5 certification policy: internal exam only. No JLPT score equivalence. */
import { assessmentBlueprint, buildAssessment, CORE_SKILLS, validateItem } from './engine.js';
import { N5_TOPICS, topicPassed, unitsForTopic, LEGACY_N5_UNIT_COUNTS, unitPassed } from '../courseUnits.js';
import { N5_CURRICULUM } from './n5Curriculum.js';

export const N5_CERTIFICATION_POLICY = Object.freeze({
  level: 'N5',
  minItemsPerSkill: 20,
  minTotalFraction: 0.8,
  minSkillFraction: 0.6,
  version: 1,
  label: 'Avaliação interna Kotonoha — não é certificado JLPT',
});

export const N5_SKILL_LABELS = Object.freeze({
  vocabulary: 'Vocabulário e kanji',
  grammar: 'Gramática',
  reading: 'Leitura',
  listening: 'Compreensão auditiva',
});

export const N5_REQUIRED_COMPETENCIES = Object.freeze({
  vocabulary: Object.freeze(N5_CURRICULUM.filter(item => ['vocabulary'].includes(item.domain)).map(item => item.id)),
  grammar: Object.freeze(N5_CURRICULUM.filter(item => item.domain === 'grammar').map(item => item.id)),
  reading: Object.freeze(N5_CURRICULUM.filter(item => item.domain === 'reading').map(item => item.id)),
  listening: Object.freeze(N5_CURRICULUM.filter(item => item.domain === 'listening').map(item => item.id)),
});

export function missingExamCompetencies(questions) {
  const present = new Set((Array.isArray(questions) ? questions : []).filter(item =>
    item?.level === 'N5' && item.status === 'approved' && validateItem(item).length === 0
  ).map(item => `${item.skill}:${item.competencyId}`));
  return Object.fromEntries(CORE_SKILLS.map(skill => [skill,
    N5_REQUIRED_COMPETENCIES[skill].filter(id => !present.has(`${skill}:${id}`)),
  ]));
}

const coversAllCompetencies = items => Object.values(missingExamCompetencies(items)).every(missing => missing.length === 0);
const validSkillOutcome = (record, skill) => {
  const outcome = record?.bySkill?.[skill];
  return outcome && Number.isInteger(outcome.total) && outcome.total >= N5_CERTIFICATION_POLICY.minItemsPerSkill &&
    Number.isInteger(outcome.correct) && outcome.correct >= 0 && outcome.correct <= outcome.total &&
    outcome.correct / outcome.total >= N5_CERTIFICATION_POLICY.minSkillFraction;
};

/** Reject contradictory totals or impossible coverage in a persisted internal result. */
function consistentN5Score(record) {
 if (!record || !Number.isInteger(record.total) || !Number.isInteger(record.correct) ||
     !Number.isFinite(record.fraction) || record.total <= 0 || record.correct < 0 || record.correct > record.total ||
     Math.abs(record.fraction - record.correct / record.total) > 1e-9) return false;
 const outcomes = CORE_SKILLS.map(skill => record.bySkill?.[skill]);
 if (!outcomes.every(x => x && Number.isInteger(x.total) && Number.isInteger(x.correct) &&
     x.total >= 0 && x.correct >= 0 && x.correct <= x.total &&
     Number.isFinite(x.fraction) && Math.abs(x.fraction - (x.total ? x.correct / x.total : 0)) <= 1e-9)) return false;
 return outcomes.reduce((sum,x) => sum + x.total,0) === record.total &&
   outcomes.reduce((sum,x) => sum + x.correct,0) === record.correct;
}

/** Do not equate completed micro-checkpoints or legacy scores with level certification. */
export function hasPassedInternalN5(state) {
  const history = state?.pedagogy?.assessmentHistory;
  if (!Array.isArray(history)) return false;
  return history.some(record => record?.kind === 'kotonoha-internal' && record?.level === 'N5' &&
    record?.status === 'passed' && record?.passed === true && record?.policyVersion === N5_CERTIFICATION_POLICY.version &&
    CORE_SKILLS.every(skill => validSkillOutcome(record, skill)) &&
    consistentN5Score(record) &&
    Number.isInteger(record.total) && record.total >= CORE_SKILLS.length * N5_CERTIFICATION_POLICY.minItemsPerSkill &&
    Number.isInteger(record.correct) && record.correct >= Math.ceil(record.total * N5_CERTIFICATION_POLICY.minTotalFraction) &&
    record.correct <= record.total &&
    CORE_SKILLS.every(skill => N5_REQUIRED_COMPETENCIES[skill].every(id => (record.competencyIds?.[skill] || []).includes(id))));
}

/** Optional laboratories need the original beginner foundation, not full N5
 * certification; legacy checkpoint scores still grant those exact old units. */
export function hasCompletedN5Basics(state) {
  return Object.entries(LEGACY_N5_UNIT_COUNTS).every(([topic,count])=>
    unitsForTopic(topic).filter(unit=>unit.index<count).every(unit=>unitPassed(state,unit.id)));
}

export function hasCompletedN5Foundations(state) {
  return N5_TOPICS.every(topic => topicPassed(state || {}, topic));
}

/** Review coverage before offering an exam. Shortages are explicit and never silently waived. */
export function n5ReleaseReadiness(items = [], state = {}) {
  const blueprint = assessmentBlueprint('N5', N5_CERTIFICATION_POLICY.minItemsPerSkill);
  const selected = buildAssessment(items, blueprint, { seed: 5 });
  const approved = (Array.isArray(items) ? items : []).filter(item => item?.level === 'N5' && item?.status === 'approved' && validateItem(item).length === 0);
  const bySkill = Object.fromEntries(CORE_SKILLS.map(skill => [skill, {
    label: N5_SKILL_LABELS[skill],
    approved: approved.filter(item => item.skill === skill).length,
    required: N5_CERTIFICATION_POLICY.minItemsPerSkill,
    missing: selected.shortages?.[skill] || 0,
  }]));
  const competencyGaps = missingExamCompetencies(approved);
  const foundations = Object.fromEntries(N5_TOPICS.map(topic => [topic, topicPassed(state, topic)]));
  return {
    level: 'N5',
    foundations,
    foundationsComplete: hasCompletedN5Foundations(state),
    examAvailable: selected.status === 'ready' && coversAllCompetencies(selected.questions),
    missingCompetencies: competencyGaps,
    certified: hasPassedInternalN5(state),
    bySkill,
    status: selected.status === 'ready' && coversAllCompetencies(selected.questions) ? 'assessment-bank-ready' : 'awaiting-reviewed-questions',
    note: 'Critérios internos provisórios, não equivalentes à nota escalonada oficial do JLPT.',
  };
}

/** Strictly build the actual N5 internal test with the release policy (never the generic tiny development blueprint). */
export function buildN5CertificationExam(items, seed) {
  const blueprint = {
    ...assessmentBlueprint('N5', N5_CERTIFICATION_POLICY.minItemsPerSkill),
    minTotalFraction: N5_CERTIFICATION_POLICY.minTotalFraction,
    minSkillFraction: N5_CERTIFICATION_POLICY.minSkillFraction,
  };
  const exam = buildAssessment(items, blueprint, { seed });
  if (exam.status === 'ready' && !coversAllCompetencies(exam.questions))
    return {...exam, status:'insufficient_competency_coverage', questions:[], missingCompetencies:missingExamCompetencies(exam.questions)};
  return exam;
}

export function recordN5Result(state, graded, assessment) {
  if (!state?.pedagogy || graded?.status !== 'passed' || !assessment || assessment?.status !== 'ready') return false;
  const required = N5_CERTIFICATION_POLICY.minItemsPerSkill;
  if (CORE_SKILLS.some(skill => assessment.blueprint?.required?.[skill] !== required)) return false;
  const examIds = assessment.questions.map(item => item.id);
  if (examIds.length < CORE_SKILLS.length * required || new Set(examIds).size !== examIds.length ||
      assessment.questions.some(item => item.level !== 'N5' || item.status !== 'approved' || validateItem(item).length) ||
      !coversAllCompetencies(assessment.questions)) return false;
  // An assessment result must account for this exact question set and every skill.
  if (!consistentN5Score(graded) || graded.level !== 'N5' || graded.kind !== 'kotonoha-internal' ||
      graded.total !== assessment.questions.length ||
      CORE_SKILLS.some(skill => graded.bySkill?.[skill]?.total !== assessment.questions.filter(item => item.skill === skill).length)) return false;
  const result = { ...graded, passed: true, policyVersion: N5_CERTIFICATION_POLICY.version,
    date: new Date().toISOString(), itemIds: examIds,
    competencyIds: Object.fromEntries(CORE_SKILLS.map(skill => [skill, [...new Set(assessment.questions.filter(q=>q.skill===skill).map(q=>q.competencyId))]])) };
  if (!hasPassedInternalN5({pedagogy:{assessmentHistory:[result]}})) return false;
  state.pedagogy.assessmentHistory = [...(state.pedagogy.assessmentHistory || []), result].slice(-250);
  state.pedagogy.placement = {recommendedLevel:'N4',verifiedThrough:'N5',officialJlptCertification:false};
  return true;
}
