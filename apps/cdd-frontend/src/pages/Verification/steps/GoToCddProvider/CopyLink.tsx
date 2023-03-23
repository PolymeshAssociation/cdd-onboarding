import React from 'react';
import {
  Button,
  Text,
  useClipboard,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';

export type CopyLinkProps = {
  link: string;
};

export const CopyLink: React.FC<CopyLinkProps> = ({ link }) => {
  const { onCopy, hasCopied } = useClipboard(link);

  return (
    <>
      <Text textAlign="justify" mb="1rem">
        Copy the link to verification page and copy that in a new browser
        window.
      </Text>
      <InputGroup size="md">
        <Input
          pr="7.6rem"
          type="text"
          disabled
          placeholder="Link to CDD"
          borderRadius="1.5rem"
          value={link}
        />
        <InputRightElement width="7rem" mr="0.1rem">
          <Button size="md" onClick={onCopy} borderLeftRadius={0}>
            {hasCopied ? 'Copied' : 'Copy link'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};

export default CopyLink;