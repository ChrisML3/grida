import React from "react";
import styled from "@emotion/styled";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
} from "@editor-ui/dropdown-menu";
import dayjs from "dayjs";

interface ItemMenuProps {
  onDeleteClick?: () => void;
  onUnlistClick?: () => void;
  onPublishClick?: () => void;
}

export function PostListItem({
  title,
  summary,
  author,
  publishedAt,
  createdAt,
  thumbnail,
  readingTime,
  onClick,
  isDraft,
  ...menuProps
}: {
  title: string;
  summary: string;
  author?: string;
  publishedAt?: Date | string;
  createdAt?: Date | string;
  isDraft?: boolean;
  thumbnail?: string;
  readingTime?: number;
  onClick?: () => void;
} & ItemMenuProps) {
  return (
    <Container onClick={onClick}>
      <TextContents>
        <Title>{title?.length ? title : "Untitled post"}</Title>
        {summary && <Summary>{summary}</Summary>}
        <MetaContainer>
          {author && <Author>@{author}</Author>}
          <PublishedAt>
            {isDraft ? (
              <>Created on {dayjs(createdAt).format("MMM DD, YYYY")}</>
            ) : (
              <>Published on {dayjs(publishedAt).format("MM/DD/YYYY")}</>
            )}
          </PublishedAt>
          {readingTime && (
            <ReadingTime>{readingtimeToMinutes(readingTime)}</ReadingTime>
          )}
          <ItemDropdownMenu {...menuProps} />
        </MetaContainer>
      </TextContents>
      {thumbnail && <Thumbnail src={thumbnail} />}
    </Container>
  );
}

function ItemDropdownMenu({
  onDeleteClick,
  onPublishClick,
  onUnlistClick,
}: ItemMenuProps) {
  return (
    <DropdownMenu>
      <MoreMenu
        onClick={(e) => {
          // show menu
          e.stopPropagation();
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.68374 11.8844C8.88017 12.0542 9.17735 12.0458 9.36385 11.8593L13.6065 7.61666C13.8018 7.4214 13.8018 7.10482 13.6065 6.90955C13.4112 6.71429 13.0946 6.71429 12.8994 6.90955L9.00973 10.7992L5.11381 6.90328C4.91855 6.70802 4.60196 6.70802 4.4067 6.90328C4.21144 7.09854 4.21144 7.41513 4.4067 7.61039L8.64934 11.853C8.66043 11.8641 8.67191 11.8746 8.68374 11.8844Z"
            fill="#535455"
          />
        </svg>
      </MoreMenu>
      <DropdownMenuContent>
        {onDeleteClick && (
          <DropdownMenuItem onClick={onDeleteClick}>Delete</DropdownMenuItem>
        )}
        {onUnlistClick && (
          <DropdownMenuItem onClick={onUnlistClick}>Unlist</DropdownMenuItem>
        )}
        {onPublishClick && (
          <DropdownMenuItem onClick={onPublishClick}>Publish</DropdownMenuItem>
        )}
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function readingtimeToMinutes(readingTime: number) {
  // 0 min -> 1 min
  const min = Math.max(1, Math.floor(readingTime / 1000 / 60));
  if (min === 1) {
    return "1 minute read";
  } else {
    return `${min} minutes read`;
  }
}

const Container = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 16px;
  min-height: 80px;
  box-sizing: border-box;
  color: rgb(55, 53, 48);
  border-bottom: 1px solid transparent;

  :hover {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    color: black;
  }

  transition: border-bottom 0.3s ease-in-out, color 0.3s ease-in-out;
`;

const TextContents = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 8px;
  box-sizing: border-box;
`;

const Title = styled.span`
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
`;

const Summary = styled.span`
  opacity: 0.9;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 20px;
  box-sizing: border-box;
`;

const Author = styled.span`
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  text-align: left;
`;

const PublishedAt = styled.span`
  color: rgba(55, 53, 48, 0.8);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  text-align: left;
`;

const ReadingTime = styled.span`
  color: rgba(55, 53, 48, 0.8);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  text-align: left;
`;

const Thumbnail = styled.img`
  width: 130px;
  height: 130px;
  object-fit: cover;
  margin-bottom: 4px;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const MoreMenu = styled(DropdownMenuTrigger)`
  padding: 0px;
  outline: none;
  border: none;
  width: 21px;
  height: 21px;
  border-radius: 100px;
  background-color: transparent;

  :hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;