import test from "node:test";
import assert from "node:assert/strict";
import {initialState, normalizeState, isValidStudySession} from "../src/state.js";
const sample = {step:2,lessonIndex:1,duration:15,dueCardIds:[],srsIndex:0,srsRevealed:false,selectedOption:null,answered:false};
test("guided session survives backup normalization",()=>{const s=initialState();s.studySession=sample;assert.deepEqual(normalizeState(s).studySession,sample);});
test("invalid guided sessions are discarded",()=>{const s=initialState();s.studySession={...sample,step:99};assert.equal(isValidStudySession(s.studySession),false);assert.equal(normalizeState(s).studySession,null);});
test("missing card ids are removed on restore",()=>{const s=initialState();s.studySession={...sample,dueCardIds:["missing"],srsIndex:1};const restored=normalizeState(s);assert.deepEqual(restored.studySession.dueCardIds,[]);assert.equal(restored.studySession.srsIndex,0);});
