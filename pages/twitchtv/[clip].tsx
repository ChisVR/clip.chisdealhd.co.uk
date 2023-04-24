import { NextPage, NextPageContext } from "next";
import { fetcher, host } from "../../lib/fetchertwitch";
import { Clip } from "../../interfaces/clipstwitch";
import ErrorPage from "../_error";
import styled from "styled-components";
import { timeSince } from "../../lib/timeSince";
import { ClipsBody, Heading } from "../../components/clipstwitch";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from 'next/router';

interface Props {
  id?: string;
  clip?: Clip;
  error?: string;
}
  
function convertToMp4(str) {
  const newStr = str.replace("-preview-480x272.jpg", ".mp4");
  return newStr;
}
  
function convertToTimestamp(isoDateString) {
  const date = new Date(isoDateString);
  const timestamp = date.getTime();
  return timestamp;
}

const ClipPage: NextPage<Props> = ({ id, clip, error }) => {
  const router = useRouter();
  if (error) return <ErrorPage err={error} statusCode={500} />;

  return (
    <ClipsBody>
      <Head>
        <title>
          {clip.title} - clip.nekosunevr.co.uk - NekoSuneVR's MedalTV Clips
        </title>
        <meta name="twitter:card" content="photo" />
        <meta name="twitter:title" content={clip.title} />
        <meta name="twitter:image" content={clip.thumbnail_url} />
        <meta name="twitter:url" content={`${host}/${id}`} />

        <meta property="og:title" content={clip.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={clip.thumbnail_url} />
        <meta
          property="og:site_name"
          content="NekoSuneVR - Streamer / Developer"
        />
        <meta property="og:description" content={clip.title} />

        <meta itemProp="name" content={clip.title} />
        <meta itemProp="description" content={clip.title} />
        <meta itemProp="image" content={clip.thumbnail_url} />
      </Head>
      <Heading>
        <h1>
          <Link href="/">
            <a>⬅</a>
          </Link>
          {clip.title}
        </h1>
        <p>Published: {timeSince(convertToTimestamp(clip.created_at) * 1000)}</p>
      </Heading>
      <VideoContainer>
        <VideoPlayer src={convertToMp4(clip.thumbnail_url)} />
      </VideoContainer>
    </ClipsBody>
  );
};

ClipPage.getInitialProps = async ({ query }: NextPageContext) => {
  const id: string = query.clip as string;

  try {
    const { data, errors } = await fetcher(`
      query {
        clip(id: "${id}") {
          title
          thumbnail_url
          created_at
        }
      }
    `).then((data) => data.json());

    return {
      id,
      clip: data?.clip,
      error:
        (!data?.clip && "Clip not found") || (errors && errors[0]?.message),
    };
  } catch (e) {
    return { error: "Clip not found" };
  }
};

export default ClipPage;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
`;

const VideoPlayer = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;
