export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://haloeduverse.my.id/</loc>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://haloeduverse.my.id/courses</loc>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://haloeduverse.my.id/about</loc>
    <priority>0.6</priority>
  </url>

</urlset>`);
}
