import { API_IDS } from './api.constants';

export type GetStrapiDataParams = {
  endpoint: (typeof API_IDS)[keyof typeof API_IDS],
  populate?: string,
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
  accentColorAltHexCode: string | null;
  accentColorHexCode: string;
  fontAwesomeIcon: string;
  fontColorHexCode: string;
  heroImage: MediaType;
  logo: MediaType;
  primaryColorAltHexCode: string | null;
  primaryColorHexCode: string;
  secondaryColorAltHexCode: string | null;
  secondaryColorHexCode: string;
  uniqueName: string;
};

export type LandingPageDataType = {
  commaSeparatedSubHeadersString: string;
  description: string;
  header: string;
  subHeader: string;
};

export type BlogDataType = {
  createdAt: string;
  likes: number;
  postContent: string;
  postImages: {
    isMain: boolean;
    mediaFiles: MediaType[];
    order: number;
  }[];
  postSummary: string;
  slug: string;
  tags?: { name: string }[];
  title: string;
};

export type SocialLinkDataType = {
  displayName: string;
  iconShortcode: string;
  link: string;
};

export type ProjectDataType = {
  content: string;
  createdAt: string;
  description: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  projectImages: {
    isMain: boolean;
    mediaFiles: MediaType[];
    order: number;
  }[];
  shortDescription: string;
  slug: string;
  tags?: { name: string }[];
  technologies?: { name: string }[];
  title: string;
};
