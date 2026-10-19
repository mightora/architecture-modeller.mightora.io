import type { Model } from '../schema/types';
import { canonical } from '../schema';
export interface SavedModel { id:string; name:string; updated:string; model:Model; revisions:{date:string;text:string}[] }
export class LocalModelLibrary {
  private db?:Promise<IDBDatabase>;
  private open():Promise<IDBDatabase>{
    return this.db ||= new Promise((resolve,reject)=>{const request=indexedDB.open('mightora-architecture-library',1);request.onupgradeneeded=()=>request.result.createObjectStore('models',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||new Error('Local library unavailable.'));});
  }
  private async request<T>(mode:IDBTransactionMode, action:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{
    const db=await this.open();return new Promise((resolve,reject)=>{const tx=db.transaction('models',mode),r=action(tx.objectStore('models'));let result:T;r.onsuccess=()=>{result=r.result;};tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||new Error('Local save failed.'));tx.onerror=()=>reject(tx.error);});
  }
  async list():Promise<SavedModel[]>{return this.request('readonly',s=>s.getAll());}
  async get(id:string):Promise<SavedModel|undefined>{return this.request('readonly',s=>s.get(id));}
  async save(model:Model,id:string):Promise<void>{
    const previous=await this.get(id),now=new Date().toISOString(),text=canonical(model),revisions=previous?.revisions||[];
    if(previous&&canonical(previous.model)!==text)revisions.unshift({date:previous.updated,text:canonical(previous.model)});
    await this.request('readwrite',s=>s.put({id,name:model.name,updated:now,model,revisions:revisions.slice(0,5)} satisfies SavedModel));
  }
  async remove(id:string):Promise<void>{await this.request('readwrite',s=>s.delete(id));}
}
