import styled from 'styled-components';


export default function FeedItem() {
  return (
    <FeedItemWrapper>
      <UserInfo>
        <Avatar src="/user.png" alt="User avatar" />
        <div>
          <UserName>Dan @dwr</UserName>
          <TimeStamp>3hr</TimeStamp>
        </div>
      </UserInfo>
      <Content>Bought tickets to Ed Sheeran's concert on bookmyshow.</Content>
      <PostImage src="/concert.png" alt="Concert" />
      <Location>📍 Location Map Link</Location>
      <Actions>
        <ActionButton aria-label="Upvote">
          <UpvoteIcon viewBox="0 0 24 24">
            <path d="M12 4l-8 8h6v8h4v-8h6z" />
          </UpvoteIcon>
        </ActionButton>
        <ActionButton aria-label="Downvote">
          <DownvoteIcon viewBox="0 0 24 24">
            <path d="M12 20l-8-8h6V4h4v8h6z" />
          </DownvoteIcon>
        </ActionButton>
        <ShareButton>Share</ShareButton>
      </Actions>
    </FeedItemWrapper>
  )
}

const FeedItemWrapper = styled.div`
  background-color: #1B1F24;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 16px;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserName = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

const TimeStamp = styled.span`
  color: #657786;
  font-size: 0.9em;
`;

const Content = styled.p`
  margin-bottom: 12px;
`;

const PostImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Location = styled.p`
  color: #1DA1F2;
  margin-bottom: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: #657786;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

const IconSvg = styled.svg`
  width: 24px;
  height: 24px;
  fill: currentColor;
  stroke: white;
  stroke-width: 1px;
`;

const UpvoteIcon = styled(IconSvg)`
  color: #4CAF50;
`;

const DownvoteIcon = styled(IconSvg)`
  color: #F44336;
`;

const ShareButton = styled(ActionButton)`
  color: #657786;
  padding: 8px 12px;
  border-radius: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
    opacity: 1;
  }
`;
