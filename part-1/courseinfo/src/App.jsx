// Header component: displays the course name as a heading
const Header = ({ course }) => <h1>{course}</h1>;

// Part component: displays the name and number of exercises for a single part
const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

// Content component: renders all parts of the course by using the Part component for each
const Content = ({ parts }) => {
  return (
    <div>
      {/* Render each part using the Part component */}
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises} />
      <Part name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
};

// Total component: calculates and displays the total number of exercises
const Total = ({ parts }) => (
  <p>
    Number of exercises{" "}
    {parts[0].exercises + parts[1].exercises + parts[2].exercises}
  </p>
);

// App component: main component that holds the course data and renders Header, Content, and Total
const App = () => {
  // course object contains the course name and an array of parts
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  // Render the Header, Content, and Total components, passing the appropriate data as props
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
