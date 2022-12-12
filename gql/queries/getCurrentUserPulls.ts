import { gql } from "@apollo/client";

export const getCurrentUserPulls = gql`
  {
    user(login: "tinagdev") {
      id
      pullRequests(first: 5) {
        totalCount
        edges {
          node {
            changedFiles
            checksUrl
            lastEditedAt
            title
            url
          }
        }
      }
    }
  }
`;
