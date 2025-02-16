import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";
import { pipeline } from "@huggingface/transformers"; // Import pipeline from transformers

export const Home = () => {
  const [answer, setAnswer] = useState(""); // State to store the answer
  const [expandedAnswer, setExpandedAnswer] = useState(""); // Full sentence
  const [question, setQuestion] = useState(""); // State to store the user question
  const [loading, setLoading] = useState(false); // Loading state for better UX

  // Create a ref to store the model instance
  const modelRef = useRef(null);
  const textGenModelRef = useRef(null); // Store the text-generation model


  // Load the QA model using transformers.js only once when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Use a smaller model for question answering
        const loadedModel = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
        modelRef.current = loadedModel; // Store the model in the ref
        textGenModelRef.current = await pipeline("text2text-generation", 'Xenova/LaMini-Flan-T5-783M');
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };

    loadModel(); // Load model only once when component mounts
  }, []); // Empty dependency array means this runs only once

  const expandAnswer = async (shortAnswer, question) => {
    if (!textGenModelRef.current) return shortAnswer; // Fallback

    const prompt = `Rewrite the answer: "${shortAnswer}" in a full sentence for the question: "${question}". Write it in 1st person, using I.`;
    const result = await textGenModelRef.current(prompt, { max_length: 50 });
    
    return result[0]?.generated_text || shortAnswer; // Return expanded text
  };

  // Function to handle question submission
  const handleQuestionSubmit = async () => {
    if (!question || question.trim() === "") {
      alert("Please enter a valid question.");
      return;
    }
    setLoading(true); // Set loading state

    // Your resume text as context
    const resumeText = process.env.REACT_APP_RESUME;

    // Ensure both question and context are valid strings
    if (typeof question !== "string" || typeof resumeText !== "string") {
      console.error("Both question and context should be strings");
      setLoading(false);
      return;
    }

    // Check if question and context are valid strings
    if (!question || !resumeText || question.trim() === "" || resumeText.trim() === "") {
      console.error("Both question and context must be non-empty strings.");
      setLoading(false);
      return;
    }

    try {
      // Run inference using the model only if the model is loaded
      if (modelRef.current) {
        const result = await modelRef.current(question, resumeText);
        setAnswer(result.answer); // Update the answer state with the result from the model
        const fullSentence = await expandAnswer(result.answer, question);
        setExpandedAnswer(fullSentence);
        console.log('QA: '+ result.answer);
        const prompt = `You are given the resume: "${resumeText}". Answer the question: "${question}". Write it in 1st person, using I.`;
        const result2 = await textGenModelRef.current(prompt, { max_length: 500 });
        console.log('T2T: ' + result2[0]?.generated_text);
      } else {
        console.error("Model not loaded yet");
      }
    } catch (error) {
      console.error("Error running inference:", error);
      setAnswer("An error occurred while processing your question.");
    }

    setLoading(false); // Stop loading after result
  };

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <div className="intro_sec d-block d-lg-flex align-items-center ">
          <div
            className="h_bg-image order-1 order-lg-2 h-100 "
            style={{ backgroundImage: `url(${introdata.your_img_url})` }}
          ></div>
          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center ">
              <div className="intro mx-auto">
                <h2 className="mb-1x">{introdata.title}</h2>
                <h1 className="fluidz-48 mb-1x">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString("I'm a Principal Engineer")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("I work at Microsoft")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("I've worked at Amazon")
                        .pauseFor(1000)
                        .deleteChars(6)
                        .typeString("AWS")
                        .pauseFor(1000)
                        .deleteChars(3)
                        .typeString("Morgan Stanley")
                        .pauseFor(1000)
                        .deleteChars(14)
                        .typeString("Zillow")
                        .pauseFor(1000)
                        .deleteAll()
                        .start();
                    }}
                    options={{
                      loop: true, // Enable looping
                    }}
                  />
                </h1>
                <p className="mb-1x">{introdata.description}</p>
                <div className="intro_btn-action pb-5">
                  <div className="question-ask">
                    <input
                      type="text"
                      id="question"
                      name="question"
                      placeholder="Ask a question about my resume"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button id="askButton" onClick={handleQuestionSubmit}>Ask</button>
                  </div>

                  {/* Loading state */}
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    expandedAnswer && (
                      <div className="answer">
                        <h3>Answer:</h3>
                        <p>{expandedAnswer}</p>
                      </div>
                    )
                  )}

                  <Link to="/contact">
                    <div id="button_h" className="ac_btn btn">
                      Contact Me
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
