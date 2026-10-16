import React from 'react';
import Icon from './Icon.jsx';

/** Compact semantic status: icons and labels reinforce color, never color alone. */
const STYLES={
 completed:{label:'Concluída',icon:'check',className:'bg-accent-soft text-primary-strong'},
 current:{label:'Agora',icon:'learn',className:'bg-blue-soft text-blue'},
 review:{label:'Revisar',icon:'review',className:'bg-amber-soft text-amber-ink'},
 locked:{label:'Mais adiante',icon:'lock',className:'bg-raised text-muted'},
};
export default function LearningStatus({kind='current',label}){
 const status=STYLES[kind]||STYLES.current;
 return <span className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${status.className}`}>
  <Icon name={status.icon} className="h-3.5 w-3.5" />
  {label||status.label}
 </span>;
}
