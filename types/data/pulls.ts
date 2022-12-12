export type PullAuthor = Record<
  "__typename" | "url" | "avatarUrl" | "name",
  string
>;

export type PullReviews = {
    __typename: string;
    totalCount: number;
  };

export interface PullRequestData {
    __typename: string;
    author: PullAuthor;
    isDraft: boolean;
    bodyText: string;
    changedFiles: number;
    headRefName: string;
    number: number;
    lastEditedAt: null | string;
    reviews: PullReviews;
    title: string;
    url: string;
  }
