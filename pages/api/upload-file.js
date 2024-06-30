import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { imageUrl } = req.body;

      // Fetch the image data
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      // Prepare form data for Pinata
      const formData = new FormData();
      formData.append("file", imageBuffer, { filename: "image.png" });

      // Upload to Pinata
      const pinataResponse = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
          ...formData.getHeaders(),
        },
      });

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;
      res.status(200).json({ ipfsUrl });
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      res.status(500).json({ error: "Failed to upload image to IPFS" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
