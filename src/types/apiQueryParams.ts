export type Query = {
  [key: string]: undefined | string | string[] | Query | Query[];
};
