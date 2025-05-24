import { getShortUrl } from "../dao/short_url.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

const getCleanAppUrl = () => {
  // Remove trailing slash if any and hidden characters
  return process.env.APP_URL.trim().replace(/\/$/, "");
};

export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  let shortUrl;

  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }

  // Build final short URL
  const finalShortUrl = `${getCleanAppUrl()}/${shortUrl}`;
  res.status(200).json({ shortUrl: finalShortUrl });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  if (!url) throw new Error("Short URL not found");
  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;
  // Assuming you meant to call `createShortUrlWithUser` for custom slugs
  const shortUrl = await createShortUrlWithUser(url, req.user?._id, slug);

  const finalShortUrl = `${getCleanAppUrl()}/${shortUrl}`;
  res.status(200).json({ shortUrl: finalShortUrl });
});
