import React, { useEffect, useState } from 'react';

const LeftPanel = ({ sections, currentSectionIndex }) => {
  return (
    <div style={{ width: '180px', float: 'left', position: 'fixed' }}>
      {sections.map((section, index) => (
        <div
          key={section._id}
          style={{
            padding: '10px',

            background:
              currentSectionIndex === index ? '#4CAF50' : 'transparent',
            color: currentSectionIndex === index ? 'white' : 'black',
          }}
        >
          {section.title}
        </div>
      ))}
    </div>
  );
};

const Survey = ({
  title,
  description,
  sections,
  setSurveyAnswers,
  editAnswers,
}) => {
  const [answers, setAnswers] = useState({});

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(sections[0]);

  const handleNextSection = () => {
    if (currentSectionIndex + 1 < sections.length) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentSection(sections[currentSectionIndex + 1]); // Use the updated index here
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex - 1 >= 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentSection(sections[currentSectionIndex - 1]); // Use the updated index here
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (editAnswers) {
      setAnswers(editAnswers);
      setCurrentSection(sections[currentSectionIndex]);
    }
  }, [editAnswers]);

  const handleAnswerChange = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  const isSectionQustionAnswers = (cs) => {
    return cs.subSections.every((subSection) =>
      subSection.questions.every((question) => answers[question.id])
    );
  };

  const isBackEnabled = () => {
    return currentSectionIndex > 0;
  };

  const handleShowResults = () => {
    console.log('Show results with answers:', answers);
    setSurveyAnswers(answers);
    // Add logic to navigate to results page or display results here
  };

  // useEffect(() => {
  //   setAnswers(editAnswers ? editAnswers : {});
  // }, [editAnswers]);

  // useEffect(() => {
  //   setCurrentSection(sections[currentSectionIndex]);
  // }, [currentSectionIndex, sections, answers]);
  return (
    <>
      <LeftPanel
        sections={sections}
        currentSectionIndex={currentSectionIndex}
      ></LeftPanel>
      <div
        style={{
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '800px',
          marginTop: '30px',
          marginBottom: '30px',
          margin: '0 auto',
          color: 'black',
          background: 'rgb(240, 240, 240)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <header
          style={{
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: 'black', padding: '10px' }}>{title}</h1>
          <p style={{ color: 'black' }}>{description}</p>
        </header>

        {currentSection && (
          <div
            key={currentSection._id}
            style={{
              background: 'white',
              color: 'black',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ color: 'black', paddingBottom: '10px' }}>
              {currentSection.title}
            </h2>
            <p
              style={{
                color: 'black',
                paddingBottom: '20px',
                paddingLeft: '15px',
              }}
            >
              {currentSection.description}
            </p>
            {currentSection.subSections.map((subSection) => (
              <div
                key={subSection._id}
                style={{
                  background: 'white',
                  padding: '15px',
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ color: 'black', paddingBottom: '10px' }}>
                  {subSection.title}
                </h3>
                <p
                  style={{
                    color: 'black',
                    paddingBottom: '20px',
                    paddingLeft: '15px',
                  }}
                >
                  {subSection.description}
                </p>
                {subSection.questions.map((question) => (
                  <div
                    key={question.id}
                    style={{
                      marginTop: '20px',
                      background: 'rgb(217, 217, 217)',
                      padding: '20px',
                      borderRadius: '15px',
                      boxShadow: '0 0px 15px rgba(0, 0, 0, 0.1)',
                      marginBottom: '20px',
                    }}
                  >
                    <h4 style={{ color: '#333' }}>{question.questionText}</h4>
                    <ul
                      style={{
                        listStyle: 'none',

                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {question.options.map((option) => (
                        <li
                          key={option._id}
                          onClick={(e) =>
                            handleAnswerChange(question.id, option.text)
                          }
                          style={{
                            border:
                              answers[question.id] == option.text
                                ? '3px solid white'
                                : '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '0.7rem',
                            marginInline: '6px',
                            marginBottom: '10px',
                            background:
                              answers[question.id] == option.text
                                ? '#b3ffd0'
                                : '#F5E9EE',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="radio"
                            id={`option-${option._id}`}
                            name={`question-${question.id}`}
                            value={option.text}
                            onChange={(e) =>
                              handleAnswerChange(question.id, option.text)
                            }
                            checked={answers[question.id] == option.text}
                            style={{ marginRight: '5px', display: 'none' }}
                          />
                          <label
                            htmlFor={`option-${option.text}`}
                            style={{ color: '#333', cursor: 'pointer' }}
                          >
                            {option.text}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            disabled={!isBackEnabled()}
            onClick={handlePreviousSection}
            style={
              !isBackEnabled()
                ? {
                    color: '#4CAF50',
                    fontSize: '20px',
                    padding: '15px 25px',
                    border: 'black 2px',
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }
                : {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '20px',
                    padding: '15px 25px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }
            }
          >
            Previous Section
          </button>
          {currentSectionIndex === sections.length - 1 ? (
            <button
              disabled={!isSectionQustionAnswers(currentSection)}
              onClick={handleShowResults}
              style={
                !isSectionQustionAnswers(currentSection)
                  ? {
                      color: '#4CAF50',
                      fontSize: '20px',
                      padding: '15px 25px',
                      border: 'black 2px',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }
                  : {
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontSize: '20px',
                      padding: '15px 25px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }
              }
            >
              Finish
            </button>
          ) : (
            <button
              disabled={!isSectionQustionAnswers(currentSection)}
              onClick={handleNextSection}
              style={
                !isSectionQustionAnswers(currentSection)
                  ? {
                      color: '#4CAF50',
                      fontSize: '20px',
                      padding: '15px 25px',
                      border: 'black 2px',
                      borderRadius: '5px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }
                  : {
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontSize: '20px',
                      padding: '15px 25px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }
              }
            >
              Next Section
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Survey;
