import { test } from 'node:test';
import assert from 'node:assert/strict';
import {chooseJapaneseVoice,speakJapanese,stopSpeech} from '../src/entities/study/index.js';
import {FORMATIVE_LISTENING_N5,gradeFormativeListening} from '../src/entities/study/index.js';

test('select only Japanese voice, prefer local ja-JP and honour explicit voice choice',()=>{
 const voices=[{voiceURI:'en',lang:'en-US',localService:true},{voiceURI:'ja-remote',lang:'ja-JP',localService:false},{voiceURI:'ja-local',lang:'ja-JP',localService:true}];
 assert.equal(chooseJapaneseVoice(voices)?.voiceURI,'ja-local');
 assert.equal(chooseJapaneseVoice(voices,'ja-remote')?.voiceURI,'ja-remote');
 assert.equal(chooseJapaneseVoice(voices.slice(0,1)),null);
});

test('voice unavailable reports a user-friendly error and does not invent audio',()=>{
 let error='';
 assert.equal(speakJapanese('こんにちは',msg=>{error=msg;}),false);
 assert.match(error,/não está disponível/);
});

test('speech requests Japanese synchronously; ignores interrupted playback errors',()=>{
 const previous=globalThis.window;
 let spoken=null;let canceled=0;const alerts=[];
 const synth={getVoices:()=>[{voiceURI:'ja1',lang:'ja-JP',localService:true}],cancel:()=>{canceled++},paused:false,speak:utterance=>{spoken=utterance;}};
 class FakeUtterance {constructor(text){this.text=text;}}
 globalThis.window={speechSynthesis:synth,SpeechSynthesisUtterance:FakeUtterance};
 try{
  assert.equal(speakJapanese('水を飲みます。',msg=>alerts.push(msg),{rate:4}),true);
  assert.equal(spoken.lang,'ja-JP');assert.equal(spoken.rate,1.15);
  assert.equal(spoken.voice.voiceURI,'ja1');assert.equal(spoken.text,'水を飲みます。');
  spoken.onerror({error:'interrupted'});assert.deepEqual(alerts,[]);
  stopSpeech();assert.ok(canceled>=2);
 }finally{globalThis.window=previous;}
});

test('missing Japanese voice does not speak with an unrelated language voice',()=>{
 const previous=globalThis.window;let calls=0;let err='';
 globalThis.window={speechSynthesis:{getVoices:()=>[{lang:'en-US'}],speak:()=>{calls++}},SpeechSynthesisUtterance:class{}};
 try{assert.equal(speakJapanese('こんにちは',msg=>err=msg),false);assert.equal(calls,0);assert.match(err,/voz japonesa/i);}finally{globalThis.window=previous;}
});

test('browser TTS listening samples are explicitly formative, not certifying',()=>{
 assert.ok(FORMATIVE_LISTENING_N5.length>=5);
 for(const q of FORMATIVE_LISTENING_N5){
  assert.equal(q.choices.length,4);assert.ok(q.spokenText);
  const heard=gradeFormativeListening(q,q.answerIndex,true);
  assert.equal(heard.correct,true);assert.equal(heard.certificationEligible,false);
  assert.equal(heard.skillEvidence,'formative-tts-listening');
  assert.equal(gradeFormativeListening(q,q.answerIndex,false).skillEvidence,'reading-assistance');
 }
});
