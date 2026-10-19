import type { Model } from '../packages/schema/types';
export function parse(text:string,extension?:string):Model;
export function dump(model:Model):string;
