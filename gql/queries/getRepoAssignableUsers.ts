import { gql } from "@apollo/client";

export const getRepoAssignableUsers = gql`
  {
    repository(name: "poc", owner: "linja-app") {
      id
      isPrivate
      assignableUsers(first: 10) {
        edges {
          node {
            id
            name
            login
          }
        }
      }
    }
  }
`;
