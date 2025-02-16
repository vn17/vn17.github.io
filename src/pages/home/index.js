import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";
import { pipeline } from "@huggingface/transformers"; // Import pipeline from transformers

export const Home = () => {
  const [answer, setAnswer] = useState(""); // State to store the generated answer
  const [question, setQuestion] = useState(""); // State to store the user's question
  const [loading, setLoading] = useState(false); // Loading state

  const textGenModelRef = useRef(null); // Store the text-generation model

  // Load the text generation model once on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        textGenModelRef.current = await pipeline("text2text-generation", "Xenova/LaMini-Flan-T5-783M");
      } catch (error) {
        console.error("Error loading text generation model:", error);
      }
    };

    loadModel(); // Load model only once when component mounts
  }, []);

  // Function to handle question submission
  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      alert("Please enter a valid question.");
      return;
    }

    setLoading(true); // Set loading state

    const resumeText = process.env.REACT_APP_RESUME;

    if (!resumeText || typeof resumeText !== "string") {
      console.error("Resume text is missing or invalid.");
      setLoading(false);
      return;
    }

    try {
      if (textGenModelRef.current) {
        // Use the text generation model to directly answer the question in a full sentence
        const prompt = `You are given my resume: "${resumeText}". Answer the question: "${question}". Respond in 1st person (using 'I').`;
        const result = await textGenModelRef.current(prompt, { max_length: 100 });

        const fullAnswer = result[0]?.generated_text || "I'm not sure how to answer that.";

        setAnswer(fullAnswer);
        console.log("Generated Answer: " + fullAnswer);
      } else {
        console.error("Text generation model not loaded yet.");
      }
    } catch (error) {
      console.error("Error generating answer:", error);
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
            <div className="align-self-center">
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
                    options={{ loop: true }}
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
                    answer && (
                      <div className="answer">
                        <h3>Answer:</h3>
                        <p>{answer}</p>
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
