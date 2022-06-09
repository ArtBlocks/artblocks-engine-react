export interface Project {
  id: string;
  name: string;
  artistName: string;
  invocations: BigInt;
  maxInvocations: BigInt;
  active: boolean;
  paused: boolean;
  complete: boolean;
  tokens: Token[];
}

export interface Token {
  id: string;
  tokenId: string;
}
