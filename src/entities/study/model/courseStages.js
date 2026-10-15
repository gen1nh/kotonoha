import {N5_UNITS,unitPassed} from './courseUnits.js';

import {N5_STAGE_PLAN} from '../content/n5Sequence.js';
export const N5_STAGES=Object.freeze(N5_STAGE_PLAN.map(stage=>Object.freeze({...stage,units:Object.freeze(stage.ids.map(id=>N5_UNITS.find(unit=>unit.id===id)))})));

export function stageProgress(state,stage){
 const completed=stage.units.filter(unit=>unitPassed(state,unit.id)).length;
 const current=N5_UNITS.find(unit=>!unitPassed(state,unit.id));
 return {completed,total:stage.units.length,status:completed===stage.units.length?'completed':stage.units.some(unit=>unit.id===current?.id)?'current':'upcoming'};
}
export const stageForUnit=id=>N5_STAGES.find(stage=>stage.units.some(unit=>unit.id===id))||null;
