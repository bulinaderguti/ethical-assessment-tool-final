// SurveyResults.js
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  RadialLinearScale,
  LinearScale,
  Title
);

const SurveyResults = ({ survey, answers, formattedChartData }) => {
  const sectionBasedRecommendations = [];

  const chartData = formattedChartData;

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

  const renderRecommendations = () => {
    return sectionBasedRecommendations.map((recommendations, sectionIndex) => (
      <div key={sectionIndex}>
        {recommendations[0].length > 0 && (
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <h4 style={styles.sectionTitle}>
                {survey.sections[sectionIndex].title}
              </h4>
              {recommendations.map((subRecommendations, subSectionIndex) => (
                <div key={subSectionIndex}>
                  {subRecommendations.length > 0 && (
                    <ul style={styles.recommendationList}>
                      {subRecommendations.map((recommendation, index) => (
                        <li key={index} style={styles.recommendationItem}>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ));
  };

  const styles = {
    cardContainer: {
      marginBottom: '5px',
      border: '1px solid #3498db',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    card: {
      padding: '20px',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      color: '#333',
    },
    recommendationList: {
      listStyleType: 'disc',
      paddingInlineStart: '20px',
    },
    recommendationItem: {
      marginBottom: '8px',
      color: '#555',
    },
  };

  const extractRecommendations = (survey, answers) => {
    survey.sections.forEach((section, sectionIndex) => {
      const sectionRecommendations = [];

      section.subSections.forEach((subSection, subSectionIndex) => {
        const subSectionRecommendations = [];

        subSection.questions.forEach((question) => {
          const answerId = answers[question.id];
          const selectedOption =
            answerId !== undefined
              ? question.options.find((option) => option.text === answerId)
              : null;

          // Check if the user's answer indicates a need for a recommendation
          if (
            selectedOption &&
            ['no', '1', '2', '3', "don't know"].includes(
              selectedOption.text.toLowerCase()
            ) &&
            question.recommendation
          ) {
            subSectionRecommendations.push(question.recommendation);
          }
        });

        sectionRecommendations[subSectionIndex] = subSectionRecommendations;
      });

      sectionBasedRecommendations[sectionIndex] = sectionRecommendations;
    });
  };

  extractRecommendations(survey, answers);

  return (
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
        <h1 style={{ color: 'white', padding: '10px' }}>Survey Results</h1>
        <p style={{ color: 'white' }}>
          Here are the results obtained from your feedback
        </p>
      </header>
      {sectionBasedRecommendations.length > 0 && (
        <section
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Our Expert Recommendations
          </h3>
          {renderRecommendations()}
        </section>
      )}
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
          Spider Chart
        </h3>
        <div
          style={{
            margin: 'auto',
            width: '600px',
            height: '600px',
          }}
        >
          <Radar data={chartData} options={options} />
        </div>
      </section>
    </div>
  );
};

export default SurveyResults;
