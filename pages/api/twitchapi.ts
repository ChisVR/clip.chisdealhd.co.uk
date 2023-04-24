import { ApolloServer, gql } from "apollo-server-micro";
import "isomorphic-fetch";
import { Clips, Clip } from "../../interfaces/clipstwitch";

const typeDefs = gql`
  type Query {
    clip(id: String): Clip
    clips: [Clip]
    lastUpdated: Date
  }
  scalar Date
  type Clip {
    id: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
  }
`;

let clips: Clip[] = [];
let lastUpdated = null;

var clientid = process.env.Twitch_ClientID;
var clientsecrate = process.env.Twitch_ClientSecrate;
var username = process.env.Twitch_Username;
var oauth = window.localStorage.getItem("oauth");

function convertToTimestamp(isoDateString) {
  const date = new Date(isoDateString);
  const timestamp = date.getTime();
  return timestamp;
}

async function getOauth() {
    let response = await fetch(
       `https://id.twitch.tv/oauth2/token?client_id=${clientid}&client_secret=${clientsecrate}&grant_type=client_credentials`,
       { method: "POST" }
    );

    let data = await response.json();
    window.localStorage.setItem("oauth", data.access_token);
    oauth = data.access_token;
}

async function twitchRequest(query) {
                    let response = await fetch(
                        `https://api.twitch.tv/helix/${query}`,
                        {
                            headers: {
                                "Client-ID": clientid,
                                Authorization: `Bearer ${oauth}`,
                            },
                        }
                    );

                    switch (response.status) {
                        case 200:
                            return await response.json();
                            break;
                        case 401:
                            await getOauth();
                            return await this.twitchRequest(query);
                            break;
                    }
                }
async function getUserId() {
  let broadcasterId;
                    let local = JSON.parse(window.localStorage.getItem("user"));
                    if (local != null && local.username == username) {
                        broadcasterId = local.broadcasterId;
                    } else {
                        localStorage.clear();

                        try {
                            let data = await this.twitchRequest(
                                `users?login=${username}`
                            );
                            broadcasterId = data.data[0].id;

                            window.localStorage.setItem(
                                "user",
                                JSON.stringify({
                                    broadcasterId: broadcasterId,
                                    username: username,
                                })
                            );
                        } catch (error) {
                            console.log(
                                "Got an error requesting userid:",
                                error
                            );
                        }
                    }
                }
const updateClips = async (): Promise<void> => {
  if (
    lastUpdated !== null &&
    (new Date().getTime() - lastUpdated.getTime()) / 1000 < 600
  )
    return;
    let local = JSON.parse(window.localStorage.getItem("user"));
    var broadcasterId = local.broadcasterId;
  
  const data: Clips = await this.twitchRequest(
             `clips?broadcaster_id=${
                 broadcasterId
               }&first=100`
          ).then((data) => data.json());

  clips = data.data.map((clip: Clip) => ({
    ...clip,
    createdTimestamp: convertToTimestamp(clip.created_at) / 1000,
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
    async clip(_: any, { id }: { id: string }): Promise<Clip> {
      await updateClips();
      return clips.filter((clip) => clip.id === id)[0];
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
