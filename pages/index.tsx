import { NextPage } from "next";
import ErrorPage from "./_error";
import styled from "styled-components";
import { rgba } from "polished";
import Link from "next/link";
import Head from "next/head";
import ErrorPage from "./_error";

const ClipsPage: NextPage = ({ error }) => {
  if (error) return <ErrorPage err={error} statusCode={500} />;

  return (
    <ClipsBody>
      <Head>
        <title>Home - ChisVR's Clips</title>
      </Head>
      <Heading>
        <h1>Please Visit one of Urls Below</h1>
      </Heading>
      <ClipsContainer>
          <Link href="/medaltv/">
            <Button variant="contained" color="secondary">MedalTV Clips</Button>
          </Link>
        ))}
      </ClipsContainer>
    </ClipsBody>
  );
};


export default ClipsPage;

const ClipsContainer = styled.div`
  display: grid;
  margin-top: 15px;
  grid-template-columns: 100%;

  @media only screen and (min-width: 850px) {
    grid-template-columns: 50% 50%;
  }
  @media only screen and (min-width: 1000px) {
    grid-template-columns: 33.333% 33.333% 33.333%;
  }
  @media only screen and (min-width: 1300px) {
    grid-template-columns: 25% 25% 25% 25%;
  }

  @media only screen and (min-width: 1500px) {
    grid-template-columns: 20% 20% 20% 20% 20%;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.color};
  }

  div.clip {
    background: ${(props) => props.theme.darker};
    margin: 10px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${(props) => props.theme.accent};
    cursor: pointer;

    &:hover {
      background: ${(props) => props.theme.accent};
      color: ${(props) => props.theme.darker};
    }

    p {
      margin: 10px 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    div.meta {
      position: relative;
      display: flex;

      img {
        width: 100%;
      }
    }
  }
`;

const ClipMeta = styled.div<{
  horizontal: "left" | "right";
  vertical: "top" | "bottom";
}>`
  position: absolute;
  color: ${(props) => props.theme.color};
  background: ${(props: any) => rgba(props.theme.darker, 0.75)};
  padding: 0 10px;
  font-size: 0.8rem;

  ${(props) => props.horizontal}: 0;
  ${(props) => props.vertical}: 0;
`;
