// SurveyResults.js
import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Filler,
  Title,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  Filler,
  Title
);

const SurveyAnalysis = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [notFound, setNotFound] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    if (slug) {
      // Fetch survey data based on the slug
      fetch(`/api/survey/surveyResult`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.data) {
            setNotFound(true);
          } else {
            let surveys = data.data;
            surveys = surveys.filter((elem) => elem.surveySlug === slug);

            if (surveys.length) {
              let cd = surveys[0].chartData;
              let labels = cd.labels;

              // Calculate the averages for each label using reduce
              let dataset = labels.map((label, index) => {
                let valueSum = surveys.reduce(
                  (sum, survey) =>
                    sum + survey.chartData.datasets[0].data[index],
                  0
                );
                return valueSum / surveys.length;
              });

              // Update the datasets with the calculated averages
              cd.datasets[0].data = dataset;

              console.dir(dataset);

              setChartData(cd);

              setTotalResponses(surveys.length);
            } else {
              setNotFound(true);
            }
          }
        });
    }
  }, [slug]);

  if (notFound) {
    router.push('/');
  }

  if (!chartData) {
    return (
      <>
        <Head>
          <title>Survey Analysis</title>
          <meta name="description" content="Fill Current Survey" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="surveyMain">Loading...</main>
      </>
    );
  }

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function (value, index, values) {
            let label = 'Low';

            if (value >= 0 && value <= 20) {
              label = 'Low - 20%';
            } else if (value >= 21 && value <= 40) {
              label = 'Medium - 40%';
            } else if (value >= 41 && value <= 60) {
              label = 'Moderate - 60%';
            } else if (value >= 61 && value <= 80) {
              label = 'High - 80%';
            } else if (value >= 91 && value <= 100) {
              label = 'Very High - 100%';
            }

            return label; // Return the label for each value
          },
        },
      },
    },
  };

  return (
    <>
      <Head>
        <title>Survey</title>
        <meta name="description" content="Fill Current Survey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="surveyMain"></main>
      <Link
        href="/"
        style={{
          position: 'fixed',
          right: '10px', // Adjust the left distance as needed
          top: '10px', // Adjust the bottom distance as needed
          backgroundColor: '#4CAF50', // Green background color
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Back to Homepage
      </Link>
      <div
        style={{
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          maxWidth: '800px',
          marginTop: '30px',
          marginBottom: '30px',
          margin: '0 auto',
          background: '#3498db',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <header
          style={{
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: 'white', padding: '10px' }}>Survey Analysis</h1>
          <p style={{ color: 'white' }}>
            Here are the collective results obtained from this survey
          </p>
        </header>

        {chartData && (
          <section
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              {`Spider Chart - Average of ${totalResponses} responses`}
            </h3>
            <div>
              <Radar
                style={{
                  margin: 'auto',
                  width: '700px',
                  height: '400px',
                }}
                data={chartData}
                options={options}
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default SurveyAnalysis;
