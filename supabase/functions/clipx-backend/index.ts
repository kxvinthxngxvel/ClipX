import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import * as yt_dlp from "https://deno.land/x/yt_dlp/mod.ts";

serve(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("video_url");
    const rangeHeader = req.headers.get("Range") || undefined;

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "Video URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const options = { format: "best" };
    const info = await yt_dlp.extractInfo(videoUrl, options);
    const videoStreamUrl = info.url;
    const videoTitle = info.title || "video";

    const response = await fetch(videoStreamUrl, {
      headers: rangeHeader ? { Range: rangeHeader } : {},
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch video" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${videoTitle}.mp4"`,
        ...(rangeHeader && { Range: rangeHeader }),
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
