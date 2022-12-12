import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { PullRequest } from "../../types/data/pulls";
import PullAuthor from "./PullAuthor";
import NextLink from "next/link";
type Props = {
  pr: PullRequest;
};

const PullCard = ({ pr }: Props) => {
  return (
    <Box>
      <Card maxW="sm" textAlign="left">
        <CardHeader>
          <Heading size="xs">
            <Link as={NextLink} href={pr.url} isExternal>
              <span>#{pr.number}</span>
            </Link>
            : {pr.title}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text>{pr.bodyText}</Text>
        </CardBody>
        <CardFooter justifyContent="space-between">
          <Flex>
            <PullAuthor author={pr.author} />
          </Flex>
          <Text>{pr.reviews.totalCount}</Text>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default PullCard;
