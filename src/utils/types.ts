export interface Project {
  id: string;
  name: string;
  description: string;
  artistName: string;
  invocations: BigInt;
  maxInvocations: BigInt;
  activatedAt: BigInt;
  scriptJSON: string;
  active: boolean;
  paused: boolean;
  complete: boolean;
  tokens: Token[];
}

export interface Token {
  id: string;
  tokenId: string;
  invocation: BigInt;
}
