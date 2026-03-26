declare function __webpack_init_sharing__(scope: string): Promise<void>;

declare const __webpack_share_scopes__: {
  default: Record<string, any>;
};

declare module 'http://localhost:6000/remoteEntry.js' {
  const content: any;
  export default content;
}