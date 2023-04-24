import { NextPage } from "next";
import ErrorPage from "./_error";
import styled from "styled-components";
import { rgba } from "polished";
import Link from "next/link";
import Head from "next/head";
import { ClipsBody, Heading } from "../components/clips";
import Button from '@material-ui/core/Button'

const ClipsPage: NextPage = () => {
  return (
    <ClipsBody>
      <Head>
        <title>Home - NekoSuneVR's Clips</title>
      </Head>
      <Heading>
        <h1>Please Visit one of Urls Below</h1>
      </Heading>
      <ClipsContainer>
          <Link href="/medaltv/">
            <a>
              <Button variant="contained" color="secondary">MedalTV Clips</Button>
            </a>
          </Link>
          <Link href="/twitchtv/">
            <a>
              <Button variant="contained" color="secondary">TwitchTV Clips</Button>
            </a>
          </Link>
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
`;
