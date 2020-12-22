export interface RevealedConfig {
  revealedId: string;
  role: 'burglar' | 'princess';
  src: string;
  sticker: { ratioTop: number; ratioLeft: number; ratioSize: number };
  avatar: { ratioTop: number; ratioLeft: number; ratioSize: number; rotate: number; zIndex: number };
}

const Z_INDEX_BEFORE_STICKER = 101;
const Z_INDEX_BEHIND_STICKER = 0;

export const REVEALED_CONFIGS: RevealedConfig[] = [
  {
    revealedId: 'crown',
    role: 'princess',
    src: 'assets/images/crown.png',
    sticker: {
      ratioTop: 0,
      ratioLeft: 0.3,
      ratioSize: 0.3,
    },
    avatar: {
      ratioTop: 0.2,
      ratioLeft: 0.33,
      ratioSize: 0.3,
      rotate: 0,
      zIndex: Z_INDEX_BEHIND_STICKER,
    },
  },
  {
    revealedId: 'princess',
    role: 'princess',
    src: 'assets/images/princess.png',
    sticker: {
      ratioTop: 0,
      ratioLeft: 0,
      ratioSize: 1,
    },
    avatar: {
      ratioTop: 0.15,
      ratioLeft: 0.34,
      ratioSize: 0.25,
      rotate: 0,
      zIndex: Z_INDEX_BEHIND_STICKER,
    },
  },
  {
    revealedId: 'princess2',
    role: 'princess',
    src: 'assets/images/princess2.png',
    sticker: {
      ratioTop: 0.1,
      ratioLeft: 0.2,
      ratioSize: 0.65,
    },
    avatar: {
      ratioTop: 0.11,
      ratioLeft: 0.41,
      ratioSize: 0.16,
      rotate: 7,
      zIndex: Z_INDEX_BEFORE_STICKER,
    },
  },
  {
    revealedId: 'burglar',
    role: 'burglar',
    src: 'assets/images/burglar.png',
    sticker: {
      ratioTop: 0.15,
      ratioLeft: 0,
      ratioSize: 1,
    },
    avatar: {
      ratioTop: 0.12,
      ratioLeft: 0.45,
      ratioSize: 0.3,
      rotate: 20,
      zIndex: Z_INDEX_BEHIND_STICKER,
    },
  },
  {
    revealedId: 'burglar2',
    role: 'burglar',
    src: 'assets/images/burglar2.png',
    sticker: {
      ratioTop: 0,
      ratioLeft: 0,
      ratioSize: 1,
    },
    avatar: {
      ratioTop: 0.11,
      ratioLeft: 0.31,
      ratioSize: 0.25,
      rotate: -15,
      zIndex: Z_INDEX_BEFORE_STICKER,
    },
  },
  {
    revealedId: 'burglar3',
    role: 'burglar',
    src: 'assets/images/burglar3.png',
    sticker: {
      ratioTop: 0.2,
      ratioLeft: 0.2,
      ratioSize: 0.6,
    },
    avatar: {
      ratioTop: 0.29,
      ratioLeft: 0.25,
      ratioSize: 0.3,
      rotate: -10,
      zIndex: Z_INDEX_BEHIND_STICKER,
    },
  },
];
