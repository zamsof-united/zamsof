

import Fade from "react-reveal/Fade";
import "./information.css";
import AboutData from "../../Data/About";

function Information() {
  const { vision, beliefs, objectives } = AboutData;

  return (
    <div className="information-page">
      {/* Vision Statement */}
      <section className="section bg-gradient-vision">
        <Fade bottom>
          <div className="vision-box">
            <h2 className="section-title">{vision.title}</h2>
            {vision.content.map((text, index) => (
              <p key={index} className="section-content">{text}</p>
            ))}
          </div>
        </Fade>
      </section>

      {/* Beliefs & Values */}
      <section className="section bg-gradient-beliefs">
        <h2 className="section-title">Our Beliefs & Values</h2>
        <div className="accordion">
          {beliefs.map((belief, index) => (
            <Fade bottom delay={index * 200} key={index}>
              <div className="accordion-item hover-effect">
                <h3>{belief.title}</h3>
                <p>{belief.content}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="section bg-gradient-objectives">
        <h2 className="section-title">Strategic Objectives (2025-2027)</h2>
        <div className="objectives">
          {objectives.map((objective, index) => (
            <Fade bottom delay={index * 200} key={index}>
              <div className="objective-card hover-effect">
                <h3>{objective.title}</h3>
                <p><strong>Goal:</strong> {objective.goal}</p>
                <p><strong>Milestone:</strong> {objective.milestone}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Information;