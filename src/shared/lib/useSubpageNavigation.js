import {useCallback,useEffect,useState} from 'react';
/** Store subpages in history so the browser's Back button matches the visible page. */
export function useSubpageNavigation(scope,defaultPage='menu',allowedPages=[]) {
  const parameter='sub_'+scope;
  const read=useCallback(()=>{
    const value=new URLSearchParams(window.location.search).get(parameter);
    return value && allowedPages.includes(value)?value:defaultPage;
  },[parameter,defaultPage,allowedPages.join('|')]);
  const [page,setPage]=useState(read);
  useEffect(()=>{
    const onPop=()=>setPage(read());
    window.addEventListener('popstate',onPop);
    return ()=>window.removeEventListener('popstate',onPop);
  },[read]);
  const navigate=useCallback(next=>{
    if(!allowedPages.includes(next)&&next!==defaultPage)return;
    if(read()===next){setPage(next);return;}
    const url=new URL(window.location.href);
    if(next===defaultPage)url.searchParams.delete(parameter);
    else url.searchParams.set(parameter,next);
    window.history.pushState({...window.history.state,kotonohaSub:scope},'',url.pathname+url.search+url.hash);
    setPage(next);
  },[scope,parameter,read,defaultPage,allowedPages.join('|')]);
  const back=useCallback(()=>{
    if(page===defaultPage)return;
    // A direct deep link has no in-app submenu history entry to pop.
    if(window.history.state?.kotonohaSub===scope){window.history.back();return;}
    const url=new URL(window.location.href);
    url.searchParams.delete(parameter);
    window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
    setPage(defaultPage);
  },[page,scope,parameter,defaultPage]);
  return [page,navigate,back];
}
