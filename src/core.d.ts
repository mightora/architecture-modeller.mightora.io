import type { Model } from '../packages/schema/types';
export function validate(input:unknown):Model;
export function parse(text:string):Model;
export function empty(name?:string):Model;
export const LIMITS:{bytes:number};
