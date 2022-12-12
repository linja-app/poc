import Head from "next/head";
import Image from "next/image";

import {
  ApolloClient, createHttpLink, InMemoryCache
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  Stack
} from "@chakra-ui/react";
import KanbanBoard from "../components/kanban/KanbanBoard";
import { getRepoPulls } from "../gql/queries/getRepoPulls";
import { PullRequest } from "../types/data/pulls";
import PullCard from "../components/pull-card/PullCard";

export interface RepoInfo {
  __typename: string;
  id: string;
  isPrivate: boolean;
}

type Props = {
  pullRequests: PullRequest[];
  repoInfo: RepoInfo;
};
const Home = ({ pullRequests, repoInfo }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full justify-center px-20 text-center">
        <KanbanBoard pulls={pullRequests} />
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: getRepoPulls,
  });

  const { pullRequests: rawPullRequests, ...repoInfo } = data.repository;

  return {
    props: {
      pullRequests: rawPullRequests.edges.map(({ node }) => node),
      repoInfo,
    },
  };
}
