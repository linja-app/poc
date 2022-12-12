import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useActiveUserContext } from "../../context/active-user";
import { UserStatus } from "../../types/active-user.types";
import { PullAuthor } from "../../types/data/pulls";

type Props = {
  author: PullAuthor;
};
type StatusStates = {
  [key in UserStatus]: string;
};
interface StatusColours extends StatusStates {
  default: string;
}
const PullAuthor = ({ author }: Props) => {
  const statusColours: StatusColours = {
    active: "green.500",
    idle: "orange.400",
    default: "gray.300", // fallback if status isn't set
  };
  const { status } = useActiveUserContext();
  
  return (
    <Flex flex="1" gap="2" alignItems="center" flexWrap="wrap">
      <Box border="2px" borderColor={statusColours[status]} borderRadius="full">
        <Avatar size="xs" name={author.name} src={author.avatarUrl} />
      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="bold">
          {author.name}
        </Text>
      </Box>
    </Flex>
  );
};

export default PullAuthor;
