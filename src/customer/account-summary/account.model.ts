export interface Account {
  index: number;
  displayName: string;
  availableBalance: number;
  category: string;
  subCategory: string;
  referenceId: string;
  displayBalance: number;
  originalProductName: string;
  accountMessage: AccountMessage;
  isDisplayAccount: boolean;
  navigable: boolean;
  contentImage: ContentImage;
  accountStatus: string;
  singleAccountViewEnabled: boolean;
  accountNumberTLNPI: string;
}

export interface AccountMessage {
  type: string;
  level: string;
}

export interface ContentImage {
  hiRes: HiResContentImage;
  lowRes: LowResContentImage;
}

interface Image {
  tileBackground: string;
  logo: string;
}

export interface HiResContentImage extends Image {}

export interface LowResContentImage extends Image {}

export type Accounts = Account[];
