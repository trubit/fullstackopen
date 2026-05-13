import useStatisticLine from "../store/feedbackStore";

const Buttons = () => {
  const { action } = useStatisticLine();
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={action.incrementGood}>good</button>
      <button onClick={action.incrementNeutral}>neutral</button>
      <button onClick={action.incrementBad}>bad</button>
    </div>
  );
};

export default Buttons;
