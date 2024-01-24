import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';

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
        <title>Survey Lists</title>
        <meta name="description" content="Explore Available Surveys" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.exploreSection}>
          <h2 className={styles.exploreTitle}>Explore Popular Surveys</h2>
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
                      backgroundColor: '#4CAF50', // Green background color
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
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
