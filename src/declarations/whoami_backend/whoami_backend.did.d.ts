import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface JustTry {
  'argument' : ActorMethod<[], Principal>,
  'cycle_balance' : ActorMethod<[], bigint>,
  'id' : ActorMethod<[], Principal>,
  'idQuick' : ActorMethod<[], Principal>,
  'installer' : ActorMethod<[], Principal>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface _SERVICE extends JustTry {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
