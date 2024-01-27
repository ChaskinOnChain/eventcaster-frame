/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import prisma from "lib/prisma";

const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export const revalidate = 0;
// ... (rest of your imports)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Use satori to create SVG with the desired message
    const svg = await satori(
      <div
        style={{
          justifyContent: "center", // Center align the content
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#f4f4f4", // Ensure this is a valid color value
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <h2 style={{ textAlign: "center", color: "#333" }}>
            {" "}
            {/* Updated color for better visibility */}
            Click to show a random NFT you own
          </h2>
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [
          {
            data: fontData,
            name: "Roboto",
            style: "normal",
            weight: 400,
          },
        ],
      },
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}
