import { gql } from "@apollo/client";

export const getRepoPulls = gql`
  {
    repository(name: "poc", owner: "linja-app") {
      id
      isPrivate
      branchProtectionRules(first: 10) {
        edges {
          node {
            requiredApprovingReviewCount
          }
        }
      }
      pullRequests(
        first: 10
        orderBy: { field: CREATED_AT, direction: ASC }
        states: OPEN
      ) {
        edges {
          node {
            author {
              url
              avatarUrl(size: 1024)
              ... on User {
                id
                name
              }
            }
            reviews(last: 5) {
              totalCount
            }
            isDraft
            bodyText
            changedFiles
            headRefName
            number
            lastEditedAt
            title
            url
          }
        }
      }
    }
  }
`;
