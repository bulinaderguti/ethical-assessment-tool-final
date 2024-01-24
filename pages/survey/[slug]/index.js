// pages/survey/[slug].js
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Survey from '@/components/Survey';
import SurveyResults from '@/components/SurveyResults';
import { v4 as uuidv4 } from 'uuid';

import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

const SurveyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [survey, setSurvey] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState(null);
  const [surveyEditAnswers, setSurveyEditAnswers] = useState(null);

  const [chartData, setChartData] = useState(null);
  const [showEditResponse, setShowEditResponse] = useState(false);

  const returnScoreForQuestion = (selectedOption) => {
    let score = 0.0;
    if (selectedOption) {
      switch (selectedOption.text) {
        case 'Yes':
        case '5':
          score = 1.0;
          break;
        case '4':
          score = 0.8;
          break;
        case "Don't Know":
        case '3':
          score = 0.6;
          break;
        case '2':
          score = 0.4;
          break;
        case 'No':
        case '1':
          score = 0.2;
          break;
        default:
          score = 0.0;
          break;
      }
    }
    return score;
  };

  const formatChartData = (survey, answers) => {
    const data = {
      labels: [],
      datasets: [
        {
          label: 'User Responses',
          data: [],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
        },
      ],
    };

    survey.sections.forEach((section) => {
      // Add section title to labels
      data.labels.push(section.title);

      let totalQuestionsInSection = 0.0;
      let totalYesAnswersInSection = 0.0;

      section.subSections.forEach((subSection) => {
        subSection.questions.forEach((question) => {
          totalQuestionsInSection++;

          const answerText = answers[question.id];
          const selectedOption =
            answerText !== undefined
              ? question.options.find((option) => option.text === answerText)
              : null;
          let score = returnScoreForQuestion(selectedOption);
          totalYesAnswersInSection += score;
        });
      });

      // Calculate average score for the current section
      const averageScoreInSection =
        totalQuestionsInSection > 0
          ? (totalYesAnswersInSection / totalQuestionsInSection) * 100 // Multiply by 100 to get percentage
          : 0;

      // Add average score to data
      data.datasets[0].data.push(averageScoreInSection);
    });

    return data;
  };

  const saveSurveyData = async (chartData, answers) => {
    try {
      let userId = getUserIdFromLocalStorage();
      if (!userId) {
        userId = uuidv4();
        saveUserIdToLocalStorage(userId);
      }

      const response = await fetch('/api/survey/surveyResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: survey._id,
          chartData: chartData,
          surveySlug: survey.slug,
          surveyAnswers: answers,
          userId: userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Survey result saved:', result);
        // Handle success, redirect, or update UI as needed
      } else {
        console.error('Failed to save survey result:', response.statusText);
        // Handle error, display message, or update UI accordingly
      }
    } catch (error) {
      console.error('Error during API request:', error);
      // Handle error, display message, or update UI accordingly
    }
  };

  const modifySurveyData = async (chartData, answers) => {
    try {
      let userId = getUserIdFromLocalStorage();

      const response = await fetch('/api/survey/surveyResult', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: survey._id,
          chartData: chartData,
          surveySlug: survey.slug,
          surveyAnswers: answers,
          userId: userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Survey result saved:', result);
        // Handle success, redirect, or update UI as needed
      } else {
        console.error('Failed to save survey result:', response.statusText);
        // Handle error, display message, or update UI accordingly
      }
    } catch (error) {
      console.error('Error during API request:', error);
      // Handle error, display message, or update UI accordingly
    }
  };

  const setSurveyAnswersHandler = async (answers) => {
    const cd = formatChartData(survey, answers);
    if (surveyEditAnswers) {
      await modifySurveyData(cd, answers, getUserIdFromLocalStorage());
    } else {
      await saveSurveyData(cd, answers);
    }

    setShowEditResponse(true);
    setSurveyEditAnswers(null);
    showSurveyResult(answers, cd);
    window.scrollTo(0, 0);
  };

  const showSurveyResult = (answers, cd) => {
    setChartData(cd);
    setSurveyAnswers(answers);
  };

  const saveUserIdToLocalStorage = (userId) => {
    localStorage.setItem('userIdForSurvey', JSON.stringify(userId));
  };

  // Function to get surveyAnswers from localStorage
  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem('userIdForSurvey');
    return userId ? JSON.parse(userId) : null;
  };

  const handleSurveyEditResponse = () => {
    setShowEditResponse(false);
    setSurveyEditAnswers(surveyAnswers);
    setSurveyAnswers(null);
  };

  const reloadAlreadySubmittedSurvey = (survey) => {
    let userId = getUserIdFromLocalStorage();
    if (userId) {
      fetch(`/api/survey/surveyResult`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            let results = data.data;
            let result = results.find(
              (elem) => elem.surveySlug === slug && elem.userId === userId
            );
            if (result) {
              const cd = formatChartData(survey, result.surveyAnswers);
              setSurvey(survey);
              setShowEditResponse(true);
              showSurveyResult(result.surveyAnswers, cd);
            } else {
              setSurvey(survey);
            }
          } else {
            setSurvey(survey);
          }
        });
    } else {
      setSurvey(survey);
    }
  };

  useEffect(() => {
    if (slug) {
      // Fetch survey data based on the slug
      fetch(`/api/survey/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.data) {
            setNotFound(true);
          } else {
            let surveyData = data.data;
            reloadAlreadySubmittedSurvey(surveyData);
          }
        });
    }
  }, [slug]);

  if (notFound) {
    router.push('/');
  }

  if (!survey) {
    return (
      <>
        <Head>
          <title>Survey</title>
          <meta name="description" content="Fill Current Survey" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="surveyMain">Loading...</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Survey</title>
        <meta name="description" content="Fill Current Survey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="surveyMain">
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
        {showEditResponse && (
          <button
            onClick={handleSurveyEditResponse}
            style={{
              position: 'fixed',
              left: '10px', // Adjust the left distance as needed
              top: '10px', // Adjust the bottom distance as needed
              backgroundColor: '#4CAF50', // Green background color
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Edit your Response
          </button>
        )}
        {surveyAnswers ? (
          <SurveyResults
            survey={survey}
            answers={surveyAnswers}
            formattedChartData={chartData}
          ></SurveyResults>
        ) : (
          <Survey
            title={survey.title}
            description={survey.description}
            sections={survey.sections}
            editAnswers={surveyEditAnswers}
            setSurveyAnswers={setSurveyAnswersHandler}
          ></Survey>
        )}
      </main>
    </>
  );
};

export default SurveyDetailPage;
