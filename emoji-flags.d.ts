declare module "emoji-flags" {
    const flags: {
      [key: string]: {
        code: string;
        emoji: string;
        name: string;
      };
    };
    export default flags;
  }
  