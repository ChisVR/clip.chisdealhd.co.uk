import { ApolloServer, gql } from "apollo-server-micro";
import "isomorphic-fetch";
import { Clips, Clip } from "../../interfaces/clipstwitch";

const typeDefs = gql`
  type Query {
    clip(contentId: String): Clip
    clips: [Clip]
    lastUpdated: Date
  }
  scalar Date
  type Clip {
    contentId: String
    contentTitle: String
    contentViews: String
    contentThumbnail: String
    createdTimestamp: String
    directClipUrl: String
  }
`;

let clips: Clip[] = [];
let lastUpdated = null;

const updateClips = async (): Promise<void> => {
  if (
    lastUpdated !== null &&
    (new Date().getTime() - lastUpdated.getTime()) / 1000 < 600
  )
    return;
  const data: Clips = await fetch(
    `https://api.nekosunevr.co.uk/v3/social/api/twitch/clips/nekosunevr/100`,
    {
      headers: {
        'Content-Type': "application/json",
        'nekosunevr-api-key': process.env.NEKOSUNEAPIKEY,
      },
    }
  ).then((data) => data.json());

  clips = data.contentObjects.map((clip: Clip) => ({
    ...clip,
    createdTimestamp: clip.createdTimestamp / 1000,
  }));
  lastUpdated = new Date();
};

updateClips();

const resolvers = {
  Query: {
    async clips(): Promise<Clip[]> {
      await updateClips();
      return clips;
    },
    async clip(_: any, { contentId }: { contentId: string }): Promise<Clip> {
      await updateClips();
      return clips.filter((clip) => clip.contentId === contentId)[0];
    },
    async lastUpdated(): Promise<string | null> {
      return lastUpdated || new Date();
    },
  },
};


export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground: false,
}).createHandler({ path: "/api/twitchapi" });
