import { API_IDS } from './api.constants';

export type GetStrapiDataParams = {
  endpoint: (typeof API_IDS)[keyof typeof API_IDS];
  populate?: string;
};

export type MediaFormatType = {
  height: number;
  name: string;
  url: string;
  width: number;
};

export type MediaType = {
    alternativeText: string;
    formats: {
      large: MediaFormatType;
      medium: MediaFormatType;
      small: MediaFormatType;
      thumbnail: MediaFormatType;
    };
  } & MediaFormatType;

export type ThemeDataType = {
  accentColorHexCode: string;
  fontAwesomeIcon: string;
  fontColorHexCode: string;
  heroImage: MediaType;
  primaryColorHexCode: string;
  secondaryColorHexCode: string;
  uniqueName: string;
};

export type LandingPageDataType = {
  description: string;
  header: string;
  subHeader: string;
};

export type BlogDataType = {
  createdAt: string;
  likes: number;
  postContent: string;
  postImages: MediaType[];
  postSummary: string;
  slug: string;
  tags?: string[];
  title: string;
};
