import Head from "next/head";

import ExportedImage from "next-image-export-optimizer";

import styles from "../styles/Home.module.css";

export default function Home(props) {
  const podcasts = props.podcasts;
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
          {podcasts.map((podcast) => (
            <a key={podcast.name} href={podcast.url} className={styles.card}>
              <h2>{podcast.name}</h2>
              <p>
                Lorem ipsum dolor my teeth.
                <button type="button" className={styles.starred}>
                  {(podcast.starred || []).length} ★
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
const TOML = require("@iarna/toml");

export async function getStaticProps() {
  const libraryPath = path.join(process.cwd(), "data/library.toml");
  const tomlData = await fs.readFile(libraryPath);
  const library = await TOML.parse.async(tomlData);

  return { props: library };
}
