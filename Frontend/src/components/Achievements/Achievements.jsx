import { useEffect, useState } from 'react';
import './Achievements.css';

const Achievements = () => {
  const [animated, setAnimated] = useState(false);
  const [currentValues, setCurrentValues] = useState(
    Array(4).fill(0) // Initialize with the length of achievementsData
  );

  const achievementsData = [
    { label: 'Smallholder Farmers', value: 2000 },
    { label: 'Acres of Land', value: 5000 },
    { label: 'Beneficiaries', value: 1400 },
    { label: 'Districts', value: 10 }
  ];

  useEffect(() => {
    const animateValues = () => {
      let counter = 0;
      const interval = setInterval(() => {
        setCurrentValues(prevValues => {
          const newValues = prevValues.map((value, index) => {
            const increment = Math.ceil(achievementsData[index].value / 100);
            const nextValue = value + increment;
  
            // Ensure we don't overshoot the target value
            if (nextValue >= achievementsData[index].value) {
              return achievementsData[index].value;
            }
            return nextValue;
          });
  
          counter += 1;
          if (counter >= 100) {
            clearInterval(interval);
            // Ensure all values are set to their target at the end
            setCurrentValues(achievementsData.map(data => data.value));
          }
  
          return newValues;
        });
      }, 20);
    };
  
    const handleScrollAnimation = () => {
      const achievementsSection = document.getElementById('achievements-section');
      if (achievementsSection && !animated) {
        const position = achievementsSection.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
  
        if (position < screenHeight * 0.75) {
          animateValues();
          setAnimated(true);
        }
      }
    };
  
    // Debounce function for performance optimization
    let debounceTimeout;
    const debouncedHandleScroll = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleScrollAnimation, 100);
    };
  
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  });
  

  return (
    <section id="achievements-section" className="achievements-section" style={{ backgroundColor: '#619900' }}>
      <div className="achievements-container">
        {currentValues.map((value, index) => (
          <div key={index} className="achievement">
            <h3>{value}+</h3>
            <p>{achievementsData[index].label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
