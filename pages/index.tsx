import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  Avatar,
  AvatarBadge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getRepoPulls } from "../gql/queries/getRepoPulls";

export type PRAuthor = Record<
  "__typename" | "url" | "avatarUrl" | "name",
  string
>;
export type PullReviews = {
  __typename: string;
  totalCount: number;
};

export interface PullRequest {
  __typename: string;
  author: PRAuthor;
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

export interface RepoInfo {
  __typename: string;
  id: string;
  isPrivate: boolean;
}

const PRAuthor = ({ author }: { author: PRAuthor }) => (
  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
    <Avatar name={author.name} src={author.avatarUrl}>
      <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize="1.25em" />
    </Avatar>
    <Box>
      <Heading size="xs">{author.name}</Heading>
    </Box>
  </Flex>
);

const PRSummaryCard = ({ pr }: { pr: PullRequest }) => {
  return (
    <Box>
      <Card maxW="sm">
        <CardHeader>
          <Link as={NextLink} href={pr.url} isExternal>
            <Heading size="sm">
              #{pr.number}: {pr.title}
            </Heading>
          </Link>
        </CardHeader>
        <CardBody textAlign="left">
          <Text>{pr.bodyText}</Text>
        </CardBody>
        <CardFooter justifyContent="space-between">
          <Flex> 
            <PRAuthor author={pr.author} />
          </Flex>
          <Text>
            {pr.reviews.totalCount}
          </Text>
        </CardFooter>
      </Card>
    </Box>
  );
};

type HomeProps = {
  pullRequests: PullRequest[];
  repoInfo: RepoInfo;
};
const Home: NextPage<HomeProps> = ({ pullRequests, repoInfo }) => {
  console.log({ pullRequests });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full justify-center px-20 text-center">
        {repoInfo.isPrivate && <span>isPrivate</span>}
        <Stack direction={["column", "row"]} spacing="8">
          {pullRequests.map((pr: PullRequest) => (
            <PRSummaryCard key={pr.number} pr={pr} />
          ))}
        </Stack>
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
