import useStatisticLine from "../store/feedbackStore";

const Statistics = () => {
  const { good, neutral, bad, getTotal, getAverage, getPositivePercentage } =
    useStatisticLine();

  const total = getTotal();

  if (total === 0) {
    return (
      <div>
        <h2>no feedback given</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{getTotal()}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{getAverage().toFixed(1)}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{getPositivePercentage().toFixed(1)} % </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
