import { create } from "ipfs-http-client";

const projectId = "48f191838ccc4401bd047a45661030a5";
const auth =
  "Basic " +
  Buffer.from(
    "dbc656d386aa4d0dbce13fcfac97125f" +
      ":" +
      "WG+D6n3K7FgURML49yfpz7m7HgZ2a6J+5PqOabx6mxyvLKZEVMxGvQ"
  ).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: auth },
});

export default ipfs;
