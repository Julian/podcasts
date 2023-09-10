import Head from "next/head";

import ExportedImage from "next-image-export-optimizer";
import { getPodcastFromURL } from "podcast-feed-parser";
import { stripHtml } from "string-strip-html";

import styles from "../styles/Home.module.css";

export default function Home(props: {
  library: Library;
  fetched: { [key: string]: FetchedPodcast };
}) {
  const podcasts = props.library.podcasts;
  const fetched = props.fetched;
  return (
    <div className={styles.container}>
      <Head>
        <title>Podcasts</title>
        <meta name="description" content="@Julian's Podcast Library" />
        <link rel="icon" href="/images/musical-notes.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Podcasts</h1>

        <p className={styles.description}>Library</p>

        <div className={styles.grid}>
          {podcasts
            .slice()
            .sort((a, b) => (b.starred?.length || 0) - (a.starred?.length || 0))
            .map((podcast) => (
              <a key={podcast.name} href={podcast.url} className={styles.card}>
                <h2>{podcast.name}</h2>
                {fetched[podcast?.rss] ? (
                  <ExportedImage
                    src={fetched[podcast.rss].imageURL}
                    alt={podcast.name}
                    width={150}
                    height={150}
                  />
                ) : (
                  ""
                )}
                <p className={styles.summary}>
                  {fetched[podcast.rss]?.summary}
                  <button type="button" className={styles.starred}>
                    {podcast.starred?.length ?? 0} ★
                  </button>
                </p>
              </a>
            ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <span className={styles.logo}>
          <ExportedImage
            src="/image/musical-notes.svg"
            alt="Musical Notes"
            width={72}
            height={16}
          />
        </span>
      </footer>
    </div>
  );
}

import { promises as fs } from "fs";
import path from "path";
import TOML from "@iarna/toml";

export async function getStaticProps() {
  const libraryPath = path.join(process.cwd(), "data/library.toml");
  const tomlData = await fs.readFile(libraryPath);
  const library = (await TOML.parse.async(
    tomlData.toString(),
  )) as unknown as Library;

  let fetched: { [key: string]: FetchedPodcast } = {};
  const fetchPromises = library.podcasts.map(async (podcast) => {
    if (podcast.rss === undefined) {
      return null;
    }
    const info = await getPodcastFromURL(podcast.rss);
    fetched[podcast.rss] = {
      summary: info.meta?.summary ? stripHtml(info.meta.summary).result : null,
      imageURL: info.meta.imageURL,
      lastUpdated: info.meta.lastUpdated ?? null,
    };
  });

  await Promise.all(fetchPromises.filter(Boolean));

  return {
    props: {
      library: library,
      fetched: fetched,
    },
  };
}

export interface Library {
  podcasts: Podcast[];
}

export interface Podcast {
  name: string;
  rss: string;
  url: string;
  starred?: string[];
}

export interface FetchedPodcast {
  summary: string | null;
  imageURL: string;
  lastUpdated?: string;
}
