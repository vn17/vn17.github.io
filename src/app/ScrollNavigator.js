import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = ["/", "/about", "/portfolio", "/contact"]; // Define the order of routes
  const currentIndex = routes.indexOf(location.pathname); // Find current route index

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Current scroll position
      const windowHeight = window.innerHeight; // Height of the viewport
      const documentHeight = document.documentElement.scrollHeight; // Total document height

      // Check if scrolled to the bottom of the page
      if (scrollTop + windowHeight >= documentHeight) {
        if (currentIndex < routes.length - 1) { // Check if not at the last route
          navigate(routes[currentIndex + 1]); // Navigate to the next route
        }
      }
      // Check if scrolled to the top of the page
      else if (scrollTop === 0) {
        if (currentIndex > 0) { // Check if not at the first route
          navigate(routes[currentIndex - 1]); // Navigate to the previous route
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
    };
  }, [navigate, currentIndex, routes]);

  return null; // This component doesn't render anything
};

export default ScrollNavigator;
