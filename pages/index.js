import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetch('/api/survey')
      .then((res) => res.json())
      .then((data) => {
        setSurveys(data.data);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Survey App</title>
        <meta name="description" content="Online Survey App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.exploreSection}>
          <h2 className={styles.exploreTitle}>Ethical Assesment Tool</h2>
        </div>

        <div className={styles.surveyGrid}>
          {surveys?.map((survey) => (
            <div key={survey.title} className={styles.surveyCard}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{survey.title}</h3>
                <p className={styles.cardDescription}>{survey.description}</p>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                  <button
                    style={{
                      backgroundColor: 'rgb(168, 129, 175)', // Green background color
                      color: 'white',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontFamily: "'Nunito', sans-serif",
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onClick={() => {
                      router.push(`/survey/${survey.slug}`);
                    }}
                  >
                    Start Survey
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <button
                  style={{
                    backgroundColor: 'rgb(93 195 163)',
                    color: 'white',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    width: '100%',
                    fontWeight: 'bold',
                    fontFamily: "'Nunito', sans-serif",
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onClick={() => {
                    router.push(`/survey/${survey.slug}/results`);
                  }}
                >
                  Check Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
